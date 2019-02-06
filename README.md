# System Design Capstone Log for Trails Service

## Table Of Contents:
+ [Related Projects](#Related-Projects)
+ [Requirements](#Requirements)
+ [Installation-for-MySQL-Implementation](#Installation/MySQL)
+ [Phase 1: Scale the Database](#Phase-1:-Scale-the-Database)
+ [Backlog / Noted Opportunities](#Backlog-/-Noted-Opportunities)
+ [Phase 2: Implement and Scale Secondary Database](#Phase-2:-Implement-and-Scale-Secondary-Database)
+ [Phase 3: Optimize Primary and Secondary Databases. Build CRUD Operation](#Phase-3:-Optimize-Primary-and-Secondary-Databases.-Build-CRUD-Operation)
+ [API Endpoints](API-Endpoints)
+ [JSON Example](JSON-Example)

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
## Phase 3: Optimize Primary and Secondary Databases. Build CRUD Operation


### API Enpoints

+ DELETE `/:trailId/delete`
  - Given a trailId, deletes the trail information.
+ GET `/:trailId/trailInfo`
  - Given a trailId, retrieves all trail information for that trail.


### JSON Example

Example JSON response to `http:localhost:3001/6784641/trailInfo` for a trail with an ID of 6784641:

```json
{
  "data": {
    "attributes": {
      "trail_name": "Golden Gate Park Trail",
      "distance": 73,
      "distance_units": "miles",
      "elevation_gain": 1732,
      "elevation_units": "ft",
      "description": "Magna deserunt ea proident laborum. Laboris veniam. Nisi aliquip sint magna.",
      "route_type": "Loop",
      "difficulty": "BernieBuster",
      "general_area": "Ea adipisicing",
      "origin": "http://www.labore.com/cupidatat/aliqua.html",
      "tags": []
    },
    "id": "6784641",
    "type": "trail"
  }
}

```

-
[1]: https://docs.mongodb.com/manual/core/data-modeling-introduction/
[2]: https://docs.mongodb.com/manual/core/data-model-design/#data-modeling-embedding
[3]: https://docs.mongodb.com/manual/core/data-model-design/#normalized-data-models
[4]: https://docs.mongodb.com/manual/reference/program/mongoimport/index.html
[5]: https://stackoverflow.com/a/44623546