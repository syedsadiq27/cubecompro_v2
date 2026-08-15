'use client';

import { Component, type ReactNode } from 'react';

type Props = {
  children: ReactNode;
  correlationId?: string;
};

type State = {
  hasError: boolean;
  error?: Error;
};

export class RuntimeErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('[Storefront Runtime Error]', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-dvh w-full flex-col items-center justify-center bg-[#F4F3F0] p-6 text-center select-none text-[#18181B]">
          <div className="max-w-md space-y-4 rounded-2xl border border-black/10 bg-white p-8 shadow-xl">
            <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-amber-100 text-amber-800 text-xl font-bold">
              !
            </div>
            <h2 className="text-[18px] font-bold tracking-tight">Configuration Temporarily Unavailable</h2>
            <p className="text-[13px] text-stone-600">
              We encountered a minor issue loading this 3D product variation. You can reload or proceed with standard options.
            </p>
            {this.props.correlationId && (
              <div className="rounded-lg bg-stone-50 p-2 font-mono text-[10px] text-stone-500 border border-stone-200">
                Trace ID: {this.props.correlationId}
              </div>
            )}
            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="rounded-xl bg-[#18181B] hover:bg-black px-4 py-2 text-[12px] font-semibold text-white transition-colors cursor-pointer"
              >
                Reload Configurator
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
