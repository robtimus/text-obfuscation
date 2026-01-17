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
   * An optional function that determines whether or not objects should be treated as scalar instead.
   * It takes two parameters: the object to check, and the key for the object in the containing object. For array elements the key is the key for the enclosing array.
   * The object in which the object was found is provided as the function's `this` context.
   *
   * Unlike objects, properties of scalar values are not inspected, nor is their JSON representation used to obfuscate.
   * Instead, if they are not obfuscated they are left as-is, and if they are obfuscated their string representation is used.
   * This can prevent empty objects (`{}`) in obfuscated results, or empty objects being obfuscated.
   */
  treatAsScalar?: (this: object, o: object, key: string) => boolean;
  /**
   * An optional function that replaces property values before obfuscating them or iterating over them.
   * It takes two parameters: the value to potentially replace, and they for the value in the containing object. For array elements the key is the key for the enclosing array.
   * The object in which the value was found is provided as the function's `this` context.
   *
   * The return value is obfuscated instead of the original value. This can be used to replace iterable types like `Set` and `Map`,
   * which otherwise result in empty objects (`{}`). If the return value is `undefined` the property will be omitted instead.
   */
  replacer?: (this: object, value: unknown, key: string) => unknown;
}

interface PropertyConfig {
  obfuscate: ((text: string) => string) | "ignore";
  forObjects: ObfuscationMode;
  forArrays: ObfuscationMode;
}

interface ObfuscatorContext {
  caseSensitiveProperties: { [name: string]: PropertyConfig | undefined };
  caseInsensitiveProperties: { [name: string]: PropertyConfig | undefined };
  treatAsScalar?: (this: object, o: object, key: string) => boolean;
  replacer?: (this: object, value: unknown, key: string) => unknown;
}

function obfuscationMode(value?: ObfuscationMode, fallbackValue?: ObfuscationMode): ObfuscationMode {
  if (value) {
    return value;
  }
  return obfuscationMode(fallbackValue, "obfuscate");
}

function isScalar(value: unknown, key: string, o: object, context: ObfuscatorContext): boolean {
  return (
    value === undefined || value === null || value instanceof Date || value instanceof RegExp || typeof value !== "object" || (context.treatAsScalar?.bind(o)(value, key) ?? false)
  );
}

function obfuscateScalar(value: unknown, obfuscate?: ((text: string) => string) | "ignore"): unknown {
  return obfuscate && obfuscate !== "ignore" ? obfuscate("" + value) : value;
}

function obfuscateScalars(o: object, objectKey: string, obfuscate: ((text: string) => string) | "ignore", context: ObfuscatorContext): object {
  if (obfuscate === "ignore") {
    return o;
  }
  if (Array.isArray(o)) {
    return o.map((value) => (isScalar(value, objectKey, o, context) ? obfuscate("" + value) : obfuscateScalars(value, objectKey, obfuscate, context)));
  }
  const result = {};
  for (const [key, value] of Object.entries(o)) {
    const obfuscatableValue = value === undefined || !context.replacer ? value : context.replacer.bind(o)(value, key);
    if (value !== undefined && obfuscatableValue === undefined) {
      continue;
    }
    result[key] = isScalar(obfuscatableValue, key, o, context) ? obfuscate("" + obfuscatableValue) : obfuscateScalars(obfuscatableValue as object, key, obfuscate, context);
  }
  return result;
}

function obfuscateProperty(propertyName: string, value: string, context: ObfuscatorContext): string {
  const config = context.caseSensitiveProperties[propertyName] ?? context.caseInsensitiveProperties[propertyName.toLowerCase()];
  const obfuscator = config && config.obfuscate !== "ignore" ? config.obfuscate : obfuscateNone;
  return obfuscator(value);
}

function obfuscateWithDefault(o: object, objectKey: string, obfuscateDefault: ((text: string) => string) | "ignore" | undefined, context: ObfuscatorContext): object {
  if (Array.isArray(o)) {
    return o.map((value) =>
      isScalar(value, objectKey, o, context) ? obfuscateScalar(value, obfuscateDefault) : obfuscateWithDefault(value, objectKey, obfuscateDefault, context)
    );
  }
  const result = {};
  for (const [key, value] of Object.entries(o)) {
    const config = context.caseSensitiveProperties[key] ?? context.caseInsensitiveProperties[key.toLowerCase()];
    const obfuscate = config?.obfuscate ?? obfuscateDefault;
    const obfuscatableValue = value === undefined || !context.replacer ? value : context.replacer.bind(o)(value, key);
    if (value !== undefined && obfuscatableValue === undefined) {
      continue;
    }
    // When obfuscatableValue is not scalar, it's an object
    if (isScalar(obfuscatableValue, key, o, context)) {
      result[key] = obfuscateScalar(obfuscatableValue, obfuscate);
    } else if (obfuscate) {
      const obfuscationMode = Array.isArray(obfuscatableValue) ? config?.forArrays : config?.forObjects;
      switch (obfuscationMode) {
        case "exclude":
          result[key] = obfuscateWithDefault(obfuscatableValue as object, key, obfuscateDefault, context);
          break;
        case "inherit":
          result[key] = obfuscateScalars(obfuscatableValue as object, key, obfuscate, context);
          break;
        case "inherit-overridable":
        case undefined: // config is undefined, which means obfuscateDefault is used, which means this path got triggered from another inherit-overridable config
          result[key] = obfuscateWithDefault(obfuscatableValue as object, key, obfuscate, context);
          break;
        case "obfuscate":
          result[key] = obfuscate === "ignore" ? value : obfuscate(JSON.stringify(value));
          break;
      }
    } else {
      result[key] = obfuscateWithDefault(obfuscatableValue as object, key, obfuscateDefault, context);
    }
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
        forObjects: obfuscationMode(globalProperties.forObjects),
        forArrays: obfuscationMode(globalProperties.forArrays),
      };
    } else {
      caseSensitive = property.caseSensitive ?? globalProperties.caseSensitive !== false;
      propertyConfig = {
        obfuscate: property.obfuscate,
        forObjects: obfuscationMode(property.forObjects, globalProperties.forObjects),
        forArrays: obfuscationMode(property.forArrays, globalProperties.forArrays),
      };
    }
    if (caseSensitive) {
      caseSensitiveProperties[propertyName] = propertyConfig;
    } else {
      caseInsensitiveProperties[propertyName.toLowerCase()] = propertyConfig;
    }
  }

  const context: ObfuscatorContext = {
    caseSensitiveProperties,
    caseInsensitiveProperties,
    treatAsScalar: globalProperties.treatAsScalar,
    replacer: globalProperties.replacer,
  };

  function obfuscate(propertyName: string, value: string): string;
  function obfuscate(o: object): object;
  function obfuscate(propertyNameOrObject: object | string, value?: string): object | string {
    if (typeof propertyNameOrObject === "string") {
      // obfuscate(propertyName, value), value is a string
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return obfuscateProperty(propertyNameOrObject, value!, context);
    }
    return obfuscateWithDefault(propertyNameOrObject, "", undefined, context);
  }
  return obfuscate;
}
