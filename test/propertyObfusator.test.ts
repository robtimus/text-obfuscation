import { obfuscateWithFixedLength, newPropertyObfuscator } from "../src";

describe("obfuscateObfuscator", () => {
  const input = {
    string: 'string"int',
    int: 123456,
    float: 1234.56,
    booleanTrue: true,
    booleanFalse: false,
    null: null,
    object: {
      string: 'string"int',
      int: 123456,
      float: 1234.56,
      booleanTrue: true,
      booleanFalse: false,
      null: null,
      nested: [
        {
          prop1: "1",
          prop2: "2",
        },
      ],
    },
    array: [["1", "2"], {}],
    notMatchedString: "123456",
    notMatchedInt: 123456,
    notMatchedFloat: 1234.56,
    notMatchedBooleanTrue: true,
    notMatchedBooleanFalse: false,
    nonMatchedNull: null,
    nonMatchedObject: {
      notMatchedString: "123456",
      notMatchedInt: 123456,
      notMatchedFloat: 1234.56,
      notMatchedBooleanTrue: true,
      notMatchedBooleanFalse: false,
      nonMatchedNull: null,
    },
    nested: [
      {
        string: 'string"int',
        int: 123456,
        float: 1234.56,
        booleanTrue: true,
        booleanFalse: false,
        null: null,
        object: {
          string: 'string"int',
          int: 123456,
          float: 1234.56,
          booleanTrue: true,
          booleanFalse: false,
          nested: [
            {
              prop1: "1",
              prop2: "2",
            },
          ],
        },
        array: [["1", "2"], {}],
        notMatchedString: "123456",
        notMatchedInt: 123456,
        notMatchedFloat: 1234.56,
        notMatchedBooleanTrue: true,
        notMatchedBooleanFalse: false,
        nonMatchedNull: null,
      },
    ],
    notObfuscated: {
      string: 'string"int',
      int: 123456,
      float: 1234.56,
      booleanTrue: true,
      booleanFalse: false,
      null: null,
      object: {
        string: 'string"int',
        int: 123456,
        float: 1234.56,
        booleanTrue: true,
        booleanFalse: false,
        nested: [
          {
            prop1: "1",
            prop2: "2",
          },
        ],
      },
      array: [["1", "2"], {}],
      notMatchedString: "123456",
      notMatchedInt: 123456,
      notMatchedFloat: 1234.56,
      notMatchedBooleanTrue: true,
      notMatchedBooleanFalse: false,
      nonMatchedNull: null,
    },
  };

  const expectedObfucatingAll = {
    string: "***",
    int: "***",
    float: "***",
    booleanTrue: "***",
    booleanFalse: "***",
    null: "***",
    object: "***",
    array: "***",
    notMatchedString: "123456",
    notMatchedInt: 123456,
    notMatchedFloat: 1234.56,
    notMatchedBooleanTrue: true,
    notMatchedBooleanFalse: false,
    nonMatchedNull: null,
    nonMatchedObject: {
      notMatchedString: "123456",
      notMatchedInt: 123456,
      notMatchedFloat: 1234.56,
      notMatchedBooleanTrue: true,
      notMatchedBooleanFalse: false,
      nonMatchedNull: null,
    },
    nested: [
      {
        string: "***",
        int: "***",
        float: "***",
        booleanTrue: "***",
        booleanFalse: "***",
        null: "***",
        object: "***",
        array: "***",
        notMatchedString: "123456",
        notMatchedInt: 123456,
        notMatchedFloat: 1234.56,
        notMatchedBooleanTrue: true,
        notMatchedBooleanFalse: false,
        nonMatchedNull: null,
      },
    ],
    notObfuscated: {
      string: 'string"int',
      int: 123456,
      float: 1234.56,
      booleanTrue: true,
      booleanFalse: false,
      null: null,
      object: {
        string: 'string"int',
        int: 123456,
        float: 1234.56,
        booleanTrue: true,
        booleanFalse: false,
        nested: [
          {
            prop1: "1",
            prop2: "2",
          },
        ],
      },
      array: [["1", "2"], {}],
      notMatchedString: "123456",
      notMatchedInt: 123456,
      notMatchedFloat: 1234.56,
      notMatchedBooleanTrue: true,
      notMatchedBooleanFalse: false,
      nonMatchedNull: null,
    },
  };

  const expectedObfuscatingLeafs = {
    string: "***",
    int: "***",
    float: "***",
    booleanTrue: "***",
    booleanFalse: "***",
    null: "***",
    object: {
      string: "***",
      int: "***",
      float: "***",
      booleanTrue: "***",
      booleanFalse: "***",
      null: "***",
      nested: [
        {
          prop1: "1",
          prop2: "2",
        },
      ],
    },
    array: [["1", "2"], {}],
    notMatchedString: "123456",
    notMatchedInt: 123456,
    notMatchedFloat: 1234.56,
    notMatchedBooleanTrue: true,
    notMatchedBooleanFalse: false,
    nonMatchedNull: null,
    nonMatchedObject: {
      notMatchedString: "123456",
      notMatchedInt: 123456,
      notMatchedFloat: 1234.56,
      notMatchedBooleanTrue: true,
      notMatchedBooleanFalse: false,
      nonMatchedNull: null,
    },
    nested: [
      {
        string: "***",
        int: "***",
        float: "***",
        booleanTrue: "***",
        booleanFalse: "***",
        null: "***",
        object: {
          string: "***",
          int: "***",
          float: "***",
          booleanTrue: "***",
          booleanFalse: "***",
          nested: [
            {
              prop1: "1",
              prop2: "2",
            },
          ],
        },
        array: [["1", "2"], {}],
        notMatchedString: "123456",
        notMatchedInt: 123456,
        notMatchedFloat: 1234.56,
        notMatchedBooleanTrue: true,
        notMatchedBooleanFalse: false,
        nonMatchedNull: null,
      },
    ],
    notObfuscated: {
      string: "***",
      int: "***",
      float: "***",
      booleanTrue: "***",
      booleanFalse: "***",
      null: "***",
      object: {
        string: "***",
        int: "***",
        float: "***",
        booleanTrue: "***",
        booleanFalse: "***",
        nested: [
          {
            prop1: "1",
            prop2: "2",
          },
        ],
      },
      array: [["1", "2"], {}],
      notMatchedString: "123456",
      notMatchedInt: 123456,
      notMatchedFloat: 1234.56,
      notMatchedBooleanTrue: true,
      notMatchedBooleanFalse: false,
      nonMatchedNull: null,
    },
  };

  it("globally case sensitive", () => {
    const obfuscator = obfuscateWithFixedLength(3);
    const propertyObfuscator = newPropertyObfuscator(
      {
        string: obfuscator,
        int: obfuscator,
        float: obfuscator,
        booleanTrue: obfuscator,
        booleanFalse: obfuscator,
        object: obfuscator,
        array: obfuscator,
        null: obfuscator,
        notObfuscated: "ignore",
      },
      {
        caseSensitive: true,
      }
    );

    const obfuscated = propertyObfuscator(input);
    expect(obfuscated).toEqual(expectedObfucatingAll);
  });

  it("globally case insensitive", () => {
    const obfuscator = obfuscateWithFixedLength(3);
    const propertyObfuscator = newPropertyObfuscator(
      {
        STRING: obfuscator,
        INT: obfuscator,
        FLOAT: obfuscator,
        BOOLEANTRUE: obfuscator,
        BOOLEANFALSE: obfuscator,
        OBJECT: obfuscator,
        ARRAY: obfuscator,
        NULL: obfuscator,
        NOTOBFUSCATED: "ignore",
      },
      {
        caseSensitive: false,
      }
    );

    const obfuscated = propertyObfuscator(input);
    expect(obfuscated).toEqual(expectedObfucatingAll);
  });

  it("globally matching objects and arrays", () => {
    const obfuscator = obfuscateWithFixedLength(3);
    const propertyObfuscator = newPropertyObfuscator(
      {
        string: obfuscator,
        int: obfuscator,
        float: obfuscator,
        booleanTrue: obfuscator,
        booleanFalse: obfuscator,
        object: obfuscator,
        array: obfuscator,
        null: obfuscator,
        notObfuscated: "ignore",
      },
      {
        matchObjects: true,
        matchArrays: true,
      }
    );

    const obfuscated = propertyObfuscator(input);
    expect(obfuscated).toEqual(expectedObfucatingAll);
  });

  it("matching objects and arrays overriding globals", () => {
    const obfuscator = obfuscateWithFixedLength(3);
    const propertyConfig = {
      obfuscate: obfuscator,
      matchObjects: true,
      matchArrays: true,
    };
    const objecObfuscator = newPropertyObfuscator(
      {
        string: propertyConfig,
        int: propertyConfig,
        float: propertyConfig,
        booleanTrue: propertyConfig,
        booleanFalse: propertyConfig,
        object: propertyConfig,
        array: propertyConfig,
        null: propertyConfig,
        notObfuscated: {
          obfuscate: "ignore",
          matchObjects: true,
          matchArrays: true,
        },
      },
      {
        matchObjects: false,
        matchArrays: false,
      }
    );

    const obfuscated = objecObfuscator(input);
    expect(obfuscated).toEqual(expectedObfucatingAll);
  });

  it("globally not matching objects and arrays", () => {
    const obfuscator = obfuscateWithFixedLength(3);
    const propertyObfuscator = newPropertyObfuscator(
      {
        string: obfuscator,
        int: obfuscator,
        float: obfuscator,
        booleanTrue: obfuscator,
        booleanFalse: obfuscator,
        object: obfuscator,
        array: obfuscator,
        null: obfuscator,
        notObfuscated: "ignore",
      },
      {
        matchObjects: false,
        matchArrays: false,
      }
    );

    const obfuscated = propertyObfuscator(input);
    expect(obfuscated).toEqual(expectedObfuscatingLeafs);
  });

  it("not matching objects and arrays overriding globals", () => {
    const obfuscator = obfuscateWithFixedLength(3);
    const propertyConfig = {
      obfuscate: obfuscator,
      matchObjects: false,
      matchArrays: false,
    };
    const propertyObfuscator = newPropertyObfuscator(
      {
        string: propertyConfig,
        int: propertyConfig,
        float: propertyConfig,
        booleanTrue: propertyConfig,
        booleanFalse: propertyConfig,
        object: propertyConfig,
        array: propertyConfig,
        null: propertyConfig,
        notObfuscated: {
          obfuscate: "ignore",
          matchObjects: false,
          matchArrays: false,
        },
      },
      {
        matchObjects: true,
        matchArrays: true,
      }
    );

    const obfuscated = propertyObfuscator(input);
    expect(obfuscated).toEqual(expectedObfuscatingLeafs);
  });

  describe("obfuscateProperty", () => {
    describe("globally case sensitive", () => {
      const cases = [
        ["string", "hello world", "***"],
        ["notObfuscated", "hello world", "hello world"],
        ["notMatched", "hello world", "hello world"],
      ];

      const obfuscator = obfuscateWithFixedLength(3);
      const propertyObfuscator = newPropertyObfuscator(
        {
          string: obfuscator,
          notObfuscated: "ignore",
        },
        {
          caseSensitive: true,
        }
      );
      it.each(cases)("for propertyName '%s' should obfuscate '%s' to '%s'", (propertyName, text, expected) => {
        const obfuscated = propertyObfuscator.obfuscateProperty(propertyName, text);
        expect(obfuscated).toBe(expected);
      });
    });

    describe("globally case insensitive", () => {
      const cases = [
        ["string", "hello world", "***"],
        ["notObfuscated", "hello world", "hello world"],
        ["notMatched", "hello world", "hello world"],
      ];

      const obfuscator = obfuscateWithFixedLength(3);
      const propertyObfuscator = newPropertyObfuscator(
        {
          STRING: obfuscator,
          NOTOBFUSCATED: "ignore",
        },
        {
          caseSensitive: false,
        }
      );
      it.each(cases)("for propertyName '%s' should obfuscate '%s' to '%s'", (propertyName, text, expected) => {
        const obfuscated = propertyObfuscator.obfuscateProperty(propertyName, text);
        expect(obfuscated).toBe(expected);
      });
    });
  });
});
