import type { ReactNode } from 'react';

export function CustomizerSidebar({ children }: { children: ReactNode }) {
  return (
    <div className="ui:flex ui:min-h-0 ui:w-full ui:flex-col">
      {children}
    </div>
  );
}
