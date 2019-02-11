const loremIpsum = require('lorem-ipsum');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const seedFuncs = require('../generateSql.js')

let start = new Date();
const main = (async () => {
  const tenMillion = 10000000;

  const csvWriter = createCsvWriter({
    path: './milly.csv',
    header: [
        {id: 'trail_id', title: 'trail_id'},
        {id: 'trail_name', title: 'trail_name'},
        {id: 'distance', title: 'distance'},
        {id: 'distance_units', title: 'distance_units'},
        {id: 'elevation_gain', title: 'elevation_gain'},
        {id: 'elevation_units', title: 'elevation_units'},
        {id: 'description', title: 'description'},
        {id: 'route_type', title: 'route_type'},
        {id: 'difficulty', title: 'difficulty'},
        {id: 'general_area', title: 'general_area'},
        {id: 'origin', title: 'origin'},
        {id: 'tags', title: 'tags'}
    ]
  });


  csvWriter.writeRecords([])

  const records = [];
  for (let i = 1; i < tenMillion + 1; i++) {
    if (records.length > 99 || i === tenMillion) {
      await csvWriter.writeRecords(records);
      records.length = 0;
    }
    records.push({
      trail_id: i,
      trail_name: seedFuncs.setTrailName(),
      distance: seedFuncs.setNumber(100),
      distance_units: 'miles',
      elevation_gain: seedFuncs.setNumber(1900),
      elevation_units: 'ft',
      description: seedFuncs.sentences(3, 5, 200),
      route_type: seedFuncs.setRouteType(),
      difficulty: seedFuncs.setDifficulty(),
      general_area: seedFuncs.sentences(1, 3, 65),
      origin: seedFuncs.setOrigin(),
      tags: seedFuncs.tags()
    });
  }

})();


