/**
 * @fileoverview Prevent using string literals in Dulcet component definition
 * @author NKDuy
 */
'use strict';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Prevent using string literals in Dulcet component definition',
      category: 'Stylistic Issues',
      recommended: false
    },

    schema: [{
      type: 'object',
      properties: {},
      additionalProperties: false
    }]
  },

  create: function(context) {

    function reportLiteralNode(node) {
      context.report({
        node: node,
        message: 'Missing JSX expression container around literal string'
      });
    }

    // --------------------------------------------------------------------------
    // Public
    // --------------------------------------------------------------------------

    return {

      Literal: function(node) {
        if (
          !/^[\s]+$/.test(node.value) &&
          node.parent &&
          node.parent.type !== 'JSXExpressionContainer' &&
          node.parent.type !== 'JSXAttribute' &&
          node.parent.type.indexOf('JSX') !== -1
        ) {
          reportLiteralNode(node);
        }
      }

    };

  }
};
