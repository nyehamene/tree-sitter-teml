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

  externals: ($) => [
    $._quoted_string_content,
    $._line_string_content,

    //
    // to be used by the external scannar only
    //
    $._ignored,
  ],

  rules: {
    source_file: ($) =>
      seq(
        optional($.package_declaration),
        optional(seq($._imports, repeat($.using_declaration))),
        repeat(choice($.document_declaration, $.component_declaration)),
      ),

    comment: () => token(seq(";", /[^\n]*/)),

    identifier: () => /[a-zA-Z][a-zA-Z[0-9]-_]*/,

    _identifier_or_member_access: ($) => choice($.identifier, $.member_access),

    _quoted_string_content: () => /[^"\n]/,

    _string_quoted: ($) =>
      seq(
        '"',
        repeat(choice($._quoted_string_content, $.template_expression)),
        '"',
      ),

    _string_line: ($) =>
      prec.left(
        seq(
          "--",
          repeat(choice($._line_string_content, $.template_expression)),
          optional("\n"),
        ),
      ),

    // TODO: support escape sequences are expression; may require external scanner
    string: ($) => choice($._string_quoted, $._string_line),

    number: () => choice("0", /[1-9][0-9]*/),

    bool: () => choice("true", "false"),

    _literal: ($) =>
      choice(alias($._string_quoted, $.string), $.number, $.bool),

    _primary_expression: ($) => choice($._literal, $.identifier),

    template_expression: ($) =>
      seq(
        "\\",
        token.immediate("("),
        choice($._primary_expression, $.if_expression, $.conditional),
        ")",
      ),

    member_access: ($) =>
      seq(
        field("object", $._identifier_or_member_access),
        token.immediate("/"),
        field("member", $.identifier),
      ),

    if_expression: ($) =>
      seq(
        "(",
        "if",
        field("condition", choice($.identifier, $.bool)),
        field("then", $._expression),
        optional(field("else", $._expression)),
        ")",
      ),

    conditional: ($) =>
      seq(
        "(",
        "cond",
        field("target", $.identifier),
        repeat(seq(alias($._conditional_option, $.option), optional(","))),
        ")",
      ),

    _conditional_option: ($) =>
      seq(
        field("constant", choice($._literal)),
        ":",
        field("value", $._expression),
      ),

    _expression: ($) =>
      choice(
        $._primary_expression,
        $.member_access,
        $.if_expression,
        $.conditional,
      ),

    _type: ($) => choice($._identifier_or_member_access, $.enum),

    enum: ($) =>
      seq(
        "(",
        "enum",
        repeat(field("constant", choice($.string, $.number))),
        ")",
      ),

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
      seq(field("name", $.identifier), ":", field("type", $._type)),

    element: ($) =>
      seq(
        "(",
        field("tag", $._identifier_or_member_access),
        alias(repeat(choice($.attributes, $._element_content)), $.children),
        ")",
      ),

    _element_content: ($) => prec.right(choice($.string, $.element)),

    attributes: ($) =>
      seq(
        optional(field("directive", seq("#", $._identifier_or_member_access))),
        "{",
        optional(repeat1(seq($.attribute, optional(",")))),
        "}",
      ),

    attribute: ($) =>
      seq(field("key", $.identifier), ":", field("value", $._expression)),

    template: ($) =>
      repeat1(
        choice(
          $.string,
          $.element,
          alias($._conditional_element, $.conditional),
          alias($._if_expression_element, $.if_expression),
        ),
      ),

    _if_expression_element: ($) =>
      seq(
        "(",
        "if",
        field("condition", choice($.identifier, $.bool)),
        field("then", choice($.string, $.element)),
        optional(field("else", choice($.string, $.element))),
        ")",
      ),

    _conditional_element: ($) =>
      seq(
        "(",
        "cond",
        field("target", $.identifier),
        repeat(
          seq(alias($._conditional_element_option, $.option), optional(",")),
        ),
        ")",
      ),

    _conditional_element_option: ($) =>
      seq(
        field("constant", choice($._literal)),
        ":",
        field("value", choice($.string, $.element)),
      ),

    _imports: ($) => repeat1($.import_declaration),
  },
});
