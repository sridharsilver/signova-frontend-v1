import { en } from "./en";
import { hi } from "./hi";
import { te } from "./te";
import { gu } from "./gu";
import { mr } from "./mr";
import { ta } from "./ta";
import { kn } from "./kn";

export const translations = {
  en,
  hi,
  te,
  gu,
  mr,
  ta,
  kn,
} as const;

export type TranslationType = typeof en;
