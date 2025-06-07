import XCTest
import SwiftTreeSitter
import TreeSitterTeml

final class TreeSitterTemlTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_teml())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Teml grammar")
    }
}
