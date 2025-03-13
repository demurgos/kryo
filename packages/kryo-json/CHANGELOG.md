# Next

- **[Breaking change]** Update to `kryo@0.16`.
- **[Breaking change]** Require `Date` values provided as strings to match the complete ISO format.
- **[Fix]** Reject empty array when a record is expected.
- **[Internal]** Fix multiple invalid test cases.
- **[Internal]** Refactor code to be compatible with `erasableSyntaxOnly` TS option.
- **[Internal]** Switch to built-in Node testing framework.
- **[Internal]** Replace `private` TypeScript visibility modifier with JavaScript `#` private fields.

# 0.15.1 (2024-01-24)

- **[Fix]** Update dependencies

# 0.15.0 (2024-01-22)

- Drop `unorm`, `incident`, `object-inspect` errors
- `CodePointString` renamed to `UsvString`
  - `enforceUnicodeRegExp` for opt-out replaced by `allowUcs2String` for opt-in
  - `normalization` defaults to `null` (instead of `NFC`)
- `WhiteListType` renamed to `LiteralUnion`

# 0.14.2 (2023-12-10)

- **[Fix]** Update dependencies

# 0.14.1 (2023-12-09)

- **[Fix]** Update dependencies

# 0.14.0 (2022-05-07)

- **[Breaking change]** Compile to `.mjs`.
- **[Fix]** Update dependencies.

# 0.13.0 (2021-07-20)

- **[Breaking change]** Drop `lib` prefix from deep imports.

# 0.12.2 (2021-06-29)

- **[Fix]** Update to `kryo@0.12.2` with support for more `Ord` implementations.

# 0.12.0 (2021-06-28)

- **[Fix]** Update dependencies.

# 0.11.2 (2020-12-28)

- **[Fix]** Include sources in package.

# 0.11.0 (2020-06-01)

- **[Breaking change]** Require Node 14.

# 0.10.2 (2020-05-02)

- **[Fix]** Fix publication.

# 0.10.1 (2020-04-23)

- **[Feature]** Add `JSON_VALUE_WRITER` and `JSON_VALUE_READER` builtins.

# 0.10.0 (2020-04-10)

- **[Feature]** First release.
