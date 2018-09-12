'use strict';

const assert = require('assert');

class FontRenderer {
    constructor(width, height) {
        assert.strictEqual(width.constructor.name, 'Number');
        assert.strictEqual(width | 0, width);
        assert.strictEqual(height.constructor.name, 'Number');
        assert.strictEqual(height | 0, height);

        this._width = width;
        this._height = height;
    }

    getDimension() {
        return {
            width: this._width,
            height: this._height,
        };
    }

    getByteWidth() {
        return Math.floor((this._width + 7) / 8);
    }
}

module.exports = FontRenderer;
