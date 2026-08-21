'use client';

import { Group, Panel, Separator, useDefaultLayout } from 'react-resizable-panels';
import type { ReactNode } from 'react';

function EditorResizeHandle({ orientation }: { orientation: 'horizontal' | 'vertical' }) {
  return (
    <Separator
      className={
        orientation === 'horizontal'
          ? 'group relative w-1.5 shrink-0 cursor-col-resize bg-transparent outline-none hover:bg-[#665CFF]/40 data-[separator]:bg-transparent'
          : 'group relative h-1.5 shrink-0 cursor-row-resize bg-transparent outline-none hover:bg-[#665CFF]/40 data-[separator]:bg-transparent'
      }
    />
  );
}

export function EditorHorizontalSplit({
  id,
  left,
  center,
  right,
  collapsedLeft,
}: {
  id: string;
  left?: ReactNode;
  center: ReactNode;
  right: ReactNode;
  collapsedLeft?: boolean;
}) {
  const showLeft = Boolean(left) && !collapsedLeft;
  const { defaultLayout, onLayoutChanged } = useDefaultLayout({
    id,
    panelIds: showLeft
      ? ['editor-left', 'editor-center', 'editor-right']
      : ['editor-center', 'editor-right'],
    storage: typeof window !== 'undefined' ? localStorage : undefined,
  });

  return (
    <Group
      id={id}
      orientation="horizontal"
      className="min-h-0 min-w-0 flex-1"
      defaultLayout={defaultLayout}
      onLayoutChanged={onLayoutChanged}
    >
      {showLeft ? (
        <>
          <Panel
            id="editor-left"
            defaultSize="18%"
            minSize="12%"
            maxSize="35%"
            className="min-h-0 min-w-0"
          >
            {left}
          </Panel>
          <EditorResizeHandle orientation="horizontal" />
        </>
      ) : null}

      <Panel
        id="editor-center"
        defaultSize={showLeft ? '60%' : '78%'}
        minSize="35%"
        className="min-h-0 min-w-0"
      >
        {center}
      </Panel>

      <EditorResizeHandle orientation="horizontal" />

      <Panel
        id="editor-right"
        defaultSize={showLeft ? '22%' : '22%'}
        minSize="16%"
        maxSize="40%"
        className="min-h-0 min-w-0"
      >
        {right}
      </Panel>
    </Group>
  );
}

export function EditorVerticalSplit({
  id,
  top,
  bottom,
}: {
  id: string;
  top: ReactNode;
  bottom: ReactNode;
}) {
  const { defaultLayout, onLayoutChanged } = useDefaultLayout({
    id,
    panelIds: ['editor-viewport', 'editor-action'],
    storage: typeof window !== 'undefined' ? localStorage : undefined,
  });

  return (
    <Group
      id={id}
      orientation="vertical"
      className="h-full min-h-0 min-w-0"
      defaultLayout={defaultLayout}
      onLayoutChanged={onLayoutChanged}
    >
      <Panel
        id="editor-viewport"
        defaultSize="74%"
        minSize="35%"
        className="min-h-0 min-w-0"
      >
        {top}
      </Panel>
      <EditorResizeHandle orientation="vertical" />
      <Panel
        id="editor-action"
        defaultSize="26%"
        minSize="14%"
        maxSize="55%"
        className="min-h-0 min-w-0"
      >
        {bottom}
      </Panel>
    </Group>
  );
}
