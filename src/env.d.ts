/// <reference path="../.astro/types.d.ts" />
/// <reference path="../.astro/env.d.ts" />
/// <reference types="astro/client" />

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

export interface FileData {
  name: string;
  content: string;
}
