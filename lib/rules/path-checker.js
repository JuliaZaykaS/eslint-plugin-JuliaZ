/**
 * @fileoverview feature sliced relative path checker
 * @author JuliaZ
 */
"use strict";

// const path = require("path");


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
    schema: [ // Add a schema if the rule has options (чтобы пробрасывать разные алиасы прямо из проекта, н-р)

      {
        type: "object",
        properties: {
          alias: {
            type: "string",
          }
        }

      }
    ],

    messages: {
      relativePaths: 'В рамках одного слайса все пути должны быть относительными',
    },

  },

  create(context) {
    // variables should be defined here
    const alias = context.options[0] && (context.options[0].alias || "")

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
        const value = node.source.value
        const importTo = alias ? value.replace(`${alias}/`, "") : value
        // example C:\Users\username\Documents\production-progect\src\entities\Article
        const fromFilename = context.filename
        // console.log("🚀 ~ file: path-checker.js:53 ~ ImportDeclaration ~ context.filename:", context.filename())

        // console.log("🚀 ~ file: path-checker.js:55 ~ ImportDeclaration ~ context.physicalFilename:", context.physicalFilename)
        // const fromFilename = context.getFilename()
        // console.log("🚀 ~ file: path-checker.js:57 ~ ImportDeclaration ~ context.getFilename():", context.getFilename())
        // console.log("🚀 ~ file: path-checker.js:54 ~ ImportDeclaration ~ context:", context)
        // console.log("🚀 ~ file: path-checker.js:53 ~ ImportDeclaration ~ fromFilename:", fromFilename)


        if (shouldBeRelative(fromFilename, importTo)) {
          context.report({
            node, messageId: 'relativePaths',
          })
        }
      }
    };
  },
};

// проверяем, относительный ли путь
function isPathRelative(path) {
  // проверяем, с чего начинается путь, и если с этих знаков, то путь относительный
  return path === "." || path.startsWith("./") || path.startsWith("../");
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


  if (isPathRelative(to)) { return false }
  // example entities/Article
  // console.log(from, to);
  const toArray = to.split("/")
  // console.log(toArray);
  const toLayer = toArray[0] // entities
  const toSlice = toArray[1] // Article
  if (!toLayer || !toSlice || !layers[toLayer]) {
    // console.log("🚀 ~ file: path-checker.js:95 ~ shouldBeRelative ~ layers[toLayer]:", layers[toLayer])
    // console.log("🚀 ~ file: path-checker.js:93 ~ shouldBeRelative ~ toLayer:", toLayer)
    // console.log("🚀 ~ file: path-checker.js:95 ~ shouldBeRelative ~ toSlice:", toSlice)


    return false
  }
// console.log(2);
  // example C:\Users\username\Documents\production-progect\src\entities\Article
  // const normalizedPath = path.toNamespacedPath(from)
  // const projectFrom = normalizedPath.split("src")[1]
  // console.log("🚀 ~ file: path-checker.js:107 ~ shouldBeRelative ~ from:", from)
  const projectFrom = from.split("src")[1]
  // console.log(3);
  // const fromArray = projectFrom.split("\\")
  const fromArray = projectFrom.split(/\\|\//)

  const fromLayer = fromArray[1] // entities
  const fromSlice = fromArray[2] // Article
  if (!fromLayer || !fromSlice || !layers[fromLayer]) { return false }


  return fromSlice === toSlice && toLayer === fromLayer



}

