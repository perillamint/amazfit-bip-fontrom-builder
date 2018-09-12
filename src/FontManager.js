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

    async _fileToArrayBuffer(file) {
        return await new Promise((ful, _rej) => {
            const fileReader = new FileReader();
            fileReader.onload = (evt) => {
                ful(evt.target.result);
            };

            fileReader.readAsArrayBuffer(file);
        });
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
            const fontbin = (await axios.get(`./asset/vendor/${i}`, {responseType: 'arraybuffer'})).data;
            this._fonts.vendor.push({
                binary: Buffer.from(fontbin),
                filename: i,
                name: vendorfntmeta[i].name,
            });
        }

        const latinfntmeta = (await axios.get('./asset/latin/fonts.json')).data;
        const latinfonts = Object.keys(latinfntmeta);

        for (const i of latinfonts) {
            const fontbin = (await axios.get(`./asset/latin/${i}`, {responseType: 'arraybuffer'})).data;
            const headersz = latinfntmeta[i].header;
            const width = latinfntmeta[i].width;
            const height = latinfntmeta[i].height;
            this._fonts.latin.push({
                renderer: new LatinFontRenderer(Buffer.from(fontbin), headersz, width, height),
                filename: i,
                name: latinfntmeta[i].name,
            });
        }

        const dkb844fntmeta = (await axios.get('./asset/dkb844/fonts.json')).data;
        const dkb844fonts = Object.keys(dkb844fntmeta);

        for (const i of dkb844fonts) {
            const fontbin = (await axios.get(`./asset/dkb844/${i}`, {responseType: 'arraybuffer'})).data;
            const headersz = dkb844fntmeta[i].header;
            const width = dkb844fntmeta[i].width;
            const height = dkb844fntmeta[i].height;
            this._fonts.dkb844.push({
                renderer: new Dkb844FontRenderer(Buffer.from(fontbin), headersz, width, height),
                filename: i,
                name: dkb844fntmeta[i].name,
            });
        }

        const fontxfntmeta = (await axios.get('./asset/fontx/fonts.json')).data;
        const fontxfonts = Object.keys(fontxfntmeta);

        for (const i of fontxfonts) {
            const fontbin = (await axios.get(`./asset/fontx/${i}`, {responseType: 'arraybuffer'})).data;
            this._fonts.fontx.push({
                renderer: new FontXFontRenderer(Buffer.from(fontbin)),
                filename: i,
                name: fontxfntmeta[i].name,
            });
        }
    }

    getFontList() {
        return this._fonts;
    }

    async addVendorFont(file, filename, name) {
        const bin = await this._fileToArrayBuffer(file);
        this._fonts.vendor.push({
            binary: Buffer.from(bin),
            filename: filename,
            name: name,
        });
    }

    async addLatinFont(file, filename, name, headersz, width, height) {
        const bin = await this._fileToArrayBuffer(file);
        this._fonts.latin.push({
            renderer: new LatinFontRenderer(Buffer.from(bin), headersz, width, height),
            filename: filename,
            name: name,
        });
    }

    async addDKB844Font(file, filename, name, headersz, width, height) {
        const bin = await this._fileToArrayBuffer(file);
        this._fonts.dkb844.push({
            renderer: new Dkb844FontRenderer(Buffer.from(bin), headersz, width, height),
            filename: filename,
            name: name,
        });
    }

    async addFontXFont(file, filename, name) {
        const bin = await this._fileToArrayBuffer(file);
        this._fonts.fontx.push({
            renderer: new FontXFontRenderer(Buffer.from(bin)),
            filename: filename,
            name: name,
        });
    }
}

module.exports = FontManager;
