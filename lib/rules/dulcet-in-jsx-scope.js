/**
 * @fileoverview Prevent missing Dulcet when using JSX
 * @author NKDuy
 */
'use strict';

var variableUtil = require('../util/variable');
var pragmaUtil = require('../util/pragma');

// -----------------------------------------------------------------------------
// Rule Definition
// -----------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Prevent missing Dulcet when using JSX',
      category: 'Possible Errors',
      recommended: true
    },
    schema: []
  },

  create: function(context) {

    var pragma = pragmaUtil.getFromContext(context);
    var NOT_DEFINED_MESSAGE = '\'{{name}}\' must be in scope when using JSX';

    return {

      JSXOpeningElement: function(node) {
        var variables = variableUtil.variablesInScope(context);
        if (variableUtil.findVariable(variables, pragma)) {
          return;
        }
        context.report({
          node: node,
          message: NOT_DEFINED_MESSAGE,
          data: {
            name: pragma
          }
        });
      }

    };

  }
};
