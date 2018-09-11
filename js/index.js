'use strict';
// Font ROM load target
let fonts = {
    vendor: {},
    dkb844: [],
    fontx: [],
    latin: [],
};

async function downloadFiles() {
}

async function loadbiprom(evt) {
    const file = document.getElementById('baserom').files[0];
    const blob = Buffer.from(await fileToArrayBuffer(file));

    fonts = await BIPFont.unpackFile(blob);
}

async function load844Hangul(evt) {
    const file = document.getElementById('').files[0];
}
