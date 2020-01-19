'use strict';

const BitmapFontGlyph = require('./BitmapFontGlyph.js');
const BipFont = require('./BipFont.js');
const assert = require('assert');

class BitmapFontStorage {
    constructor() {
        this._codeToGlyphMap = {};
    }

    setBitmaps(bitmapobj) {
        this._codeToGlyphMap = bitmapobj;
    }

    addGlyph(code, bitmapData, marginTop, width) {
        assert.strictEqual(code.constructor.name, 'Number');
        assert.strictEqual(bitmapData.constructor.name, 'Buffer');
        assert.strictEqual(marginTop.constructor.name, 'Number');
        assert.strictEqual(width.constructor.name, 'Number');

        this._codeToGlyphMap[code] = new BitmapFontGlyph(bitmapData, marginTop, width);
    }

    getGlyphAt(code) {
        assert(code.constructor.name, 'Number');

        return this._codeToGlyphMap[code];
    }

    getAllGlyphs() {
        return this._codeToGlyphMap;
    }

    buildBipFont() {
        return BipFont.packFile(this);
    }
}

module.exports = BitmapFontStorage;
