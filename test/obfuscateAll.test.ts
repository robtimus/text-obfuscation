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
  it.each(cases)("obfuscateText('%s') === '%s'", (text, expected) => {
    const obfuscated = obfuscator.obfuscateText(text);
    expect(obfuscated).toBe(expected);
  });
});
