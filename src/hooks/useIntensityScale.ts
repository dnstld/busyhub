import { useCallback } from 'react';

export const intensityColors = [
  'bg-zinc-800',
  'bg-lime-900',
  'bg-lime-700',
  'bg-lime-500',
  'bg-lime-300',
];

/**
 * Maps an event-count to a Tailwind class name.
 *
 * @param thresholds  The upper bound for each colour bucket.
 *                    Default `[0, 1, 2, 3]` → produces 5 buckets.
 * @param classes     Tailwind colour classes, one longer than `thresholds`.
 *                    Default greys/greens.
 *
 * @returns           A memoised `(count: number) => string`.
 */
export const useIntensityScale = (
  thresholds: number[] = [0, 1, 2, 3],
  classes: string[] = intensityColors,
) => {
  if (classes.length !== thresholds.length + 1) {
     
    console.warn(
      'useIntensityScale: classes.length must equal thresholds.length + 1',
    );
  }

  return useCallback(
    (count: number) => {
      const idx = thresholds.findIndex((t) => count <= t);
      return classes[idx === -1 ? classes.length - 1 : idx];
    },
    [thresholds, classes],
  );
};
