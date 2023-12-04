/**
 * @fileoverview feature sliced relative path checker
 * @author JuliaZ
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/path-checker"),
  RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
parserOptions: {ecmaVersion: 6, sourceType: "module"}
});
ruleTester.run("path-checker", rule, {
  valid: [
    // give me some code that won't trigger a warning
     {
      filename: 'C:\\Users\\username\\Documents\\production-progect\\src\\entities\\Article',
      code: "import { addNewCommentFormActions, addNewCommentFormReducer } from '../../model/slices/addNewCommentFormSlice'",
      errors: [{ message: "В рамках одного слайса все пути должны быть относительными" }],
    },
  ],

  invalid: [
    {
      filename: 'C:\\Users\\username\\Documents\\production-progect\\src\\entities\\Article',
      code: "import { addNewCommentFormActions, addNewCommentFormReducer } from '@/entities/Article/addNewCommentForm/model/slices/addNewCommentFormSlice'",
      errors: [{ message: "В рамках одного слайса все пути должны быть относительными" }],
      options: [{
        alias: "@"
      }]
    },
    {
      filename: 'C:\\Users\\username\\Documents\\production-progect\\src\\entities\\Article',
      code: "import { addNewCommentFormActions, addNewCommentFormReducer } from 'entities/Article/addNewCommentForm/model/slices/addNewCommentFormSlice'",
      errors: [{ message: "В рамках одного слайса все пути должны быть относительными" }],
    },
  ],
});
