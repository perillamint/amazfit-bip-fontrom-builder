'use strict';

class FontRenderer {
    constructor(width, height) {
        this._width = width;
        this._height = height;
    }

    getDimension() {
        return {
            width: this._width,
            height: this._height,
        };
    }

    getByteWidth() {
        return Math.floor((this._width + 7) / 8);
    }
}

module.exports = FontRenderer;
