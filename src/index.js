'use strict';
/* eslint-env browser */


const BipFont = require('./BipFont.js');
const BitmapFontStorage = require('./BitmapFontStorage.js');
const FontManager = require('./FontManager.js');
const FontVisualizer = require('./FontVisualizer.js');

class EntryPoint {
    constructor() {
        this._fm = new FontManager();
        this._bfs = new BitmapFontStorage();
    }

    _renderAndAddGlyph(bfs, renderer, start, end) {
        for (let i = start; i <= end; i++) {
            try {
                const bin = renderer.renderChar(i);
                bfs.addGlyph(i, bin, 4, renderer.getDimension().width);
            } catch (e) {}
        }
    }

    _childCleaner(elem) {
        while (elem.firstChild) {
            elem.removeChild(elem.firstChild);
        }
    }

    _getFontOption(font, value) {
        const option = document.createElement('option');
        option.text = `${font.filename} - ${font.name}`;
        option.value = value;

        return option;
    }

    _refreshFontList() {
        const fontList = this._fm.getFontList();
        const baseromlist = document.getElementById('baserom');
        const latinromlist = document.getElementById('latinrom');
        const dkbromlist = document.getElementById('dkb844rom');
        const fontxromlist = document.getElementById('fontxrom');

        this._childCleaner(baseromlist);
        this._childCleaner(latinromlist);
        this._childCleaner(dkbromlist);
        this._childCleaner(fontxromlist);

        for (let i = 0; i < fontList.vendor.length; i++) {
            baseromlist.appendChild(this._getFontOption(fontList.vendor[i], i));
        }

        for (let i = 0; i < fontList.latin.length; i++) {
            latinromlist.appendChild(this._getFontOption(fontList.latin[i], i));
        }

        for (let i = 0; i < fontList.dkb844.length; i++) {
            dkbromlist.appendChild(this._getFontOption(fontList.dkb844[i], i));
        }

        for (let i = 0; i < fontList.fontx.length; i++) {
            fontxromlist.appendChild(this._getFontOption(fontList.fontx[i], i));
        }
    }

    async _loadFonts() {
        await this._fm.downloadFontAssets();

        this._refreshFontList();
        this.updateFonts();
    }

    _renderFonts(latinidx, dkbidx, fontxidx) {
        const fonts = this._fm.getFontList();
        this._bfs = BipFont.unpackFile(fonts.vendor[0].binary);

        const latin = fonts.latin[latinidx].renderer;
        const dkb = fonts.dkb844[dkbidx].renderer;
        const fontx = fonts.fontx[fontxidx].renderer;

        this._renderAndAddGlyph(this._bfs, latin, 0x0000, 0x007F);

        this._renderAndAddGlyph(this._bfs, dkb, 0x1100, 0x1112);
        this._renderAndAddGlyph(this._bfs, dkb, 0x11A8, 0x11C2);
        this._renderAndAddGlyph(this._bfs, dkb, 0x3131, 0x314E);
        this._renderAndAddGlyph(this._bfs, dkb, 0x314F, 0x3163);
        this._renderAndAddGlyph(this._bfs, dkb, 0xAC00, 0xD7A3);

        this._renderAndAddGlyph(this._bfs, fontx, 0x3000, 0x303F);
        this._renderAndAddGlyph(this._bfs, fontx, 0x3040, 0x309F);
        this._renderAndAddGlyph(this._bfs, fontx, 0x30A0, 0x30FF);
        this._renderAndAddGlyph(this._bfs, fontx, 0x4E00, 0x9FFF);
        this._renderAndAddGlyph(this._bfs, fontx, 0x3400, 0x4DBF);
    }

    _initCanvas() {
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

    async init() {
        this._initCanvas();
        await this._loadFonts();
    }

    updateFonts() {
        const latinromidx = document.getElementById('latinrom').value;
        const dkbromidx = document.getElementById('dkb844rom').value;
        const fontxromidx = document.getElementById('fontxrom').value;

        this._renderFonts(latinromidx, dkbromidx, fontxromidx);
        this.drawText();
    }

    drawText() {
        const canvas = document.getElementById('examplerender');
        const ctx = canvas.getContext('2d');

        const text = document.getElementById('exampletext').value;

        // Erase canvas before draw anything
        this._initCanvas();
        let xpos = 0;
        let ypos = 0;
        for (let i = 0; i < text.length; i++) {
            const code = text.charCodeAt(i);
            if (code === 10) {
                ypos += 16;
                xpos = 0;
            } else {
                const glyph = this._bfs.getGlyphAt(code);

                if (glyph != null) {
                    FontVisualizer.drawToCanvas(glyph.getData(), ctx, xpos, ypos);
                    xpos += glyph.getWidth();
                } else {
                    // TODO: Tofu here
                    xpos += 16;
                }
            }
        }
    }

    async buildROM() {
        const rom = BipFont.packFile(this._bfs);
        const link = document.createElement('a');
        link.style.display = 'none';
        document.body.appendChild(link);


        const blob = new Blob([rom], {type: 'application/octet-binary'});
        const objectURL = URL.createObjectURL(blob);

        link.href = objectURL;
        link.href = URL.createObjectURL(blob);
        link.download = document.getElementById('savefilename').value;
        link.click();
        link.remove();
    }

    async loadROM() {
        const romtype = document.getElementById('romtype').value;
        const romfile = document.getElementById('rom').files[0];
        const romname = document.getElementById('romname').value;
        const romwidth = parseInt(document.getElementById('romwidth').value, 10);
        const romheight = parseInt(document.getElementById('romheight').value, 10);
        const romheader = parseInt(document.getElementById('romheader').value, 10);

        try {
            if (romfile == null) {
                throw new Error('ROM file cannot be empty!');
            }

            if (romname === '') {
                throw new Error('ROM name cannot be empty!');
            }

            if (romtype !== 'vendor' || romtype !== 'fontx') {
                if (isNaN(romwidth) || isNaN(romheight)) {
                    throw new Error('ROM dimension cannot be empty!');
                }

                if (isNaN(romheader)) {
                    throw new Error('ROM header size cannot be empty!');
                }
            }

            switch (romtype) {
            case 'vendor':
                await this._fm.addVendorFont(romfile, romfile.name, romname);
                break;
            case 'latin':
                await this._fm.addLatinFont(romfile, romfile.name, romname, romheader, romwidth, romheight);
                break;
            case 'dkb844':
                await this._fm.addDKB844Font(romfile, romfile.name, romname, romheader, romwidth, romheight);
                break;
            case 'fontx':
                await this._fm.addFontXFont(romfile, romfile.name, romname);
                break;
            }
        } catch (e) {
            alert(e.message);
            return;
        }

        alert('ROM loaded successfully!');
        this._refreshFontList();
    }
}
module.exports = new EntryPoint();
