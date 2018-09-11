'use strict';

const fs = require('fs');
const BIPFont = require('./src/bipfont.js');
const DKB844Renderer = require('./src/dkb844.js');
const LatinRenderer = require('./src/latin.js');
const FontXRenderer = require('./src/fontx.js');
const BitmapStorage = require('./src/bitmapstorage.js');

function printFont(bin) {
    let line = '';
    for (let i = 0; i < 16; i++) {
        for (let j = 0; j < 16; j++) {
            const pixelpt = i * 16 + j;
            const buf = bin[Math.floor(pixelpt / 8)];
            const bit = buf << (pixelpt % 8);
            if (bit & 0x80) {
                line = line + '■';
            } else {
                line = line + '□';
            }
        }
        line += '\n';
    }

    console.log(line);
}

function renderAndAddGlyph(bms, renderer, start, end) {
    for(let i = start; i <= end; i++) {
        try {
            const bin = renderer.renderChar(i);
            bms.addGlyph(i, bin, 4, renderer.getDimension().width);
        } catch (e) {}
    }
}

async function main() {
    //const ftfile = fs.readFileSync('./test-latinonly.ft');
    const ftfile = fs.readFileSync('./Mili_chaohu.ft');
    const dkbfile = fs.readFileSync('./asset/dkb844/H04.FNT');
    const latinFile = fs.readFileSync('./asset/latin/VGA-ROM.F16');
    const fontxFile = fs.readFileSync('./asset/fontx/04GZN16X.FNT');

    //const fontmap = BIPFont.unpackFile(ftfile);
    //const fontbin = BIPFont.packFile(fontmap);
    //fs.writeFileSync('./test.ft', fontbin);
    //return;

    const dkb = new DKB844Renderer(dkbfile, 16, 16);
    const dkbimg = dkb.renderChar('삠'.codePointAt(0));
    printFont(dkbimg);

    const latin = new LatinRenderer(latinFile, 8, 16);
    const latinimg = latin.renderChar('I'.codePointAt(0));
    printFont(latinimg);

    const fontx = new FontXRenderer(fontxFile);
    const fontximg = fontx.renderChar('い'.codePointAt(0));
    printFont(fontximg);

    const bms = BitmapStorage.fromBIPFont(ftfile);

    renderAndAddGlyph(bms, latin, 0x0000, 0x007F);

    renderAndAddGlyph(bms, dkb, 0x1100, 0x1112);
    renderAndAddGlyph(bms, dkb, 0x11A8, 0x11C2);
    renderAndAddGlyph(bms, dkb, 0x3131, 0x314E);
    renderAndAddGlyph(bms, dkb, 0x314F, 0x3163);
    renderAndAddGlyph(bms, dkb, 0xAC00, 0xD7A3);

    renderAndAddGlyph(bms, fontx, 0x3040, 0x309F);
    renderAndAddGlyph(bms, fontx, 0x30A0, 0x30FF);
    renderAndAddGlyph(bms, fontx, 0x4E00, 0x9FFF);
    renderAndAddGlyph(bms, fontx, 0x3400, 0x4DBF);

    const bin = bms.buildBipFont();
    fs.writeFileSync('./built.ft', bin);
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
