import { obfuscateNone } from "./obfuscators";

/**
 * A function that will obfuscate object properties.
 */
export interface PropertyObfuscator {
  /**
   * Obfuscates the value for a single property.
   */
  (propertyName: string, value: string): string;
  /**
   * Obfuscates all properties in the given object recursively. This may change some non-string properties into strings.
   * @returns a copy of the given object with properties obfuscated as necessary.
   */
  (o: object): object;
}

/**
 * The possible ways to deal with nested objects and arrays:
 * - `exclude` will not obfuscate nested objects or arrays, but instead will traverse into them.
 * - `obfuscate` will obfuscate nested objects and arrays using their JSON string representations.
 * - `inherit` will not obfuscate nested objects or arrays, but will use the obfuscator for all nested scalar properties.
 * - `inherit-overridable` will not obfuscate nested objects or arrays, but will use the obfuscator for all nested scalar properties.
 *   If a nested property has its own obfuscator defined this will be used instead.
 */
export type ObfuscationMode = "exclude" | "obfuscate" | "inherit" | "inherit-overridable";

/**
 * Per-property options.
 */
export interface PropertyOptions {
  /**
   * A function that will obfuscate the property's value, or "ignore" to not obfuscate the property.
   * The latter is mostly useful to skip obfuscation for entire object trees.
   */
  obfuscate: ((text: string) => string) | "ignore";
  /**
   * Whether or not to use a case sensitive match on property name. Overrides any globally set value.
   */
  caseSensitive?: boolean;
  /**
   * How to handle matched object properties. Overrides any globally set value.
   */
  forObjects?: ObfuscationMode;
  /**
   * How to handle matched array properties. Overrides any globally set value.
   */
  forArrays?: ObfuscationMode;
  /**
   * whether or not to match object properties. Overrides any globally set value.
   * @deprecated Use `forObjects` instead.
   */
  matchObjects?: boolean;
  /**
   * whether or not to match array properties. Overrides any globally set value.
   * @deprecated Use `forArrays` instead.
   */
  matchArrays?: boolean;
}

/**
 * Global options that serve as defaults.
 */
export interface GlobalPropertyObfuscatorOptions {
  /**
   * Whether or not to use a case sensitive match on property name. Defaults to true.
   */
  caseSensitive?: boolean;
  /**
   * How to handle matched object properties. Defaults to `obfuscate`.
   */
  forObjects?: ObfuscationMode;
  /**
   * How to handle matched array properties. Defaults to `obfuscate`.
   */
  forArrays?: ObfuscationMode;
  /**
   * whether or not to match object properties.
   * @deprecated Use `forObjects` instead.
   */
  matchObjects?: boolean;
  /**
   * whether or not to match array properties.
   * @deprecated Use `forArrays` instead.
   */
  matchArrays?: boolean;
}

interface PropertyConfig {
  obfuscate: ((text: string) => string) | "ignore";
  forObjects: ObfuscationMode;
  forArrays: ObfuscationMode;
}

function forObjects(options: PropertyOptions | GlobalPropertyObfuscatorOptions): ObfuscationMode | undefined {
  return toObfuscationMode(options.forObjects, options.matchObjects, "Cannot use both forObjects and matchObjects");
}

function forArrays(options: PropertyOptions | GlobalPropertyObfuscatorOptions): ObfuscationMode | undefined {
  return toObfuscationMode(options.forArrays, options.matchArrays, "Cannot use both forArrays and matchArrays");
}

function toObfuscationMode(obfuscationMode: ObfuscationMode | undefined, match: boolean | undefined, errorMessage: string): ObfuscationMode | undefined {
  if (obfuscationMode && match !== undefined) {
    throw new Error(errorMessage);
  }
  if (match === true) {
    return "obfuscate";
  }
  if (match === false) {
    return "exclude";
  }
  return obfuscationMode;
}

function obfuscationMode(value?: ObfuscationMode, fallbackValue?: ObfuscationMode): ObfuscationMode {
  if (value) {
    return value;
  }
  return obfuscationMode(fallbackValue, "obfuscate");
}

function isScalar(v: unknown): boolean {
  return v === undefined || v === null || typeof v !== "object";
}

function obfuscateScalar(value: unknown, obfuscate?: ((text: string) => string) | "ignore"): unknown {
  return obfuscate && obfuscate !== "ignore" ? obfuscate("" + value) : value;
}

