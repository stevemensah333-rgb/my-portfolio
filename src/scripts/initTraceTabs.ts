type TraceTabOptions = {
  onSelect?: (id: string, index: number, count: number) => void;
};

export function initTraceTabs(root: Element, options: TraceTabOptions = {}) {
  const tabs = [...root.querySelectorAll<HTMLButtonElement>('[data-stage-tab]')];
  const panels = [...root.querySelectorAll<HTMLElement>('[data-stage-panel]')];

  if (tabs.length === 0 || panels.length === 0) return;

  const select = (id: string) => {
    const index = tabs.findIndex(tab => tab.dataset.stageTab === id);
    if (index < 0) return;

    tabs.forEach((tab, tabIndex) => {
      const active = tab.dataset.stageTab === id;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      tab.dataset.active = String(active);
      tab.dataset.past = String(tabIndex < index);
    });
    panels.forEach(panel => {
      const active = panel.dataset.stagePanel === id;
      panel.dataset.active = String(active);
      panel.hidden = !active;
    });
    options.onSelect?.(id, index, tabs.length);
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
}
