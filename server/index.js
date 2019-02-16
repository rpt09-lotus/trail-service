const express = require('express');
const app = express();
require('dotenv').config();
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const hbe = require('express-handlebars');
const trailInfo = require('./trailInfo');

const port = 80
console.log(port, 'this is port')
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
const bundleSource = 'http://ec2-34-217-75-14.us-west-2.compute.amazonaws.com/app.js';

app.use('/:trailId', trailInfo);
app.get('/:trailId(\\d+$)*?', (req, res) => {
  res.status(200).render('../public/index', {appSource: bundleSource});
});

// Console log for dev or prod
var serviceHost = 'http://ec2-34-217-75-14.us-west-2.compute.amazonaws.com'
app.listen(port, () => console.log(`trail-service widget listening on ${serviceHost}`));

module.exports = app;
