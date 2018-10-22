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
            const fontbin = Buffer.from((await axios.get(`./asset/vendor/${i}`, {responseType: 'arraybuffer'})).data);
            this.addFont('vendor', fontbin, i, vendorfntmeta[i].name);
        }

        const latinfntmeta = (await axios.get('./asset/latin/fonts.json')).data;
        const latinfonts = Object.keys(latinfntmeta);

        for (const i of latinfonts) {
            const fontbin = Buffer.from((await axios.get(`./asset/latin/${i}`, {responseType: 'arraybuffer'})).data);
            const headersz = latinfntmeta[i].header;
            const width = latinfntmeta[i].width;
            const height = latinfntmeta[i].height;
            this.addFont('latin', fontbin, i, latinfntmeta[i].name, headersz, width, height);
        }

        const dkb844fntmeta = (await axios.get('./asset/dkb844/fonts.json')).data;
        const dkb844fonts = Object.keys(dkb844fntmeta);

        for (const i of dkb844fonts) {
            const fontbin = Buffer.from((await axios.get(`./asset/dkb844/${i}`, {responseType: 'arraybuffer'})).data);
            const headersz = dkb844fntmeta[i].header;
            const width = dkb844fntmeta[i].width;
            const height = dkb844fntmeta[i].height;
            this.addFont('dkb844', fontbin, i, dkb844fntmeta[i].name, headersz, width, height);
        }

        const fontxfntmeta = (await axios.get('./asset/fontx/fonts.json')).data;
        const fontxfonts = Object.keys(fontxfntmeta);

        for (const i of fontxfonts) {
            const fontbin = Buffer.from((await axios.get(`./asset/fontx/${i}`, {responseType: 'arraybuffer'})).data);
            this.addFont('fontx', fontbin, i, fontxfntmeta[i].name);
        }
    }

    getFontList() {
        return this._fonts;
    }

    async addFont(type, file, filename, name, headersz, width, height) {
        let renderer = null; // allocate renderer
        switch (type) {
        case 'vendor':
            this._fonts.vendor.push({
                getBinary: async () => {
                    return file;
                },
                filename: filename,
                name: name,
            });
            break;
        case 'latin':
            this._fonts.latin.push({
                getRenderer: async () => {
                    if (renderer == null) {
                        renderer = new LatinFontRenderer(file, headersz, width, height);
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
                        renderer = new Dkb844FontRenderer(file, headersz, width, height);
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
                        renderer = new FontXFontRenderer(file);
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
