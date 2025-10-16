/**
 * @fileoverview plugin for fsd project
 * @author JuliaZ
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

// const requireIndex = require("requireindex");

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------


// import all rules in lib/rules
// module.exports.rules = requireIndex(__dirname + "/rules");
 // index.js
module.exports = {
    rules: {
        'path-checker': require('./rules/path-checker'),
        'public-api-imports': require('./rules/public-api-imports'),
        'layer-imports': require('./rules/layer-imports'),
    },
};



