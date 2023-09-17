import { Obfuscator, obfuscateCustom } from "./obfuscators";

/**
 * A point in a string to split obfuscation.
 * Like {@link Obfuscator.untilLength}, this can be used to combine obfuscators. For instance, to obfuscate email addresses:
 * Unlike {@link Obfuscator.untilLength} it's not possible to chain splitting, but it's of course possible to nest it.
 * @example
 * const localPartObfuscator = obfuscatePortion({
 *   keepAtStart: 1,
 *   keepAtEnd: 1,
 *   fixedTotalLength: 8
 * });
 * const domainObfuscator = obfuscateNone;
 * const obfuscator = atFirst('@').splitTo(localPartObfuscator, domainObfuscator);
 * // Everything before @ will be obfuscated using localPartObfuscator, everything after @ will not be obfuscated
 * // Example input: test@example.org
 * // Example output: t******t@example.org
 * @example
 * const localPartObfuscator = obfuscatePortion({
 *   keepAtStart: 1,
 *   keepAtEnd: 1,
 *   fixedTotalLength: 8
 * });
 * const domainObfuscator = atLast('.').splitTo(obfuscateAll(), obfuscateNone);
 * const obfuscator = atFirst('@').splitTo(localPartObfuscator, domainObfuscator);
 * // Everything before @ will be obfuscated using localPartObfuscator, everything after @ will be obfuscated until the last dot
 * // Example input: test@example.org
 * // Example output: t******t@*******.org
 */
export interface SplitPoint {
  /**
   * Creates an obfuscator that splits obfuscation at this split point.
   * The part of the string before the split point will be obfuscated by one obfuscator, the part after the split point by another.
   * @param beforeSplitPoint The obfuscator to use before the split point.
   * @param afterSplitPoint The obfuscator to use after the split point.
   * @return The created obfuscator.
   */
  splitTo(beforeSplitPoint: Obfuscator, afterSplitPoint: Obfuscator): Obfuscator;
}

/**
 * Creates a new split point that splits at the first occurrence of a string.
 * This split point is exclusive; the string itself will not be obfuscated.
 */
export function atFirst(s: string): SplitPoint {
  function splitStart(text: string): number {
    const index = text.indexOf(s);
    return index == -1 ? text.length : index;
  }
  return splitPoint(splitStart, s.length);
}

/**
 * Creates a new split point that splits at the last occurrence of a string.
 * This split point is exclusive; the string itself will not be obfuscated.
 */
export function atLast(s: string): SplitPoint {
  function splitStart(text: string): number {
    const index = text.lastIndexOf(s);
    return index == -1 ? text.length : index;
  }
  return splitPoint(splitStart, s.length);
}

/**
 * Creates a new split point that splits at a specific occurrence of a string.
 * This split point is exclusive; the string itself will not be obfuscated.
 * @param occurrence The zero-based occurrence of the string to split at.
 */
export function atNth(s: string, occurrence: number): SplitPoint {
  if (occurrence < 0) {
    throw new Error(`${occurrence} < 0`);
  }
  function splitStart(text: string): number {
    let index = text.indexOf(s, 0);
    for (let i = 1; i <= occurrence && index != -1; i++) {
      index = text.indexOf(s, index + 1);
    }
    return index == -1 ? text.length : index;
  }
  return splitPoint(splitStart, s.length);
}

function splitPoint(splitStart: (text: string) => number, splitLength: number): SplitPoint {
  return {
    splitTo(beforeSplitPoint, afterSplitPoint) {
      return splitObfuscator(splitStart, splitLength, beforeSplitPoint, afterSplitPoint);
    },
  };
}

function splitObfuscator(splitStart: (text: string) => number, splitLength: number, beforeSplitPoint: Obfuscator, afterSplitPoint: Obfuscator): Obfuscator {
  const obfuscate = (text: string): string => {
    const splitStartIndex = splitStart(text);
    if (splitStartIndex === text.length) {
      return beforeSplitPoint(text);
    }
    return [
      beforeSplitPoint(text.substring(0, splitStartIndex)),
      text.substring(splitStartIndex, splitStartIndex + splitLength),
      afterSplitPoint(text.substring(splitStartIndex + splitLength)),
    ].join("");
  };
  return obfuscateCustom(obfuscate);
}
