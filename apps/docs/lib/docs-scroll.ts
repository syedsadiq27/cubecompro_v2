const OFFSET = 40;

export function getDocsScroller() {
  return document.querySelector<HTMLElement>('[data-docs-scroll]');
}

export function scrollDocsToId(id: string) {
  const scroller = getDocsScroller();
  const el = document.getElementById(id);
  if (!scroller || !el) return;
  const top =
    el.getBoundingClientRect().top -
    scroller.getBoundingClientRect().top +
    scroller.scrollTop -
    OFFSET;
  scroller.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  window.history.replaceState(null, '', `#${id}`);
}

export function readActiveDocsId(ids: string[]) {
  const scroller = getDocsScroller();
  if (!scroller || ids.length === 0) return '';
  const line = scroller.getBoundingClientRect().top + OFFSET;
  let active = ids[0];
  for (const id of ids) {
    const el = document.getElementById(id);
    if (!el) continue;
    if (el.getBoundingClientRect().top <= line + 1) {
      active = id;
    }
  }
  return active ?? '';
}
