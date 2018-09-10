let exportFlag = false;
if (module !== undefined) {
    exportFlag = true;
}

'use strict';

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

class BIPFont {
    static unpackFile(bin) {
        const magic = bin.readUInt32BE(0);
        if (magic !== 0x4E455A4b) {
            throw new Error('Invalid magic');
        }

        const fonts = {};
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
                const font = bin.slice(off, off + 32);
                const margin_top = bin[off + 32] % 16;
                off += 33;

                fonts[i] = {
                    font: font,
                    margin_top: margin_top,
                };
            }
        }

        return fonts;
    }

    static packFile(fontmap) {
        const codepoints = Object.keys(fontmap).sort((a, b) => {
            const an = parseInt(a);
            const bn = parseInt(b);

            return an < bn ? -1 : (an > bn ? 1 : 0);
        });

        for (const i of codepoints) {
            //
        }
    }
}

if (exportFlag) {
    module.exports = BIPFont;
}
