/**
 * @file Templ is a language agnostic templating language
 * @author hnyehamene <nhcdeveloper@gmail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "teml",

  word: $ => $._identifier_simple,

  extras: $ => [$.comment, /\s/],

  rules: {
    source_file: $ => seq(
      // NOTE: package is optional for testing only
      optional($.package_declaration),
      optional(
        seq(
          $._imports,
        )
      ),
    ),

    comment: () => token(seq("//", /[^\n]*/)),

    _identifier_simple: () => /[a-zA-Z][a-zA-Z-_]*/,

    _identifier_qualified: $ => seq(
      $._identifier_simple,
      repeat1(
        seq(
          "/",
          $._identifier_simple
        )
      )
    ),

    identifier: $ => choice($._identifier_simple, $._identifier_qualified),

    // TODO: support escape sequences are expression; may require external scanner
    _string_quoted: () => token(seq("\"", /[^"]*/, "\"")),

    // TODO: support escape sequences are expression; may require external scanner
    _string_line: () => token(seq("--", /[^\n]*/)),

    string: $ => choice($._string_quoted, $._string_line),

    package_declaration: $ => seq(
      "(",
      "package",
      field("name", $.identifier),
      field("path", $.string),
      ")"
    ),

    import_declaration: $ => seq(
      "(",
      "import",
      field("name",$.identifier),
      field("path", $.string),
      ")"
    ),

    _imports: $ => repeat1($.import_declaration)
  }
});
