const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const requireHTTPS = (request, response, next) => {
  if (request.header('x-forwarded-proto') !== 'https') {
    return response.redirect(`https://${request.header('host')}${request.url}`);
  }
  return next();
};

if (process.env.NODE_ENV === 'production') {
  app.use(requireHTTPS);
}

app.set('port', process.env.PORT || 3002);
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.locals.title = 'GarageBin';

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.get(`/api/v1/items`, (request, response) => {
  database('garage_items').select()
    .then(items => response.status(200).json(items))
    .catch(error => response.status(500).json({ error }));
});

app.post(`/api/v1/items`, (request, response) => {
  const body = request.body;
  for (let requiredParameter of ['title', 'body', 'rating']) {
    if (!body[requiredParameter]) {
      return response.status(422).json(
        { error: `Garage item is missing ${requiredParameter} property` }
      );
    }
  }
  return database('garage_items').insert(body, '*')
    .then(item => response.status(201).json(item[0]))
    .catch(error => response.status(500).json(error));
});

app.delete(`/api/v1/items/:id`, (request, response) => {
  const { id } = request.params;

  database('garage_items').where({ id }).del()
    .then(item => {
      return item
        ? response.sendStatus(204)
        : response.status(404).json({ error: `Garage item not found` });
    })
    .catch(error => response.status(500).json({ error }));
});

app.listen(app.get('port'), () => {
  // eslint-disable-next-line no-console
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports = app;
