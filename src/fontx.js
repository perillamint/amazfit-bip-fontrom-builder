'use strict';

const FontRenderer = require('./fontrenderer.js');
const iconv = require('iconv-lite');

class FontXRenderer extends FontRenderer {
    constructor(font) {
        if (font.slice(0x00, 0x06).toString('UTF-8') !== 'FONTX2') {
            throw new Error('Invalid magic!');
        }

        let width = font.slice(0x0E, 0x0F)[0];
        let height = font.slice(0x0F, 0x10)[0];
        super(width, height);

        this._fontbin = font;

        const header = {};
        header.fontname = font.slice(0x06, 0x0E).toString('UTF-8');
        header.flag = font.slice(0x10, 0x11)[0];

        if (header.flag === 0) {
            throw new Error('ANK is not supported yet');
        }

        const blkcnt = font.slice(0x11, 0x12)[0];
        const blocks = [];
        let offset = 0x12;
        for(let i = 0; i < blkcnt; i++) {
            blocks[i] = {
                start: font.readUInt16LE(offset),
                end: font.readUInt16LE(offset + 2),
            };
            offset += 4;
        }

        header.blocks = blocks;
        header.size = offset;

        this._header = header;

        this._fonts = {};

        let off = 0;
        for (let i = 0; i < header.blocks.length; i++) {
            const block = header.blocks[i];
            for (let j = block.start; j <= block.end; j++) {
                this._fonts[j] = this._grabChar(this._header.size, off);
                off++;
            }
        }
    }

    _grabChar(baseoff, off) {
        const {width, height} = this.getDimension();
        const byteWidth = this.getByteWidth();
        const characterByte = byteWidth * height;

        return this._fontbin.slice(baseoff + characterByte * off, baseoff + characterByte * (off + 1));
    }

    renderChar(code) {
        const jisstr = iconv.encode(String.fromCharCode(code), 'Shift-JIS');

        if (jisstr.length != 2) {
            throw new Error('Unsupported character!');
        }

        const jiscode = jisstr.readUInt16BE(0);

        if (this._fonts[jiscode] == null) {
            throw new Error('Unsupported character!');
        }

        const {width, height} = this.getDimension();
        const byteWidth = this.getByteWidth();
        const characterByte = byteWidth * height;

        const buf = Buffer.alloc(32);

        const rowStep = byteWidth === 2 ? 1 : 2;
        for (let i = 0; i < characterByte; i++) {
            buf[i * rowStep] |= this._fonts[jiscode][i];
        }

        return buf;
    }
}

module.exports = FontXRenderer;
