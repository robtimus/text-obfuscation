import {
  Obfuscator,
  atFirst,
  atLast,
  newHeaderObfuscator,
  newPropertyObfuscator,
  obfuscateAll,
  obfuscateCustom,
  obfuscateNone,
  obfuscatePortion,
  obfuscateWithFixedLength,
  obfuscateWithFixedValue,
} from "../src";

it("obfuscateAll", () => {
  const obfuscator = obfuscateAll();
  const obfuscated = obfuscator("Hello World");
  expect(obfuscated).toBe("***********");
});

it("obfuscateWithFixedLength", () => {
  const obfuscator = obfuscateWithFixedLength(5);
  const obfuscated = obfuscator("Hello World");
  expect(obfuscated).toBe("*****");
});

it("obfuscateWithFixedValue", () => {
  const obfuscator = obfuscateWithFixedValue("foo");
  const obfuscated = obfuscator("Hello World");
  expect(obfuscated).toBe("foo");
});

describe("obfuscatePortion", () => {
  describe("Obfuscating all but the last 4 characters", () => {
    it("only keepAtEnd", () => {
      const obfuscator = obfuscatePortion({
        keepAtEnd: 4,
      });
      const obfuscated = obfuscator("1234567890123456");
      expect(obfuscated).toBe("************3456");
    });

    it("with atLeastFromStart", () => {
      const obfuscator = obfuscatePortion({
        keepAtEnd: 4,
        atLeastFromStart: 12,
      });
      const obfuscated = obfuscator("1234567890");
      expect(obfuscated).toBe("**********");
    });
  });

  it("Obfuscating only the last 2 characters", () => {
    const obfuscator = obfuscatePortion({
      keepAtStart: Number.MAX_VALUE,
      atLeastFromEnd: 2,
    });
    const obfuscated = obfuscator("SW1A 2AA");
    expect(obfuscated).toBe("SW1A 2**");
  });

  it("Using a fixed length", () => {
    const obfuscator = obfuscatePortion({
      keepAtStart: 2,
      keepAtEnd: 2,
      fixedTotalLength: 6,
    });
    let obfuscated = obfuscator("Hello World");
    expect(obfuscated).toBe("He**ld");
    obfuscated = obfuscator("foo");
    expect(obfuscated).toBe("fo**oo");
  });
});

it("obfuscateCustom", () => {
  const obfuscator = obfuscateCustom((text) => text.toUpperCase());
  const obfuscated = obfuscator("Hello World");
  expect(obfuscated).toBe("HELLO WORLD");
});

it("obfuscateNone", () => {
  const somePossiblyUndefinedObfuscator: Obfuscator | undefined = undefined;
  const obfuscator = somePossiblyUndefinedObfuscator || obfuscateNone;
  const obfuscated = obfuscator("Hello World");
  expect(obfuscated).toBe("Hello World");
});

describe("Combining obfuscators", () => {
  it("portion only", () => {
    const obfuscator = obfuscatePortion({
      keepAtStart: 4,
      keepAtEnd: 4,
    });
    const obfuscated = obfuscator("1234567890123456");
    expect(obfuscated).toBe("1234********3456");
    const incorrectlyObfuscated = obfuscator("12345678901234");
    expect(incorrectlyObfuscated).toBe("1234******1234");
  });

  it("16 character credit card numbers", () => {
    const obfuscator = obfuscateNone.untilLength(4).afterThat(obfuscateAll()).untilLength(12).afterThat(obfuscateNone);
    const obfuscated = obfuscator("1234567890123456");
    expect(obfuscated).toBe("1234********3456");
  });

  it("any length credit card numbers", () => {
    const obfuscator = obfuscateNone.untilLength(4).afterThat(
      obfuscatePortion({
        keepAtEnd: 4,
        atLeastFromStart: 8,
      })
    );
    const obfuscated = obfuscator("12345678901234");
    expect(obfuscated).toBe("1234********34");
  });
});

