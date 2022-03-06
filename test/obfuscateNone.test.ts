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
  it.each(cases)("applied to '%s' should be '%s'", (text, expected) => {
    const obfuscated = obfuscator(text);
    expect(obfuscated).toBe(expected);
  });
});
