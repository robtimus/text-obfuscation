/**
 * An object that will obfuscate text.
 */
export interface Obfuscator {
  /**
   * Obfuscates the given text.
   */
  obfuscateText(text: string): string;
  /**
   * Creates a prefix that can be used to chain another obfuscator to this obfuscator.
   * For the part up to the given prefix length, this obfuscator will be used; for any remaining content another obfuscator will be used.
   * This makes it possible to easily create complex obfuscators that would otherwise be impossible using any of the other obfuscators provided by this library.
   */
  untilLength(prefixLength: number): ObfuscatorPrefix;
}

/**
 * A prefix of a specific length that uses a specific obfuscator.
 * It can be used to create combined obfuscators that obfuscate text for the part up to the length of this prefix using the prefix' obfuscator,
 * then the rest with another.
 */
export interface ObfuscatorPrefix {
  /**
   * @returns an obfuscator that first uses the source of this object for the length of this prefix, then another obfuscator.
   */
  then(other: Obfuscator): Obfuscator;
}

/**
 * @returns an immutable obfuscator that replaces all text with the given mask character.
 *          The length of obfuscated contents will be as long as the length of the source.
 */
export function obfuscateAll(maskChar = "*"): Obfuscator {
  return obfuscateCustom((text) => maskChar.repeat(text.length));
}

/**
 * An immutable obfuscator that does not obfuscate anything.
 * This can be used as default value to prevent having to check for null or undefined.
 */
export const obfuscateNone = obfuscateCustom((text) => text);

/**
 * @returns an immutable obfuscator that replaces all text with the given fixed number of the give mask character.
 */
export function obfuscateWithFixedLength(fixedLength: number, maskChar = "*"): Obfuscator {
  const fixedValue = maskChar.repeat(fixedLength);
  return obfuscateWithFixedValue(fixedValue);
}

/**
 * @returns an immutable obfuscator that replaces all text with the given fixed value.
 */
export function obfuscateWithFixedValue(fixedValue: string): Obfuscator {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return obfuscateCustom((_text) => fixedValue);
}

export interface ObfuscatePortionOptions {
  /**
   * The number of characters at the start that created obfuscators will skip when obfuscating. Defaults to 0.
   */
  keepAtStart?: number;
  /**
   * The number of characters at the end that created obfuscators will skip when obfuscating. Defaults to 0.
   */
  keepAtEnd?: number;
  /**
   * The minimum number of characters from the start that need to be obfuscated.
   * This will overrule any explicit value for {@link #keepAtStart} or {@link #keepAtEnd}.
   * Defaults to 0.
   */
  atLeastFromStart?: number;
  /**
   * The minimum number of characters from the end that need to be obfuscated.
   * This will overrule any explicit value for {@link #keepAtStart} or {@link #keepAtEnd}.
   * Defaults to 0.
   */
  atLeastFromEnd?: number;
  /**
   * The fixed total length to use for obfuscated contents.
   * When obfuscating, the result will have {@link #maskChar} added until this total length has been reached.
   * <p>
   * Note: when used in combination with {@link #keepAtStart} and/or {@link #keepAtEnd}, this total length must be at least the sum of both other values.
   * When used in combination with both, parts of the input may be repeated in the obfuscated content if the input's length is less than the combined
   * number of characters to keep.
   */
  fixedTotalLength?: number;
  /**
   * The character to use for masking. Defaults to *.
   */
  maskChar?: string;
}

