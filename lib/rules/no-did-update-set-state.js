/**
 * @fileoverview Prevent usage of setState in componentDidUpdate
 * @author NKDuy
 */
'use strict';

var makeNoMethodSetStateRule = require('../util/makeNoMethodSetStateRule');

module.exports = makeNoMethodSetStateRule('componentDidUpdate');
