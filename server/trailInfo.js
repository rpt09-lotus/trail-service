const express = require('express');
const router = express.Router({mergeParams: true});
const db = require('../database/index');
const service = require('./serviceHelpers');
const seedFunc = require('../generateSql.js')

/*
  API endpoint for trail service
  Requests must include /:trailId/trailInfo
  Example: http://localhost:3001/3/trailInfo
  for the Trail where trail_id === 3
*/
router.get('/trailInfo', (req, res) => {
  var theId = req.params.trailId;
  db.getTrail(theId, (row) => {
    // trail object for response
    // see example-data.json for example
    var theTrail = row[0];
    var resObj = {};
    resObj.data = {
      attributes: {}
    };
    for (var prop in theTrail) {
      if (prop === 'trail_id') {
        resObj.data['id'] = theTrail['trail_id'].toString();
      } else {
        resObj.data.attributes[prop] = theTrail[prop];
      }
      resObj.data.type = 'trail';
    }
    db.getTags(theId, (tags) => {
      resObj.data.attributes.tags = tags;
      res.status(200).json(resObj);
    });
  });
});

/*
  API endpoint for trail service Banner component state
*/
router.get('/banner', (req, res) => {
  var theId = req.params.trailId;
	console.log('AHHHHHHHHHHHH', theId)
  db.getTrail(theId, (row) => {
    var theTrail = row[0];
    // banner state only needs trailName and difficulty from trail-service
    var resObj = {
      trailId: theTrail.trail_id,
      trailName: theTrail.trail_name,
      difficulty: theTrail.difficulty
    };
    // banner state data from reviews and trail-photos services
    service.getBannerData(theId, (bannerRes) => {
      resObj.totalReviews = bannerRes.stats.totalReviews;
      resObj.avgRating = bannerRes.stats.avgRating;
      resObj.trailRank = bannerRes.rank;
      resObj.heroUrl = bannerRes.heroUrl;
      resObj.photosCount = bannerRes.count;
      res.status(200).json(resObj);
    });
  });
});

/*
  API endpoint for trail service TrailDescription component state
*/
router.get('/trailDescription', (req, res) => {
  var theId = req.params.trailId;
  db.getTrail(theId, (row) => {
    // trail object for response to trailDescription component
    var theTrail = row[0];
    var resObj = {
      description: theTrail.description,
      distance: theTrail.distance,
      distanceUnits: theTrail.distance_units,
      elevationGain: theTrail.elevation_gain,
      elevationUnits: theTrail.elevation_units,
      routeType: theTrail.route_type,
      tags: theTrail.tags.split(',')
    };
    res.status(200).json(resObj);
  });
});

module.exports = router;
