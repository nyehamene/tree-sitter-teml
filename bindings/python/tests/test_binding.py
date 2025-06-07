from unittest import TestCase

import tree_sitter
import tree_sitter_teml


class TestLanguage(TestCase):
    def test_can_load_grammar(self):
        try:
            tree_sitter.Language(tree_sitter_teml.language())
        except Exception:
            self.fail("Error loading Teml grammar")
