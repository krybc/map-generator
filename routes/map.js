import express from 'express';
import Map from '../src/Map';
import DiamondSquare from '../src/DiamontSquare';

let router = express.Router();

router.get('/map/generate', function(req, res, next) {
  const params = {
    width: 128,
    height: 128,
    seaLevel: 0.3,
    generator: DiamondSquare
  };

  let map = new Map(null, params).generate();

  map.saveToFile();

  res.render('terrain', {
    'map': map
  });
});

module.exports = router;