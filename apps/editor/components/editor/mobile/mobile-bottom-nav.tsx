'use client';

import {
  AssetsIcon,
  CameraIcon,
  ConfigIcon,
  SceneIcon,
} from '@/components/editor/icons';

export function MobileBottomNav({
  activeTab,
  onSelectTab,
}: {
  activeTab: 'scene' | 'product' | 'cameras' | 'assets';
  onSelectTab: (tab: 'scene' | 'product' | 'cameras' | 'assets') => void;
}) {
  const tabs = [
    {
      key: 'scene' as const,
      label: 'Scene',
      icon: <SceneIcon size="lg" />,
    },
    {
      key: 'product' as const,
      label: 'Config',
      icon: <ConfigIcon size="lg" />,
    },
    {
      key: 'cameras' as const,
      label: 'Camera',
      icon: <CameraIcon size="lg" />,
    },
    {
      key: 'assets' as const,
      label: 'Assets',
      icon: <AssetsIcon size="lg" />,
    },
  ];

  return (
    <nav className="flex h-14 shrink-0 items-center justify-around border-t border-white/10 bg-[#0E0F12] px-2 select-none text-white">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onSelectTab(tab.key)}
            className={`flex flex-1 flex-col items-center justify-center gap-0.5 py-1 transition-colors ${
              isActive ? 'text-[#9D95FF]' : 'text-white/50 hover:text-white/80'
            }`}
          >
            {tab.icon}
            <span className="text-[10px] font-medium tracking-wide">
              {tab.label}
            </span>
            {isActive ? (
              <span className="mt-0.5 h-0.5 w-6 rounded-full bg-[#665CFF]" />
            ) : (
              <span className="mt-0.5 h-0.5 w-6 opacity-0" />
            )}
          </button>
        );
      })}
    </nav>
  );
}
