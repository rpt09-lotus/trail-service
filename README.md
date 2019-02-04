# System Design Capstone Log for Trails Service

## Table Of Contents:
+ [Related Projects](#Related-Projects)
+ [Requirements](#Requirements)
+ [Installation-for-MySQL-Implementation](#Installation/MySQL)
+ [Phase 1: Scale the Database](#Phase-1:-Scale-the-Database)
+ [Backlog / Noted Opportunities](#Backlog-/-Noted-Opportunities)
+ [Phase 2: Implement and Scale Secondary Database](#Phase-2:-Implement-and-Scale-Secondary-Database)

## Related Projects
- [Trails (FEC)](https://github.com/rpt09-scully/trail-service)

## Requirements
 - Server: [Express](http://expressjs.com/)
  - DB original: [MySQL](https://dev.mysql.com/doc/refman/5.7/en/)
  - DB secondary: [MongoDB](https://docs.mongodb.com/manual/)

## Installation/MySQL
After cloning the project, go to the root directory then install all required dependencies by running

```sh
$> cd /path/to/trails-service
npm install
```

Start your MySQL database
```sh
$> mysql server.start
```

Setup .env file (for sql credentials)
```sh
$> touch.env
```

Seed database `TrailsService` (change credentials as needed) with 10 million records
```sh
$> touch.env
```

Inside `.env` place your SQL credentials (change if needed)
```
# DB_HOST=localhost
# DB_USER=root
# DB_PASS=
```

To execute:

```sh
$ npm run server-dev
```

## Log

## Phase 1: Scale the Database

### DBMS Selection and Data Generation

- [x] Select an DBMS technology that was not used in FEC; preferably of a different type as was used in FEC

Working with the [trails-service](https://github.com/rpt09-lotus/trail-service) from FEC, which used MySQL.  I am refactoring the original database and testing it against MongoDB as my secondary

> Think carefully about the use-cases for your service and design a schema that is realistic for what your service is doing. It's likely that your service is the source of truth for certain information so be sure to represent your information in a way that accomplishes the goals of your use-cases.

The trails service retrieves data from the database for a given trail and provides a json response to `GET` requests of the `{trailID}/trailInfo` API end point. Currently, the seed script for the legacy codeis only generating only 136 unique records.  These unique records make up the `trails` table.  There is also a `tags` table with 1000+ records that are then used by the `trails` table.  As interesting as it would be to generate 50 million secondary records to correspond with my 10 million primary records, I will be creating a function that generates multiple `trail tags` to be includedin each primary rcord, thus eliminating the need for an additional MySQL table which for the purpose of this project, is unnecessary

- [ ] Write a data generation script that can produce a minimum of 10M records and efficiently load this data into your service's DBMS. **Use your simulated dataset for ALL subsequent testing.**



"Normalized data models describe relationships using [references](https://docs.mongodb.com/manual/reference/database-references/) between documents."[3]

> In general, use normalized data models:
>
> - when embedding would result in duplication of data but would not provide sufficient read performance advantages to outweigh the implications of the duplication.
> - to represent more complex many-to-many relationships.
> - to model large hierarchical data sets.

"...client-side applications must issue follow-up queries to resolve the references. In other words, normalized data models can require more round trips to the server."

##Phase 2: Implement and Scale Secondary Database
#### Schema Notes

Draft Model for Trails:

```JavaScript
{
  trail_id: {
    type: Number,
    required: true
  },
  trail_name: {
    type: String,
    required: true
  },
  distance: {
    type: Number,
    required: true
  },
  distance_units: {
    type: String,
    required: true
  },
  elevation_gain: {
    type: Number,
    required: true
  },
  elevation_units: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  route_type: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    required: true
  },
  tags: {
    type: [String],
    required: true
  },
  general_area: {
    type: String,
    required: true
  },
  origin: {
    type: String,
    required: true
  },
}
```

#### Data Import

- "The [mongoimport](https://docs.mongodb.com/manual/reference/program/mongoimport/index.html#bin.mongoimport) tool imports content from Extended JSON, CSV, or TSV."[4]
- mongoimport only supports data files that are UTF-8 encoded.

Hmmmm. If I use `.csv` or `.tsv` as the output of my generation script, and the import source for my DB, how would I represent an array in one of the "columns" in the file for `activities`?

Could `activity0,activity1,activity2,activity3activity4...` be imported as an array?

test mongoexport writing csv:

Add test document[5]:

```sh
db.newcol.insert({
... id:'123',
... name:'thename',
... activities: ['one','two','three','four']
... })
```

Export:

```sh
mongoexport -d test -c newcol --fields id,name,activities --type csv > out.csv
```

Result:

```sh
───────┬─────────────────────────────────────────────────────
       │ File: out.csv
───────┼─────────────────────────────────────────────────────
   1   │ id,name,activities
   2   │ 123,thename,"[""one"",""two"",""three"",""four""]"
───────┴─────────────────────────────────────────────────────
```

So, apparently when the output file format of `mongoexport` is csv, arrays like the profile-service activities are written with quotes in a stringified manner (like above), but are _not_ imported as array types by `mongoimport`, even though the documentation suggests otherwise. Confusing.

Have to re-write my data generation script to produce JSON instead of csv to support appropriate column types. Note that the [`--columnsHaveTypes`](https://docs.mongodb.com/manual/reference/program/mongoimport/index.html#cmdoption-mongoimport-columnshavetypes) `mongoimport` option does not include any options for the `array` type. Sad panda.

**Refactoring**

I refactored `seed-data.js` to produce valid json for import to MongoDB. Initially, writing to a json file with 1MM records using a simple loop and array to store all records before writing, took 29.171 seconds with `--max-old-space-size=4096`, laptop crashed without that option.

Then I tested writing directly to MongoDB instead of a file. I figured if we're working with json, might as well try inserting it directly, instead of the interim step of a file.

I tested several variations of generating data documents and writing to the db. What seemed to worked best was a batch size of 50,000, repeated 200 times. This didn't stress my laptop, didn't require and additional memory flags, and completed the generation of the data and db insertion in 1188.63 seconds, or about 20 minutes.

I [confirmed this](https://gist.github.com/ryanbrennan12/28d3688ac27d1f273e3103851dcd6d55) with `SELECT COUNT(*) FROM trail;`  and `SELECT trail_name FROM trail WHERE trail_id= 666444; `from MySql.

---

[1]: https://docs.mongodb.com/manual/core/data-modeling-introduction/
[2]: https://docs.mongodb.com/manual/core/data-model-design/#data-modeling-embedding
[3]: https://docs.mongodb.com/manual/core/data-model-design/#normalized-data-models
[4]: https://docs.mongodb.com/manual/reference/program/mongoimport/index.html
[5]: https://stackoverflow.com/a/44623546