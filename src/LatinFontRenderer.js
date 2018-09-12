'use strict';

const FontRenderer = require('./FontRenderer.js');

class LatinFontRenderer extends FontRenderer {
    constructor(font, width, height) {
        super(width, height);

        this._fontbin = font;
        this._fonts = [];

        for (let i = 0; i < 0xFF; i++) {
            this._fonts[i] = this._grabChar(i);
        }
    }

    _grabChar(off) {
        const {width, height} = this.getDimension();
        const byteWidth = this.getByteWidth();
        const characterByte = byteWidth * height;

        return this._fontbin.slice(characterByte * off, characterByte * (off + 1));
    }

    renderChar(code) {
        const {width, height} = this.getDimension();
        const byteWidth = this.getByteWidth();
        const characterByte = byteWidth * height;

        const buf = Buffer.alloc(32);

        const rowStep = byteWidth === 2 ? 1 : 2;
        for (let i = 0; i < characterByte; i++) {
            buf[i * rowStep] |= this._fonts[code][i];
        }

        return buf;
    }
}

module.exports = LatinFontRenderer;
