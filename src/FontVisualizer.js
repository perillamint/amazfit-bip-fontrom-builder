'use strict';

const assert = require('assert');

class FontVisualizer {
    static drawToConsole(glyphData, _ctx, _x, _y) {
        assert.strictEqual(glyphData.constructor.name, 'Buffer')

        let line = '';
        for (let i = 0; i < 16; i++) {
            for (let j = 0; j < 16; j++) {
                const pixelpt = i * 16 + j;
                const buf = glyphData[Math.floor(pixelpt / 8)];
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

    static drawToCanvas(glyphData, ctx, x, y) {
        assert.strictEqual(glyphData.constructor.name, 'Buffer')
        assert.strictEqual(ctx.constructor.name, 'CanvasRenderingContext2D')
        assert.strictEqual(x.constructor.name, 'Number')
        assert.strictEqual(x | 0, x)
        assert.strictEqual(y.constructor.name, 'Number')
        assert.strictEqual(y | 0, y)

        const imageData = ctx.createImageData(16, 16);
        const data = imageData.data;

        for (let i = 0; i < 16; i++) {
            for (let j = 0; j < 16; j++) {
                const pixelpt = i * 16 + j;
                const buf = glyphData[Math.floor(pixelpt / 8)];
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
