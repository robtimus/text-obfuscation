import { obfuscateNone } from "./obfuscators";

/**
 * A function that will obfuscate headers.
 */
export interface HeaderObfuscator {
  /**
   * Obfuscates the value for a single header.
   */
  (headerName: string, headerValue: string): string;
  /**
   * Obfuscates multiple values for a single header.
   */
  (headerName: string, headerValues: string[]): string[];
  /**
   * Obfuscates all headers in the given headers object.
   * @return a copy of the given headers object with headers obfuscated as necesary.
   */
  (headers: { [name: string]: string | string[] | undefined }): { [name: string]: string | string[] | undefined };
  /**
   * Obfuscates all headers in the given headers object.
   * @return a copy of the given headers object with headers obfuscated as necesary.
   */
  (headers: { [name: string]: number | string | string[] | undefined }): { [name: string]: number | string | string[] | undefined };
}

type HeaderObject = { [name: string]: string | string[] | undefined };
type HeaderObjectWithNumber = { [name: string]: number | string | string[] | undefined };

/**
 * @param headers the headers to obfuscate.
 * @returns an immutable obfuscator that obfuscates headers according to the given rules.
 */
export function newHeaderObfuscator(headers: { [name: string]: (text: string) => string }): HeaderObfuscator {
  // Store a copy with lowercased header names
  const caseInsensitiveHeaders: { [name: string]: (text: string) => string } = {};
  for (const headerName in headers) {
    caseInsensitiveHeaders[headerName.toLowerCase()] = headers[headerName];
  }

  function obfuscateHeader(headerName: string, headerValue: string): string {
    const obfuscator = caseInsensitiveHeaders[headerName.toLowerCase()] || obfuscateNone;
    return obfuscator(headerValue);
  }
  function obfuscateHeaders(headerName: string, headerValues: string[]): string[] {
    const obfuscator = caseInsensitiveHeaders[headerName.toLowerCase()] || obfuscateNone;
    return headerValues.map((v) => obfuscator(v));
  }
  function obfuscateObject(headerObject: HeaderObject | HeaderObjectWithNumber): HeaderObject | HeaderObjectWithNumber {
    // If headerObject is a HeaderObject, it will not contain any number values and therefore neither will the result
    const result: HeaderObjectWithNumber = {};
    for (const headerName in headerObject) {
      const headerValue = headerObject[headerName];
      if (headerValue === undefined) {
        result[headerName] = undefined;
      } else if (typeof headerValue === "number") {
        const obfuscator = caseInsensitiveHeaders[headerName.toLowerCase()];
        result[headerName] = obfuscator ? obfuscator(headerValue.toString()) : headerValue;
      } else if (typeof headerValue === "string") {
        const obfuscator = caseInsensitiveHeaders[headerName.toLowerCase()];
        result[headerName] = obfuscator ? obfuscator(headerValue) : headerValue;
      } else {
        const obfuscator = caseInsensitiveHeaders[headerName.toLowerCase()];
        result[headerName] = obfuscator ? headerValue.map((v) => obfuscator(v)) : headerValue;
      }
    }
    return result;
  }

  function obfuscate(headerName: string, headerValue: string): string;
  function obfuscate(headerName: string, headerValues: string[]): string[];
  function obfuscate(headers: HeaderObject): HeaderObject;
  function obfuscate(headers: HeaderObjectWithNumber): HeaderObjectWithNumber;
  function obfuscate(
    headerNameOrObject: string | HeaderObject | HeaderObjectWithNumber,
    headerValue?: string | string[]
  ): string | string[] | HeaderObject | HeaderObjectWithNumber {
    if (typeof headerNameOrObject === "string") {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return typeof headerValue === "string" ? obfuscateHeader(headerNameOrObject, headerValue) : obfuscateHeaders(headerNameOrObject, headerValue!);
    }
    return obfuscateObject(headerNameOrObject);
  }
  return obfuscate;
}
