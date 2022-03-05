import { obfuscatePortion } from "../src";

describe("obfuscatePortion", () => {
  describe("keepAtStart 4", () => {
    const obfuscator = obfuscatePortion({
      keepAtStart: 4,
    });
    const cases = [
      ["foo", "foo"],
      ["foobar", "foob**"],
      ["hello", "hell*"],
      ["hello world", "hell*******"],
      ["", ""],
    ];
    it.each(cases)("obfuscateText('%s') === '%s'", (text, expected) => {
      const obfuscated = obfuscator.obfuscateText(text);
      expect(obfuscated).toBe(expected);
    });
  });

  describe("keepAtEnd 4", () => {
    const obfuscator = obfuscatePortion({
      keepAtEnd: 4,
    });
    const cases = [
      ["foo", "foo"],
      ["foobar", "**obar"],
      ["hello", "*ello"],
      ["hello world", "*******orld"],
      ["", ""],
    ];
    it.each(cases)("obfuscateText('%s') === '%s'", (text, expected) => {
      const obfuscated = obfuscator.obfuscateText(text);
      expect(obfuscated).toBe(expected);
    });
  });

  describe("keepAtStart 4, keepAtEnd 4", () => {
    const obfuscator = obfuscatePortion({
      keepAtStart: 4,
      keepAtEnd: 4,
    });
    const cases = [
      ["foo", "foo"],
      ["foobar", "foobar"],
      ["hello", "hello"],
      ["hello world", "hell***orld"],
      ["", ""],
    ];
    it.each(cases)("obfuscateText('%s') === '%s'", (text, expected) => {
      const obfuscated = obfuscator.obfuscateText(text);
      expect(obfuscated).toBe(expected);
    });
  });

  describe("keepAtStart 4, atLeastFromEnd 4", () => {
    const obfuscator = obfuscatePortion({
      keepAtStart: 4,
      atLeastFromEnd: 4,
    });
    const cases = [
      ["foo", "***"],
      ["foobar", "fo****"],
      ["hello", "h****"],
      ["hello world", "hell*******"],
      ["", ""],
    ];
    it.each(cases)("obfuscateText('%s') === '%s'", (text, expected) => {
      const obfuscated = obfuscator.obfuscateText(text);
      expect(obfuscated).toBe(expected);
    });
  });

  describe("keepAtEnd 4, atLeastFromStart 4", () => {
    const obfuscator = obfuscatePortion({
      keepAtEnd: 4,
      atLeastFromStart: 4,
    });
    const cases = [
      ["foo", "***"],
      ["foobar", "****ar"],
      ["hello", "****o"],
      ["hello world", "*******orld"],
      ["", ""],
    ];
    it.each(cases)("obfuscateText('%s') === '%s'", (text, expected) => {
      const obfuscated = obfuscator.obfuscateText(text);
      expect(obfuscated).toBe(expected);
    });
  });

  describe("keepAtStart 4, fixedTotalLength 9", () => {
    const obfuscator = obfuscatePortion({
      keepAtStart: 4,
      fixedTotalLength: 9,
    });
    const cases = [
      ["foo", "foo******"],
      ["foobar", "foob*****"],
      ["hello", "hell*****"],
      ["hello world", "hell*****"],
      ["", "*********"],
    ];
    it.each(cases)("obfuscateText('%s') === '%s'", (text, expected) => {
      const obfuscated = obfuscator.obfuscateText(text);
      expect(obfuscated).toBe(expected);
    });
  });

  describe("keepAtEnd 4, fixedTotalLength 9", () => {
    const obfuscator = obfuscatePortion({
      keepAtEnd: 4,
      fixedTotalLength: 9,
    });
    const cases = [
      ["foo", "******foo"],
      ["foobar", "*****obar"],
      ["hello", "*****ello"],
      ["hello world", "*****orld"],
      ["", "*********"],
    ];
    it.each(cases)("obfuscateText('%s') === '%s'", (text, expected) => {
      const obfuscated = obfuscator.obfuscateText(text);
      expect(obfuscated).toBe(expected);
    });
  });

  describe("keepAtStart 4, keepAtEnd 4, fixedTotalLength 9", () => {
    const obfuscator = obfuscatePortion({
      keepAtStart: 4,
      keepAtEnd: 4,
      fixedTotalLength: 9,
    });
    const cases = [
      ["foo", "foo***foo"],
      ["foobar", "foob*obar"],
      ["hello", "hell*ello"],
      ["hello world", "hell*orld"],
      ["", "*********"],
    ];
    it.each(cases)("obfuscateText('%s') === '%s'", (text, expected) => {
      const obfuscated = obfuscator.obfuscateText(text);
      expect(obfuscated).toBe(expected);
    });
  });

  describe("keepAtStart 4, atLeastFromEnd 4, fixedTotalLength 9", () => {
    const obfuscator = obfuscatePortion({
      keepAtStart: 4,
      atLeastFromEnd: 4,
      fixedTotalLength: 9,
    });
    const cases = [
      ["foo", "*********"],
      ["foobar", "fo*******"],
      ["hello", "h********"],
      ["hello world", "hell*****"],
      ["", "*********"],
    ];
    it.each(cases)("obfuscateText('%s') === '%s'", (text, expected) => {
      const obfuscated = obfuscator.obfuscateText(text);
      expect(obfuscated).toBe(expected);
    });
  });

  describe("keepAtEnd 4, atLeastFromStart 4, fixedTotalLength 9", () => {
    const obfuscator = obfuscatePortion({
      keepAtEnd: 4,
      atLeastFromStart: 4,
      fixedTotalLength: 9,
    });
    const cases = [
      ["foo", "*********"],
      ["foobar", "*******ar"],
      ["hello", "********o"],
      ["hello world", "*****orld"],
      ["", "*********"],
    ];
    it.each(cases)("obfuscateText('%s') === '%s'", (text, expected) => {
      const obfuscated = obfuscator.obfuscateText(text);
      expect(obfuscated).toBe(expected);
    });
  });

  describe("keepAtStart 4, fixedTotalLength 4", () => {
    const obfuscator = obfuscatePortion({
      keepAtStart: 4,
      fixedTotalLength: 4,
    });
    const cases = [
      ["foo", "foo*"],
      ["foobar", "foob"],
      ["hello", "hell"],
      ["hello world", "hell"],
      ["", "****"],
    ];
    it.each(cases)("obfuscateText('%s') === '%s'", (text, expected) => {
      const obfuscated = obfuscator.obfuscateText(text);
      expect(obfuscated).toBe(expected);
    });
  });

  describe("keepAtEnd 4, fixedTotalLength 4", () => {
    const obfuscator = obfuscatePortion({
      keepAtEnd: 4,
      fixedTotalLength: 4,
    });
    const cases = [
      ["foo", "*foo"],
      ["foobar", "obar"],
      ["hello", "ello"],
      ["hello world", "orld"],
      ["", "****"],
    ];
    it.each(cases)("obfuscateText('%s') === '%s'", (text, expected) => {
      const obfuscated = obfuscator.obfuscateText(text);
      expect(obfuscated).toBe(expected);
    });
  });

  describe("keepAtStart, keepAtEnd 4, fixedTotalLength 8", () => {
    const obfuscator = obfuscatePortion({
      keepAtStart: 4,
      keepAtEnd: 4,
      fixedTotalLength: 8,
    });
    const cases = [
      ["foo", "foo**foo"],
      ["foobar", "foobobar"],
      ["hello", "hellello"],
      ["hello world", "hellorld"],
      ["", "********"],
    ];
    it.each(cases)("obfuscateText('%s') === '%s'", (text, expected) => {
      const obfuscated = obfuscator.obfuscateText(text);
      expect(obfuscated).toBe(expected);
    });
  });

  describe("keepAtStart, atLeastFromEnd 4, fixedTotalLength 4", () => {
    const obfuscator = obfuscatePortion({
      keepAtStart: 4,
      atLeastFromEnd: 4,
      fixedTotalLength: 4,
    });
    const cases = [
      ["foo", "****"],
      ["foobar", "fo**"],
      ["hello", "h***"],
      ["hello world", "hell"],
      ["", "****"],
    ];
    it.each(cases)("obfuscateText('%s') === '%s'", (text, expected) => {
      const obfuscated = obfuscator.obfuscateText(text);
      expect(obfuscated).toBe(expected);
    });
  });

  describe("keepAtEnd, atLeastFromStart 4, fixedTotalLength 4", () => {
    const obfuscator = obfuscatePortion({
      keepAtEnd: 4,
      atLeastFromStart: 4,
      fixedTotalLength: 4,
    });
    const cases = [
      ["foo", "****"],
      ["foobar", "**ar"],
      ["hello", "***o"],
      ["hello world", "orld"],
      ["", "****"],
    ];
    it.each(cases)("obfuscateText('%s') === '%s'", (text, expected) => {
      const obfuscated = obfuscator.obfuscateText(text);
      expect(obfuscated).toBe(expected);
    });
  });

  describe("last 2 characters only", () => {
    const obfuscator = obfuscatePortion({
      keepAtStart: Number.MAX_VALUE,
      atLeastFromEnd: 2,
    });
    const cases = [
      ["foo", "f**"],
      ["foobar", "foob**"],
      ["hello", "hel**"],
      ["hello world", "hello wor**"],
      ["", ""],
    ];
    it.each(cases)("obfuscateText('%s') === '%s'", (text, expected) => {
      const obfuscated = obfuscator.obfuscateText(text);
      expect(obfuscated).toBe(expected);
    });
  });

  describe("first 2 characters only", () => {
    const obfuscator = obfuscatePortion({
      keepAtEnd: Number.MAX_VALUE,
      atLeastFromStart: 2,
    });
    const cases = [
      ["foo", "**o"],
      ["foobar", "**obar"],
      ["hello", "**llo"],
      ["hello world", "**llo world"],
      ["", ""],
    ];
    it.each(cases)("obfuscateText('%s') === '%s'", (text, expected) => {
      const obfuscated = obfuscator.obfuscateText(text);
      expect(obfuscated).toBe(expected);
    });
  });

  describe("invalid input", () => {
    it("keepAtStart < 0", () => {
      expect(() => obfuscatePortion({ keepAtStart: -1 })).toThrowError("keepAtStart: -1 < 0");
    });

    it("keepAtEnd < 0", () => {
      expect(() => obfuscatePortion({ keepAtEnd: -1 })).toThrowError("keepAtEnd: -1 < 0");
    });

    it("atLeastFomStart < 0", () => {
      expect(() => obfuscatePortion({ atLeastFromStart: -1 })).toThrowError("atLeastFromStart: -1 < 0");
    });

    it("atLeastFromEnd < 0", () => {
      expect(() => obfuscatePortion({ atLeastFromEnd: -1 })).toThrowError("atLeastFromEnd: -1 < 0");
    });

    it("keepAtStart > fixedTotalLength", () => {
      expect(() =>
        obfuscatePortion({
          keepAtStart: 4,
          fixedTotalLength: 3,
        })
      ).toThrowError("fixedTotalLength (3) < keepAtStart (4) + keepAtEnd (0)");
    });

    it("keepAtEnd > fixedTotalLength", () => {
      expect(() =>
        obfuscatePortion({
          keepAtEnd: 4,
          fixedTotalLength: 3,
        })
      ).toThrowError("fixedTotalLength (3) < keepAtStart (0) + keepAtEnd (4)");
    });

    it("keepAtStart + keepAtEnd > fixedTotalLength", () => {
      expect(() =>
        obfuscatePortion({
          keepAtStart: 4,
          keepAtEnd: 4,
          fixedTotalLength: 7,
        })
      ).toThrowError("fixedTotalLength (7) < keepAtStart (4) + keepAtEnd (4)");
    });
  });
});
