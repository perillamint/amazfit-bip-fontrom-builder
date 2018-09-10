'use strict';
// Font ROM load target
let fonts = {
    vendor: {},
    dkb844: [],
    fontx: [],
    latin: [],
};

async function fileToArrayBuffer(file) {
    return await new Promise((ful, rej) => {
        const fileReader = new FileReader();
        fileReader.onload = (evt) => {
            ful(evt.target.result);
        };

        fileReader.readAsArrayBuffer(file);
    });
}

async function downloadFiles() {
    const latinfntmeta = (await axios.get('/asset/latin/fonts.json')).data;
    const latinfonts = Object.keys(latinfntmeta);

    for (const i of latinfonts) {
        const fontbin = (await axios.get(`/asset/latin/${i}`, {responseType: 'arraybuffer'})).data;
        const fontbuffer = Buffer.from(fontbin);
        fonts.latin.push({
            data: fontbuffer,
            name: latinfntmeta[i].name,
            width: latinfntmeta[i].width,
            height: latinfntmeta[i].height,
        });
    }

    const dkb844fntmeta = (await axios.get('/asset/dkb844/fonts.json')).data;
    const dkb844fonts = Object.keys(dkb844fntmeta);

    for (const i of dkb844fonts) {
        const fontbin = (await axios.get(`/asset/dkb844/${i}`, {responseType: 'arraybuffer'})).data;
        const fontbuffer = Buffer.from(fontbin);
        fonts.dkb844.push({
            data: fontbuffer,
            name: dkb844fntmeta[i].name,
            width: dkb844fntmeta[i].width,
            height: dkb844fntmeta[i].height,
        });
    }

    const fontxfntmeta = (await axios.get('/asset/fontx/fonts.json')).data;
    const fontxfonts = Object.keys(fontxfntmeta);

    for (const i of fontxfonts) {
        const fontbin = (await axios.get(`/asset/fontx/${i}`, {responseType: 'arraybuffer'})).data;
        const fontbuffer = Buffer.from(fontbin);
        fonts.fontx.push({
            data: fontbuffer,
            name: fontxfntmeta[i].name,
        });
    }
}

async function loadbiprom(evt) {
    const file = document.getElementById('baserom').files[0];
    const blob = Buffer.from(await fileToArrayBuffer(file));

    fonts = await BIPFont.unpackFile(blob);
}

async function load844Hangul(evt) {
    const file = document.getElementById('').files[0];
}
