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
parserOptions: {ecmaVersion: 6, sourceType: "module"}
});

const aliasOptions = [
  {
    alias: "@"
  }
]

ruleTester.run("public-api-imports", rule, {
valid: [
    // give me some code that won't trigger a warning
     {
      code: "import { addNewCommentFormActions, addNewCommentFormReducer } from '../../model/slices/addNewCommentFormSlice'",
      errors: [],
    },
     {
      code: "import { addNewCommentFormActions, addNewCommentFormReducer } from '@/entities/Article'",
       errors: [],
      options: aliasOptions,
    },
  ],

  invalid: [
    {

      code: "import { addNewCommentFormActions, addNewCommentFormReducer } from '@/entities/Article/addNewCommentForm/model/slices/addNewCommentFormSlice'",
      errors: [{ message: "Абсолютный импорт разрешен только из Public API (index.ts)" }],
      options:aliasOptions,
    },

  ],
});
