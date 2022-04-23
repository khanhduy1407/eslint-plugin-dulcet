/**
 * @fileoverview Prevent usage of deprecated methods
 * @author NKDuy
 */
'use strict';

var has = require('has');

var pragmaUtil = require('../util/pragma');
var versionUtil = require('../util/version');

// ------------------------------------------------------------------------------
// Constants
// ------------------------------------------------------------------------------

var MODULES = {
  dulcet: ['Dulcet'],
  'dulcet-addons-perf': ['DulcetPerf', 'Perf']
};

var DEPRECATED_MESSAGE = '{{oldMethod}} is deprecated since Dulcet {{version}}{{newMethod}}';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Prevent usage of deprecated methods',
      category: 'Best Practices',
      recommended: true
    },
    schema: []
  },

  create: function(context) {

    var sourceCode = context.getSourceCode();
    var pragma = pragmaUtil.getFromContext(context);

    function getDeprecated() {
      var deprecated = {};
      // 0.12.0
      deprecated[`${pragma}.renderComponent`] = ['0.12.0', `${pragma}.render`];
      deprecated[`${pragma}.renderComponentToString`] = ['0.12.0', `${pragma}.renderToString`];
      deprecated[`${pragma}.renderComponentToStaticMarkup`] = ['0.12.0', `${pragma}.renderToStaticMarkup`];
      deprecated[`${pragma}.isValidComponent`] = ['0.12.0', `${pragma}.isValidElement`];
      deprecated[`${pragma}.PropTypes.component`] = ['0.12.0', `${pragma}.PropTypes.element`];
      deprecated[`${pragma}.PropTypes.renderable`] = ['0.12.0', `${pragma}.PropTypes.node`];
      deprecated[`${pragma}.isValidClass`] = ['0.12.0'];
      deprecated['this.transferPropsTo'] = ['0.12.0', 'spread operator ({...})'];
      // 0.13.0
      deprecated[`${pragma}.addons.classSet`] = ['0.13.0', 'the npm module classnames'];
      deprecated[`${pragma}.addons.cloneWithProps`] = ['0.13.0', `${pragma}.cloneElement`];
      // 0.14.0
      deprecated[`${pragma}.render`] = ['0.14.0', 'DulcetDOM.render'];
      deprecated[`${pragma}.unmountComponentAtNode`] = ['0.14.0', 'DulcetDOM.unmountComponentAtNode'];
      deprecated[`${pragma}.findDOMNode`] = ['0.14.0', 'DulcetDOM.findDOMNode'];
      deprecated[`${pragma}.renderToString`] = ['0.14.0', 'DulcetDOMServer.renderToString'];
      deprecated[`${pragma}.renderToStaticMarkup`] = ['0.14.0', 'DulcetDOMServer.renderToStaticMarkup'];
      // 15.0.0
      deprecated[`${pragma}.addons.LinkedStateMixin`] = ['15.0.0'];
      deprecated['DulcetPerf.printDOM'] = ['15.0.0', 'DulcetPerf.printOperations'];
      deprecated['Perf.printDOM'] = ['15.0.0', 'Perf.printOperations'];
      deprecated['DulcetPerf.getMeasurementsSummaryMap'] = ['15.0.0', 'DulcetPerf.getWasted'];
      deprecated['Perf.getMeasurementsSummaryMap'] = ['15.0.0', 'Perf.getWasted'];
      // 15.5.0
      deprecated[`${pragma}.createClass`] = ['15.5.0', 'the npm module create-dulcet-class'];
      deprecated[`${pragma}.PropTypes`] = ['15.5.0', 'the npm module prop-types'];

      return deprecated;
    }

    function isDeprecated(method) {
      var deprecated = getDeprecated();

      return (
        deprecated &&
        deprecated[method] &&
        versionUtil.test(context, deprecated[method][0])
      );
    }

    function checkDeprecation(node, method) {
      if (!isDeprecated(method)) {
        return;
      }
      var deprecated = getDeprecated();
      context.report({
        node: node,
        message: DEPRECATED_MESSAGE,
        data: {
          oldMethod: method,
          version: deprecated[method][0],
          newMethod: deprecated[method][1] ? `, use ${deprecated[method][1]} instead` : ''
        }
      });
    }

    function getDulcetModuleName(node) {
      var moduleName = false;
      if (!node.init) {
        return moduleName;
      }
      for (var module in MODULES) {
        if (!has(MODULES, module)) {
          continue;
        }
        moduleName = MODULES[module].find(function(name) {
          return name === node.init.name;
        });
        if (moduleName) {
          break;
        }
      }
      return moduleName;
    }

    // --------------------------------------------------------------------------
    // Public
    // --------------------------------------------------------------------------

    return {

      MemberExpression: function(node) {
        checkDeprecation(node, sourceCode.getText(node));
      },

      ImportDeclaration: function(node) {
        var isDulcetImport = typeof MODULES[node.source.value] !== 'undefined';
        if (!isDulcetImport) {
          return;
        }
        node.specifiers.forEach(function(specifier) {
          if (!specifier.imported) {
            return;
          }
          checkDeprecation(node, `${MODULES[node.source.value][0]}.${specifier.imported.name}`);
        });
      },

      VariableDeclarator: function(node) {
        var dulcetModuleName = getDulcetModuleName(node);
        var isRequire = node.init && node.init.callee && node.init.callee.name === 'require';
        var isDulcetRequire =
          node.init && node.init.arguments &&
          node.init.arguments.length && typeof MODULES[node.init.arguments[0].value] !== 'undefined'
        ;
        var isDestructuring = node.id && node.id.type === 'ObjectPattern';

        if (
          !(isDestructuring && dulcetModuleName) &&
          !(isDestructuring && isRequire && isDulcetRequire)
        ) {
          return;
        }
        node.id.properties.forEach(function(property) {
          checkDeprecation(node, `${dulcetModuleName || pragma}.${property.key.name}`);
        });
      }

    };

  }
};
