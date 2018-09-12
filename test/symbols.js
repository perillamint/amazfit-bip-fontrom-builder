'use strict';
/* eslint-env: node mocha */
const assert = require('assert');
const entryPoint = require('../src/index.js');

describe('EntryPoint', () => {
    it('should have init method', () => {
        assert.ok(typeof entryPoint.init === 'function');
    });

    it('should have updateFonts method', () => {
        assert.ok(typeof entryPoint.updateFonts === 'function');
    });

    it('should have drawText method', () => {
        assert.ok(typeof entryPoint.drawText === 'function');
    });

    it('should have buildROM method', () => {
        assert.ok(typeof entryPoint.buildROM === 'function');
    });

    it('should have loadROM method', () => {
        assert.ok(typeof entryPoint.loadROM === 'function');
    });
});
