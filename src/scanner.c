#include "tree_sitter/parser.h"

typedef enum { QUOTED_STRING_CONTENT, LINE_STRING_CONTENT, IGNORED } TokenType;

void *tree_sitter_teml_external_scanner_create() { return NULL; }

void tree_sitter_teml_external_scanner_destroy(void *payload) {}

unsigned tree_sitter_teml_external_scanner_serialize(void *payload,
                                                     char *buffer) {
  return 0;
}

void tree_sitter_teml_external_scanner_deserialize(void *payload,
                                                   const char *buffer,
                                                   unsigned length) {}

static bool scan_string_content(void *payload, TSLexer *lexer,
                                const bool *valid_symbols);

bool tree_sitter_teml_external_scanner_scan(void *payload, TSLexer *lexer,
                                            const bool *valid_symbols) {
  // allow the lexer to continue error recovery
  if (valid_symbols[IGNORED]) {
    return false;
  }

  bool is_string = valid_symbols[LINE_STRING_CONTENT] ||
                   valid_symbols[QUOTED_STRING_CONTENT];

  if (is_string) {
    return scan_string_content(payload, lexer, valid_symbols);
  }
  return false;
}

static void advance(TSLexer *lexer) { lexer->advance(lexer, false); }

static void skip(TSLexer *lexer) { lexer->advance(lexer, true); }

static bool scan_string_content(void *payload, TSLexer *lexer,
                                const bool *valid_symbols) {
  // is the lexer scanning a line string content
  bool is_line = valid_symbols[LINE_STRING_CONTENT];

  if (is_line) {
    lexer->result_symbol = LINE_STRING_CONTENT;
  } else {
    lexer->result_symbol = QUOTED_STRING_CONTENT;
  }

  // otherwise the lexer is scanning a quoted string content
  bool is_quoted = !is_line;

  for (bool has_content = false;; has_content = true) {

    lexer->mark_end(lexer);

    if (lexer->eof(lexer)) {
      //
      // unbalanced "
      // the scanner reached the end of file before the closing "
      //
      if (is_quoted) {
        return false;
      }
      return has_content;
    }

    switch (lexer->lookahead) {
    case '"':
      if (is_quoted) {
        return has_content;
      }
      break;
    case '\n':
      if (is_line) {
        return has_content;
      }
      //
      // if scanning a quoted string content this means there is
      // unbalanced "
      //
      return false;
    case '\\':
      // check if the next token is a template_expression
      advance(lexer);
      if (lexer->lookahead == '(') {
        return has_content;
      }
      // escape
      if (lexer->lookahead == '\\') {
        skip(lexer);
      }
      break;
    default:
      advance(lexer);
    }
  }
}
