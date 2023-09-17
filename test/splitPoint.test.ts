import { atFirst, atLast, atNth, obfuscateAll, obfuscateWithFixedLength, obfuscateWithFixedValue } from "../src";

describe("atFirst('@')", () => {
  describe("splitTo(obfuscateAll(), obfuscateWithFixedLength(5))", () => {
    const obfuscator = atFirst("@").splitTo(obfuscateAll(), obfuscateWithFixedLength(5));
    const cases = [
      ["test", "****"],
      ["test@", "****@*****"],
      ["test@example.org", "****@*****"],
      ["test@example.org@", "****@*****"],
      ["test@example.org@localhost", "****@*****"],
      ["", ""],
    ];
    it.each(cases)("applied to '%s' should be '%s'", (text, expected) => {
      const obfuscated = obfuscator(text);
      expect(obfuscated).toBe(expected);
    });
  });
});

describe("atLast('@')", () => {
  describe("splitTo(obfuscateAll(), obfuscateWithFixedLength(5))", () => {
    const obfuscator = atLast("@").splitTo(obfuscateAll(), obfuscateWithFixedLength(5));
    const cases = [
      ["test", "****"],
      ["test@", "****@*****"],
      ["test@example.org", "****@*****"],
      ["test@example.org@", "****************@*****"],
      ["test@example.org@localhost", "****************@*****"],
      ["", ""],
    ];
    it.each(cases)("applied to '%s' should be '%s'", (text, expected) => {
      const obfuscated = obfuscator(text);
      expect(obfuscated).toBe(expected);
    });
  });
});

it("atNth('.', -1)", () => {
  expect(() => atNth(".", -1)).toThrowError("-1 < 0");
});

describe("atNth('.', 0)", () => {
  describe("splitTo(obfuscateWithFixedValue('xxx'), obfuscateWithFixedLength(5))", () => {
    const obfuscator = atNth(".", 0).splitTo(obfuscateWithFixedValue("xxx"), obfuscateWithFixedLength(5));
    const cases = [
      ["alpha", "xxx"],
      ["alpha.", "xxx.*****"],
      ["alpha.bravo", "xxx.*****"],
      ["alpha.bravo.charlie", "xxx.*****"],
      ["alpha.bravo.charlie.", "xxx.*****"],
      ["alpha.bravo.charlie.delta", "xxx.*****"],
      ["alpha.bravo.charlie.delta.echo", "xxx.*****"],
      ["........", "xxx.*****"],
    ];
    it.each(cases)("applied to '%s' should be '%s'", (text, expected) => {
      const obfuscated = obfuscator(text);
      expect(obfuscated).toBe(expected);
    });
  });
});

describe("atNth('.', 1)", () => {
  describe("splitTo(obfuscateWithFixedValue('xxx'), obfuscateWithFixedLength(5))", () => {
    const obfuscator = atNth(".", 1).splitTo(obfuscateWithFixedValue("xxx"), obfuscateWithFixedLength(5));
    const cases = [
      ["alpha", "xxx"],
      ["alpha.bravo", "xxx"],
      ["alpha.bravo.", "xxx.*****"],
      ["alpha.bravo.charlie", "xxx.*****"],
      ["alpha.bravo.charlie.", "xxx.*****"],
      ["alpha.bravo.charlie.delta", "xxx.*****"],
      ["alpha.bravo.charlie.delta.echo", "xxx.*****"],
      ["........", "xxx.*****"],
    ];
    it.each(cases)("applied to '%s' should be '%s'", (text, expected) => {
      const obfuscated = obfuscator(text);
      expect(obfuscated).toBe(expected);
    });
  });
});

describe("atNth('.', 2)", () => {
  describe("splitTo(obfuscateWithFixedValue('xxx'), obfuscateWithFixedLength(5))", () => {
    const obfuscator = atNth(".", 2).splitTo(obfuscateWithFixedValue("xxx"), obfuscateWithFixedLength(5));
    const cases = [
      ["alpha", "xxx"],
      ["alpha.bravo", "xxx"],
      ["alpha.bravo.charlie", "xxx"],
      ["alpha.bravo.charlie.", "xxx.*****"],
      ["alpha.bravo.charlie.delta", "xxx.*****"],
      ["alpha.bravo.charlie.delta.echo", "xxx.*****"],
      ["........", "xxx.*****"],
    ];
    it.each(cases)("applied to '%s' should be '%s'", (text, expected) => {
      const obfuscated = obfuscator(text);
      expect(obfuscated).toBe(expected);
    });
  });
});
