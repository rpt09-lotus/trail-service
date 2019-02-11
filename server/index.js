const express = require('express');
const app = express();
require('dotenv').config();
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const hbe = require('express-handlebars');
const trailInfo = require('./trailInfo');

const port = process.env.PORT || 3001;

// log every request to the console
// https://www.npmjs.com/package/morgan#dev
app.use(morgan('dev'));
app.use(cors());

app.engine('html', hbe());
app.set('view engine', 'html');
app.set('views', path.resolve(__dirname + '/../public'));

// Serve static index.html w bundle from ../public
app.use(express.static(path.resolve(__dirname + '/../public')));

// Pass bundle location for dev or prod
const bundleSource = (port === 3001) ? 'http://localhost:3001/app.js' : 'http://ec2-54-202-83-16.us-west-2.compute.amazonaws.com/app.js' ;

app.use('/:trailId', trailInfo);
app.get('/:trailId(\\d+$)*?', (req, res) => {
  res.status(200).render('../public/index', {appSource: bundleSource});
});

// Console log for dev or prod
var serviceHost = (process.env.RDS_HOSTNAME) ? 'http://ec2-54-202-83-16.us-west-2.compute.amazonaws.com.com' : `http://localhost:${port}`;
app.listen(port, () => console.log(`trail-service widget listening on ${serviceHost}`));

module.exports = app;
