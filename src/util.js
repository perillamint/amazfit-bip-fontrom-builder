'use strict';
/* global FileReader */

class Util {
    static async fileToBuffer(file) {
        const abuf = await new Promise((ful, _rej) => {
            const fileReader = new FileReader();
            fileReader.onload = (evt) => {
                ful(evt.target.result);
            };

            fileReader.readAsArrayBuffer(file);
        });

        return Buffer.from(abuf);
    }
}

module.exports = Util;
