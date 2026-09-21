import { DestroyRef } from '@angular/core';
import { ViewportScroller } from '@angular/common';

/** Keep anchor targets below a header that can grow when text or the viewport changes. */
export function observeHeaderOffset(
  document: Document,
  header: HTMLElement | null,
  destroyRef: DestroyRef,
  scroller: ViewportScroller,
): void {
  const window = document.defaultView;
  if (!window || !header) return;

  const root = document.documentElement;
  const previous = root.style.getPropertyValue('--site-header-offset');
  let lastOffset = '';
  const update = () => {
    if (destroyRef.destroyed) return;
    lastOffset = `${Math.ceil(header.getBoundingClientRect().height) + 16}px`;
    root.style.setProperty('--site-header-offset', lastOffset);
    scroller.setOffset([0, parseFloat(lastOffset)]);
  };
  update();
  const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(update);
  observer?.observe(header);
  window.addEventListener('resize', update, { passive: true });

  destroyRef.onDestroy(() => {
    observer?.disconnect();
    window.removeEventListener('resize', update);
    if (root.style.getPropertyValue('--site-header-offset') !== lastOffset) return;
    scroller.setOffset([0, 0]);
    if (previous) root.style.setProperty('--site-header-offset', previous);
    else root.style.removeProperty('--site-header-offset');
  });
}
