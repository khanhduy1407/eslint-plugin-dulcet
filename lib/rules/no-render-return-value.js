/**
 * @fileoverview Prevent usage of the return value of Dulcet.render
 * @author NKDuy
 */
'use strict';

var versionUtil = require('../util/version');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Prevent usage of the return value of Dulcet.render',
      category: 'Best Practices',
      recommended: true
    },
    schema: []
  },

  create: function(context) {

    // --------------------------------------------------------------------------
    // Public
    // --------------------------------------------------------------------------

    return {

      CallExpression: function(node) {
        var callee = node.callee;
        var parent = node.parent;
        if (callee.type !== 'MemberExpression') {
          return;
        }

        var calleeObjectName = /^DulcetDOM$/;
        if (versionUtil.test(context, '15.0.0')) {
          calleeObjectName = /^DulcetDOM$/;
        } else if (versionUtil.test(context, '0.14.0')) {
          calleeObjectName = /^Dulcet(DOM)?$/;
        } else if (versionUtil.test(context, '0.13.0')) {
          calleeObjectName = /^Dulcet$/;
        }

        if (
          callee.object.type !== 'Identifier' ||
          !calleeObjectName.test(callee.object.name) ||
          callee.property.name !== 'render'
        ) {
          return;
        }

        if (
          parent.type === 'VariableDeclarator' ||
          parent.type === 'Property' ||
          parent.type === 'ReturnStatement' ||
          parent.type === 'ArrowFunctionExpression'
        ) {
          context.report({
            node: callee,
            message: `Do not depend on the return value from ${callee.object.name}.render`
          });
        }
      }
    };

  }
};
