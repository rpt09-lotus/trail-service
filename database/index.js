require('dotenv').config();

if (process.env.RDS_HOSTNAME) {
  var dbh = process.env.RDS_HOSTNAME;
  var dbu = process.env.RDS_USERNAME;
  var dbpass = process.env.RDS_PASSWORD;
  var dbport = process.env.RDS_PORT;
} else {
  var dbh = process.env.DB_HOST;
  var dbu = process.env.DB_USER;
  var dbpass = process.env.DB_PASS;
  var dbport = null;
}

var deleteTrail = (id, callback) => {
  knex('trail')
  .where('trail_id', {id})
  .del()
  .then((info) => {
    callback(info)
  })
}

var knex = require('knex')({
  client: 'mysql',
  connection: {
    host: dbh,
    user: dbu,
    password: dbpass,
    port: dbport,
    database: 'trailService'
  }
});

// Get a trail from the database using its `id` and pass the query
// result row to the callback
// called from ../server/index.js

var getTrail = (id, callback) => {
  knex.select()
    .from('trail')
    .where('trail_id', '=', id)
    .then((row) => {
      callback(row);
    })
    .catch((error) => {
      console.error('getTrail select error: ', error);
    });
};

var getTags = (id, callback) => {
  // SELECT tag_name FROM tags WHERE tag_id IN (SELECT tag_id FROM trail_tags WHERE trail_id = 1)
  var subquery = knex.select('tag_id').from('trail_tags').where('trail_id', '=', id);
  knex.select('tag_name').from('tags')
    .whereIn('tag_id', subquery)
    .then((tags) => {
      var tagsArr = [];
      tags.forEach( (tag) => {
        tagsArr.push(tag.tag_name);
      });
      callback(tagsArr);
    })
    .catch((error) => {
      console.error('getTags select error: ', error);
    });
};

// for testing or whatev
// Not used in FEC implementation
var getAllTrails = (callback) => {
  knex.select()
    .from('trail')
    .then((rows) => {
      callback(rows);
    })
    .catch((error) => {
      console.error('getAllTrails select error: ', error);
    });
};

module.exports.getAllTrails = getAllTrails;
module.exports.getTrail = getTrail;
module.exports.getTags = getTags;
