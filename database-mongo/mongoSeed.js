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

