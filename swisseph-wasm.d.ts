declare module 'swisseph-wasm' {
  export function calc_ut(julianDay: number, planet: number, flags: number): {
    error?: string;
    data: number[];
  };

  export const SE_SUN: number;
  export const SE_MOON: number;
  export const SE_MERCURY: number;
  export const SE_VENUS: number;
  export const SE_MARS: number;
  export const SE_JUPITER: number;
  export const SE_SATURN: number;
  export const SE_URANUS: number;
  export const SE_NEPTUNE: number;
  export const SE_PLUTO: number;
  export const SE_EARTH: number;
  export const SE_TRUE_NODE: number;
}
