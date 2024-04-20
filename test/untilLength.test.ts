import { obfuscateAll, obfuscateWithFixedLength, obfuscateWithFixedValue, obfuscateNone } from "../src";

describe("obfuscateNone.untilLength(4)", () => {
  describe("then(obfuscateAll()).untilLength(12).then(obfuscateNone)", () => {
    const obfuscator = obfuscateNone.untilLength(4).then(obfuscateAll()).untilLength(12).then(obfuscateNone);
    const cases = [
      ["0", "0"],
      ["01", "01"],
      ["012", "012"],
      ["0123", "0123"],
      ["01234", "0123*"],
      ["012345", "0123**"],
      ["0123456", "0123***"],
      ["01234567", "0123****"],
      ["012345678", "0123*****"],
      ["0123456789", "0123******"],
      ["0123456789A", "0123*******"],
      ["0123456789AB", "0123********"],
      ["0123456789ABC", "0123********C"],
      ["0123456789ABCD", "0123********CD"],
      ["0123456789ABCDE", "0123********CDE"],
      ["0123456789ABCDEF", "0123********CDEF"],
    ];
    it.each(cases)("applied to '%s' should be '%s'", (text, expected) => {
      const obfuscated = obfuscator(text);
      expect(obfuscated).toBe(expected);
    });
  });

  describe("then(obfuscateWithFixedLength(3))", () => {
    const obfuscator = obfuscateNone.untilLength(4).then(obfuscateWithFixedLength(3));
    const cases = [
      ["0", "0"],
      ["01", "01"],
      ["012", "012"],
      ["0123", "0123"],
      ["01234", "0123***"],
      ["012345", "0123***"],
      ["0123456", "0123***"],
      ["01234567", "0123***"],
      ["012345678", "0123***"],
      ["0123456789", "0123***"],
      ["0123456789A", "0123***"],
      ["0123456789AB", "0123***"],
      ["0123456789ABC", "0123***"],
      ["0123456789ABCD", "0123***"],
      ["0123456789ABCDE", "0123***"],
      ["0123456789ABCDEF", "0123***"],
    ];
    it.each(cases)("applied to '%s' should be '%s'", (text, expected) => {
      const obfuscated = obfuscator(text);
      expect(obfuscated).toBe(expected);
    });
  });
});

describe("obfuscateWithFixedLength(3).untilLength(4)", () => {
  describe("then(obfuscateNone)", () => {
    const obfuscator = obfuscateWithFixedLength(3).untilLength(4).then(obfuscateNone);
    const cases = [
      ["0", "***"],
      ["01", "***"],
      ["012", "***"],
      ["0123", "***"],
      ["01234", "***4"],
      ["012345", "***45"],
      ["0123456", "***456"],
      ["01234567", "***4567"],
      ["012345678", "***45678"],
      ["0123456789", "***456789"],
      ["0123456789A", "***456789A"],
      ["0123456789AB", "***456789AB"],
      ["0123456789ABC", "***456789ABC"],
      ["0123456789ABCD", "***456789ABCD"],
      ["0123456789ABCDE", "***456789ABCDE"],
      ["0123456789ABCDEF", "***456789ABCDEF"],
    ];
    it.each(cases)("applied to '%s' should be '%s'", (text, expected) => {
      const obfuscated = obfuscator(text);
      expect(obfuscated).toBe(expected);
    });
  });

  describe("then(obfuscateWithFixedValue('xxx'))", () => {
    const obfuscator = obfuscateWithFixedLength(3).untilLength(4).then(obfuscateWithFixedValue("xxx"));
    const cases = [
      ["0", "***"],
      ["01", "***"],
      ["012", "***"],
      ["0123", "***"],
      ["01234", "***xxx"],
      ["012345", "***xxx"],
      ["0123456", "***xxx"],
      ["01234567", "***xxx"],
      ["012345678", "***xxx"],
      ["0123456789", "***xxx"],
      ["0123456789A", "***xxx"],
      ["0123456789AB", "***xxx"],
      ["0123456789ABC", "***xxx"],
      ["0123456789ABCD", "***xxx"],
      ["0123456789ABCDE", "***xxx"],
      ["0123456789ABCDEF", "***xxx"],
    ];
    it.each(cases)("applied to '%s' should be '%s'", (text, expected) => {
      const obfuscated = obfuscator(text);
      expect(obfuscated).toBe(expected);
    });
  });
});

describe("invalid prefix lengths", () => {
  it("first", () => {
    const obfuscator = obfuscateNone;
    expect(() => obfuscator.untilLength(0)).toThrow("0 <= 0");
  });

  it("second", () => {
    const obfuscator = obfuscateNone.untilLength(1).then(obfuscateAll());
    expect(() => obfuscator.untilLength(1)).toThrow("1 <= 1");
  });

  it("third", () => {
    const obfuscator = obfuscateNone.untilLength(1).then(obfuscateAll()).untilLength(2).then(obfuscateNone);
    expect(() => obfuscator.untilLength(2)).toThrow("2 <= 2");
  });

  it("fourth", () => {
    const obfuscator = obfuscateNone.untilLength(1).then(obfuscateAll()).untilLength(2).then(obfuscateNone).untilLength(3).then(obfuscateAll());
    expect(() => obfuscator.untilLength(3)).toThrow("3 <= 3");
  });
});
