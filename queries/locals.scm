(program) @local.scope
(component_declaration) @local.scope
(document_declaration) @local.scope

(package_declaration
	name: (identifier) @local.definition)

(import_declaration
	name: (identifier) @local.definition)

(using_declaration
	name: (identifier) @local.definition
	from: (identifier) @local.reference)

(component_declaration
	name: (identifier) @local.definition)

(document_declaration
	name: (identifier) @local.definition)

(property
	name: (identifier) @local.definition
	type: (identifier) @local.reference)

(attribute
	value: (identifier) @local.reference)

(element
	tag: (identifier) @local.reference)

(template_expression
	(identifier) @local.reference)

(conditional
	target: (identifier) @local.reference)

(if_expression
	condition: (identifier) @local.reference)
