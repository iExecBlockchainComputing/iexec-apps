const {   override,   addBabelPlugin} = require("customize-cra");
module.exports = override(addBabelPlugin(["@babel/plugin-proposal-optional-chaining", { "loose": false }]),   
                          addBabelPlugin(["@babel/plugin-proposal-nullish-coalescing-operator", { "loose": false }]),   
                          addBabelPlugin(["@babel/plugin-syntax-dynamic-import", { "loose": false }]),   
                          addBabelPlugin(["@babel/plugin-syntax-bigint", { "loose": false }]));
