/**
 * @fileoverview feature sliced relative path checker
 * @author JuliaZ
 */
"use strict";

const path = require("path");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    // eslint-disable-next-line eslint-plugin/require-meta-type
    type: null, // `problem`, `suggestion`, or `layout`
    docs: {
      description: "feature sliced relative path checker",
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: null, // Or `code` or `whitespace`
    schema: [], // Add a schema if the rule has options

    messages: {
      relativePaths: 'В рамках одного слайса все пути должны быть относительными',
    },

  },

  create(context) {
    // variables should be defined here

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    // any helper functions should go here or else delete this section

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      // visitor functions for different types of nodes
      ImportDeclaration(node) {
        // example entities/Article
        const importTo = node.source.value
        // example C:\Users\username\Documents\production-progect\src\entities\Article
        const fromFilename = context.filename

        if (shouldBeRelative(fromFilename, importTo)) {
          context.report({ node,           messageId: 'relativePaths',
})
        }
}
    };
  },
};

// проверяем, относительный ли путь
function isPathRelative(path) {
  // проверяем, с чего начинается путь, и если с этих знаков, то путь относительный
return path === "." || path.startWith("./") || path.startWith("../");
}

// перечисление слоев по fsd, чтобы отсечь импорты стилей и пакетов
const layers = {
  "entities": "entities",
  "features": "features",
  "shared": "shared",
  "pages": "pages",
  "widgets": "widgets",
}


// проверяем, должен ли путь быть относительным
// from -путь к файлу, где мы находимся сейчас
// to - путь, который мы проверяем
function shouldBeRelative(from, to) {
if(isPathRelative(to)){ return false}
          // example entities/Article
  const toArray = to.split("/")
  const toLayer = toArray[0] // entities
  const toSlice = toArray[1] // Article
  if (!toLayer || !toSlice || !layers[toLayer]) { return false }

  // example C:\Users\username\Documents\production-progect\src\entities\Article
  const normalizedPath = path.toNamespacedPath(from)
  const projectFrom = normalizedPath.split("src")[1]
  const fromArray = projectFrom.split("\\")
  const fromLayer = fromArray[0] // entities
  const fromSlice = fromArray[1] // Article
  if (!fromLayer || !fromSlice || !layers[fromLayer]) { return false }


return fromSlice === toSlice && toLayer === fromLayer



}