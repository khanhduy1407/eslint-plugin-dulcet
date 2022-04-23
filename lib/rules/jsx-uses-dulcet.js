/**
 * @fileoverview Prevent Dulcet to be marked as unused
 * @author NKDuy
 */
'use strict';

var pragmaUtil = require('../util/pragma');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Prevent Dulcet to be marked as unused',
      category: 'Best Practices',
      recommended: true
    },
    schema: []
  },

  create: function(context) {

    var pragma = pragmaUtil.getFromContext(context);

    // --------------------------------------------------------------------------
    // Public
    // --------------------------------------------------------------------------

    return {

      JSXOpeningElement: function() {
        context.markVariableAsUsed(pragma);
      }

    };

  }
};
