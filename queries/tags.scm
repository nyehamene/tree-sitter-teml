(package_declaration
  name: (identifier) @name) @definition.package

(import_declaration
  name: (identifier) @name) @definition.package.import

(using_declaration
  name: (identifier) @name) @definition.variable

(using_declaration
  from: (identifier) @name) @reference.package.import

(component_declaration
  name: (identifier) @name) @definition.class

(document_declaration
  name: (identifier) @name) @definition.class

(template_expression
  (identifier) @name) @reference.variable

(member_access
  object: (identifier) @name) @reference.variable

(property
  name: (identifier) @name) @definition.variable.member

(property
  type: (identifier) @name) @reference.class

(property
  type: (member_access
    member: (identifier) @name)) @reference.class

(element
  tag: (identifier) @name) @reference.call

(element
  tag: (member_access
    object: (identifier) @name)) @reference.variable

(element
  tag: (member_access
    member: (identifier) @name)) @reference.call
