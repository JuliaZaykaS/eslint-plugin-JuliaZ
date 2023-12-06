/**
 * @fileoverview check imports from public api
 * @author JuliaZ
 */
"use strict";

const { isPathRelative } = require('../helpers');
const micromatch = require("micromatch")

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {

  meta: {

    // eslint-disable-next-line eslint-plugin/require-meta-type
    type: null, // `problem`, `suggestion`, or `layout`
    docs: {
      description: "check imports from public api",
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
          },
          testFilesPatterns: {
            type: "array",
          }
        }

      }
    ],
    messages: {
      absoluteImports: 'Абсолютный импорт разрешен только из Public API (index.ts)',
      testingFilesImports: "Тестовые файлы необходимо импортировать из publicApi/testing.ts",
    },
  },

  create(context) {
     // variables should be defined here
    // const { alias, testFilesPatterns } = context.options[0] && (context.options[0].alias || "")
    const { alias ="", testFilesPatterns=[] } = context.options[0] && (context.options[0] || {});

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    // any helper functions should go here or else delete this section

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

// перечисление слоев по fsd, чтобы отсечь импорты стилей и пакетов (кроме shared, т.к. там другая структура, без index.ts)
const avaliableLayers = {
  "entities": "entities",
  "features": "features",
  "pages": "pages",
  "widgets": "widgets",
}


    return {
      // visitor functions for different types of nodes
      ImportDeclaration(node) {
        // example entities/Article
        const value = node.source.value
        const importTo = alias ? value.replace(`${alias}/`, "") : value

        if (isPathRelative(importTo)) {
          return;
        }

        // [entities, articles, model, types]
        const segments = importTo.split("/")
        const layer = segments[0]

        if (!avaliableLayers[layer]) {
          return
        }

        const isImportNotFromPublicApi = segments.length > 2

        // [entities, articles,testing]

        const isTestingPublicApi = segments[2] === "testing" && segments.length < 4



        if (isImportNotFromPublicApi && !isTestingPublicApi) {
          context.report({
            node, messageId: 'absoluteImports',
          })
        }

        if (isTestingPublicApi) {
          const currentFilePath = context.getFilename()

          const isCurrentFileTesting = testFilesPatterns.some(pattern=> micromatch.isMatch(currentFilePath,pattern))

          if (!isCurrentFileTesting) {
             context.report({
            node, messageId: 'testingFilesImports',
          })
          }

        }
      }
    };
  },
};
