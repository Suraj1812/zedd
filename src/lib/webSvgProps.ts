/** Animated injects native layout flags which must never reach SVG DOM nodes. */
export function webSvgProps<T extends object>(props: T) {
  const clean = { ...props } as T & {
    collapsable?: unknown;
    collapsableChildren?: unknown;
  };
  delete clean.collapsable;
  delete clean.collapsableChildren;
  return clean;
}