describe("Splitting text during obfuscation", () => {
  it("keep domain as-is", () => {
    const localPartObfuscator = obfuscatePortion({
      keepAtStart: 1,
      keepAtEnd: 1,
      fixedTotalLength: 8,
    });
    const domainObfuscator = obfuscateNone;
    const obfuscator = atFirst("@").splitTo(localPartObfuscator, domainObfuscator);
    const obfuscated = obfuscator("test@example.org");
    expect(obfuscated).toBe("t******t@example.org");
  });

  it("keep only the TLD of the domain", () => {
    const localPartObfuscator = obfuscatePortion({
      keepAtStart: 1,
      keepAtEnd: 1,
      fixedTotalLength: 8,
    });
    const domainObfuscator = atLast(".").splitTo(obfuscateAll(), obfuscateNone);
    const obfuscator = atFirst("@").splitTo(localPartObfuscator, domainObfuscator);
    const obfuscated = obfuscator("test@example.org");
    expect(obfuscated).toBe("t******t@*******.org");
  });
});

describe("Obfuscating object properties", () => {
  it("configured with obfuscators", () => {
    const propertyObfuscator = newPropertyObfuscator({
      password: obfuscateWithFixedLength(3),
    });
    const obfuscatedPassword = propertyObfuscator("password", "admin1234");
    expect(obfuscatedPassword).toBe("***");
    const obfuscatedUsername = propertyObfuscator("username", "admin");
    expect(obfuscatedUsername).toBe("admin");
    const obfuscatedObject = propertyObfuscator({
      username: "admin",
      password: "admin1234",
    });
    expect(obfuscatedObject).toStrictEqual({
      username: "admin",
      password: "***",
    });
  });

  it("configured with property options", () => {
    const propertyObfuscator = newPropertyObfuscator({
      password: {
        obfuscate: obfuscateWithFixedLength(3),
        caseSensitive: false, // defaults to true
        forObjects: "exclude", // defaults to "obfuscate"
        forArrays: "exclude", // defaults to "obfuscate"
      },
    });
    const obfuscatedPassword = propertyObfuscator("password", "admin1234");
    expect(obfuscatedPassword).toBe("***");
    const obfuscatedUsername = propertyObfuscator("username", "admin");
    expect(obfuscatedUsername).toBe("admin");
    const obfuscatedObject = propertyObfuscator({
      username: "admin",
      password: "admin1234",
    });
    expect(obfuscatedObject).toStrictEqual({
      username: "admin",
      password: "***",
    });
  });

  it("configured with global options", () => {
    const propertyObfuscator = newPropertyObfuscator(
      {
        password: obfuscateWithFixedLength(3),
      },
      {
        caseSensitive: false, // defaults to true
        forObjects: "exclude", // defaults to "obfuscate"
        forArrays: "exclude", // defaults to "obfuscate"
      }
    );
    const obfuscatedPassword = propertyObfuscator("password", "admin1234");
    expect(obfuscatedPassword).toBe("***");
    const obfuscatedUsername = propertyObfuscator("username", "admin");
    expect(obfuscatedUsername).toBe("admin");
    const obfuscatedObject = propertyObfuscator({
      username: "admin",
      password: "admin1234",
    });
    expect(obfuscatedObject).toStrictEqual({
      username: "admin",
      password: "***",
    });
  });
});

it("Obfuscating HTTP headers", () => {
  const headerObfuscator = newHeaderObfuscator({
    Authorization: obfuscateWithFixedLength(3),
  });
  const obfuscatedAuthorization = headerObfuscator("authorization", "Bearer someToken");
  expect(obfuscatedAuthorization).toBe("***");
  const obfuscatedAuthorizations = headerObfuscator("authorization", ["Bearer someToken"]);
  expect(obfuscatedAuthorizations).toStrictEqual(["***"]);
  const obfuscatedContentType = headerObfuscator("Content-Type", "application/json");
  expect(obfuscatedContentType).toBe("application/json");
  const obfuscatedHeaders = headerObfuscator({
    authorization: "Bearer someToken",
    "content-type": "application/json",
  });
  expect(obfuscatedHeaders).toStrictEqual({
    authorization: "***",
    "content-type": "application/json",
  });
});
