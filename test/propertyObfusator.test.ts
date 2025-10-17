import { obfuscateWithFixedLength, newPropertyObfuscator, PropertyOptions } from "../src";

describe("newPropertyObfuscator", () => {
  describe("for object", () => {
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
      object: "ooo",
      array: "aaa",
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
          object: "ooo",
          array: "aaa",
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

    const expectedObfuscatingInherited = {
      string: "***",
      int: "***",
      float: "***",
      booleanTrue: "***",
      booleanFalse: "***",
      null: "***",
      object: {
        string: "ooo",
        int: "ooo",
        float: "ooo",
        booleanTrue: "ooo",
        booleanFalse: "ooo",
        null: "ooo",
        nested: [
          {
            prop1: "ooo",
            prop2: "ooo",
          },
        ],
      },
      array: [["aaa", "aaa"], {}],
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
            string: "ooo",
            int: "ooo",
            float: "ooo",
            booleanTrue: "ooo",
            booleanFalse: "ooo",
            nested: [
              {
                prop1: "ooo",
                prop2: "ooo",
              },
            ],
          },
          array: [["aaa", "aaa"], {}],
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

    const expectedObfuscatingInheritedOverridable = {
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
            prop1: "ooo",
            prop2: "ooo",
          },
        ],
      },
      array: [["aaa", "aaa"], {}],
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
                prop1: "ooo",
                prop2: "ooo",
              },
            ],
          },
          array: [["aaa", "aaa"], {}],
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
              prop1: "ooo",
              prop2: "ooo",
            },
          ],
        },
        array: [["aaa", "aaa"], {}],
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
          object: obfuscateWithFixedLength(3, "o"),
          array: obfuscateWithFixedLength(3, "a"),
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
          OBJECT: obfuscateWithFixedLength(3, "o"),
          ARRAY: obfuscateWithFixedLength(3, "a"),
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

    it("globally obfuscating objects and arrays", () => {
      const obfuscator = obfuscateWithFixedLength(3);
      const propertyObfuscator = newPropertyObfuscator(
        {
          string: obfuscator,
          int: obfuscator,
          float: obfuscator,
          booleanTrue: obfuscator,
          booleanFalse: obfuscator,
          object: obfuscateWithFixedLength(3, "o"),
          array: obfuscateWithFixedLength(3, "a"),
          null: obfuscator,
          notObfuscated: "ignore",
        },
        {
          forObjects: "obfuscate",
          forArrays: "obfuscate",
        }
      );

      const obfuscated = propertyObfuscator(input);
      expect(obfuscated).toEqual(expectedObfucatingAll);
    });

    it("obfuscating objects and arrays overriding globals", () => {
      const obfuscator = obfuscateWithFixedLength(3);
      const propertyConfig: PropertyOptions = {
        obfuscate: obfuscator,
        forObjects: "obfuscate",
        forArrays: "obfuscate",
      };
      const objecObfuscator = newPropertyObfuscator(
        {
          string: propertyConfig,
          int: propertyConfig,
          float: propertyConfig,
          booleanTrue: propertyConfig,
          booleanFalse: propertyConfig,
          object: {
            obfuscate: obfuscateWithFixedLength(3, "o"),
            forObjects: "obfuscate",
            forArrays: "obfuscate",
          },
          array: {
            obfuscate: obfuscateWithFixedLength(3, "a"),
            forObjects: "obfuscate",
            forArrays: "obfuscate",
          },
          null: propertyConfig,
          notObfuscated: {
            obfuscate: "ignore",
            forObjects: "obfuscate",
            forArrays: "obfuscate",
          },
        },
        {
          forObjects: "exclude",
          forArrays: "exclude",
        }
      );

      const obfuscated = objecObfuscator(input);
      expect(obfuscated).toEqual(expectedObfucatingAll);
    });

    it("globally excluding objects and arrays", () => {
      const obfuscator = obfuscateWithFixedLength(3);
      const propertyObfuscator = newPropertyObfuscator(
        {
          string: obfuscator,
          int: obfuscator,
          float: obfuscator,
          booleanTrue: obfuscator,
          booleanFalse: obfuscator,
          object: obfuscateWithFixedLength(3, "o"),
          array: obfuscateWithFixedLength(3, "a"),
          null: obfuscator,
          notObfuscated: "ignore",
        },
        {
          forObjects: "exclude",
          forArrays: "exclude",
        }
      );

      const obfuscated = propertyObfuscator(input);
      expect(obfuscated).toEqual(expectedObfuscatingLeafs);
    });

    it("excluding objects and arrays overriding globals", () => {
      const obfuscator = obfuscateWithFixedLength(3);
      const propertyConfig: PropertyOptions = {
        obfuscate: obfuscator,
        forObjects: "exclude",
        forArrays: "exclude",
      };
      const propertyObfuscator = newPropertyObfuscator(
        {
          string: propertyConfig,
          int: propertyConfig,
          float: propertyConfig,
          booleanTrue: propertyConfig,
          booleanFalse: propertyConfig,
          object: {
            obfuscate: obfuscateWithFixedLength(3, "o"),
            forObjects: "exclude",
            forArrays: "exclude",
          },
          array: {
            obfuscate: obfuscateWithFixedLength(3, "a"),
            forObjects: "exclude",
            forArrays: "exclude",
          },
          null: propertyConfig,
          notObfuscated: {
            obfuscate: "ignore",
            forObjects: "exclude",
            forArrays: "exclude",
          },
        },
        {
          forObjects: "obfuscate",
          forArrays: "obfuscate",
        }
      );

      const obfuscated = propertyObfuscator(input);
      expect(obfuscated).toEqual(expectedObfuscatingLeafs);
    });

    it("inherited obfuscators", () => {
      const obfuscator = obfuscateWithFixedLength(3);
      const propertyConfig: PropertyOptions = {
        obfuscate: obfuscator,
        forObjects: "inherit",
        forArrays: "inherit",
      };
      const propertyObfuscator = newPropertyObfuscator({
        string: propertyConfig,
        int: propertyConfig,
        float: propertyConfig,
        booleanTrue: propertyConfig,
        booleanFalse: propertyConfig,
        object: {
          obfuscate: obfuscateWithFixedLength(3, "o"),
          forObjects: "inherit",
          forArrays: "inherit",
        },
        array: {
          obfuscate: obfuscateWithFixedLength(3, "a"),
          forObjects: "inherit",
          forArrays: "inherit",
        },
        null: propertyConfig,
        notObfuscated: {
          obfuscate: "ignore",
          forObjects: "inherit",
          forArrays: "inherit",
        },
      });

      const obfuscated = propertyObfuscator(input);
      expect(obfuscated).toEqual(expectedObfuscatingInherited);
    });

    it("overridable inherited obfuscators", () => {
      const obfuscator = obfuscateWithFixedLength(3);
      const propertyConfig: PropertyOptions = {
        obfuscate: obfuscator,
        forObjects: "inherit-overridable",
        forArrays: "inherit-overridable",
      };
      const propertyObfuscator = newPropertyObfuscator({
        string: propertyConfig,
        int: propertyConfig,
        float: propertyConfig,
        booleanTrue: propertyConfig,
        booleanFalse: propertyConfig,
        object: {
          obfuscate: obfuscateWithFixedLength(3, "o"),
          forObjects: "inherit-overridable",
          forArrays: "inherit-overridable",
        },
        array: {
          obfuscate: obfuscateWithFixedLength(3, "a"),
          forObjects: "inherit-overridable",
          forArrays: "inherit-overridable",
        },
        null: propertyConfig,
        notObfuscated: {
          obfuscate: "ignore",
          forObjects: "inherit-overridable",
          forArrays: "inherit-overridable",
        },
      });

      const obfuscated = propertyObfuscator(input);
      expect(obfuscated).toEqual(expectedObfuscatingInheritedOverridable);
    });
  });

  describe("for single property", () => {
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
        const obfuscated = propertyObfuscator(propertyName, text);
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
        const obfuscated = propertyObfuscator(propertyName, text);
        expect(obfuscated).toBe(expected);
      });
    });
  });
});
