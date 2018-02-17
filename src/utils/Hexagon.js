'use strict';

class Hexagon {
  constructor(canvasId, map) {
    this.map = map;

    this.radius = radius;

    this.height = Math.sqrt(3) * radius;
    this.width = 2 * radius;
    this.side = (3 / 2) * radius;

    this.canvas = document.getElementById(canvasId);
    this.context = this.canvas.getContext('2d');

    this.canvasOriginX = 0;
    this.canvasOriginY = 0;
  }

  draw(rows, cols, originX, originY, isDebug) {
    this.canvasOriginX = originX;
    this.canvasOriginY = originY;

    let currentHexX;
    let currentHexY;
    let debugText = "";

    let offsetColumn = false;

    for (let col = 0; col < cols; col++) {
      for (let row = 0; row < rows; row++) {

        if (!offsetColumn) {
          currentHexX = (col * this.side) + originX;
          currentHexY = (row * this.height) + originY;
        } else {
          currentHexX = col * this.side + originX;
          currentHexY = (row * this.height) + originY + (this.height * 0.5);
        }

        if (isDebug) {
          debugText = col + "," + row;
        }

        this.drawHex(currentHexX, currentHexY, "#ddd", debugText);
      }
      offsetColumn = !offsetColumn;
    }
  }

  drawHexAtColRow(column, row, color) {
    let drawy = column % 2 == 0 ? (row * this.height) + this.canvasOriginY : (row * this.height) + this.canvasOriginY + (this.height / 2);
    let drawx = (column * this.side) + this.canvasOriginX;

    this.drawHex(drawx, drawy, color, "");
  }

  drawHex(x0, y0, fillColor, debugText) {
    this.context.strokeStyle = "#000";
    this.context.beginPath();
    this.context.moveTo(x0 + this.width - this.side, y0);
    this.context.lineTo(x0 + this.side, y0);
    this.context.lineTo(x0 + this.width, y0 + (this.height / 2));
    this.context.lineTo(x0 + this.side, y0 + this.height);
    this.context.lineTo(x0 + this.width - this.side, y0 + this.height);
    this.context.lineTo(x0, y0 + (this.height / 2));

    if (fillColor) {
      this.context.fillStyle = fillColor;
      this.context.fill();
    }

    this.context.closePath();
    this.context.stroke();

    if (debugText) {
      this.context.font = "8px";
      this.context.fillStyle = "#000";
      this.context.fillText(debugText, x0 + (this.width / 2) - (this.width/4), y0 + (this.height - 5));
    }
  }

//Recusivly step up to the body to calculate canvas offset.
  getRelativeCanvasOffset() {
    let x = 0, y = 0;
    let layoutElement = this.canvas;
    if (layoutElement.offsetParent) {
      do {
        x += layoutElement.offsetLeft;
        y += layoutElement.offsetTop;
      } while (layoutElement = layoutElement.offsetParent);

      return { x: x, y: y };
    }
  }
}

module.exports = Hexagon;