type TraceTabOptions = {
  onSelect?: (id: string, index: number, count: number, tab: HTMLButtonElement) => void;
  /** Aborted when the calling view re-initializes (view transitions),
      so window-scoped listeners never accumulate. */
  signal?: AbortSignal;
};

export type TraceTabController = {
  select: (id: string) => void;
};

/**
 * Reserve the height of the tallest panel on the panels' shared parent
 * so switching stages never resizes the document below the instrument
 * (layout stability). Hidden panels are measured in one synchronous
 * pass — no paint happens between unhide and re-hide. Returns the
 * stabilize function so callers can re-run it when their layout flips
 * between stacked and exclusive modes.
 */
export function reserveStackHeight(panels: HTMLElement[], signal?: AbortSignal): () => void {
  const stack = panels[0]?.parentElement;
  let resizeTimer = 0;
  const stabilize = () => {
    if (!stack) return;
    stack.style.minHeight = '';
    let max = 0;
    for (const panel of panels) {
      const wasHidden = panel.hidden;
      panel.hidden = false;
      max = Math.max(max, panel.offsetHeight);
      panel.hidden = wasHidden;
    }
    const exclusive = panels.some((panel) => panel.hidden);
    stack.style.minHeight = exclusive && max > 0 ? `${max}px` : '';
  };
  stabilize();
  document.fonts?.ready.then(stabilize).catch(() => {});
  window.addEventListener('resize', () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(stabilize, 150);
  }, { signal });
  return stabilize;
}

export function initTraceTabs(root: Element, options: TraceTabOptions = {}): TraceTabController | null {
  const tabs = [...root.querySelectorAll<HTMLButtonElement>('[data-stage-tab]')];
  const panels = [...root.querySelectorAll<HTMLElement>('[data-stage-panel]')];

  if (tabs.length === 0 || panels.length === 0) return null;

  reserveStackHeight(panels, options.signal);

  const select = (id: string) => {
    const index = tabs.findIndex(tab => tab.dataset.stageTab === id);
    if (index < 0) return;

    tabs.forEach((tab, tabIndex) => {
      const active = tab.dataset.stageTab === id;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      tab.dataset.active = String(active);
      tab.dataset.past = String(tabIndex < index);
      tab.dataset.future = String(tabIndex > index);
    });
    panels.forEach(panel => {
      const active = panel.dataset.stagePanel === id;
      panel.dataset.active = String(active);
      panel.hidden = !active;
      if (active) {
        // reveal transformation — panel enters, consistent motion vocabulary
        panel.classList.remove('reveal-enter');
        void panel.offsetWidth;
        panel.classList.add('reveal-enter');
      }
    });
    const selectedTab = tabs[index];
    if (selectedTab) options.onSelect?.(id, index, tabs.length, selectedTab);
  };

  const initial = tabs.find(tab => tab.getAttribute('aria-selected') === 'true')?.dataset.stageTab
    ?? tabs[0]?.dataset.stageTab;
  if (initial) select(initial);

  tabs.forEach((tab, currentIndex) => {
    tab.addEventListener('click', () => {
      const id = tab.dataset.stageTab;
      if (id) select(id);
    });
    tab.addEventListener('keydown', event => {
      let nextIndex: number | null = null;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        nextIndex = (currentIndex + 1) % tabs.length;
      } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      } else if (event.key === 'Home') {
        nextIndex = 0;
      } else if (event.key === 'End') {
        nextIndex = tabs.length - 1;
      }

      if (nextIndex === null) return;
      event.preventDefault();
      const nextTab = tabs[nextIndex];
      const id = nextTab?.dataset.stageTab;
      nextTab?.focus();
      if (id) select(id);
    });
  });

  return { select };
}
