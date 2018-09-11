'use strict';

const bipFont = require('./bipfont.js');

class BitmapStorage {
    constructor() {
        this._bitmaps = {};
    }

    static fromBIPFont(buffer) {
        const fontmap = bipFont.unpackFile(buffer);
        const bms = new BitmapStorage();
        bms.setBitmaps(fontmap);

        return bms;
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

    buildBipFont() {
        return bipFont.packFile(this._bitmaps);
    }
}

module.exports = BitmapStorage;
