/**
 * @fileoverview fix layer imports in fsd methodology
 * @author JuliaZ
 */
"use strict";

const path = require("path");
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
      description: "fix layer imports in fsd methodology",
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
          ignoreImportPatterns: {
            type: "array",
          }
        }

      }
    ],
    messages: {
      ignoreImportPatterns: "Слой может импортировать в себя только нижележащие слои (shared, entities, features, widgets, pages, app)",
    },
  },

  create(context) {
    // variables should be defined here

    // объект с слоями, в которых могут использоваться импорты из других слоев
    const layers = {
      "app": ["pages", "widgets", "features", "shared", "entities"],
      "pages": ["widgets", "features", "shared", "entities"],
      "widgets": ["features", "shared", "entities"],
      "features": ["shared", "entities"],
      "entities": ["shared", "entities"],
      "shared": ["shared"],
    }

    // перечисление слоев по fsd
    const avaliableLayers = {
      "app": "app",
      "entities": "entities",
      "features": "features",
      "pages": "pages",
      "widgets": "widgets",
      "shared": "shared",
    }



    const { alias = "", ignoreImportPatterns = [] } = context.options[0] && (context.options[0] || {});

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    // any helper functions should go here or else delete this section
    const getCurrentFileLayer = () => {
      const currentFilePath = context.getFilename()
      const normalizedPath = path.toNamespacedPath(currentFilePath)
      const projectPath = normalizedPath && normalizedPath.split("src")[1]
      const segments = projectPath && projectPath.split("\\")
      return segments && segments[1]
    }

    const getImportLayer = (value) => {
      const importPath = alias ? value.replace(`${alias}/`, "") : value
      const segments = importPath.split("/")
      return segments && segments[0]

    }

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------




    return {
      // visitor functions for different types of nodes
      ImportDeclaration(node) {
        // example entities/Article
        const importPath = node.source.value
        const currentFileLayer = getCurrentFileLayer()
        const importLayer = getImportLayer(importPath)

        // если путь относительный, то выходим
        if (isPathRelative(importPath)) {
          return;
        }

        // проверка на наши пути (не импорт библиотек)
        if (!avaliableLayers[importLayer] || !avaliableLayers[currentFileLayer]) {
          return
        }

        const isIgnored = ignoreImportPatterns.some(pattern => { return micromatch.isMatch(importPath, pattern) })

        // находится ли путь в списке исключений
        if (isIgnored) {
          return
        }


          if (layers[currentFileLayer] && !layers[currentFileLayer].includes(importLayer)) {
            context.report({
              node, messageId: 'ignoreImportPatterns',
            })
          }


      }
    };
  },
};
