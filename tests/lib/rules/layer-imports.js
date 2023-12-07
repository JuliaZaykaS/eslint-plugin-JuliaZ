/**
 * @fileoverview fix layer imports in fsd methodology
 * @author JuliaZ
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/layer-imports"),
  RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 6, sourceType: "module" }
});

const ignoreOptions = [
  {
    alias: "@",
    ignoreImportPatterns: ["**/StoreProvider"]

  }
]
ruleTester.run("layer-imports", rule, {
  valid: [
    {
      filename: 'C:\\Users\\username\\Documents\\production-progect\\src\\features\\Article',
      code: "import { addNewCommentFormActions, addNewCommentFormReducer } from '@/shared/Button.tsx'",
      errors: [],
      options: ignoreOptions,

    },
    {
      filename: 'C:\\Users\\username\\Documents\\production-progect\\src\\features\\Article',
      code: "import { addNewCommentFormActions, addNewCommentFormReducer } from '@/entities/Article'",
      errors: [],
      options: ignoreOptions,

    },
    {
      filename: 'C:\\Users\\username\\Documents\\production-progect\\src\\app\\providers',
      code: "import { addNewCommentFormActions, addNewCommentFormReducer } from '@/widgets/Article'",
      errors: [],
      options: ignoreOptions,

    },
    {
      filename: 'C:\\Users\\username\\Documents\\production-progect\\src\\widgets\\pages',
      code: "import { useLocation } from 'react-router-dom'",
      errors: [],
      options: ignoreOptions,

    },
    {
      filename: 'C:\\Users\\username\\Documents\\production-progect\\src\\app\\providers',
      code: "import { addNewCommentFormActions, addNewCommentFormReducer } from 'redux'",
      errors: [],
      options: ignoreOptions,

    },
    {
      filename: 'C:\\Users\\username\\Documents\\production-progect\\src\\index.tsx',
      code: "import { StoreProvider } from '@/app/providers/StoreProvider'",
      errors: [],
      options: ignoreOptions,

    },
    {
      filename: 'C:\\Users\\username\\Documents\\production-progect\\src\\entities\\Article.tsx',
      code: "import { StateSchema } from '@/app/providers/StoreProvider'",
      errors: [],
      options: ignoreOptions,

    },
  ],

  invalid: [
    {
      filename: 'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\entities\\providers',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/features/Articl'",
      errors: [{ message: "Слой может импортировать в себя только нижележащие слои (shared, entities, features, widgets, pages, app)"}],
      options: ignoreOptions,
    },
    {
      filename: 'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\features\\providers',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/widgets/Articl'",
      errors: [{ message: "Слой может импортировать в себя только нижележащие слои (shared, entities, features, widgets, pages, app)"}],
      options: ignoreOptions,
    },
    {
      filename: 'C:\\Users\\tim\\Desktop\\javascript\\production_project\\src\\entities\\providers',
      code: "import { addCommentFormActions, addCommentFormReducer } from '@/widgets/Articl'",
      errors: [{ message: "Слой может импортировать в себя только нижележащие слои (shared, entities, features, widgets, pages, app)"}],
      options: ignoreOptions,
    },
  ],
});
