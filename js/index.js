'use strict';
// Font ROM load target
let fonts = null;

async function fileToArrayBuffer(file) {
    return await new Promise((ful, rej) => {
        const fileReader = new FileReader();
        fileReader.onload = (evt) => {
            ful(evt.target.result);
        };

        fileReader.readAsArrayBuffer(file);
    });
}

async function loadbiprom(evt) {
    const file = document.getElementById('baserom').files[0];
    const blob = Buffer.from(await fileToArrayBuffer(file));

    fonts = await BIPFont.unpackFile(blob);
}

async function load844Hangul(evt) {
    const file = document.getElementById('').files[0];
}
