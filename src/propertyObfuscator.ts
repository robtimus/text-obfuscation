import traverse = require("traverse");
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
   * whether or not to match object properties. Overrides any globally set value.
   */
  matchObjects?: boolean;
  /**
   * whether or not to match array properties. Overrides any globally set value.
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
   * whether or not to match object properties. Defaults to true.
   */
  matchObjects?: boolean;
  /**
   * whether or not to match array properties. Defaults to true.
   */
  matchArrays?: boolean;
}

interface PropertyConfig {
  obfuscate: ((text: string) => string) | "ignore";
  matchObjects: boolean;
  matchArrays: boolean;
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
  const caseSensitiveProperties: { [name: string]: PropertyConfig } = {};
  const caseInsensitiveProperties: { [name: string]: PropertyConfig } = {};
  for (const propertyName in properties) {
    const property = properties[propertyName];
    let caseSensitive: boolean;
    let propertyConfig: PropertyConfig;
    if (typeof property === "function" || property === "ignore") {
      caseSensitive = globalProperties.caseSensitive !== false;
      propertyConfig = {
        obfuscate: property,
        matchObjects: globalProperties.matchObjects !== false,
        matchArrays: globalProperties.matchArrays !== false,
      };
    } else {
      caseSensitive = property.caseSensitive !== undefined ? property.caseSensitive : globalProperties.caseSensitive !== false;
      propertyConfig = {
        obfuscate: property.obfuscate,
        matchObjects: property.matchObjects !== undefined ? property.matchObjects : globalProperties.matchObjects !== false,
        matchArrays: property.matchArrays !== undefined ? property.matchArrays : globalProperties.matchArrays !== false,
      };
    }
    if (caseSensitive) {
      caseSensitiveProperties[propertyName] = propertyConfig;
    } else {
      caseInsensitiveProperties[propertyName.toLowerCase()] = propertyConfig;
    }
  }

  function obfuscateProperty(propertyName: string, value: string): string {
    const config = caseSensitiveProperties[propertyName] || caseInsensitiveProperties[propertyName.toLowerCase()];
    const obfuscator = config && config.obfuscate !== "ignore" ? config.obfuscate : obfuscateNone;
    return obfuscator(value);
  }
  function obfuscateObject(o: object): object {
    o = JSON.parse(JSON.stringify(o));
    traverse(o).forEach(function (v) {
      if (this.key) {
        const config = caseSensitiveProperties[this.key] || caseInsensitiveProperties[this.key.toLowerCase()];
        if (config) {
          if (this.isLeaf) {
            if (config.obfuscate !== "ignore") {
              this.update(config.obfuscate("" + v));
            }
          } else {
            const match = Array.isArray(v) ? config.matchArrays : config.matchObjects;
            if (match) {
              if (config.obfuscate === "ignore") {
                this.block();
              } else {
                this.update(config.obfuscate(JSON.stringify(v)));
              }
            }
          }
        }
      }
    });
    return o;
  }

  function obfuscate(propertyName: string, value: string): string;
  function obfuscate(o: object): object;
  function obfuscate(propertyNameOrObject: object | string, value?: string): object | string {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return typeof propertyNameOrObject === "string" ? obfuscateProperty(propertyNameOrObject, value!) : obfuscateObject(propertyNameOrObject);
  }
  return obfuscate;
}
