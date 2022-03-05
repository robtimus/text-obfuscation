import { obfuscateNone } from "../src";

describe("obfuscateNone", () => {
  const obfuscator = obfuscateNone;
  const cases = [
    ["foo", "foo"],
    ["foobar", "foobar"],
    ["hello", "hello"],
    ["hello world", "hello world"],
    ["", ""],
  ];
  it.each(cases)("obfuscateText('%s') === '%s'", (text, expected) => {
    const obfuscated = obfuscator.obfuscateText(text);
    expect(obfuscated).toBe(expected);
  });
});
