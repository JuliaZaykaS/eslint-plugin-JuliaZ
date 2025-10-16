/**
 * @fileoverview feature sliced relative path checker
 * @author JuliaZ
 */
"use strict";

const path = require("path");
const {isPathRelative} = require("../helpers")


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
    // fixable: null, // Or `code` or `whitespace`
    fixable: 'code', // Or `code` or `whitespace`
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
        // const fromFilename = context.filename

        const fromFilename = context.getFilename()



        if (shouldBeRelative(fromFilename, importTo)) {
          context.report({
            node,
            messageId: 'relativePaths',
            fix: (fixer) => {
              // entities/Article/Article.tsx
              const normalizedPath = getNormalizedCurrentFilePath(fromFilename)
                .split('/')
                .slice(0, -1)
                .join('/')
              let relativePath = path.relative(normalizedPath, `/${importTo}`)
                .split('\\')
                .join('/')

              if (!relativePath.startsWith('.')) {
                relativePath = './' + relativePath
              }

              return fixer.replaceText(node.source, `'${relativePath}'`)

            }

          })
        }
      }
    };
  },
};


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

  const toArray = to.split("/")
  const toLayer = toArray[0] // entities
  const toSlice = toArray[1] // Article
  if (!toLayer || !toSlice || !layers[toLayer]) {



    return false
  }

  // example C:\Users\username\Documents\production-progect\src\entities\Article

  // const projectFrom = from.split("src")[1]
  const projectFrom = getNormalizedCurrentFilePath(from)

  // const fromArray = projectFrom.split(/\\|\//)
if (projectFrom) {

    const fromArray = projectFrom?.split('/')

    const fromLayer = fromArray[1] // entities
    const fromSlice = fromArray[2] // Article
    if (!fromLayer || !fromSlice || !layers[fromLayer]) { return false }


    return fromSlice === toSlice && toLayer === fromLayer
  }
}

function getNormalizedCurrentFilePath(currentFilePath) {

  const projectFrom = currentFilePath.split("src")[1]

  return projectFrom?.split("\\").join('/')

  // const fromArray = projectFrom.split(/\\|\//)
}

