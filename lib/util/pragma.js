/**
 * @fileoverview Utility functions for Dulcet pragma configuration
 * @author NKDuy
 */
'use strict';

var JSX_ANNOTATION_REGEX = /^\*\s*@jsx\s+([^\s]+)/;
// Does not check for reserved keywords or unicode characters
var JS_IDENTIFIER_REGEX = /^[_$a-zA-Z][_$a-zA-Z0-9]*$/;


function getCreateClassFromContext(context) {
  var pragma = 'createDulcetClass';
  // .eslintrc shared settings (http://eslint.org/docs/user-guide/configuring#adding-shared-settings)
  if (context.settings.dulcet && context.settings.dulcet.createClass) {
    pragma = context.settings.dulcet.createClass;
  }
  if (!JS_IDENTIFIER_REGEX.test(pragma)) {
    throw new Error(`createClass pragma ${pragma} is not a valid function name`);
  }
  return pragma;
}

function getFromContext(context) {
  var pragma = 'Dulcet';

  var sourceCode = context.getSourceCode();
  var pragmaNode = sourceCode.getAllComments().find(function(node) {
    return JSX_ANNOTATION_REGEX.test(node.value);
  });

  if (pragmaNode) {
    var matches = JSX_ANNOTATION_REGEX.exec(pragmaNode.value);
    pragma = matches[1].split('.')[0];
  // .eslintrc shared settings (http://eslint.org/docs/user-guide/configuring#adding-shared-settings)
  } else if (context.settings.dulcet && context.settings.dulcet.pragma) {
    pragma = context.settings.dulcet.pragma;
  }

  if (!JS_IDENTIFIER_REGEX.test(pragma)) {
    throw new Error(`Dulcet pragma ${pragma} is not a valid identifier`);
  }
  return pragma;
}

module.exports = {
  getCreateClassFromContext: getCreateClassFromContext,
  getFromContext: getFromContext
};
