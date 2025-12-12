export interface District {
  id: number;
  name: string;
}

export interface Block {
  id: number;
  name: string;
  districtId: number;
}

export interface GramPanchayat {
  id: number;
  name: string;
  blockId: number;
}