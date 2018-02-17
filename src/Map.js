'use strict';

import fs from 'fs';
import './utils/Helpers';

class Map {
  constructor(id = null, params = []) {

    if (id === null) {
      id = (new Date()).getFullYear().toString() + ((new Date()).getMonth()+1).toString().leftPad('0', 2) + (new Date()).getDate().toString() + (new Date()).getHours().toString() + (new Date()).getMinutes().toString() + ((new Date()).getSeconds()).toString().leftPad('0', 2);
    }

    this.id = id;
    this.params = params;
    this.tiles = [];
  }

  generate() {
    return new this.params.generator(this).run();
  }

  saveToFile() {
    fs.writeFile('./public/maps/' + this.id + '.json', JSON.stringify(this));
  }
}

module.exports = Map;