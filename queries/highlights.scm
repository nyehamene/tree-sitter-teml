[
  "package"
  "import"
  "using"
  "component"
  "document"
] @keyword

[
  "and"
  "or"
  "not"
] @keyword.operator

[
  ">"
  "<"
  "="
] @operator

[
  "true"
  "false"
] @constant.bool

[
  ":"
  ","
  "/"
] @punctuation.delimiter

[
  "("
  ")"
  "["
  "]"
  "{"
  "}"
] @punctuation.bracket

(comment) @comment.line

(string) @string

(number) @number

(package_declaration name: (identifier) @variable.package)

(import_declaration name: (identifier) @variable.package.import)

(attribute
  key: (identifier) @tag.attribute)

(property
  name: (identifier) @variable.member
  type: (identifier) @type)

(using_declaration
  name: (identifier) @variable
  from: (identifier) @variable.package.import)

(component_declaration
  name: (identifier) @type.definition)

(document_declaration
  name: (identifier) @type.definition)

((element tag: (identifier) @tag)
 (#is-not? @tag "component" "document"))
