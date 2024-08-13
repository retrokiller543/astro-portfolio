export interface Path {
  path: string;
  name: string;
  icon?: any;
  children?: Path[];
}

export interface Section {
  name: string;
  path: string;
  children?: Path[];
}
