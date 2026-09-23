/**
 * Three.js adapter for the Stephen bust in the Home avatar slot.
 *
 * Asset pipeline (run once with gltf-transform CLI 4.5; not part of the build):
 *   rotate: bake -90° about Y so the bust faces +Z (the source faced +X),
 *           then a -20° yaw trim so the neutral pose meets the visitor and
 *           matches the turn of the fallback photograph
 *   simplify --ratio 0.02 --error 0.005    1,879,648 tris -> 37,592 tris
 *   resize: baseColor <= 1024 px, normal + ORM <= 1024 px (all were 4096;
 *   the stage renders at <= 480 CSS px, so 1024 leaves 2x-DPR headroom)
 *   webp --quality 85, then dedup, prune, meshopt --level high
 *   Result: 55.9 MB -> 421 KB, one self-contained GLB using
 *   EXT_meshopt_compression, EXT_texture_webp and KHR_mesh_quantization.
 *
 * `three` is imported only inside the factory, so the library is fetched
 * solely when the stage is actually needed — never on the no-JS path, and
 * never after a missing-asset or failure response.
 *
 * Rendering is on demand: a frame is requested while the damped pose is
 * moving, on resize, and once after load. No loop runs while the pose is
 * settled. The asset has no rig, morphs or animation; rotating the bust a few
 * degrees at most reads as head movement without a tracking gimmick.
 */
import type { Group as GroupType, Mesh as MeshType, MeshStandardMaterial as StandardMaterial } from 'three';
import type { StephenRenderer, StephenRendererFactory } from './stephenVisual';

/** Hard caps on pose, in radians. Deliberately small: a glance, not a track. */
const MAX_YAW = 0.1; // ~5.7°
const MAX_PITCH = 0.055; // ~3.2°
const NOD = 0.045; // acknowledgement impulse when the note opens
const NOD_MS = 700;
const LOAD_TIMEOUT_MS = 20000;

export class StephenRendererError extends Error {
  kind: 'missing' | 'failed';
  constructor(kind: 'missing' | 'failed', message: string) {
    super(message);
    this.name = 'StephenRendererError';
    this.kind = kind;
  }
}