export function obfuscatePortion(options: ObfuscatePortionOptions): Obfuscator {
  function validateNonNegativeNumber(value: number | undefined, name: string): number {
    value = value || 0;
    if (value < 0) {
      throw new Error(`${name}: ${value} < 0`);
    }
    return value;
  }

  const keepAtStart = validateNonNegativeNumber(options.keepAtStart, "keepAtStart");
  const keepAtEnd = validateNonNegativeNumber(options.keepAtEnd, "keepAtEnd");
  const atLeastFromStart = validateNonNegativeNumber(options.atLeastFromStart, "atLeastFromStart");
  const atLeastFromEnd = validateNonNegativeNumber(options.atLeastFromEnd, "atLeastFromEnd");
  const fixedTotalLength = options.fixedTotalLength;
  const maskChar = options.maskChar || "*";

  if (fixedTotalLength !== undefined && fixedTotalLength < keepAtStart + keepAtEnd) {
    throw new Error(`fixedTotalLength (${fixedTotalLength}) < keepAtStart (${keepAtStart}) + keepAtEnd (${keepAtEnd})`);
  }

  function calculateFromStart(length: number) {
    if (atLeastFromStart > 0) {
      // The first characters need to be obfuscated so ignore keepAtStart
      return 0;
    }
    // 0 <= keepAtMost <= length, the maximum number of characters to not obfuscate taking into account atLeastFromEnd
    // 0 <= result <= length, the minimum of what we want to obfuscate and what we can obfuscate
    const keepAtMost = Math.max(0, length - atLeastFromEnd);
    return Math.min(keepAtStart, keepAtMost);
  }

  function calculateFromEnd(length: number, keepFromStart: number, allowDuplicates: boolean) {
    if (atLeastFromEnd > 0) {
      // The last characters need to be obfuscated so ignore keepAtEnd
      return 0;
    }
    // 0 <= available <= length, the number of characters not already handled by fromStart (to prevent characters being appended twice)
    //                           if allowDuplicates then available == length
    // 0 <= keepAtMost <= length, the maximum number of characters to not obfuscate taking into account atLeastFromStart
    // 0 <= result <= length, the minimum of what we want to obfuscate and what we can obfuscate
    const available = allowDuplicates ? length : length - keepFromStart;
    const keepAtMost = Math.max(0, length - atLeastFromStart);
    return Math.min(keepAtEnd, Math.min(available, keepAtMost));
  }

  return obfuscateCustom((text) => {
    const allowDuplicates = fixedTotalLength !== undefined;
    let length = text.length;
    const fromStart = calculateFromStart(length);
    const fromEnd = calculateFromEnd(length, fromStart, allowDuplicates);
    // 0 <= fromStart <= length == end - start, so start <= start + fromStart <= end
    // 0 <= fromEnd <= length == end - start, so 0 <= length - fromEnd and start <= end - fromEnd

    if (fixedTotalLength !== undefined) {
      length = fixedTotalLength;
    }
    const obfuscatedLength = length - fromEnd - fromStart;

    // Result: 0 to fromStart non-obfuscated, then obfuscated, then from end - fromEnd non-obfuscated
    return text.substring(0, fromStart) + maskChar.repeat(obfuscatedLength) + text.substring(text.length - fromEnd);
  });
}

/**
 * @returns an obfuscator that uses the given function to obfuscate text.
 */
export function obfuscateCustom(obfuscate: (text: string) => string): Obfuscator {
  const obfuscator = {
    obfuscateText: obfuscate,
    untilLength: (prefixLength: number) => {
      if (prefixLength <= 0) {
        throw new Error(prefixLength + " <= 0");
      }
      return {
        then: (other: Obfuscator) => new CombinedObfuscator(obfuscator, prefixLength, other),
      };
    },
  };
  return obfuscator;
}

class CombinedObfuscator implements Obfuscator {
  constructor(private first: Obfuscator, private lengthForFirst: number, private second: Obfuscator) {}

  obfuscateText(text: string): string {
    if (text.length <= this.lengthForFirst) {
      return this.first.obfuscateText(text);
    }
    return this.first.obfuscateText(text.substring(0, this.lengthForFirst)) + this.second.obfuscateText(text.substring(this.lengthForFirst));
  }

  untilLength(prefixLength: number): ObfuscatorPrefix {
    if (prefixLength <= this.lengthForFirst) {
      throw new Error(prefixLength + " <= " + this.lengthForFirst);
    }
    return {
      then: (other) => new CombinedObfuscator(this, prefixLength, other),
    };
  }
}
