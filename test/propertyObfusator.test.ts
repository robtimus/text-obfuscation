import { obfuscateWithFixedLength, newPropertyObfuscator, PropertyOptions, obfuscateWithFixedValue } from "../src";

describe("newPropertyObfuscator", () => {
  describe("for object", () => {
    const date = new Date();
    const regex = /.*/s;
    const input = {
      string: 'string"int',
      int: 123456,
      float: 1234.56,
      booleanTrue: true,
      booleanFalse: false,
      date,
      regex,
      null: null,
      object: {
        string: 'string"int',
        int: 123456,
        float: 1234.56,
        booleanTrue: true,
        booleanFalse: false,
        date,
        regex,
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
      notMatchedDate: date,
      notMatchedRegex: regex,
      nonMatchedNull: null,
      nonMatchedObject: {
        notMatchedString: "123456",
        notMatchedInt: 123456,
        notMatchedFloat: 1234.56,
        notMatchedBooleanTrue: true,
        notMatchedBooleanFalse: false,
        notMatchedDate: date,
        notMatchedRegex: regex,
        nonMatchedNull: null,
      },
      nested: [
        {
          string: 'string"int',
          int: 123456,
          float: 1234.56,
          booleanTrue: true,
          booleanFalse: false,
          date,
          regex,
          null: null,
          object: {
            string: 'string"int',
            int: 123456,
            float: 1234.56,
            booleanTrue: true,
            booleanFalse: false,
            date,
            regex,
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
          notMatchedDate: date,
          notMatchedRegex: regex,
          nonMatchedNull: null,
        },
      ],
      notObfuscated: {
        string: 'string"int',
        int: 123456,
        float: 1234.56,
        booleanTrue: true,
        booleanFalse: false,
        date,
        regex,
        null: null,
        object: {
          string: 'string"int',
          int: 123456,
          float: 1234.56,
          booleanTrue: true,
          booleanFalse: false,
          date,
          regex,
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
        notMatchedDate: date,
        notMatchedRegex: regex,
        nonMatchedNull: null,
      },
    };

    const expectedObfucatingAll = {
      string: "***",
      int: "***",
      float: "***",
      booleanTrue: "***",
      booleanFalse: "***",
      date: "now",
      regex: "match-all",
      null: "***",
      object: "ooo",
      array: "aaa",
      notMatchedString: "123456",
      notMatchedInt: 123456,
      notMatchedFloat: 1234.56,
      notMatchedBooleanTrue: true,
      notMatchedBooleanFalse: false,
      notMatchedDate: date,
      notMatchedRegex: {},
      nonMatchedNull: null,
      nonMatchedObject: {
        notMatchedString: "123456",
        notMatchedInt: 123456,
        notMatchedFloat: 1234.56,
        notMatchedBooleanTrue: true,
        notMatchedBooleanFalse: false,
        notMatchedDate: date,
        notMatchedRegex: {},
        nonMatchedNull: null,
      },
      nested: [
        {
          string: "***",
          int: "***",
          float: "***",
          booleanTrue: "***",
          booleanFalse: "***",
          date: "now",
          regex: "match-all",
          null: "***",
          object: "ooo",
          array: "aaa",
          notMatchedString: "123456",
          notMatchedInt: 123456,
          notMatchedFloat: 1234.56,
          notMatchedBooleanTrue: true,
          notMatchedBooleanFalse: false,
          notMatchedDate: date,
          notMatchedRegex: {},
          nonMatchedNull: null,
        },
      ],
      notObfuscated: {
        string: 'string"int',
        int: 123456,
        float: 1234.56,
        booleanTrue: true,
        booleanFalse: false,
        date,
        regex,
        null: null,
        object: {
          string: 'string"int',
          int: 123456,
          float: 1234.56,
          booleanTrue: true,
          booleanFalse: false,
          date,
          regex,
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
        notMatchedDate: date,
        notMatchedRegex: regex,
        nonMatchedNull: null,
      },
    };

    const expectedObfuscatingLeafs = {
      string: "***",
      int: "***",
      float: "***",
      booleanTrue: "***",
      booleanFalse: "***",
      date: "now",
      regex: {},
      null: "***",
      object: {
        string: "***",
        int: "***",
        float: "***",
        booleanTrue: "***",
        booleanFalse: "***",
        date: "now",
        regex: {},
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
      notMatchedDate: date,
      notMatchedRegex: {},
      nonMatchedNull: null,
      nonMatchedObject: {
        notMatchedString: "123456",
        notMatchedInt: 123456,
        notMatchedFloat: 1234.56,
        notMatchedBooleanTrue: true,
        notMatchedBooleanFalse: false,
        notMatchedDate: date,
        notMatchedRegex: {},
        nonMatchedNull: null,
      },
      nested: [
        {
          string: "***",
          int: "***",
          float: "***",
          booleanTrue: "***",
          booleanFalse: "***",
          date: "now",
          regex: {},
          null: "***",
          object: {
            string: "***",
            int: "***",
            float: "***",
            booleanTrue: "***",
            booleanFalse: "***",
            date: "now",
            regex: {},
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
          notMatchedDate: date,
          notMatchedRegex: {},
          nonMatchedNull: null,
        },
      ],
      notObfuscated: {
        string: "***",
        int: "***",
        float: "***",
        booleanTrue: "***",
        booleanFalse: "***",
        date: "now",
        regex: {},
        null: "***",
        object: {
          string: "***",
          int: "***",
          float: "***",
          booleanTrue: "***",
          booleanFalse: "***",
          date: "now",
          regex: {},
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
        notMatchedDate: date,
        notMatchedRegex: {},
        nonMatchedNull: null,
      },
    };

    const expectedObfuscatingInherited = {
      string: "***",
      int: "***",
      float: "***",
      booleanTrue: "***",
      booleanFalse: "***",
      date: "now",
      regex: {},
      null: "***",
      object: {
        string: "ooo",
        int: "ooo",
        float: "ooo",
        booleanTrue: "ooo",
        booleanFalse: "ooo",
        date: "ooo",
        regex: {},
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
      notMatchedDate: date,
      notMatchedRegex: {},
      nonMatchedNull: null,
      nonMatchedObject: {
        notMatchedString: "123456",
        notMatchedInt: 123456,
        notMatchedFloat: 1234.56,
        notMatchedBooleanTrue: true,
        notMatchedBooleanFalse: false,
        notMatchedDate: date,
        notMatchedRegex: {},
        nonMatchedNull: null,
      },
      nested: [
        {
          string: "***",
          int: "***",
          float: "***",
          booleanTrue: "***",
          booleanFalse: "***",
          date: "now",
          regex: {},
          null: "***",
          object: {
            string: "ooo",
            int: "ooo",
            float: "ooo",
            booleanTrue: "ooo",
            booleanFalse: "ooo",
            date: "ooo",
            regex: {},
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
          notMatchedDate: date,
          notMatchedRegex: {},
          nonMatchedNull: null,
        },
      ],
      notObfuscated: {
        string: 'string"int',
        int: 123456,
        float: 1234.56,
        booleanTrue: true,
        booleanFalse: false,
        date,
        regex,
        null: null,
        object: {
          string: 'string"int',
          int: 123456,
          float: 1234.56,
          booleanTrue: true,
          booleanFalse: false,
          date,
          regex,
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
        notMatchedDate: date,
        notMatchedRegex: regex,
        nonMatchedNull: null,
      },
    };

    const expectedObfuscatingInheritedOverridable = {
      string: "***",
      int: "***",
      float: "***",
      booleanTrue: "***",
      booleanFalse: "***",
      date: "now",
      regex: {},
      null: "***",
      object: {
        string: "***",
        int: "***",
        float: "***",
        booleanTrue: "***",
        booleanFalse: "***",
        date: "now",
        regex: {},
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
      notMatchedDate: date,
      notMatchedRegex: {},
      nonMatchedNull: null,
      nonMatchedObject: {
        notMatchedString: "123456",
        notMatchedInt: 123456,
        notMatchedFloat: 1234.56,
        notMatchedBooleanTrue: true,
        notMatchedBooleanFalse: false,
        notMatchedDate: date,
        notMatchedRegex: {},
        nonMatchedNull: null,
      },
      nested: [
        {
          string: "***",
          int: "***",
          float: "***",
          booleanTrue: "***",
          booleanFalse: "***",
          date: "now",
          regex: {},
          null: "***",
          object: {
            string: "***",
            int: "***",
            float: "***",
            booleanTrue: "***",
            booleanFalse: "***",
            date: "now",
            regex: {},
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
          notMatchedDate: date,
          notMatchedRegex: {},
          nonMatchedNull: null,
        },
      ],
      notObfuscated: {
        string: "***",
        int: "***",
        float: "***",
        booleanTrue: "***",
        booleanFalse: "***",
        date: "now",
        regex: {},
        null: "***",
        object: {
          string: "***",
          int: "***",
          float: "***",
          booleanTrue: "***",
          booleanFalse: "***",
          date: "now",
          regex: {},
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
        notMatchedDate: date,
        notMatchedRegex: {},
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
          date: obfuscateWithFixedValue("now"),
          regex: obfuscateWithFixedValue("match-all"),
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
          DATE: obfuscateWithFixedValue("now"),
          REGEX: obfuscateWithFixedValue("match-all"),
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
          date: obfuscateWithFixedValue("now"),
          regex: obfuscateWithFixedValue("match-all"),
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
          date: {
            obfuscate: obfuscateWithFixedValue("now"),
            forObjects: "obfuscate",
            forArrays: "obfuscate",
          },
          regex: {
            obfuscate: obfuscateWithFixedValue("match-all"),
            forObjects: "obfuscate",
            forArrays: "obfuscate",
          },
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
          date: obfuscateWithFixedValue("now"),
          regex: obfuscateWithFixedValue("match-all"),
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
          date: {
            obfuscate: obfuscateWithFixedValue("now"),
            forObjects: "exclude",
            forArrays: "exclude",
          },
          regex: {
            obfuscate: obfuscateWithFixedValue("match-all"),
            forObjects: "exclude",
            forArrays: "exclude",
          },
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
        date: {
          obfuscate: obfuscateWithFixedValue("now"),
          forObjects: "inherit",
          forArrays: "inherit",
        },
        regex: {
          obfuscate: obfuscateWithFixedValue("match-all"),
          forObjects: "inherit",
          forArrays: "inherit",
        },
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
        date: {
          obfuscate: obfuscateWithFixedValue("now"),
          forObjects: "inherit-overridable",
          forArrays: "inherit-overridable",
        },
        regex: {
          obfuscate: obfuscateWithFixedValue("match-all"),
          forObjects: "inherit-overridable",
          forArrays: "inherit-overridable",
        },
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

    it("with custom scalar types", () => {
      const input = {
        string: "foo",
        obfuscatedArray: ["a", "b", "c"],
        nonObfuscatedArray: ["a", "b", "c"],
        scalarObfuscatedArray: ["a", "b", "c"],
        scalarNonObfuscatedArray: ["a", "b", "c"],
      };
      const expected = {
        string: "foo",
        obfuscatedArray: ["***", "***", "***"],
        nonObfuscatedArray: ["a", "b", "c"],
        scalarObfuscatedArray: "***",
        scalarNonObfuscatedArray: ["a", "b", "c"],
      };

      const obfuscator = obfuscateWithFixedLength(3);
      const treatAsScalarReceivers: unknown[] = [];
      const propertyObfuscator = newPropertyObfuscator(
        {
          obfuscatedArray: obfuscator,
          scalarObfuscatedArray: obfuscator,
        },
        {
          forArrays: "inherit",
          treatAsScalar: function (o, key) {
            treatAsScalarReceivers.push(this);
            return Array.isArray(o) && key.startsWith("scalar");
          },
        }
      );

      const obfuscated = propertyObfuscator(input);
      expect(obfuscated).toEqual(expected);

      // treatAsScalar is called once for each property except for the already-scalar one
      expect(treatAsScalarReceivers).toHaveLength(Object.entries(input).length - 1);
      const distinctReceivers = new Set(treatAsScalarReceivers);
      expect(distinctReceivers.size).toBe(1);
      expect(distinctReceivers).toEqual(new Set([input]));
    });

    it("with replacer", () => {
      const input = {
        originalUndefined: undefined,
        obfuscatedSet: new Set(["a", "b", undefined]),
        nonObfuscatedSet: new Set(["a", "b", undefined]),
        scalarSet: new Set(["a", "b", undefined]),
        regularSet: new Set(["a", "b", undefined]),
        undefinedSet: new Set(["a", "b", undefined]),
        obfuscatedMap: new Map([
          ["a", 1],
          ["b", 2],
          ["c", undefined],
        ]),
        nonObfuscatedMap: new Map([
          ["a", 1],
          ["b", 2],
          ["c", undefined],
        ]),
        scalarMap: new Map([
          ["a", 1],
          ["b", 2],
          ["c", undefined],
        ]),
        regularMap: new Map([
          ["a", 1],
          ["b", 2],
          ["c", undefined],
        ]),
        undefinedMap: new Map([
          ["a", 1],
          ["b", 2],
          ["c", undefined],
        ]),
        nested: {
          set: new Set(["a", "b", undefined]),
          map: new Map([
            ["a", 1],
            ["b", 2],
            ["c", undefined],
          ]),
          undefined: 4,
        },
      };
      const expected = {
        originalUndefined: undefined,
        obfuscatedSet: ["***", "***", "***"],
        nonObfuscatedSet: ["a", "b", undefined],
        scalarSet: `${["a", "b", undefined]}`,
        regularSet: {},
        obfuscatedMap: {
          a: "***",
          b: "***",
          c: "***",
        },
        nonObfuscatedMap: {
          a: 1,
          b: 2,
          c: undefined,
        },
        scalarMap: JSON.stringify({ a: 1, b: 2, c: undefined }),
        regularMap: {},
        nested: {
          set: ["***", "***", "***"],
          map: {
            a: "***",
            b: "***",
            c: "***",
          },
        },
      };

      const obfuscator = obfuscateWithFixedLength(3);
      function setToArray<T>(s: Set<T>): T[] {
        return [...s];
      }
      function mapToObject<T>(m: Map<string, T>): object {
        return Object.fromEntries(m.entries());
      }
      const replacerReceivers: unknown[] = [];
      const replacedMaps: object[] = [];
      const propertyObfuscator = newPropertyObfuscator(
        {
          obfuscatedSet: obfuscator,
          obfuscatedMap: obfuscator,
          nested: obfuscator,
        },
        {
          forObjects: "inherit",
          forArrays: "inherit",
          replacer: function (value, key) {
            replacerReceivers.push(this);
            if (key.startsWith("scalar")) {
              if (value instanceof Set) {
                return `${setToArray(value)}`;
              }
              if (value instanceof Map) {
                return JSON.stringify(mapToObject(value));
              }
            }
            if (key.startsWith("undefined")) {
              return undefined;
            }
            if (!key.startsWith("regular")) {
              if (value instanceof Set) {
                return setToArray(value);
              }
              if (value instanceof Map) {
                const result = mapToObject(value);
                replacedMaps.push(result);
                return result;
              }
            }
            return value;
          },
        }
      );

      const obfuscated = propertyObfuscator(input);
      expect(obfuscated).toEqual(expected);

      // The replacer is called once for each property except for the undefined one,
      // plus 2 times for both of the replaced Map's entries (excluding the undefined values),
      // plus 1 time for the nested Set,
      // plus 3 times for the nested Map plus it's entries,
      // plus 1 time for the nested "undefined" entry
      expect(replacerReceivers).toHaveLength(Object.entries(input).length - 1 + 9);
      const distinctReceivers = new Set(replacerReceivers);
      expect(distinctReceivers).toEqual(new Set([input, input.nested, ...replacedMaps]));
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
