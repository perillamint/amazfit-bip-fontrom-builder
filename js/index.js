'use strict';

let fm = null;
let bms = null;

function renderAndAddGlyph(bms, renderer, start, end) {
    for(let i = start; i <= end; i++) {
        try {
            if (i === 0x30C4) {console.log('asdf!!');}
            const bin = renderer.renderChar(i);
            if (i === 0x30C4) {console.log('asdf!!');}
            bms.addGlyph(i, bin, 4, renderer.getDimension().width);
            if (i === 0x30C4) {console.log('asdf!!');}
        } catch (e) {}
    }
}

async function loadfonts(evt) {
    fm = new EntryPoint.FontManager();
    await fm.downloadFontAssets();
}

function renderFonts() {
    const fonts = fm.getFontList();
    bms = new EntryPoint.BitmapStorage();

    const latin = fonts.latin[0].renderer;
    const dkb = fonts.dkb844[0].renderer;
    const fontx = fonts.fontx[0].renderer;
    console.log(fontx);

    renderAndAddGlyph(bms, latin, 0x0000, 0x007F);

    renderAndAddGlyph(bms, dkb, 0x1100, 0x1112);
    renderAndAddGlyph(bms, dkb, 0x11A8, 0x11C2);
    renderAndAddGlyph(bms, dkb, 0x3131, 0x314E);
    renderAndAddGlyph(bms, dkb, 0x314F, 0x3163);
    renderAndAddGlyph(bms, dkb, 0xAC00, 0xD7A3);

    renderAndAddGlyph(bms, fontx, 0x3000, 0x303F);
    renderAndAddGlyph(bms, fontx, 0x3040, 0x309F);
    renderAndAddGlyph(bms, fontx, 0x30A0, 0x30FF);
    renderAndAddGlyph(bms, fontx, 0x4E00, 0x9FFF);
    renderAndAddGlyph(bms, fontx, 0x3400, 0x4DBF);
}

function draw() {
    const canvas = document.getElementById('examplerender');
    const ctx = canvas.getContext('2d');

    const text = document.getElementById('exampletext').value;

    let xpos = 0;
    let ypos = 0;
    for(let i = 0; i < text.length; i++) {
        const code = text.charCodeAt(i);
        if (code === 10) {
            ypos += 16;
            xpos = 0;
        } else {
            const glyph = bms.getGlyph(code);

            if(glyph != null) {
                EntryPoint.FontVisualizer.drawToCanvas(glyph.data, ctx, xpos, ypos);
                xpos += glyph.width;
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
        data[i]     = 0;   // red
        data[i + 1] = 0;   // green
        data[i + 2] = 0;   // blue
        data[i + 3] = 255; // alpha
    }
    ctx.putImageData(imageData, 0, 0);
}