function obfuscateScalars(o: object, obfuscate: ((text: string) => string) | "ignore"): object {
  if (obfuscate === "ignore") {
    return o;
  }
  if (Array.isArray(o)) {
    return o.map((value) => (isScalar(value) ? obfuscate("" + value) : obfuscateScalars(value, obfuscate)));
  }
  const result = {};
  for (const [key, value] of Object.entries(o)) {
    result[key] = isScalar(value) ? obfuscate("" + value) : obfuscateScalars(value, obfuscate);
  }
  return result;
}

/**
 * @param properties the properties to obfuscate.
 *                   Passing a function or "ignore" is shorthand for passing {@link PropertyOptions} with only the obfuscate property set.
 * @returns an immutable obfuscator that obfuscates properties according to the given rules.
 */
export function newPropertyObfuscator(
  properties: { [name: string]: PropertyOptions | ((text: string) => string) | "ignore" },
  globalProperties: GlobalPropertyObfuscatorOptions = {}
): PropertyObfuscator {
  // First normalize the input properties, this also allows easier case sensitive/insensitive lookups
  const caseSensitiveProperties: { [name: string]: PropertyConfig | undefined } = {};
  const caseInsensitiveProperties: { [name: string]: PropertyConfig | undefined } = {};
  for (const propertyName in properties) {
    const property = properties[propertyName];
    let caseSensitive: boolean;
    let propertyConfig: PropertyConfig;
    if (typeof property === "function" || property === "ignore") {
      caseSensitive = globalProperties.caseSensitive !== false;
      propertyConfig = {
        obfuscate: property,
        forObjects: obfuscationMode(forObjects(globalProperties)),
        forArrays: obfuscationMode(forArrays(globalProperties)),
      };
    } else {
      caseSensitive = property.caseSensitive ?? globalProperties.caseSensitive !== false;
      propertyConfig = {
        obfuscate: property.obfuscate,
        forObjects: obfuscationMode(forObjects(property), forObjects(globalProperties)),
        forArrays: obfuscationMode(forArrays(property), forArrays(globalProperties)),
      };
    }
    if (caseSensitive) {
      caseSensitiveProperties[propertyName] = propertyConfig;
    } else {
      caseInsensitiveProperties[propertyName.toLowerCase()] = propertyConfig;
    }
  }

  function obfuscateProperty(propertyName: string, value: string): string {
    const config = caseSensitiveProperties[propertyName] ?? caseInsensitiveProperties[propertyName.toLowerCase()];
    const obfuscator = config && config.obfuscate !== "ignore" ? config.obfuscate : obfuscateNone;
    return obfuscator(value);
  }
  function obfuscateWithDefault(o: object, obfuscateDefault?: ((text: string) => string) | "ignore"): object {
    if (Array.isArray(o)) {
      return o.map((value) => (isScalar(value) ? obfuscateScalar(value, obfuscateDefault) : obfuscateWithDefault(value, obfuscateDefault)));
    }
    const result = {};
    for (const [key, value] of Object.entries(o)) {
      const config = caseSensitiveProperties[key] ?? caseInsensitiveProperties[key.toLowerCase()];
      const obfuscate = config?.obfuscate ?? obfuscateDefault;
      if (isScalar(value)) {
        result[key] = obfuscateScalar(value, obfuscate);
      } else if (obfuscate) {
        const obfuscationMode = Array.isArray(value) ? config?.forArrays : config?.forObjects;
        switch (obfuscationMode) {
          case "exclude":
            result[key] = obfuscateWithDefault(value, obfuscateDefault);
            break;
          case "inherit":
            result[key] = obfuscateScalars(value, obfuscate);
            break;
          case "inherit-overridable":
          case undefined: // config is undefined, which means obfuscateDefault is used, which means this path got triggered from another inherit-overridable config
            result[key] = obfuscateWithDefault(value, obfuscate);
            break;
          case "obfuscate":
            result[key] = obfuscate === "ignore" ? value : obfuscate(JSON.stringify(value));
            break;
        }
      } else {
        result[key] = obfuscateWithDefault(value, obfuscateDefault);
      }
    }
    return result;
  }

  function obfuscate(propertyName: string, value: string): string;
  function obfuscate(o: object): object;
  function obfuscate(propertyNameOrObject: object | string, value?: string): object | string {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return typeof propertyNameOrObject === "string" ? obfuscateProperty(propertyNameOrObject, value!) : obfuscateWithDefault(propertyNameOrObject);
  }
  return obfuscate;
}
