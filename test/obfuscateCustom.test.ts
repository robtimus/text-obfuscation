import { obfuscateCustom } from "../src";

describe("obfuscateCustom", () => {
  const obfuscator = obfuscateCustom((text: string) => text.toUpperCase());
  const cases = [
    ["foo", "FOO"],
    ["foobar", "FOOBAR"],
    ["hello", "HELLO"],
    ["hello world", "HELLO WORLD"],
    ["", ""],
  ];
  it.each(cases)("applied to '%s' should be '%s'", (text, expected) => {
    const obfuscated = obfuscator(text);
    expect(obfuscated).toBe(expected);
  });
});
