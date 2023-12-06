/**
 * @fileoverview check imports from public api
 * @author juliaz
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/public-api-imports"),
  RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 6, sourceType: "module" }
});

const aliasOptions = [
  {
    alias: "@",

  }
]
const testingOptions = [
  {
    alias: "@",
    testFilesPatterns: ["**/*.test.ts", "**/*.stories.*", "**/StoreDecorator.tsx"]

  }
]

ruleTester.run("public-api-imports", rule, {
  valid: [
    // give me some code that won't trigger a warning
    {
      code: "import { addNewCommentFormActions, addNewCommentFormReducer } from '../../model/slices/addNewCommentFormSlice'",
      errors: [],
      options: aliasOptions,
    },
    {
      code: "import { addNewCommentFormActions, addNewCommentFormReducer } from '@/entities/Article'",
      errors: [],
      options: aliasOptions,
    },
    {
      filename: 'C:\\Users\\username\\Documents\\production-progect\\src\\entities\\article.test.ts',
      code: "import { addNewCommentFormActions, addNewCommentFormReducer } from '@/entities/Article/testing'",
      errors: [],
      options: testingOptions,

    },
    {
      filename: 'C:\\Users\\username\\Documents\\production-progect\\src\\entities\\StoreDecorator.tsx',
      code: "import { addNewCommentFormActions, addNewCommentFormReducer } from '@/entities/Article/testing'",
      errors: [],
      options: testingOptions,

    },
  ],

  invalid: [
    {

      code: "import { addNewCommentFormActions, addNewCommentFormReducer } from '@/entities/Article/addNewCommentForm/model/slices/addNewCommentFormSlice'",
      errors: [{ message: "Абсолютный импорт разрешен только из Public API (index.ts)" }],
      options: aliasOptions,
    },
    {
      filename: 'C:\\Users\\username\\Documents\\production-progect\\src\\entities\\forbidden.ts',
      code: "import { addNewCommentFormActions, addNewCommentFormReducer } from '@/entities/Article/testing'",
      errors: [{message: "Тестовые файлы необходимо импортировать из publicApi/testing.ts"}],
      options: testingOptions,

    },
    {
      filename: 'C:\\Users\\username\\Documents\\production-progect\\src\\entities\\StoreDecorator.tsx',
      code: "import { addNewCommentFormActions, addNewCommentFormReducer } from '@/entities/Article/testing/file.tsx'",
      errors: [{message: "Абсолютный импорт разрешен только из Public API (index.ts)"}],
      options: testingOptions,

    },

  ],
});
