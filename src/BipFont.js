'use strict';

const BitmapFontStorage = require('./BitmapFontStorage.js');
const assert = require('assert');

class BipFont {
    static unpackFile(bin) {
        assert.strictEqual(bin.constructor.name, 'Buffer');

        const magic = bin.readUInt32BE(0);
        if (magic !== 0x4E455A4b) {
            throw new Error('Invalid magic');
        }

        const bitmapFontStorage = new BitmapFontStorage();
        const ranges = [];

        const rangesCnt = bin.readUInt16LE(0x20);

        for (let i = 0; i < rangesCnt; i++) {
            const elem = {
                start: bin.readUInt16LE(0x22 + i*6),
                end: bin.readUInt16LE(0x24 + i*6),
                seq: bin.readUInt16LE(0x26 + i*6),
            };

            ranges.push(elem);
        }

        let off = 0x22 + 0x06 * ranges.length;
        for (const elem of ranges) {
            for (let i = elem.start; i <= elem.end; i++) {
                const buf = bin.slice(off, off + 32);
                const marginTop = bin[off + 32] & 0x0F;
                const width = bin[off + 32] >> 4;
                off += 33;

                bitmapFontStorage.addGlyph(i, buf, marginTop, width);
            }
        }

        assert.strictEqual(bitmapFontStorage.constructor.name, 'BitmapFontStorage');
        return bitmapFontStorage;
    }

    static packFile(bitmapFontStorage) {
        assert.strictEqual(bitmapFontStorage.constructor.name, 'BitmapFontStorage');

        const glyphs = bitmapFontStorage.getAllGlyphs()
        const codepoints = Object.keys(glyphs).sort((a, b) => {
            const an = parseInt(a);
            const bn = parseInt(b);

            return an < bn ? -1 : (an > bn ? 1 : 0);
        }).map((x) => {
            return parseInt(x);
        });

        let header = Buffer.from('4E455A4B08FFFFFFFFFF01000000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF0000', 'hex');
        const body = Buffer.alloc(codepoints.length * 33);

        let blkstart = codepoints[0];
        let blkcnt = 0;
        let seqcnt = 0;
        let offset = 0;
        for (let i = 0; i < codepoints.length; i++) {
            const glyph = glyphs[codepoints[i]];

            if (glyph.getData().length != 32) {
                throw new Error('Invalid glyph binary');
            }

            const padding = (((glyph.getWidth() - 1) << 4) + (glyph.getMarginTop() & 0x0F)) & 0xFF;
            for (let j = 0; j < 32; j++) {
                body[offset * 33 + j] = glyph.getData()[j];
            }
            body[offset * 33 + 32] = padding;
            offset ++;

            if (codepoints[i + 1] == null || codepoints[i] + 1 !== codepoints[i + 1]) {
                // End of continuous block
                blkcnt ++;
                const blkEntry = Buffer.alloc(6);
                blkEntry.writeUInt16LE(blkstart, 0);
                blkEntry.writeUInt16LE(codepoints[i], 2);
                blkEntry.writeUInt16LE(seqcnt, 4);
                header = Buffer.concat([header, blkEntry]);
                seqcnt += codepoints[i] - blkstart + 1;
                blkstart = codepoints[i + 1] != null ? codepoints[i + 1] : -1;
            }
        }

        header.writeUInt16LE(blkcnt, 0x20);

        const retBuf = Buffer.concat([header, body]);

        assert.strictEqual(retBuf.constructor.name, 'Buffer');
        return retBuf;
    }
}

module.exports = BipFont;
