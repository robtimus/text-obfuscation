import { IncomingHttpHeaders, OutgoingHttpHeaders } from "http";
import { obfuscateWithFixedLength, newHeaderObfuscator } from "../src";

describe("newHeaderObfuscator", () => {
  const obfuscator = obfuscateWithFixedLength(3);
  const headerObfuscator = newHeaderObfuscator({
    authorization: obfuscator,
  });

  describe("for http.OutgoingHttpHeaders", () => {
    it("without number obfuscation", () => {
      const input: OutgoingHttpHeaders = {
        "Content-Type": "application/json",
        "Content-Length": 13,
        Authorization: "Bearer someToken",
        "not-set": undefined,
      };

      const expected = {
        "Content-Type": "application/json",
        "Content-Length": 13,
        Authorization: "***",
      };

      const obfuscated = headerObfuscator(input);
      expect(obfuscated).toEqual(expected);
    });
    it("with number obfuscation", () => {
      const input: OutgoingHttpHeaders = {
        "Content-Type": "application/json",
        "Content-Length": 13,
        Authorization: "Bearer someToken",
        "not-set": undefined,
      };

      const expected = {
        "Content-Type": "application/json",
        "Content-Length": "***",
        Authorization: "***",
      };

      const obfuscated = newHeaderObfuscator({
        "content-length": obfuscator,
        authorization: obfuscator,
      })(input);
      expect(obfuscated).toEqual(expected);
    });
  });

  it("for http.IncomingHttpHeaders", () => {
    const input: IncomingHttpHeaders = {
      "Content-Type": "application/json",
      "Content-Length": "13",
      Authorization: "Bearer someToken",
      "not-set": undefined,
    };

    const expected = {
      "Content-Type": "application/json",
      "Content-Length": "13",
      Authorization: "***",
    };

    const obfuscated = headerObfuscator(input);
    expect(obfuscated).toEqual(expected);
  });

  describe("for single header", () => {
    const singleValueCases = [
      ["Content-Type", "application/json", "application/json"],
      ["Authorization", "Bearer someToken", "***"],
    ];
    it.each(singleValueCases)("for headerName '%s' should obfuscate '%s' to '%s'", (headerName, headerValue, expected) => {
      const obfuscated = headerObfuscator(headerName, headerValue);
      expect(obfuscated).toEqual(expected);
    });

    const multiValueCases = [
      ["Content-Type", ["application/json", "text/plain"], ["application/json", "text/plain"]],
      ["Authorization", ["Bearer someToken", "basic user:pass"], ["***", "***"]],
    ];
    it.each(multiValueCases)("for headerName '%s' should obfuscate %s to %s", (headerName, headerValues, expected) => {
      const obfuscated = headerObfuscator(headerName as string, headerValues as string[]);
      expect(obfuscated).toEqual(expected);
    });
  });
});
