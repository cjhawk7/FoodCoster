const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');
const should = chai.should();
const { userList } = require('../models');

const { app, runServer, closeServer } = require('../server');
const { TEST_DATABASE_URL } = require('../config')

const expect = chai.expect;

chai.use(chaiHttp);


function seedUserListData() {
  console.info('seeding user list data');
  const seedData = [];
  for (let i = 1; i <= 10; i++) {
    seedData.push({
      budget: faker.random.number({ min: 1, max: 5000 }),
      location: faker.address.city(),
      time: faker.random.number({ min: 1, max: 8 })
    });
  }

  return userList.insertMany(seedData);
}

function tearDownDb() {
  return new Promise((resolve, reject) => {
    console.warn('Deleting database');
    mongoose.connection.dropDatabase()
      .then(result => resolve(result))
      .catch(err => reject(err));
  });
}


describe('userList', function () {

  before(function () {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function () {
    return seedUserListData();
  });

  afterEach(function () {
    return tearDownDb();
  });

  after(function () {
    return closeServer();
  });

  //not sure if describe is being used here or not
  describe('GET endpoint', function () {
    it('should list items on GET', function () {
      return chai.request(app)
        .get('/')
        .then(function (res) {
          expect(res).to.have.status(200);
          expect(res).to.be.html;
          expect(res.text).to.contain('Food Budget Finder')
        });
    });

    it('should list average price on GET', function () {
      let res;
      return chai.request(app)
        .get('/makeRequest/Phoenix')
        .then(function (_res) {
          res = _res;
          expect(res).to.have.status(200);
          expect(res.body.data.average_price).to.be.not.null;
        });
    });

    it('should list search data on GET', function () {
      return chai.request(app)
        //need to get ID for property from database
        .get('/searchData/')
        .then(function (res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
            expect(res.body).to.be.a('object');
            expect(res.body).to.include.keys('budget', 'location', 'time');
        });
    });
  });

  // describe('POST endpoint', function () {

  //   it('should add search data on post', function () {

  //     const newListItem = {
  //       budget: faker.random.number({ min: 1, max: 5000 }),
  //       location: faker.address.city(),
  //       time: faker.random.number({ min: 1, max: 8 }) 
  //     }


  //     return chai.request(app)
  //       .post('/searchData')
  //       .send(newListItem)
  //       .then(function(res) { 
  //         expect(res).to.have.status(201);
  //         expect(res).to.be.json;
  //         expect(res.body).to.be.a('object');
  //         expect(res.body).to.include.keys(
  //           'budget', 'location', 'time');
  //         // cause Mongo should have created id on insertion
  //         expect(res.body.id).to.not.be.null;
  //         expect(res.body.budget).to.equal(newListItem.budget);
  //         expect(res.body.location).to.equal(newListItem.location);
  //         expect(res.body.time).to.equal(newListItem.time);

  //         return userList.findById(res.body.id);
  //       })
  //       .then(function(listItem) {
  //       expect(listItem.budget).to.equal(newListItem.budget);
  //       expect(listItem.location).to.equal(newListItem.location);
  //       expect(listItem.time).to.equal(newListItem.time);
  //       });
  //   })
  // });

  describe('PUT endpoint', function () {

    it('should update fields you send over', function () {
      const updateData = {
        budget: 500,
        location: 'Chicago',
        time: 1
      };

      return userList
      .findOne()
      .then(function(post) {
        updateData.id = post.id;
        
        return chai.request(app)
          .put(`/searchData/${post.id}`)
          .send(updateData);
      })
      .then(function(res) {
        expect(res).to.have.status(204);
    
        return userList.findById(updateData.id);
      })
      .then(function(listItem) {
        expect(listItem.location).to.equal(updateData.location);
        expect(listItem.budget).to.equal(updateData.budget);
        expect(listItem.time).to.equal(updateData.time);
      });
    });
  });

  describe('DELETE endpoint', function () {
    // strategy:
    //  1. get a post
    //  2. make a DELETE request for that post's id
    //  3. assert that response has right status code
    //  4. prove that post with the id doesn't exist in db anymore
    it('should delete a post by id', function () {

      let post;

      return userList
        .findOne()
        .then(_post => {
          post = _post;
          return chai.request(app).delete(`/searchData/${post.id}`);
        })
        .then(res => {
          res.should.have.status(204);
          return userList.findById(post.id);
        })
        .then(_post => {
          // when a variable's value is null, chaining `should`
          // doesn't work. so `_post.should.be.null` would raise
          // an error. `should.be.null(_post)` is how we can
          // make assertions about a null value.
          should.not.exist(_post);
        });
    });
  });
});


