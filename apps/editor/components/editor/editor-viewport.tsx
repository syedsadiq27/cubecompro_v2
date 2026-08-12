'use client';

import { useEffect, useRef } from 'react';
import { createEditorRuntime, useEditorStore } from '@/lib/editor-store';

export function EditorViewport() {
  const hostRef = useRef<HTMLDivElement>(null);
  const attachRuntime = useEditorStore((state) => state.attachRuntime);
  const clearRuntime = useEditorStore((state) => state.clearRuntime);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const runtime = createEditorRuntime(host);
    attachRuntime(runtime);

    let frame = 0;
    const tick = () => {
      runtime.render();
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);

    const onPointerDown = (event: PointerEvent) => runtime.pointerDown(event);
    const onPointerUp = (event: PointerEvent) => runtime.pointerUp(event);
    host.addEventListener('pointerdown', onPointerDown);
    host.addEventListener('pointerup', onPointerUp);

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      runtime.resize(width, height);
    });
    observer.observe(host);
    runtime.resize(host.clientWidth, host.clientHeight);

    return () => {
      window.cancelAnimationFrame(frame);
      host.removeEventListener('pointerdown', onPointerDown);
      host.removeEventListener('pointerup', onPointerUp);
      observer.disconnect();
      runtime.dispose();
      clearRuntime();
    };
  }, [attachRuntime, clearRuntime]);

  return <div ref={hostRef} className="absolute inset-0 z-[2]" />;
}
