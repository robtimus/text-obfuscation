import { obfuscateWithFixedLength } from "../src";

function testWithFixedLength(fixedLength: number, expected: string) {
  const obfuscator = obfuscateWithFixedLength(fixedLength);
  const cases = ["foo", "foobar", "hello", "hello world", ""];
  it.each(cases)("applied to '%s' should be '" + expected + "'", (text) => {
    const obfuscated = obfuscator(text);
    expect(obfuscated).toBe(expected);
  });
}

describe("obfuscateWithFixedLength", () => {
  it("with fixedLength -1", () => {
    expect(() => obfuscateWithFixedLength(-1)).toThrow();
  });
  describe("with fixedLength 0", () => testWithFixedLength(0, ""));
  describe("with fixedLength 1", () => testWithFixedLength(1, "*"));
  describe("with fixedLength 3", () => testWithFixedLength(3, "***"));
  describe("with fixedLength 8", () => testWithFixedLength(8, "********"));
});
