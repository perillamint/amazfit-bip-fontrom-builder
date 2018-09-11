'use strict';

const assert = require('assert');

class FontRenderer {
    constructor(width, height) {
        assert.equal(width.constructor.name, 'Number')
        assert.equal(width | 0, width)
        assert.equal(height.constructor.name, 'Number')
        assert.equal(height | 0, height)

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
