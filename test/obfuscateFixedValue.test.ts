import { obfuscateWithFixedValue } from "../src";

function testWithFixedValue(fixedValue: string) {
  const obfuscator = obfuscateWithFixedValue(fixedValue);
  const cases = ["foo", "foobar", "hello", "hello world", ""];
  it.each(cases)("applied to '%s' should be '" + fixedValue + "'", (text) => {
    const obfuscated = obfuscator(text);
    expect(obfuscated).toBe(fixedValue);
  });
}

describe("obfuscateWithFixedLValue", () => {
  describe("with fixedValue ''", () => testWithFixedValue(""));
  describe("with fixedValue 'obfuscated'", () => testWithFixedValue("obfuscated"));
});
