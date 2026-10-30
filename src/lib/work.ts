// Examples shown in the home page carousel.
// To use real photos: put the files in /public/work and set `image`, e.g. "/work/board.webp".
// (Your Flutter project "laser_engrave" already has photos in assets/images you can reuse.)

import type { MaterialId } from "./ids";

export interface WorkExample {
  id: string;
  title: string;
  material: MaterialId;
  image?: string;
}

export const WORK: readonly WorkExample[] = [
  { id: "board", title: "Board · Wood", material: "wood" },
  { id: "keychain", title: "Keychain · Metal", material: "metal" },
  { id: "tumbler", title: "Tumbler · Glass", material: "glass" },
  { id: "coaster", title: "Coaster · Wood", material: "wood" },
  { id: "tag", title: "Tag · Metal", material: "metal" },
];
