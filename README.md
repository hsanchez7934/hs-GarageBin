# fullstack-boilerplate

## Setup
  - Download / Clone this repo.

  - 'npm install'

  - Change `APP NAME` on line 23 of `server.js`

  - Change `NAME` on line 7 and line 31 of `knexfile.js`

  - Change `APPNAME` on line 16 of circle.yml (or delete the file if you're not using CI)

  - Create schema `knex migrate:make initial`
    - run schema `knex migrate:latest`

  - Create seed `knex seed:make initial` (if needed)
    - run seed `knex seed:run`

  - DELETE or CHANGE this `README.md`

## Development
  - Server code lives in `./server.js`

  - HTML in `./public/index.html`

  - JavaScript in `./src/index.js`

  - CSS/SCSS in `./src/styles.scss`

  - Tests in `./test/routes.spec.js`

## Running
  - In one terminal run `npm run build`
    - this will start webpack and leave it watching files and rebuilding with changes.

  - In another terminal run `nodemon server.js` or `node server.js`
    - this will start the server.

Webpack builds to `bundle.js`.  This file is git ignored and package.json is set for heroku to a new bundle when deployed.
