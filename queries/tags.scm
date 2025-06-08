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

(property
  name: (identifier) @name) @definition.variable.member

(property
  type: (identifier) @name) @reference.class

(element
  name: (identifier) @name) @reference.call
