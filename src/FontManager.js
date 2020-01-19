'use strict';
/* global FileReader */

const axios = require('axios');
const Dkb844FontRenderer = require('./Dkb844FontRenderer.js');
const LatinFontRenderer = require('./LatinFontRenderer.js');
const FontXFontRenderer = require('./FontXFontRenderer.js');

class FontManager {
    constructor() {
        this._fonts = {
            vendor: [],
            dkb844: [],
            fontx: [],
            latin: [],
        };
    }

    clearFontAssets() {
        this._fonts = {
            vendor: [],
            dkb844: [],
            fontx: [],
            latin: [],
        };
    }

    async downloadFontAssets() {
        const vendorfntmeta = (await axios.get('./asset/vendor/fonts.json')).data;
        const vendorfonts = Object.keys(vendorfntmeta);
        for (const i of vendorfonts) {
            this.addFont('vendor', `./asset/vendor/${i}`, i, vendorfntmeta[i].name);
        }

        const latinfntmeta = (await axios.get('./asset/latin/fonts.json')).data;
        const latinfonts = Object.keys(latinfntmeta);

        for (const i of latinfonts) {
            const headersz = latinfntmeta[i].header;
            const width = latinfntmeta[i].width;
            const height = latinfntmeta[i].height;
            this.addFont('latin', `./asset/latin/${i}`, i, latinfntmeta[i].name, headersz, width, height);
        }

        const dkb844fntmeta = (await axios.get('./asset/dkb844/fonts.json')).data;
        const dkb844fonts = Object.keys(dkb844fntmeta);

        for (const i of dkb844fonts) {
            const headersz = dkb844fntmeta[i].header;
            const width = dkb844fntmeta[i].width;
            const height = dkb844fntmeta[i].height;
            this.addFont('dkb844', `./asset/dkb844/${i}`, i, dkb844fntmeta[i].name, headersz, width, height);
        }

        const fontxfntmeta = (await axios.get('./asset/fontx/fonts.json')).data;
        const fontxfonts = Object.keys(fontxfntmeta);

        for (const i of fontxfonts) {
            this.addFont('fontx', `./asset/fontx/${i}`, i, fontxfntmeta[i].name);
        }
    }

    getFontList() {
        return this._fonts;
    }

    async addFont(type, file, filename, name, headersz, width, height) {
        let renderer = null; // allocate renderer

        const fontBinFetcher = async () => {
            if (file instanceof Buffer) {
                return file;
            } else {
                return Buffer.from((await axios.get(file, {responseType: 'arraybuffer'})).data);
            }
        };

        switch (type) {
        case 'vendor':
            this._fonts.vendor.push({
                getBinary: async () => {
                    return await fontBinFetcher();
                },
                filename: filename,
                name: name,
            });
            break;
        case 'latin':
            this._fonts.latin.push({
                getRenderer: async () => {
                    if (renderer == null) {
                        renderer = new LatinFontRenderer(await fontBinFetcher(), headersz, width, height);
                    }
                    return renderer;
                },
                filename: filename,
                name: name,
            });
            break;
        case 'dkb844':
            this._fonts.dkb844.push({
                getRenderer: async () => {
                    if (renderer == null) {
                        renderer = new Dkb844FontRenderer(await fontBinFetcher(), headersz, width, height);
                    }
                    return renderer;
                },
                filename: filename,
                name: name,
            });
            break;
        case 'fontx':
            this._fonts.fontx.push({
                getRenderer: async () => {
                    if (renderer == null) {
                        renderer = new FontXFontRenderer(await fontBinFetcher());
                    }
                    return renderer;
                },
                filename: filename,
                name: name,
            });
            break;
        default:
            throw new Error('Invalid file type');
        }
    }
}

module.exports = FontManager;
