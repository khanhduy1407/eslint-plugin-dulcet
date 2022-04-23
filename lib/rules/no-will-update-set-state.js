/**
 * @fileoverview Prevent usage of setState in componentWillUpdate
 * @author NKDuy
 */
'use strict';

var makeNoMethodSetStateRule = require('../util/makeNoMethodSetStateRule');

module.exports = makeNoMethodSetStateRule('componentWillUpdate');
