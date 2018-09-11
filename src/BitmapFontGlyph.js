'use strict';

const assert = require('assert');

class BitmapFontGlyph {
    constructor(data, marginTop, width) {
        assert.equal(data.constructor.name, 'Buffer');
        assert.equal(marginTop.constructor.name, 'Number');
        assert.equal(marginTop | 0, marginTop);
        assert.equal(width.constructor.name, 'Number');
        assert.equal(width | 0, width);

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
