import { writeFile } from 'node:fs/promises';

const delay = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));
const endpoint = 'http://[::1]:9224';
const target = await (await fetch(`${endpoint}/json/new?${encodeURIComponent('http://127.0.0.1:4322/')}`, { method: 'PUT' })).json();
const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.onopen = resolve;
  socket.onerror = reject;
});

let sequence = 0;
const pending = new Map();
socket.onmessage = event => {
  const message = JSON.parse(event.data);
  if (!message.id || !pending.has(message.id)) return;
  const promise = pending.get(message.id);
  pending.delete(message.id);
  if (message.error) promise.reject(message.error);
  else promise.resolve(message.result);
};

const send = (method, params = {}) => new Promise((resolve, reject) => {
  const id = ++sequence;
  pending.set(id, { resolve, reject });
  socket.send(JSON.stringify({ id, method, params }));
});

const evaluate = async expression => {
  const response = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (response.exceptionDetails) throw new Error(response.exceptionDetails.text);
  return response.result.value;
};

const setViewport = async (width, height) => {
  await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 600 });
};

const navigate = async () => {
  await send('Page.navigate', { url: 'http://127.0.0.1:4322/' });
  await delay(900);
};

const capture = async path => {
  const result = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  await writeFile(path, Buffer.from(result.data, 'base64'));
};

const layoutMetrics = () => evaluate(`(() => {
  const root = document.querySelector('[data-syncareer-narrative]');
  const firstState = document.querySelector('[data-narrative-step]');
  const firstEvidence = firstState?.querySelector('.narrative-evidence');
  const rail = document.querySelector('.narrative-rail');
  const traceStrip = document.querySelector('.trace-strip');
  const tablist = document.querySelector('.trace-tablist');
  const productImage = document.querySelector('.product-frame img');
  const portrait = document.querySelector('#about img');
  return {
    viewport: { width: innerWidth, height: innerHeight },
    documentWidth: { client: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth },
    narrativeDisplay: getComputedStyle(firstState).display,
    evidencePosition: getComputedStyle(firstEvidence).position,
    railPosition: getComputedStyle(rail).position,
    trace: { stripClient: traceStrip?.clientWidth, stripScroll: traceStrip?.scrollWidth, tablistClient: tablist?.clientWidth, tablistScroll: tablist?.scrollWidth },
    stateCount: root?.querySelectorAll('[data-narrative-step]').length,
    currentCount: root?.querySelectorAll('[data-narrative-control][aria-current="step"]').length,
    directTabs: document.querySelectorAll('[data-stage-tab]').length,
    directPanels: document.querySelectorAll('[data-stage-panel]').length,
    ariaLinksValid: [...document.querySelectorAll('[data-stage-tab]')].every(tab => document.getElementById(tab.getAttribute('aria-controls'))?.getAttribute('aria-labelledby') === tab.id),
    productImage: { complete: productImage?.complete, naturalWidth: productImage?.naturalWidth },
    portrait: { complete: portrait?.complete, naturalWidth: portrait?.naturalWidth, src: portrait?.getAttribute('src') },
  };
})()`);

const inspectState = async (stateId, screenshotPath) => {
  await evaluate(`document.querySelector('[data-narrative-step="${stateId}"]').scrollIntoView({ block: 'center', behavior: 'instant' })`);
  await delay(550);
  const state = await evaluate(`(() => {
    const root = document.querySelector('[data-syncareer-narrative]');
    const step = document.querySelector('[data-narrative-step="${stateId}"]');
    const evidence = step.querySelector('.narrative-evidence');
    const rect = evidence.getBoundingClientRect();
    return {
      requested: '${stateId}',
      active: root.dataset.activeNarrativeState,
      activeStep: root.querySelector('[data-narrative-step][data-active="true"]')?.dataset.narrativeStep,
      currentControl: root.querySelector('[data-narrative-control][aria-current="step"]')?.dataset.narrativeControl,
      selectedTrace: document.querySelector('[data-stage-tab][aria-selected="true"]')?.dataset.stageTab,
      evidence: { top: Math.round(rect.top), bottom: Math.round(rect.bottom), position: getComputedStyle(evidence).position },
    };
  })()`);
  if (screenshotPath) await capture(screenshotPath);
  return state;
};

await send('Page.enable');
await send('Runtime.enable');

const report = {};

await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] });
await setViewport(1440, 900);
await navigate();
report.desktop = {
  layout: await layoutMetrics(),
  states: [
    await inspectState('observed-failure', '/private/tmp/syncareer-desktop-failure.png'),
    await inspectState('engineering-response', '/private/tmp/syncareer-desktop-response.png'),
    await inspectState('product-contract', '/private/tmp/syncareer-desktop-contract.png'),
  ],
};

await evaluate(`document.querySelector('[data-narrative-control="engineering-response"]').click()`);
await delay(100);
report.desktop.railControl = await evaluate(`(() => ({
  active: document.querySelector('[data-syncareer-narrative]').dataset.activeNarrativeState,
  selectedTrace: document.querySelector('[data-stage-tab][aria-selected="true"]')?.dataset.stageTab,
  current: document.querySelector('[data-narrative-control][aria-current="step"]')?.dataset.narrativeControl,
}))()`);

await evaluate(`(() => {
  const tab = document.querySelector('[data-stage-tab="input"]');
  tab.focus();
  tab.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
})()`);
await delay(100);
report.desktop.keyboard = await evaluate(`(() => ({
  selected: document.querySelector('[data-stage-tab][aria-selected="true"]')?.dataset.stageTab,
  focused: document.activeElement?.dataset?.stageTab,
  visiblePanel: document.querySelector('[data-stage-panel]:not([hidden])')?.dataset.stagePanel,
}))()`);

await setViewport(768, 1024);
await navigate();
report.tablet = {
  layout: await layoutMetrics(),
  states: [
    await inspectState('observed-failure'),
    await inspectState('engineering-response'),
    await inspectState('product-contract'),
  ],
};
await capture('/private/tmp/syncareer-tablet-contract.png');

await setViewport(375, 812);
await navigate();
report.mobile = {
  layout: await layoutMetrics(),
  states: [
    await inspectState('observed-failure'),
    await inspectState('engineering-response'),
    await inspectState('product-contract'),
  ],
};
await capture('/private/tmp/syncareer-mobile-contract.png');

await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
await setViewport(1440, 900);
await navigate();
await inspectState('engineering-response');
report.reducedMotion = await evaluate(`(() => {
  const step = document.querySelector('[data-narrative-step="engineering-response"]');
  const evidence = step.querySelector('.narrative-evidence');
  const heading = step.querySelector('h4');
  const rail = document.querySelector('.narrative-rail');
  return {
    stateDisplay: getComputedStyle(step).display,
    evidencePosition: getComputedStyle(evidence).position,
    railPosition: getComputedStyle(rail).position,
    evidenceTransition: getComputedStyle(evidence).transitionDuration,
    headingTransition: getComputedStyle(heading).transitionDuration,
    opacity: getComputedStyle(evidence).opacity,
    transform: getComputedStyle(evidence).transform,
  };
})()`);

console.log(JSON.stringify(report, null, 2));
socket.close();
