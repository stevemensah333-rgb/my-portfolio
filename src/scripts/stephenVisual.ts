/**
 * Controller for the Home avatar slot. Owns lifecycle only: when the stage is
 * worth loading, when to pause, and how to report state to the markup. The
 * renderer itself lives behind `StephenRendererFactory` (see stephenRenderer),
 * so this file stays free of any 3D dependency.
 *
 * A factory mounts into `host`, loads `src`, and resolves only after its first
 * frame. It must keep the portrait visible on failure, frame the bust inside
 * the fixed square stage, and keep pointer-driven motion capped to a few
 * degrees. Targets are normalized [-1, 1]. Render on demand; `pause` MUST
 * cancel renderer frames. Never auto-rotate.
 *
 * Reduced motion still gets the model: one static frame, no pointer motion,
 * no nod, and the disclosure note stays fully usable.
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

/** photo = nothing rendered (also the no-JS baseline); held = reduced motion. */
export type StephenVisualState = 'photo' | 'loading' | 'live' | 'held' | 'fallback' | 'missing';

export function initStephenVisual(
  root: HTMLElement,
  createRenderer?: StephenRendererFactory,
  onState?: (state: StephenVisualState) => void,
) {
  // Without a factory there is nothing to enhance: the native disclosure
  // already provides click, touch, Enter and Space for the note.
  if (!createRenderer) {
    onState?.('photo');
    return () => {};
  }
  const host = root.querySelector<HTMLElement>('[data-stephen-renderer]')!;
  const stage = root.querySelector<HTMLElement>('.stephen__stage')!;
  const note = root.querySelector<HTMLDetailsElement>('details')!;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const coarse = matchMedia('(pointer: coarse)');
  const events = new AbortController();
  let renderer: StephenRenderer | undefined;
  let disposed = false;
  let visible = false;
  let loading = false;
  let blocked = false; // a failed or missing asset is not retried this session
  let idle: ReturnType<typeof setTimeout>;

  const setState = (state: StephenVisualState) => onState?.(state);
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
    setState('photo');
  };
  const load = async () => {
    if (renderer || loading || blocked || disposed || !visible || document.hidden) return;
    loading = true;
    setState('loading');
    try {
      const model = await createRenderer(host, root.dataset.modelSrc!);
      if (disposed || !visible || document.hidden) {
        model.dispose();
        host.replaceChildren();
        setState('photo');
      } else {
        renderer = model;
        setState(motion.matches ? 'held' : 'live');
        stop();
      }
    } catch (error) {
      // The renderer releases partial resources on rejection. Keep the photo.
      host.replaceChildren();
      blocked = true;
      setState((error as { kind?: string } | null)?.kind === 'missing' ? 'missing' : 'fallback');
    } finally {
      loading = false;
    }
  };
  const look = (event: PointerEvent) => {
    if (!renderer || motion.matches || !visible || document.hidden) return;
    if (coarse.matches && event.type === 'pointermove') return; // touch: taps only
    const box = stage.getBoundingClientRect();
    const clamp = (value: number) => Math.max(-1, Math.min(1, value));
    renderer.lookAt(
      clamp(((event.clientX - box.left) / box.width) * 2 - 1),
      clamp(1 - ((event.clientY - box.top) / box.height) * 2),
    );
    clearTimeout(idle);
    idle = setTimeout(stop, 650);
  };
  const options = { signal: events.signal };
  stage.addEventListener('pointermove', look, options);
  stage.addEventListener('pointerdown', look, options);
  stage.addEventListener('pointerleave', stop, options);
  stage.addEventListener('pointercancel', stop, options);
  note.addEventListener('toggle', () => {
    if (note.open && renderer && visible) {
      renderer.activate(); // a small nod; a no-op under reduced motion
      clearTimeout(idle);
      idle = setTimeout(stop, 650);
    }
  }, options);
  motion.addEventListener('change', () => {
    if (motion.matches) {
      stop();
      if (renderer) setState('held');
    } else {
      if (renderer) setState('live');
      void load();
    }
  }, options);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else void load();
  }, options);
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) void load();
    else stop();
  });
  observer.observe(root);
  const dispose = () => {
    disposed = true;
    observer.disconnect();
    events.abort();
    unload();
  };
  window.addEventListener('pagehide', (event) => {
    if (event.persisted) stop();
    else dispose();
  }, options);
  return dispose;
}
