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

(template_expression
  "\\" @punctuation.special)

(template_expression
  (number) @number)

(template_expression
  (identifier) @variable)

(call argument: (identifier) @variable)

(call function: (identifier) @function)

(member_access
  "/" @punctuation.delimiter)

(package_declaration name: (identifier) @variable.package)

(import_declaration name: (identifier) @variable.package.import)

(attribute
  key: (identifier) @tag.attribute)

(attribute
  value: (identifier) @variable)

(property
  name: (identifier) @variable.parameter)

(property
  type: (identifier) @type)

(property
  type: (member_access
    member: (identifier) @type))

(property
  type: (member_access
    object: (identifier) @variable))

(using_declaration
  name: (identifier) @variable
  from: (identifier) @variable.package.import)

(component_declaration
  name: (identifier) @type.definition)

(document_declaration
  name: (identifier) @type.definition)

(element tag: (identifier) @function)

(element
  tag: (member_access
    object: (identifier) @variable))

(element
  tag: (member_access
    member: (identifier) @function))
