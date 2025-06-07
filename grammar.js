/**
 * @file Templ is a language agnostic templating language
 * @author hnyehamene <nhcdeveloper@gmail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "teml",

  word: ($) => $._identifier_simple,

  extras: ($) => [$.comment, /\s/],

  rules: {
    source_file: ($) =>
      seq(
        // NOTE: package is optional for testing only
        optional($.package_declaration),
        optional(seq($._imports, repeat($.using_declaration))),
        optional(repeat($.component_declaration)),
        optional($.document_declaration),
      ),

    comment: () => token(seq("//", /[^\n]*/)),

    _identifier_simple: () => /[a-zA-Z][a-zA-Z-_]*/,

    _identifier_qualified: ($) =>
      seq(
        $._identifier_simple,
        repeat1(seq(token.immediate("/"), $._identifier_simple)),
      ),

    identifier: ($) =>
      choice(
        alias($._identifier_simple, "simple"),
        alias($._identifier_qualified, "qualified"),
      ),

    // TODO: support escape sequences are expression; may require external scanner
    _string_quoted: () => token(seq('"', /[^"]*/, '"')),

    // TODO: support escape sequences are expression; may require external scanner
    _string_line: () => token(seq("--", /[^\n]*/)),

    string: ($) => choice($._string_quoted, $._string_line),

    package_declaration: ($) =>
      seq(
        "(",
        "package",
        field("name", alias($._identifier_simple, $.identifier)),
        field("path", alias($._string_quoted, $.string)),
        ")",
      ),

    import_declaration: ($) =>
      seq(
        "(",
        "import",
        field("name", alias($._identifier_simple, $.identifier)),
        field("path", alias($._string_quoted, $.string)),
        ")",
      ),

    _using_single: ($) =>
      seq(field("name", alias($._identifier_simple, $.identifier))),

    _using_multiple: ($) =>
      seq(
        "[",
        optional(
          repeat(
            seq(
              field("name", alias($._identifier_simple, $.identifier)),
              optional(","), // allow trailing comma
            ),
          ),
        ),
        "]",
      ),

    using_declaration: ($) =>
      seq(
        "(",
        "using",
        choice($._using_single, $._using_multiple),
        field("from", alias($._identifier_simple, $.identifier)),
        ")",
      ),

    document_declaration: ($) =>
      seq(
        "(",
        "document",
        optional(field("name", alias($._identifier_simple, $.identifier))),
        $.properties,
        ")",
      ),

    component_declaration: ($) =>
      seq(
        "(",
        "component",
        field("name", alias($._identifier_simple, $.identifier)),
        $.properties,
        ")",
      ),

    properties: ($) => seq("[", repeat(seq($.property, optional(","))), "]"),

    property: ($) =>
      seq(
        field("name", alias($._identifier_simple, $.identifier)),
        ":",
        field("type", $.identifier),
      ),

    _imports: ($) => repeat1($.import_declaration),
  },
});
