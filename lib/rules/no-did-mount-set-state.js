/**
 * @fileoverview Prevent usage of setState in componentDidMount
 * @author NKDuy
 */
'use strict';

var makeNoMethodSetStateRule = require('../util/makeNoMethodSetStateRule');

module.exports = makeNoMethodSetStateRule('componentDidMount');
