export type PartCategory = 'mb' | 'left' | 'right' | 'top' | 'bottom' | 'internal';

export interface SmartwatchPart {
  num: number; // 1 to 45
  group: PartCategory;
  name: string;
  nameHi: string;
  shortName: string;
  role: string;
  roleHi: string;
  desc: string;
  descHi: string;
  specs?: string;
  layerIndex: number; // 0: chassis, 1: battery, 2: pcb, 3: camera, 4: screen
  voltageOrPin?: string;
  highlightCoordinates?: { x: number; y: number; z: number };
}

export interface CategoryInfo {
  id: PartCategory;
  titleHi: string;
  titleEn: string;
  range: string;
  color: string;
  count: number;
}

export type PhotoLayout = 'exploded' | 'pcb_focus' | 'poster' | 'minimal' | 'blueprint';
export type PhotoResolution = '1080p' | '2k' | '4k';
