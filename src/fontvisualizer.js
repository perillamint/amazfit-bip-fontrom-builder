class FontVisualizer {
    static drawToConsole(font, _ctx, _x, _y) {
        let line = '';
        for (let i = 0; i < 16; i++) {
            for (let j = 0; j < 16; j++) {
                const pixelpt = i * 16 + j;
                const buf = font[Math.floor(pixelpt / 8)];
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

    static drawToCanvas(font, ctx, x, y) {
        const imageData = ctx.createImageData(16, 16);
        const data = imageData.data;

        for (let i = 0; i < 16; i++) {
            for (let j = 0; j < 16; j++) {
                const pixelpt = i * 16 + j;
                const buf = font[Math.floor(pixelpt / 8)];
                const bit = buf << (pixelpt % 8);
                if (bit & 0x80) {
                    data[pixelpt * 4] = 255;
                    data[pixelpt * 4 + 1] = 255;
                    data[pixelpt * 4 + 2] = 255;
                    data[pixelpt * 4 + 3] = 255;
                } else {
                    data[pixelpt * 4] = 0;
                    data[pixelpt * 4 + 1] = 0;
                    data[pixelpt * 4 + 2] = 0;
                    data[pixelpt * 4 + 3] = 255;
                }
            }
        }

        ctx.putImageData(imageData, x, y);
    }
}

module.exports = FontVisualizer;
