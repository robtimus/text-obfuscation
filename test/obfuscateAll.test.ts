import { obfuscateAll } from "../src";

describe("obfuscateAll", () => {
  const obfuscator = obfuscateAll();
  const cases = [
    ["foo", "***"],
    ["foobar", "******"],
    ["hello", "*****"],
    ["hello world", "***********"],
    ["", ""],
  ];
  it.each(cases)("applied to '%s' should be '%s'", (text, expected) => {
    const obfuscated = obfuscator(text);
    expect(obfuscated).toBe(expected);
  });
});
