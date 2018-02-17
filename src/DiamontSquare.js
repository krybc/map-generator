'use strict';

/**
 * Diamond square map generator
 */
class DiamondSquare {
  constructor(map) {
    this.map = map;
    this.tiles = [];
  }

  run() {
    this.tiles = this.create2DArray(this.map.params.width + 1, this.map.params.height + 1);
    this.startDisplacement(this.map.params.width);

    this.map.tiles = this.prepareTerrain();
    delete this.tiles; // clean cache

    return this.map;
  }

  create2DArray(d1, d2) {
    let data = [],
      x = 0,
      y = 0;

    for (x = 0; x < d1; x++) {
      data[x] = [];
      for (y = 0; y < d2; y++) {
        data[x][y] = 0;
      }
    }

    return data;
  }

  // starts off the map generation, seeds the first 4 corners
  startDisplacement(mapDimension) {
    let topRight = 0,
      topLeft = 0,
      bottomRight = 0,
      bottomLeft = 0,
      center = 0;

    // top left
    this.tiles[0][0] = 0;
    topLeft = this.tiles[0][0];

    // bottom left
    this.tiles[0][mapDimension] = 0;
    bottomLeft = this.tiles[0][mapDimension];

    // top right
    this.tiles[mapDimension][0] = 0;
    topRight = this.tiles[mapDimension][0];

    // bottom right
    this.tiles[mapDimension][mapDimension] = 0;
    bottomRight = this.tiles[mapDimension][mapDimension];

    // center
    this.tiles[mapDimension / 2][mapDimension / 2] = this.tiles[0][0] + this.tiles[0][mapDimension] + this.tiles[mapDimension][0] + this.tiles[mapDimension][mapDimension] / 4;
    this.tiles[mapDimension / 2][mapDimension / 2] = this.normalize(this.tiles[mapDimension / 2][mapDimension / 2]);
    center = this.tiles[mapDimension / 2][mapDimension / 2];

    /* non wrapping terrain */
    this.tiles[mapDimension / 2][mapDimension] = bottomLeft + bottomRight + center / 3;
    this.tiles[mapDimension / 2][0] = topLeft + topRight + center / 3;
    this.tiles[mapDimension][mapDimension / 2] = topRight + bottomRight + center / 3;
    this.tiles[0][mapDimension / 2] = topLeft + bottomLeft + center / 3;

    /*wrapping terrain */
    this.tiles[mapDimension / 2][mapDimension] = bottomLeft + bottomRight + center + center / 4;
    this.tiles[mapDimension / 2][0] = topLeft + topRight + center + center / 4;
    this.tiles[mapDimension][mapDimension / 2] = topRight + bottomRight + center + center / 4;
    this.tiles[0][mapDimension / 2] = topLeft + bottomLeft + center + center / 4;

    // call displacment
    this.midpointDisplacment(mapDimension);
  }

  // workhorse of the terrain generation.
  midpointDisplacment(dimension) {
    let newDimension = dimension / 2,
      topRight = 0,
      topLeft = 0,
      bottomLeft = 0,
      bottomRight = 0,
      center = 0,
      x = 0, y = 0,
      i = 0, j = 0,
      unitsize = 1;

    if (newDimension > unitsize) {

      for (i = newDimension; i <= this.map.params.width; i += newDimension) {
        for (j = newDimension; j <= this.map.params.height; j += newDimension) {
          x = i - (newDimension / 2);
          y = j - (newDimension / 2);

          topLeft = this.tiles[i - newDimension][j - newDimension];
          topRight = this.tiles[i][j - newDimension];
          bottomLeft = this.tiles[i - newDimension][j];
          bottomRight = this.tiles[i][j];

          // center
          this.tiles[x][y] = (topLeft + topRight + bottomLeft + bottomRight) / 4 + this.displace(dimension);
          if (x === 0 || y === 0 || x === this.map.params.width || y === this.map.params.width) {
            this.tiles[x][y] = 0;
          } else {
            this.tiles[x][y] = this.normalize(this.tiles[x][y]);
          }

          center = this.tiles[x][y];

          // top
          if (j - (newDimension * 2) + (newDimension / 2) > 0) {
            this.tiles[x][j - newDimension] = (topLeft + topRight + center + this.tiles[x][j - dimension + (newDimension / 2)]) / 4 + this.displace(dimension);
          } else {
            this.tiles[x][j - newDimension] = (topLeft + topRight + center) / 3 + this.displace(dimension);
          }

          if (x === 0 || j - newDimension === 0 || x === this.map.params.width || j - newDimension === this.map.params.width) {
            this.tiles[x][j - newDimension] = 0;
          } else {
            this.tiles[x][j - newDimension] = this.normalize(this.tiles[x][j - newDimension]);
          }

          // bottom
          if (j + (newDimension / 2) < this.map.params.width) {
            this.tiles[x][j] = (bottomLeft + bottomRight + center + this.tiles[x][j + (newDimension / 2)]) / 4 + this.displace(dimension);
          } else {
            this.tiles[x][j] = (bottomLeft + bottomRight + center) / 3 + this.displace(dimension);
          }

          if (x === 0 || j === 0 || x === this.map.params.width || j === this.map.params.width) {
            this.tiles[x][j] = 0;
          } else {
            this.tiles[x][j] = this.normalize(this.tiles[x][j]);
          }

          //right
          if (this.tiles + (newDimension / 2) < this.map.params.width) {
            this.tiles[i][y] = (topRight + bottomRight + center + map[i + (newDimension / 2)][y]) / 4 + this.displace(dimension);
          } else {
            this.tiles[i][y] = (topRight + bottomRight + center) / 3 + this.displace(dimension);
          }

          if (i === 0 || y === 0 || i === this.map.params.width || y === this.map.params.width) {
            this.tiles[i][y] = 0;
          } else {
            this.tiles[i][y] = this.normalize(this.tiles[i][y]);
          }

          // left
          if (i - (newDimension * 2) + (newDimension / 2) > 0) {
            this.tiles[i - newDimension][y] = (topLeft + bottomLeft + center + this.tiles[i - dimension + (newDimension / 2)][y]) / 4 + this.displace(dimension);
          } else {
            this.tiles[i - newDimension][y] = (topLeft + bottomLeft + center) / 3 + this.displace(dimension);
          }

          if (i - newDimension === 0 || y === 0 || i - newDimension === this.map.params.width || y === this.map.params.width) {
            this.tiles[i - newDimension][y] = 0;
          } else {
            this.tiles[i - newDimension][y] = this.normalize(this.tiles[i - newDimension][y]);
          }

        }
      }

      this.midpointDisplacment(newDimension);
    }
  }

