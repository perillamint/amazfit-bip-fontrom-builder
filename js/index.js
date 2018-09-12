'use strict';
/* eslint-env browser */
/* global EntryPoint */

let fm = null;
let bfs = null;

function renderAndAddGlyph(bfs, renderer, start, end) {
    for (let i = start; i <= end; i++) {
        try {
            const bin = renderer.renderChar(i);
            bfs.addGlyph(i, bin, 4, renderer.getDimension().width);
        } catch (e) {}
    }
}

function childCleaner(elem) {
    while (elem.firstChild) {
        elem.removeChild(elem.firstChild);
    }
}

function getFontOption(font, value) {
    const option = document.createElement('option');
    option.text = `${font.filename} - ${font.name}`;
    option.value = value;

    return option;
}

function refreshFontList() {
    const fontList = fm.getFontList();
    const baseromlist = document.getElementById('baserom');
    const latinromlist = document.getElementById('latinrom');
    const dkbromlist = document.getElementById('dkb844rom');
    const fontxromlist = document.getElementById('fontxrom');

    childCleaner(baseromlist);
    childCleaner(latinromlist);
    childCleaner(dkbromlist);
    childCleaner(fontxromlist);

    for (let i = 0; i < fontList.vendor.length; i++) {
        baseromlist.appendChild(getFontOption(fontList.vendor[i], i));
    }

    for (let i = 0; i < fontList.latin.length; i++) {
        latinromlist.appendChild(getFontOption(fontList.latin[i], i));
    }

    for (let i = 0; i < fontList.dkb844.length; i++) {
        dkbromlist.appendChild(getFontOption(fontList.dkb844[i], i));
    }

    for (let i = 0; i < fontList.fontx.length; i++) {
        fontxromlist.appendChild(getFontOption(fontList.fontx[i], i));
    }
}

async function loadFonts() {
    fm = new EntryPoint.FontManager();
    await fm.downloadFontAssets();

    refreshFontList();
    updateFonts();
}

function updateFonts() {
    const latinromidx = document.getElementById('latinrom').value;
    const dkbromidx = document.getElementById('dkb844rom').value;
    const fontxromidx = document.getElementById('fontxrom').value;

    renderFonts(latinromidx, dkbromidx, fontxromidx);
    drawText();
}

function renderFonts(latinidx, dkbidx, fontxidx) {
    const fonts = fm.getFontList();
    bfs = EntryPoint.BipFont.unpackFile(fonts.vendor[0].binary);

    const latin = fonts.latin[latinidx].renderer;
    const dkb = fonts.dkb844[dkbidx].renderer;
    const fontx = fonts.fontx[fontxidx].renderer;

    renderAndAddGlyph(bfs, latin, 0x0000, 0x007F);

    renderAndAddGlyph(bfs, dkb, 0x1100, 0x1112);
    renderAndAddGlyph(bfs, dkb, 0x11A8, 0x11C2);
    renderAndAddGlyph(bfs, dkb, 0x3131, 0x314E);
    renderAndAddGlyph(bfs, dkb, 0x314F, 0x3163);
    renderAndAddGlyph(bfs, dkb, 0xAC00, 0xD7A3);

    renderAndAddGlyph(bfs, fontx, 0x3000, 0x303F);
    renderAndAddGlyph(bfs, fontx, 0x3040, 0x309F);
    renderAndAddGlyph(bfs, fontx, 0x30A0, 0x30FF);
    renderAndAddGlyph(bfs, fontx, 0x4E00, 0x9FFF);
    renderAndAddGlyph(bfs, fontx, 0x3400, 0x4DBF);
}

function drawText() {
    const canvas = document.getElementById('examplerender');
    const ctx = canvas.getContext('2d');

    const text = document.getElementById('exampletext').value;

    // Erase canvas before draw anything
    initCanvas();
    let xpos = 0;
    let ypos = 0;
    for (let i = 0; i < text.length; i++) {
        const code = text.charCodeAt(i);
        if (code === 10) {
            ypos += 16;
            xpos = 0;
        } else {
            const glyph = bfs.getGlyphAt(code);

            if (glyph != null) {
                EntryPoint.FontVisualizer.drawToCanvas(glyph.getData(), ctx, xpos, ypos);
                xpos += glyph.getWidth();
            } else {
                // TODO: Tofu here
                xpos += 16;
            }
        }
    }
}

function initCanvas() {
    const canvas = document.getElementById('examplerender');
    const ctx = canvas.getContext('2d');

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        data[i] = 0; // red
        data[i + 1] = 0; // green
        data[i + 2] = 0; // blue
        data[i + 3] = 255; // alpha
    }
    ctx.putImageData(imageData, 0, 0);
}

/* exported init */
async function init() {
    initCanvas();
    await loadFonts();
}

async function buildROM() {
    const rom = EntryPoint.BipFont.packFile(bfs);
    const link = document.createElement('a');
    link.style.display = 'none';
    document.body.appendChild(link);


    const blob = new Blob([rom], {type: 'application/octet-binary'});
    const objectURL = URL.createObjectURL(blob);

    link.href = objectURL;
    link.href = URL.createObjectURL(blob);
    link.download = 'font.ft';
    link.click();
    link.remove();
}

async function loadROM() {
    const romtype = document.getElementById('romtype').value;
    const romfile = document.getElementById('rom').files[0];
    const romname = document.getElementById('romname').value;
    const romwidth = document.getElementById('romwidth').value;
    const romheight = document.getElementById('romheight').value;

    try {
        if (romfile == null) {
            throw new Error('ROM file cannot be empty!');
        }

        if (romname === '') {
            throw new Error('ROM name cannot be empty!');
        }

        if (romtype !== 'vendor' || romtype !== 'fontx') {
            if (romwidth === '' || romheight === '') {
                throw new Error('ROM dimension cannot be empty!');
            }
        }

        switch (romtype) {
        case 'vendor':
            await fm.addVendorFont(romfile, romfile.name, romname);
            break;
        case 'latin':
            await fm.addLatinFont(romfile, romfile.name, romname, parseInt(romwidth, 10), parseInt(romheight, 10));
            break;
        case 'dkb844':
            await fm.addDKB844Font(romfile, romfile.name, romname, parseInt(romwidth, 10), parseInt(romheight, 10));
            break;
        case 'fontx':
            await fm.addFontXFont(romfile, romfile.name, romname);
            break;
        }
    } catch (e) {
        alert(e.message);
        return;
    }

    alert('ROM loaded successfully!');
    refreshFontList();
}
