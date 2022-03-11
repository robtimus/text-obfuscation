# text-obfuscation

Provides functionality for obfuscating text. This can be useful for logging information that contains sensitive information.

## Obfuscating strings

### Pre-defined functions

The following pre-defined functions are provided that all return an immutable obfuscator.

#### obfuscateAll

Replaces all characters with a mask character that defaults to `*`.

```
const obfuscator = obfuscateAll();
const obfuscated = obfuscator("Hello World");
// obfuscated is "***********"
```

Note: using this obfuscator still leaks out information about the length of the original text. One of the following two is more secure.

#### obfuscateWithFixedLength

Replaces the entire text with a fixed number of the given mask character that defaults to `*`.

```
const obfuscator = obfuscateWithFixedLength(5);
const obfuscated = obfuscator("Hello World");
// obfuscated is "*****"
```

#### obfuscateWithFixedValue

Replaces the entire text with a fixed value.

```
const obfuscator = obfuscateWithFixedValue("foo");
const obfuscated = obfuscator("Hello World");
// obfuscated is "foo"
```

#### obfuscatePortion

While the above examples are simple, they are not very flexible. Using `obfuscatePortion` you can build obfuscators that obfuscate only specific portions of text. Some examples:

##### Obfuscating all but the last 4 characters

Useful for obfuscating values like credit card numbers.

```
const obfuscator = obfuscatePortion({
  keepAtEnd: 4
});
const obfuscated = obfuscator("1234567890123456");
// obfuscated is "************3456"
```

It’s advised to use `atLeastFromStart`, to make sure that values of fewer than 16 characters are still obfuscated properly:

```
const obfuscator = obfuscatePortion({
  keepAtEnd: 4,
  atLeastFromStart: 12
});
const obfuscated = obfuscator("1234567890");
// obfuscated is "**********" and not "******7890"
```

##### Obfuscating only the last 2 characters

Useful for obfuscating values like zip codes, where the first part is not as sensitive as the full zip code:

```
const obfuscator = obfuscatePortion({
  keepAtStart: Number.MAX_VALUE,
  atLeastFromEnd: 2
});
const obfuscated = obfuscator("SW1A 2AA");
// obfuscated is "SW1A 2**"
```

Here, the `keepAtStart` instructs the obfuscator to keep everything; however, `atLeastFromEnd` overrides that partly to ensure that the last two characters are obfuscated regardless of the value specified by `keepAtStart`.

##### Using a fixed length

Similar to using `obfuscateAll`, by default an obfuscator built using `obfuscatePortion` leaks out the length of the original text. If your text has a variable length, you should consider specifying a fixed total length for the result. The length of the result will then be the same no matter how long the input is:

```
const obfuscator = obfuscatePortion({
  keepAtStart: 2,
  keepAtEnd: 2,
  fixedTotalLength: 6
});
let obfuscated = obfuscator("Hello World");
// obfuscated is "He**ld"
obfuscated = obfuscator("foo");
// obfuscated is "fo**oo"
```

Note that if `keepAtStart` and `keepAtEnd` are both specified, parts of the input may be repeated in the result if the input’s length is less than the combined number of characters to keep. This makes it harder to find the original input. For example, if in the example `foo` would be obfuscated into `fo***o` instead, it would be clear that the input was `foo`. Instead, it can now be anything that starts with `fo` and ends with `oo`.

#### obfuscateCustom

`obfuscateCustom` converts any function that takes a string as input and returns a string into an obfuscator.

```
const obfuscator = obfuscateCustom(text => text.toUpperCase());
const obfuscated = obfuscator("Hello World");
// obfuscated is "HELLO WORLD"
```

### obfuscateNone

`obfuscateNone` is not a function that returns an obfuscator, but an immutable obfuscator itself. It can be used as default to prevent checks. For instance:

```
const obfuscator = somePossiblyUndefinedObfuscator || obfuscateNone;
const obfuscated = obfuscator("Hello World");
// obfuscated is "Hello World" if somePossiblyUndefinedObfuscator was falsy
```

### Combining obfuscators

Sometimes the obfucators in this library alone cannot perform the obfuscation you need. For instance, if you want to obfuscate credit cards, but keep the first and last 4 characters. If the credit cards are all fixed length, `obfuscatePortion` can do just that:

