'use strict';

const FontRenderer = require('./fontrenderer.js');

// choLookup1, 2: Key is jungIdx
// jungLookup   : Key is choIdx
// jongLookup   : Key is jungIdx
// Idx               0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24
const choLookup1  = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 3, 1, 2, 4, 4, 4, 2, 1, 3, 0];
const choLookup2  = [0, 5, 5, 5, 5, 5, 5, 5, 5, 6, 7, 7, 7, 6, 6, 7, 7, 7, 6, 6, 7, 5];
const jungLookup1 = [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1];
const jungLookup2 = [0, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 3, 3, 3];
const jongLookup  = [0, 0, 2, 0, 2, 1, 2, 1, 2, 3, 0, 2, 1, 3, 3, 1, 2, 1, 3, 3, 1, 1];

class DKB844 extends FontRenderer {
    constructor(font, width, height) {
        super(width, height);

        this._fontbin = font;
        this._choSet = [];
        this._jungSet = [];
        this._jongSet = [];

        let off = 0;
        for(let i = 0; i < 8; i++) {
            this._choSet[i] = [];
            for (let j = 0; j < 20; j++) {
                this._choSet[i][j] = this._grabChar(off);
                off++;
            }
        }

        for(let i = 0; i < 4; i++) {
            this._jungSet[i] = [];
            for (let j = 0; j < 22; j++) {
                this._jungSet[i][j] = this._grabChar(off);
                off++;
            }
        }

        for (let i = 0; i < 4; i++) {
            this._jongSet[i] = [];
            for (let j = 0; j < 28; j++) {
                this._jongSet[i][j] = this._grabChar(off);
                off++;
            }
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

        let choIdx = 0;
        let jungIdx = 0;
        let jongIdx = 0;

        const buf = Buffer.alloc(characterByte);

        if (code >= 0x1100 && code <= 0x1112) {
            choIdx = code - 0x1100 + 1;
        } else if (code >= 0x1161 && code <= 0x1175) {
            jungIdx = code - 0x1161 + 1;
        } else if (code >= 0x11A8 && code <= 0x11C2) {
            jongIdx = code - 0x11A8 + 1;
        } else if (code >= 0x3131 && code <= 0x314E) {
            compatChoIdxLookup = [1, 2, 0, 3, 0, 0, 4, 5, 6, 0, 0, 0, 0 ,0, 0, 0, 7, 8, 9, 0, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
            choIdx = compatChoIdxLookup[code - 0x3131];
        } else if (code >= 0x314F && code <= 0x3163) {
            jungIdx = code - 0x314F + 1;
        } else if (code >= 0xAC00 && code <= 0xD7A3) {
            const nchr = code - 0xAC00;
            choIdx = Math.floor(nchr / (0x0015 * 0x001C)) + 1;
            jungIdx = Math.floor((nchr / 0x001C) % 0x0015) + 1;
            jongIdx = nchr % 0x001C;
        } else {
            throw new Error('Invalid character');
        }

        let choSet = this._choSet[0];
        let jungSet = this._jungSet[0];
        let jongSet = this._jongSet[0];

        if (choIdx !== 0 && jungIdx === 0 && jongIdx === 0) {
            choSet = this._choSet[1];
        } else if (choIdx === 0 && jungIdx !== 0 && jongIdx === 0) {
            jungSet = this._jungSet[0];
        } else if (choIdx === 0 && jungIdx === 0 && jongIdx === 0) {
            jongSet = this._jongSet[0];
        } else if (choIdx !== 0 && jungIdx !== 0 && jongIdx === 0) {
            choSet = this._choSet[choLookup1[jungIdx]];
            jungSet = this._jungSet[jungLookup1[choIdx]];
        } else if (choIdx !== 0 && jungIdx !== 0 && jongIdx !== 0) {
            choSet = this._choSet[choLookup2[jungIdx]];
            jungSet = this._jungSet[jungLookup2[choIdx]];
            jongSet = this._jongSet[jongLookup[jungIdx]];
        }

        const rowStep = byteWidth === 2 ? 1 : 2;
        for (let i = 0; i < characterByte; i++) {
            buf[i * rowStep] |= choSet[choIdx][i];
            buf[i * rowStep] |= jungSet[jungIdx][i];
            buf[i * rowStep] |= jongSet[jongIdx][i];
        }

        return buf;
    }
}

module.exports = DKB844;