  // random function to offset the center
  displace(num) {
    let max = num / (this.map.params.width + this.map.params.width) * 8;

    return (Math.random() - 0.5) * max;
  }

  // normalize the value to make sure its within bounds
  normalize(value) {
    return Math.max(Math.min(value, 1), 0);
  }

  prepareTerrain() {
    let tiles = [];

    // Ustalenie zakresu wysokości poszczeólnych rodzajów terenu
    let oceanRange = this.map.params.seaLevel;
    let landRange = 1 - oceanRange;
    let oceanMin = 0;
    let oceanMax = oceanRange;
    let depressionMin = oceanRange;
    let depressionMax = oceanRange+(landRange*0.05);
    let plain1Min = oceanRange+(landRange*0.05);
    let plain1Max = oceanRange+(landRange*0.3);
    let plain2Min = oceanRange+(landRange*0.3);
    let plain2Max = oceanRange+(landRange*0.5);
    let highland1Min = oceanRange+(landRange*0.5);
    let highland1Max = oceanRange+(landRange*0.65);
    let highland2Min = oceanRange+(landRange*0.65);
    let highland2Max = oceanRange+(landRange*0.75);
    let highland3Min = oceanRange+(landRange*0.75);
    let highland3Max = oceanRange+(landRange*0.85);
    let mountain1Min = oceanRange+(landRange*0.85);
    let mountain1Max = oceanRange+(landRange*0.9);
    let mountain2Min = oceanRange+(landRange*0.9);
    let mountain2Max = oceanRange+(landRange*0.95);
    let mountain3Min = oceanRange+(landRange*0.95);
    let mountain3Max = 1;

    for (let x in this.tiles) {
      tiles[x] = [];
      for (let y in this.tiles[x]) {
        let row = this.tiles[x][y];

        // Ustalenie rodzaju terenu
        let terrain = 'error';
        if (row >= oceanMin && row <= oceanMax) {
          terrain = 'ocean';
        } else if (row >= depressionMin && row <= depressionMax) {
          terrain = 'depression';
        } else if (row >= plain1Min && row <= plain1Max) {
          terrain = 'plain1';
        } else if (row >= plain2Min && row <= plain2Max) {
          terrain = 'plain2';
        } else if (row >= highland1Min && row <= highland1Max) {
          terrain = 'highland1';
        } else if (row >= highland2Min && row <= highland2Max) {
          terrain = 'highland2';
        } else if (row >= highland3Min && row <= highland3Max) {
          terrain = 'highland3';
        } else if (row >= mountain1Min && row <= mountain1Max) {
          terrain = 'mountain1';
        } else if (row >= mountain2Min && row <= mountain2Max) {
          terrain = 'mountain2';
        } else if (row >= mountain3Min && row <= mountain3Max) {
          terrain = 'mountain3';
        }

        tiles[x][y] = {
          terrain: terrain
        };

      }
    }

    return tiles;
  }
}

module.exports = DiamondSquare;