export const createStephenRenderer: StephenRendererFactory = async (host, src) => {
  const [three, gltfModule, meshoptModule] = await Promise.all([
    import('three'),
    import('three/addons/loaders/GLTFLoader.js'),
    import('three/addons/libs/meshopt_decoder.module.js'),
  ]);
  const {
    WebGLRenderer, PerspectiveCamera, Scene, Group, HemisphereLight, DirectionalLight,
    Box3, Vector3, SRGBColorSpace, NeutralToneMapping,
  } = three;

  const canvas = document.createElement('canvas');
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.display = 'block';
  host.append(canvas);

  let renderer: InstanceType<typeof WebGLRenderer>;
  try {
    renderer = new WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'low-power',
      // The portrait renders on demand; keeping the drawing buffer guarantees
      // the presented frame survives idle compositing and bfcache restores.
      preserveDrawingBuffer: true,
    });
  } catch {
    canvas.remove();
    throw new StephenRendererError('failed', 'WebGL is unavailable in this browser');
  }
  renderer.setClearColor(0x000000, 0); // the paper stage shows through
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = NeutralToneMapping;
  renderer.toneMappingExposure = 1.12; // match the studio brightness of the portrait
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  const scene = new Scene();
  const camera = new PerspectiveCamera(30, 1, 0.1, 20);
  const model = new Group();
  scene.add(model);

  // Neutral key plus a cool fill over the paper surface. No environment map,
  // no post-processing: the portrait only needs even, readable light.
  // Diffuse-heavy rig: the hemisphere carries the exposure so the directional
  // key stays low enough to keep specular off the skin.
  const hemi = new HemisphereLight(0xfff4e8, 0x7a7466, 1.9);
  const key = new DirectionalLight(0xffffff, 0.85);
  key.position.set(1.1, 1.5, 2.1);
  const fillLight = new DirectionalLight(0xdfe8f2, 0.45);
  fillLight.position.set(-1.8, 0.3, 1.4);
  scene.add(hemi, key, fillLight);

  // --- load: one fetch, explicit missing-asset detection, no double download.
  const abort = new AbortController();
  const timeout = setTimeout(() => abort.abort(), LOAD_TIMEOUT_MS);
  let buffer: ArrayBuffer;
  try {
    const response = await fetch(src, { signal: abort.signal });
    if (!response.ok) {
      throw new StephenRendererError(
        response.status === 404 || response.status === 410 ? 'missing' : 'failed',
        `Model request failed: ${response.status}`,
      );
    }
    buffer = await response.arrayBuffer();
  } catch (error) {
    clearTimeout(timeout);
    renderer.dispose();
    canvas.remove();
    if (error instanceof StephenRendererError) throw error;
    // Only an HTTP 404/410 above counts as missing; transport-level problems
    // (offline, DNS, timeout) are ordinary failures.
    throw new StephenRendererError(
      'failed',
      abort.signal.aborted ? 'Model request timed out' : 'Model request did not complete',
    );
  }
  clearTimeout(timeout);

  let gltf: { scene: GroupType };
  try {
    const loader = new gltfModule.GLTFLoader();
    loader.setMeshoptDecoder(meshoptModule.MeshoptDecoder);
    gltf = await new Promise((resolve, reject) => {
      loader.parse(buffer, '', resolve, () => reject(new StephenRendererError('failed', 'Model parse failed')));
    });
  } catch (error) {
    renderer.dispose();
    canvas.remove();
    throw error instanceof StephenRendererError ? error : new StephenRendererError('failed', 'Model parse failed');
  }

  let meshes = 0;
  gltf.scene.traverse((child) => {
    const mesh = child as MeshType;
    if (!mesh.isMesh) return;
    meshes += 1;
    // Dielectric portrait: ignore any metallic bleed from the baked ORM map.
    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const material of materials) (material as StandardMaterial).metalness = 0;
  });
  if (!meshes) {
    renderer.dispose();
    canvas.remove();
    throw new StephenRendererError('failed', 'Model contains no renderable mesh');
  }
  model.add(gltf.scene);

  // --- framing: square stage, whole bust, small headroom. Computed once at
  // load so pointer motion never reframes the shot.
  const box = new Box3().setFromObject(gltf.scene);
  const size = box.getSize(new Vector3());
  const center = box.getCenter(new Vector3());
  const margin = Math.max(size.x, size.y) * 0.06;
  const vFov = (camera.fov * Math.PI) / 180;
  const distance = Math.max(
    (size.y / 2 + margin) / Math.tan(vFov / 2),
    (size.x / 2 + margin) / Math.tan(vFov / 2),
  );
  camera.position.set(0, center.y, distance);
  camera.lookAt(center.x, center.y, 0);
  gltf.scene.position.sub(new Vector3(center.x, 0, center.z)); // keep the axis centred

  // --- on-demand frames
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let raf = 0;
  let last = 0;
  let nodStart = 0;
  const pose = { yaw: 0, pitch: 0 };
  const target = { yaw: 0, pitch: 0 };

  const draw = () => {
    let nod = 0;
    if (nodStart) {
      const progress = (performance.now() - nodStart) / NOD_MS;
      nod = progress >= 1 ? 0 : Math.sin(progress * Math.PI) * NOD;
      if (progress >= 1) nodStart = 0;
    }
    model.rotation.y = pose.yaw;
    model.rotation.x = pose.pitch + nod;
    renderer.render(scene, camera);
  };
  const schedule = () => { if (!raf) raf = requestAnimationFrame(tick); };
  const tick = (now: number) => {
    raf = 0;
    const dt = Math.min(0.1, (now - last) / 1000 || 0.016);
    last = now;
    const ease = 1 - Math.exp(-dt * 9);
    pose.yaw += (target.yaw - pose.yaw) * ease;
    pose.pitch += (target.pitch - pose.pitch) * ease;
    draw();
    const settled = Math.abs(target.yaw - pose.yaw) < 0.0006 && Math.abs(target.pitch - pose.pitch) < 0.0006;
    if (!settled || nodStart) schedule();
  };
  const snap = () => { // reduced motion: jump straight to the pose, single frame
    pose.yaw = target.yaw;
    pose.pitch = target.pitch;
    draw();
  };

  const resize = () => {
    const width = host.clientWidth;
    const height = host.clientHeight;
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    if (motion.matches) snap(); else schedule();
  };
  const observer = new ResizeObserver(resize);
  observer.observe(host);
  resize();

  // Re-present after bfcache restores or tab visibility returns: some
  // compositors drop an idle WebGL frame, and a blank portrait is worse than
  // one extra draw call.
  const represent = () => { if (motion.matches) snap(); else schedule(); };
  const onVisible = () => { if (!document.hidden) represent(); };
  const onPageshow = (event: PageTransitionEvent) => { if (event.persisted) represent(); };
  document.addEventListener('visibilitychange', onVisible);
  window.addEventListener('pageshow', onPageshow);

  const onMotionChange = () => {
    target.yaw = 0;
    target.pitch = 0;
    nodStart = 0;
    if (motion.matches) snap(); else schedule();
  };
  motion.addEventListener('change', onMotionChange);

  draw(); // first frame before resolving: the controller swaps the photo only after this

  const dispose = () => {
    cancelAnimationFrame(raf);
    document.removeEventListener('visibilitychange', onVisible);
    window.removeEventListener('pageshow', onPageshow);
    raf = 0;
    observer.disconnect();
    motion.removeEventListener('change', onMotionChange);
    gltf.scene.traverse((child) => {
      const mesh = child as MeshType;
      if (!mesh.isMesh) return;
      mesh.geometry?.dispose();
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      for (const material of materials) {
        const standard = material as StandardMaterial;
        standard.map?.dispose();
        standard.normalMap?.dispose();
        standard.roughnessMap?.dispose();
        standard.metalnessMap?.dispose();
        standard.dispose();
      }
    });
    renderer.dispose();
    renderer.forceContextLoss();
    canvas.remove();
  };

  const rendererApi: StephenRenderer = {
    lookAt(x, y) {
      if (motion.matches) return;
      target.yaw = x * MAX_YAW;
      target.pitch = y * MAX_PITCH;
      schedule();
    },
    activate() {
      if (motion.matches) return;
      nodStart = performance.now();
      last = nodStart;
      schedule();
    },
    pause() {
      cancelAnimationFrame(raf);
      raf = 0;
      nodStart = 0;
    },
    dispose,
  };
  return rendererApi;
};
