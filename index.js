'use strict';

const fs = require('fs');
const BIPFont = require('./js/bipfont.js');

async function main() {
    const ftfile = fs.readFileSync('./test-latinonly.ft');
    //const ftfile = fs.readFileSync('./Mili_chaohu.ft');

    const fontmap = BIPFont.unpackFile(ftfile);
    BIPFont.packFile(fontmap);
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
