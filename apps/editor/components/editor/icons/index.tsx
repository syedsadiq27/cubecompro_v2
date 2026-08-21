'use client';

import {
  ArrowLeft,
  Box,
  Camera,
  Check,
  ChevronDown,
  ChevronRight,
  Crosshair,
  Eye,
  EyeOff,
  Focus,
  FolderKanban,
  Grid3x3,
  Layers,
  Menu,
  MoreHorizontal,
  Move,
  MousePointer2,
  Package,
  Plus,
  RotateCw,
  Scaling,
  Search,
  Settings,
  SlidersHorizontal,
  Target,
  type LucideIcon,
  type LucideProps,
} from 'lucide-react';

export const EDITOR_ICON_STROKE = 1.75;

export const EDITOR_ICON_SIZE = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
} as const;

export type EditorIconSize = keyof typeof EDITOR_ICON_SIZE;

type EditorIconProps = {
  size?: EditorIconSize | number;
  className?: string;
} & Omit<LucideProps, 'size' | 'ref' | 'absoluteStrokeWidth'>;

export function Icon({
  icon: IconCmp,
  size = 'md',
  strokeWidth = EDITOR_ICON_STROKE,
  ...props
}: {
  icon: LucideIcon;
} & EditorIconProps) {
  const pixelSize =
    typeof size === 'number' ? size : EDITOR_ICON_SIZE[size];

  return (
    <IconCmp
      size={pixelSize}
      strokeWidth={strokeWidth}
      absoluteStrokeWidth={false}
      aria-hidden
      {...props}
    />
  );
}

function named(icon: LucideIcon) {
  return function NamedIcon(props: EditorIconProps) {
    return <Icon icon={icon} {...props} />;
  };
}

export const EyeIcon = named(Eye);
export const EyeOffIcon = named(EyeOff);
export const SettingsIcon = named(Settings);
export const SearchIcon = named(Search);
export const PlusIcon = named(Plus);
export const ChevronDownIcon = named(ChevronDown);
export const ChevronRightIcon = named(ChevronRight);
export const MoreHorizontalIcon = named(MoreHorizontal);
export const ArrowLeftIcon = named(ArrowLeft);
export const MenuIcon = named(Menu);
export const CheckIcon = named(Check);
export const TargetIcon = named(Target);
export const BoxIcon = named(Box);
export const CameraIcon = named(Camera);
export const ConfigIcon = named(SlidersHorizontal);
export const AssetsIcon = named(Layers);
export const SceneIcon = named(Box);
export const MousePointerIcon = named(MousePointer2);
export const MoveIcon = named(Move);
export const RotateIcon = named(RotateCw);
export const ScaleIcon = named(Scaling);
export const FocusIcon = named(Focus);
export const GridIcon = named(Grid3x3);
export const CrosshairIcon = named(Crosshair);
export const PackageIcon = named(Package);
export const FolderIcon = named(FolderKanban);

export {
  ArrowLeft,
  Box,
  Camera,
  Check,
  ChevronDown,
  ChevronRight,
  Crosshair,
  Eye,
  EyeOff,
  Focus,
  FolderKanban,
  Grid3x3,
  Layers,
  Menu,
  MoreHorizontal,
  Move,
  MousePointer2,
  Package,
  Plus,
  RotateCw,
  Scaling,
  Search,
  Settings,
  SlidersHorizontal,
  Target,
  type LucideIcon,
};
