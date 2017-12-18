const chai = require('chai');
// eslint-disable-next-line no-unused-vars
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

chai.use(chaiHttp);

describe('Client Routes', () => {
  it('should return the homepage', () => {
    return chai.request(server)
      .get('/')
      .then(response => {
        response.should.have.status(200);
        response.should.be.html;
      })
      .catch(error => {
        throw error;
      });
  });
  it('should return a 404 for a route that does not exist', () => {
    return chai.request(server)
      .get('/sad')
      .then(response => {
        response.should.have.status(404);
      })
      .catch(error => {
        throw error;
      });
  });
});

describe('API Routes', () => {
  before((done) => {
    database.migrate.latest().then(() => done()).catch(error => {
      throw error;
    });
  });

  beforeEach((done) => {
    database.seed.run().then(() => done()).catch(error => {
      throw error;
    });
  });

  it(`app.get /api/v1/items`, () => {
    return chai.request(server)
      .get(`/api/v1/items`)
      .then(response => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body.length.should.equal(3);

        for (var item = 0; item < response.body.length; item++) {
          response.body[item].should.have.property('title');
          response.body[item].should.have.property('id');
          response.body[item].should.have.property('body');
          response.body[item].should.have.property('rating');
        }

        response.body[0].title.should.equal('Wheels');
        response.body[0].body.should.equal('Need to sell');
        response.body[0].rating.should.equal('Sparkling');
        response.body[0].id.should.equal(1);
      })
      .catch(error => error);
  });

  it(`app.post /api/v1/items`, (done) => {
    chai.request(server)
      .post(`/api/v1/items`)
      .send({
        id: 4,
        title: 'Concrete Bags',
        body: 'Deliver to friends house',
        rating: 'Dusty'
      })
      .then(response => {
        response.should.have.status(201);
        response.should.be.json;
        response.body.should.be.a('object');
        response.body.should.have.property('title');
        response.body.should.have.property('id');
        response.body.should.have.property('body');
        response.body.should.have.property('rating');

        chai.request(server)
          .get(`/api/v1/items`)
          .then(response => {
            response.body.length.should.equal(4);
            response.body[3].title.should.equal('Concrete Bags');
            response.body[3].body.should.equal('Deliver to friends house');
            response.body[3].id.should.equal(4);
            response.body[3].rating.should.equal('Dusty');
            done();
          });
      })
      .catch(error => error);
  });

  it(`app.post /api/v1/items,
           should return a 422 status if
           the post body is missing a
           required paramter`, (done) => {
      chai.request(server)
        .post(`/api/v1/items`)
        .send({
          id: 4,
          body: 'Deliver to friends house',
          rating: 'Dusty'
        })
        .then(response => {
          response.should.have.status(422);
          // eslint-disable-next-line max-len
          response.body.error.should.equal('Garage item is missing title property');
          done();
        })
        .catch(error => error);
    });

  it(`app.delete /api/v1/items,
           if item is found, should
           successfully destroy and
           return response status 204`, (done) => {
      chai.request(server)
        .delete(`/api/v1/items/1`)
        .then(response => {
          response.should.have.status(204);
          done();
        });
    });

  it(`app.delete /api/v1/items,
           if item is not found, should
           successfully destroy and
           return response status 404`, (done) => {
      chai.request(server)
        .delete(`/api/v1/items/10`)
        .then(response => {
          response.should.have.status(404);
          response.body.error.should.equal('Garage item not found');
          done();
        })
        .catch(error => error);
    });

  it(`app.patch /api/v1/items, should be able update
      item information; body, title, or rating`, (done) => {
      chai.request(server)
        .patch(`/api/v1/items/1`)
        .send({
          title: 'Scrap metal',
          body: 'Take to recycler',
          rating: 'Rancid'
        })
        .then(response => {
          response.should.have.status(204);
          done();
        })
        .catch(error => error);
    });

  it(`app.patch /api/v1/items, should not be able
      to update garage item if a title, body, or rating
      property is missing`, (done) => {
      chai.request(server)
        .patch(`/api/v1/items/1`)
        .send({
          body: 'Take to recycler',
          rating: 'Rancid'
        })
        .then(response => {
          response.should.have.status(422);
          // eslint-disable-next-line max-len
          response.body.error.should.equal(`Must send patch as object literal with keys of body, title, and rating with string value.`);
          done();
        })
        .catch(error => error);
    });

});
