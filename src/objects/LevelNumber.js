'use strict';

import { ObjCollection } from '../../lib/ObjCollection';
import { ramp, sin, easeOutCubic, easeInCubic } from '../../lib/Maths';

const PADDING = 10;
const FONT_SIZE = 40;
const MIN_FONT_PIXELS = 20;
class LevelNumber {
  constructor (canvas, config, number) {
    this._canvas = canvas;
    this._config = config;
    this._number = number;

    this._layer = canvas.newLayer('level-num');
    this._ctx = this._layer.ctx;

    this._auxLayer = canvas.newVirtualLayer('splash-aux');
    this._auxCtx = this._auxLayer.ctx;

    this._maxFontSize = null;
    this._fontSize = null;

    this._dim = null;

    this._timeoutId = 0;
    this._timestamp = null;

    this.resize();
  }

  // -- AppObject API

  render (delta, timestamp) {
    const ctx = this._ctx;

    if (!this._timestamp) {
      this._timestamp = timestamp;
    }

    const hue = Math.round(30 * sin(timestamp));

    const x = this._canvas.scaleValue(this._canvas.max.x * 0.98);
    const y = this._canvas.scaleValue(this._canvas.max.y * 0.02);

    const dim = this._dim;
    const width = PADDING * 2 + dim.width;
    const height = PADDING * 2 + dim.actualBoundingBoxAscent + dim.actualBoundingBoxDescent;
    const rect = [this._canvas.width - width - PADDING * 1.5, PADDING * 1.2, width, height];

    ctx.clearRect(...rect);

    ctx.fillStyle = 'rgba(0,0,0,0.8)';
    ctx.fillRect(...rect);
    ctx.fillStyle = 'hsl(' + hue + ',95%,60%)';
    ctx.fillText(this._number, x - PADDING, y + PADDING);
  }

  resize () {
    this._fontSize = this._canvas.scaleText(FONT_SIZE, MIN_FONT_PIXELS);
    this._maxFontSize = this._canvas.scaleText(100);

    const ctx = this._ctx;

    ctx.font = this._fontSize + 'px pixel';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'top';

    this._dim = this._ctx.measureText(this._number);
  }

  destroy () {
    this._canvas.destroyLayer(this._layer);
    this._canvas.destroyLayer(this._auxLayer);

    window.clearTimeout(this._timeoutId);
  }
}

export {
  LevelNumber
};
