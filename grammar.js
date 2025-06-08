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
        optional($.package_declaration),
        optional(seq($._imports, repeat($.using_declaration))),
        optional($.document_declaration),
        repeat($.component_declaration),
      ),

    comment: () => token(seq("//", /[^\n]*/)),

    _identifier_simple: () => /[a-zA-Z][a-zA-Z[0-9]-_]*/,

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

    number: () => choice("0", /[1-9][0-9]*/),

    bool: () => choice("true", "false"),

    _literal: ($) => choice($.string, $.number, $.bool),

    _expression: ($) =>
      choice(
        $._literal,
        alias($._identifier_simple, $.identifier),
        $.property_access,
        $.call,
      ),

    operator: () => choice(">", "<", "=", "not", "and", "or"),

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
        optional($.template),
        ")",
      ),

    component_declaration: ($) =>
      seq(
        "(",
        "component",
        field("name", alias($._identifier_simple, $.identifier)),
        $.properties,
        optional($.template),
        ")",
      ),

    properties: ($) => seq("[", repeat(seq($.property, optional(","))), "]"),

    property: ($) =>
      seq(
        field("name", alias($._identifier_simple, $.identifier)),
        ":",
        field("type", $.identifier),
      ),

    element: ($) =>
      seq(
        "(",
        field("tag", $.identifier),
        repeat(choice($.attributes, alias($._element_content, $.children))),
        ")",
      ),

    _element_content: ($) => prec.right(repeat1(choice($.string, $.element))),

    attributes: ($) =>
      seq(
        optional(field("directive", seq("#", $.identifier))),
        "{",
        optional(repeat1(seq($.attribute, optional(",")))),
        "}",
      ),

    attribute: ($) =>
      seq(
        field("key", alias($._identifier_simple, $.identifier)),
        ":",
        field("value", $._expression),
      ),

    call: ($) =>
      seq(
        "(",
        field(
          "func",
          choice(
            $.operator,
            $.property_access,
            alias($._identifier_simple, $.identifier),
            $.call,
          ),
        ),
        repeat(seq($._expression, optional(","))),
        ")",
      ),

    property_access: ($) =>
      seq(
        field(
          "object",
          alias(
            repeat1(seq($._identifier_simple, token.immediate("."))),
            $.identifier,
          ),
        ),
        field("property", alias($._identifier_simple, $.identifier)),
      ),

    template: ($) => repeat1(choice($.string, $.element)),

    _imports: ($) => repeat1($.import_declaration),
  },
});
