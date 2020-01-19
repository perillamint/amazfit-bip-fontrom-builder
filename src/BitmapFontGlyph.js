'use strict';

const assert = require('assert');

class BitmapFontGlyph {
    constructor(data, marginTop, width) {
        assert.strictEqual(data.constructor.name, 'Buffer');
        assert.strictEqual(marginTop.constructor.name, 'Number');
        assert.strictEqual(marginTop | 0, marginTop);
        assert.strictEqual(width.constructor.name, 'Number');
        assert.strictEqual(width | 0, width);

        this._data = data;
        this._marginTop = marginTop;
        this._width = width;
    }

    getData() {
        return this._data;
    }

    getMarginTop() {
        return this._marginTop;
    }

    getWidth() {
        return this._width;
    }
}

module.exports = BitmapFontGlyph;
