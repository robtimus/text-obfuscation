import { obfuscateCustom } from "../src";

describe("obfuscateAll", () => {
  const obfuscator = obfuscateCustom((text: string) => text.toUpperCase());
  const cases = [
    ["foo", "FOO"],
    ["foobar", "FOOBAR"],
    ["hello", "HELLO"],
    ["hello world", "HELLO WORLD"],
    ["", ""],
  ];
  it.each(cases)("obfuscateText('%s') === '%s'", (text, expected) => {
    const obfuscated = obfuscator.obfuscateText(text);
    expect(obfuscated).toBe(expected);
  });
});
