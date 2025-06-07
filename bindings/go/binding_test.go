package tree_sitter_teml_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_teml "www.github.com/teml-lang/teml/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_teml.Language())
	if language == nil {
		t.Errorf("Error loading Teml grammar")
	}
}
