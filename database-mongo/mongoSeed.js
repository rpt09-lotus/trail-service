const mongoose = require('mongoose');
const Trail = require('./TrailModel');
const seedFuncs = require('../generateSql.js');



mongoose.connect('mongodb://localhost/trailsService')
.then(() => {
  console.log('DATABASE CONNECTED!!!!')
})
.catch((err) => {
  console.log('!!WE HAVE AN ERROR: ', err)
});

const trailTags = ['dogs on leash','hiking','mountain biking','trail walking','views','wildlife','muddy','dog friendly','backpacking','birding','camping','nature trips','paddle sports',
'beach','cave','forest','river','waterfall','bugs','historic site','wildlife','rocky','kid friendly','no shade','wheelchair friendly','wild flowers','lake','paved','road biking'];

let tagArray = []

Trail.deleteMany({}, (err) => {
  console.log('collection removed');

  // Batch configuration
  let batchLimit = 5000;
  let batch = 1;

  let trailsBatch = [];


  const createTrail = (trailId) => {

    let trail = new Trail({
      trail_id: i,
      trail_name: seedFuncs.setTrailName(),
      distance: seedFuncs.setNumber(100),
      distance_units: 'miles',
      elevation_gain: seedFuncs.setNumber(1900),
      elevation_units: 'ft',
      description: seedFuncs.sentences(3, 5, 200),
      route_type: seedFuncs.setRouteType(),
      difficulty: seedFuncs.setDifficulty(),
      tags: seedFuncs.tags(),
      general_area: seedFuncs.sentences(1, 3, 65),
      origin: seedFuncs.setOrigin()
    });
    trailsBatch.push(trail);
  };

  const batchSaver = () => {
    return new Promise ((resolve, reject) => {
      Trail.insertMany(trailsBatch, (err, docs) => {
        if (err) {
          reject('error occured in inserting to db: ', err);
        } else {
          resolve();
        }
      });
    });
  };


  let records = 10000000;

  const createRecords = async () => {
  let start = new Date();
  for (i = records; i > 0; i--) {
    createTrail(i);
    if (trailsBatch.length === batchLimit) {
      await batchSaver();
      trailsBatch.length = 0;

    }
  }
  let end = new Date();
  let seconds = (end.getTime() - start.getTime()) / 1000;
  console.log(`Completed saving ${records} primary records to DB in ${seconds} seconds`);
};
  createRecords();

});












  // Batch saver





