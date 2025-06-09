/**
 * @file Templ is a language agnostic templating language
 * @author hnyehamene <nhcdeveloper@gmail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "teml",

  word: ($) => $.identifier,

  extras: ($) => [$.comment, /\s/],

  rules: {
    source_file: ($) =>
      seq(
        optional($.package_declaration),
        optional(seq($._imports, repeat($.using_declaration))),
        optional($.document_declaration),
        repeat($.component_declaration),
      ),

    comment: () => token(seq("//", /[^\n]*/)),

    identifier: () => /[a-zA-Z][a-zA-Z[0-9]-_]*/,

    _identifier_or_member_access: ($) => choice($.identifier, $.member_access),

    _string_quoted: () => token(seq('"', /[^"]*/, '"')),

    _string_line: () => token(seq("--", /[^\n]*/)),

    // TODO: support escape sequences are expression; may require external scanner
    string: ($) => choice($._string_quoted, $._string_line),

    number: () => choice("0", /[1-9][0-9]*/),

    bool: () => choice("true", "false"),

    _literal: ($) => choice($.string, $.number, $.bool),

    _primary_expression: ($) =>
      choice($._string_quoted, $.number, $.bool, $.identifier),

    _expression: ($) =>
      choice($._literal, $.identifier, $.member_access, $.call),

    operator: () => choice(">", "<", "=", "not", "and", "or"),

    package_declaration: ($) =>
      seq(
        "(",
        "package",
        field("name", $.identifier),
        field("path", alias($._string_quoted, $.string)),
        ")",
      ),

    import_declaration: ($) =>
      seq(
        "(",
        "import",
        field("name", $.identifier),
        field("path", alias($._string_quoted, $.string)),
        ")",
      ),

    _using_single: ($) => seq(field("name", $.identifier)),

    _using_multiple: ($) =>
      seq(
        "[",
        optional(
          repeat(
            seq(
              field("name", $.identifier),
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
        field("from", $.identifier),
        ")",
      ),

    document_declaration: ($) =>
      seq(
        "(",
        "document",
        optional(field("name", $.identifier)),
        $.properties,
        optional($.template),
        ")",
      ),

    component_declaration: ($) =>
      seq(
        "(",
        "component",
        field("name", $.identifier),
        $.properties,
        optional($.template),
        ")",
      ),

    properties: ($) => seq("[", repeat(seq($.property, optional(","))), "]"),

    property: ($) =>
      seq(
        field("name", $.identifier),
        ":",
        field("type", $._identifier_or_member_access),
      ),

    element: ($) =>
      seq(
        "(",
        field("tag", $._identifier_or_member_access),
        repeat(choice($.attributes, alias($._element_content, $.children))),
        ")",
      ),

    _element_content: ($) => prec.right(repeat1(choice($.string, $.element))),

    attributes: ($) =>
      seq(
        optional(field("directive", seq("#", $._identifier_or_member_access))),
        "{",
        optional(repeat1(seq($.attribute, optional(",")))),
        "}",
      ),

    attribute: ($) =>
      seq(field("key", $.identifier), ":", field("value", $._expression)),

    call: ($) =>
      seq(
        "(",
        field(
          "func",
          choice($.operator, $.member_access, $.identifier, $.call),
        ),
        repeat(seq($._expression, optional(","))),
        ")",
      ),

    member_access: ($) =>
      seq(
        field("object", $.identifier),
        token.immediate("/"),
        choice(field("member", $.identifier), $.member_access),
      ),

    template: ($) => repeat1(choice($.string, $.element)),

    _imports: ($) => repeat1($.import_declaration),
  },
});
