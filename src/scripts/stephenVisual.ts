/**
 * Future GLB integration contract; deliberately no renderer dependency or fetch.
 * Replace the no-factory call in StephenVisual when a web-ready asset is approved.
 * The existing asset is ~54 MB and must not be loaded speculatively.
 *
 * A factory mounts into `host`, loads `src`, and resolves only after its first frame.
 * It must keep the portrait visible on failure, frame the head inside the fixed
 * stage, and implement look-at using its model's actual head/eye rig (unknown).
 * Targets are normalized [-1, 1]; cap head movement to a few degrees in the adapter.
 * Render on demand; pause MUST cancel renderer frames. Never auto-rotate.
 */
export interface StephenRenderer {
  lookAt(x: number, y: number): void;
  activate(): void;
  pause(): void;
  dispose(): void;
}
export type StephenRendererFactory = (
  host: HTMLElement,
  src: string,
) => Promise<StephenRenderer>;

export function initStephenVisual(root: HTMLElement, createRenderer?: StephenRendererFactory) {
  // Static today: native disclosure provides click, touch, Enter and Space.
  // No motion listeners, GPU work, or model request until a renderer is supplied.
  if (!createRenderer) return () => {};
  const host = root.querySelector<HTMLElement>('[data-stephen-renderer]')!;
  const stage = root.querySelector<HTMLElement>('.stephen__stage')!;
  const note = root.querySelector<HTMLDetailsElement>('details')!;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const events = new AbortController();
  let renderer: StephenRenderer | undefined;
  let disposed = false;
  let visible = false;
  let loading = false;
  let idle: ReturnType<typeof setTimeout>;

  const stop = () => {
    clearTimeout(idle);
    renderer?.lookAt(0, 0);
    renderer?.pause();
  };
  const unload = () => {
    stop();
    renderer?.dispose();
    renderer = undefined;
    host.replaceChildren();
  };
  const load = async () => {
    if (renderer || loading || disposed || !visible || motion.matches || document.hidden) return;
    loading = true;
    try {
      const model = await createRenderer(host, root.dataset.modelSrc!);
      if (disposed || motion.matches || !visible || document.hidden) {
        model.dispose();
        host.replaceChildren();
      } else {
        renderer = model;
        stop();
      }
    } catch {
      // A renderer must release partial resources on rejection. Keep the photograph.
      host.replaceChildren();
    } finally {
      loading = false;
    }
  };
  const look = (event: PointerEvent) => {
    if (!renderer || motion.matches || !visible || document.hidden) return;
    const box = stage.getBoundingClientRect();
    const clamp = (value: number) => Math.max(-1, Math.min(1, value));
    renderer.lookAt(clamp((event.clientX - box.left) / box.width * 2 - 1),
      clamp(1 - (event.clientY - box.top) / box.height * 2));
    clearTimeout(idle);
    idle = setTimeout(stop, 650);
  };
  const options = { signal: events.signal };
  stage.addEventListener('pointermove', look, options);
  stage.addEventListener('pointerdown', look, options);
  stage.addEventListener('pointerleave', stop, options);
  stage.addEventListener('pointercancel', stop, options);
  note.addEventListener('toggle', () => {
    if (note.open && !motion.matches && visible) {
      renderer?.activate();
      clearTimeout(idle);
      idle = setTimeout(stop, 650);
    }
  }, options);
  motion.addEventListener('change', () => motion.matches ? unload() : void load(), options);
  document.addEventListener('visibilitychange', () => document.hidden ? stop() : void load(), options);
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) void load(); else stop();
  });
  observer.observe(root);
  const dispose = () => {
    disposed = true;
    observer.disconnect();
    events.abort();
    unload();
  };
  window.addEventListener('pagehide', event => {
    if (event.persisted) stop(); else dispose();
  }, options);
  return dispose;
}
