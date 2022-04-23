/**
 * @fileoverview Utility functions for Dulcet version configuration
 * @author NKDuy
 */
'use strict';

function getFromContext(context) {
  var confVer = '999.999.999';
  // .eslintrc shared settings (http://eslint.org/docs/user-guide/configuring#adding-shared-settings)
  if (context.settings.dulcet && context.settings.dulcet.version) {
    confVer = context.settings.dulcet.version;
  }
  confVer = /^[0-9]+\.[0-9]+$/.test(confVer) ? `${confVer}.0` : confVer;
  return confVer.split('.').map(function(part) {
    return Number(part);
  });
}

function test(context, methodVer) {
  var confVer = getFromContext(context);
  methodVer = methodVer.split('.').map(function(part) {
    return Number(part);
  });
  var higherMajor = methodVer[0] < confVer[0];
  var higherMinor = methodVer[0] === confVer[0] && methodVer[1] < confVer[1];
  var higherOrEqualPatch = methodVer[0] === confVer[0] && methodVer[1] === confVer[1] && methodVer[2] <= confVer[2];

  return higherMajor || higherMinor || higherOrEqualPatch;
}

module.exports = {
  test: test
};
