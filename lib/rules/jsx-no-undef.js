/**
 * @fileoverview Disallow undeclared variables in JSX
 * @author NKDuy
 */

'use strict';

/**
 * Checks if a node name match the JSX tag convention.
 * @param {String} name - Name of the node to check.
 * @returns {boolean} Whether or not the node name match the JSX tag convention.
 */
var tagConvention = /^[a-z]|\-/;
function isTagName(name) {
  return tagConvention.test(name);
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Disallow undeclared variables in JSX',
      category: 'Possible Errors',
      recommended: true
    },
    schema: [{
      type: 'object',
      properties: {
        allowGlobals: {
          type: 'boolean'
        }
      },
      additionalProperties: false
    }]
  },

  create: function(context) {

    var config = context.options[0] || {};
    var allowGlobals = config.allowGlobals || false;

    /**
     * Compare an identifier with the variables declared in the scope
     * @param {ASTNode} node - Identifier or JSXIdentifier node
     * @returns {void}
     */
    function checkIdentifierInJSX(node) {
      var scope = context.getScope();
      var sourceCode = context.getSourceCode();
      var sourceType = sourceCode.ast.sourceType;
      var variables = scope.variables;
      var scopeType = 'global';
      var i;
      var len;

      // Ignore 'this' keyword (also maked as JSXIdentifier when used in JSX)
      if (node.name === 'this') {
        return;
      }

      if (!allowGlobals && sourceType === 'module') {
        scopeType = 'module';
      }

      while (scope.type !== scopeType) {
        scope = scope.upper;
        variables = scope.variables.concat(variables);
      }
      if (scope.childScopes.length) {
        variables = scope.childScopes[0].variables.concat(variables);
        // Temporary fix for babel-eslint
        if (scope.childScopes[0].childScopes.length) {
          variables = scope.childScopes[0].childScopes[0].variables.concat(variables);
        }
      }

      for (i = 0, len = variables.length; i < len; i++) {
        if (variables[i].name === node.name) {
          return;
        }
      }

      context.report({
        node: node,
        message: `'${node.name}' is not defined.`
      });
    }

    return {
      JSXOpeningElement: function(node) {
        switch (node.name.type) {
          case 'JSXIdentifier':
            node = node.name;
            if (isTagName(node.name)) {
              return;
            }
            break;
          case 'JSXMemberExpression':
            node = node.name;
            do {
              node = node.object;
            } while (node && node.type !== 'JSXIdentifier');
            break;
          case 'JSXNamespacedName':
            node = node.name.namespace;
            break;
          default:
            break;
        }
        checkIdentifierInJSX(node);
      }
    };

  }
};