```
const obfuscator = obfuscatePortion({
  keepAtStart: 4,
  keepAtEnd: 4
});
const obfuscated = obfuscator("1234567890123456");
// obfuscated is "1234********3456"
```

However, if you attempt to use such an obfuscator on only a part of a credit card, you could end up leaking parts of the credit card that you wanted to obfuscate:

```
const incorrectlyObfuscated = obfuscator("12345678901234");
// incorrectlyObfuscated is "1234******1234" where "1234********34" would probably be preferred
```

To overcome this issue, it’s possible to combine obfuscators. The form is as follows:
* Specify the first obfuscator, and the input length to which it should be used.
* Specify any other obfuscators, and the input lengths to which they should be used. Note that each input length should be larger than the previous input length.
* Specify the obfuscator that will be used for the remainder.

For instance, for credit card numbers of exactly 16 characters, the above can also be written like this:

```
const obfuscator = obfuscateNone.untilLength(4)
  .then(obfuscateAll).untilLength(12)
  .then(obfuscateNone);
```

With this chaining, it’s now possible to keep the first and last 4 characters, but with at least 8 characters in between:

```
const obfuscator = obfuscateNone.untilLength(4)
  .then(obfuscatePortion({
    keepAtEnd: 4,
    atLeastFromStart: 8
  });
const obfuscated = obfuscator("12345678901234");
// obfuscated is "1234********34"
```

## Obfuscating object properties

Use `newPropertyObfuscator` to create a function that can obfuscate single object properties as well as recursively all properties in an object.

The simplest form provides an obfucator function for each property to obfuscate:

```
const propertyObfuscator = newPropertyObfuscator({
  password: obfuscateWithFixedLength(3)
});
const obfuscatedPassword = propertyObfuscator("password", "admin1234");
// obfuscatedPassword is "***"
const obfuscatedUsername = propertyObfuscator("username", "admin");
// obfuscatedUsername is "admin"
const obfuscatedObject = propertyObfuscator({
  username: "admin",
  password: "admin1234"
});
// obfuscatedObject is { username: "admin", password: "***" }
```

This matches property names case sensitively, and will obfuscate any nested object or array using their JSON string representation. This behaviour can be changed in two ways:

1. Per property. Instead of providing an obfuscator function, provide an object instead:
```
const propertyObfuscator = newPropertyObfuscator({
  password: {
    obfuscate: obfuscateWithFixedLength(3),
    caseSensitive: false // defaults to true
    matchObjects: false, // defaults to true
    matchArrays: false // defaults to true
  }
});
```
2. Using global options:
```
const propertyObfuscator = newPropertyObfuscator({
  password: obfuscateWithFixedLength(3)
}, {
  caseSensitive: false // defaults to true
  matchObjects: false, // defaults to true
  matchArrays: false // defaults to true
});
```

Finally, in all formats, it's possible to skip obfuscation by using `"ignore"` instead of an obfuscator function. This can be useful for skipping entire object trees.

## Obfuscating HTTP headers

Use `newHeaderObfuscator` to create a function that can obfuscate single HTTP headers (as strings and string arrays) and HTTP header objects. It's much like `newPropertyObfuscator`, but like HTTP headers it's always case sensitive. Unlike `newPropertyObfuscator`, it doesn't support nested objects, and for nested arrays each element is obfuscated separately. It also does not support skipping obfuscation.

```
const headerObfuscator = newHeaderObfuscator({
  Authorization: obfuscateWithFixedLength(3)
});
const obfuscatedAuthorization = headerObfuscator("authorization", "Bearer someToken");
// obfuscatedAuthorization is "***"
const obfuscatedAuthorizations = headerObfuscator("authorization", ["Bearer someToken"]);
// obfuscatedAuthorization is ["***]
const obfuscatedContentType = headerObfuscator("Content-Type", "application/json");
// obfuscatedContentType is "application/json"
const obfuscatedHeaders = headerObfuscator({
  authorization: "Bearer someToken",
  "content-type": "application/json"
});
// obfuscatedHeaders is { authorization: "***", "content-type": "application/json" }
```

`newHeaderObfuscator` is compatible with `http.OutgoingHttpHeaders` and `http.IncomingHttpHeaders`, which makes it useful for HTTP clients and Express applications.
