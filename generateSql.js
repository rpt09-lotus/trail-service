// This is a utility file to generate SQL INSERT statments
// for the schema.sql file. **You don't need to use this.**
// To actually seed your database, please see seed-database
// script in package.json

const loremIpsum = require('lorem-ipsum');

// INSERT INTO trail (trail_id, trail_name, distance,
//   distance_units, elevation_gain, elevation_units,
//   description, route_type, difficulty, general_area, origin)
//   VALUES (20, "Wiliwilinui Bernie Ridge Trail", 4.5, "miles",
//   1597, "ft", "Wiliwilinui Ridge Trail is a 4.5 mile out and
//   back trail located near Honolulu, Hawaii that offers the
//   chance to see wildlife and is rated as moderate. The trail
//   offers a number of activity options and is accessible
//   year-round. Dogs are also able to use this trail but must be
//   kept on leash.", "Out & Back", "Moderate", "Honolulu,
//   Hawaii",
//   "https://www.alltrails.com/trail/us/hawaii/wiliwilinui-ridge-trail");

const sentences = function(num, words, len) {
  let sent = loremIpsum({
    count: num,
    units: 'sentences',
    sentenceLowerBound: 2,
    sentenceUpperBound: words,
    format: 'plain'
  });
  return sent.substring(0, len);
};

const words = function(num) {
  return loremIpsum({
    count: num,
    units: 'words',
    format: 'plain'
  });
};

const setNumber = function(max) {
  return Math.floor(Math.random() * Math.floor(max));
};

const setOrigin = function() {
  let domain = loremIpsum({
    count: 1,
    units: 'words',
    format: 'plain'
  });
  let sub = loremIpsum({
    count: 1,
    units: 'words',
    format: 'plain'
  });
  let page = loremIpsum({
    count: 1,
    units: 'words',
    format: 'plain'
  });
  let results = `http://www.${domain}.com/${sub}/${page}.html`;
  return results.substring(0, 99);
};

const setRouteType = function() {
  let types = ['Out & Back', 'Loop', 'Bernie'];
  let indx = Math.floor(Math.random() * Math.floor(3));
  return types[indx];
};

const setTrailName = function() {
  let types = [
    'Golden Gate Park Trail',
    'Crescent Creek Trail',
    'Hope Point',
    'Lost Lake Trail',
    'Ressurection Pass Trail',
    'Alamere Falls via Coast Trail from Palomarin Trailhead',
    'Coast Camp/Laguna Loop',
    'Presidio Bay Area Ridge Trail',
    'Presidio Ecology Trail',
    'BeltLine Eastside Trail From Piedmont Park',
    'Bull Sluice Lake',
    'Cascade Springs Nature Preserve Outer Loop',
    'Chastain Park Trail',
    'Grant Park Loop Trail',
    'Canyon Trail to Waipoo Falls',
    'Kaiwa Ridge (Pillbox) Trail',
    "Makapu'u Point Lighthouse Trail (Kaiwi)",
    'Na Pali Coast (Kalalau) Trail',
    'Wiliwilinui Bernie Ridge Trail'
  ];
  let indx = Math.floor(Math.random() * Math.floor(3));
  return types[indx];
};

const setDifficulty = function() {
  let howHard = ['Easy', 'Moderate', 'BernieBuster'];
  let i = Math.floor(Math.random() * Math.floor(3));
  return howHard[i];
};

const trailStrings = function() {
  let inserts = '';
  for (let i = 21; i < 101; i++) {
    let insertStr = `INSERT INTO trail (trail_id, trail_name, distance, distance_units, elevation_gain, elevation_units, description, route_type, difficulty, general_area, origin) VALUES (${i}, "${sentences(
      1,
      4,
      70
    )}", ${setNumber(16)}, "miles", "${setNumber(1900)}", "ft", "${sentences(
      3,
      5,
      200
    )}", "${setRouteType()}", "${setDifficulty()}", "${sentences(
      1,
      3,
      65
    )}", "${setOrigin()}");\n`;
    inserts += insertStr;
  }
  return inserts;
};

// INSERT INTO trail_tags (trail_id, tag_id) VALUES (21, 8);

const trailTags = function() {
  let str = '';
  for (let i = 21; i <= 100; i++) {
    for (let j = 1; j < 11; j++) {
      let trTag = `INSERT INTO trail_tags (trail_id, tag_id) VALUES (${i}, ${j});\n`;
      str += trTag;
    }
  }
  return str;
};

const tags = () => {
  const trailTags = [
    'dogs on leash',
    'hiking',
    'mountain biking',
    'trail walking',
    'views',
    'wildlife',
    'muddy',
    'dog friendly',
    'backpacking',
    'birding',
    'camping',
    'nature trips',
    'paddle sports',
    'beach',
    'cave',
    'forest',
    'river',
    'waterfall',
    'bugs',
    'historic site',
    'wildlife',
    'rocky',
    'kid friendly',
    'no shade',
    'wheelchair friendly',
    'wild flowers',
    'lake',
    'paved',
    'road biking'
  ];

  let str = '';
  let numOfTags = Math.floor(Math.random() * 8) + 5;

  for (let i = 0; i < numOfTags; i++) {
    let num = Math.floor(Math.random() * 20);
    str += trailTags[num] + ',';
  }

  return str;
};

module.exports = {
  trailStrings,
  trailTags,
  setDifficulty,
  setRouteType,
  setOrigin,
  setNumber,
  words,
  sentences,
  setTrailName,
  tags
};

