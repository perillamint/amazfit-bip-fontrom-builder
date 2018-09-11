'use strict';

const BipFont = require('./BipFont.js');

class BitmapFontStorage {
    constructor() {
        this._bitmaps = {};
    }

    static fromBipFont(buffer) {
        const fontmap = BipFont.unpackFile(buffer);
        const bfs = new BitmapFontStorage();
        bfs.setBitmaps(fontmap);

        return bfs;
    }

    setBitmaps(bitmapobj) {
        this._bitmaps = bitmapobj;
    }

    addGlyph(code, bitmap, margin_top, width) {
        this._bitmaps[code] = {
            data: bitmap,
            margin_top: margin_top,
            width: width,
        };
    }

    getGlyph(code) {
        return this._bitmaps[code];
    }

    buildBipFont() {
        return BipFont.packFile(this._bitmaps);
    }
}

module.exports = BitmapFontStorage;
