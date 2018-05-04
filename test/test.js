const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');
const should = chai.should();
const {userList} = require('../models');

const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config')

const expect = chai.expect;

chai.use(chaiHttp);

function tearDownDb() {
  return new Promise((resolve, reject) => {
    console.warn('Deleting database');
    mongoose.connection.dropDatabase()
      .then(result => resolve(result))
      .catch(err => reject(err));
  });
}

function seedUserListData() {
  console.info('seeding blog post data');
  const seedData = [];
  for (let i = 1; i <= 10; i++) {
    seedData.push({
      budget: faker.random.number(), 
      location: faker.address.city(),
      time: faker.random.number()
    });
  }
  // this will return a promise
  return BlogPost.insertMany(seedData);
}


describe('userList', function() {

  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function() {
    return seedUserListData();
  });

  afterEach(function() {
    return tearDownDb();
  });

  after(function() {
    return closeServer();
  });


 describe('GET endpoint', function() {

  it('should list items on GET', function() {


  return chai.request(app)
    .get('/')
    .then(function(res) {
      expect(res).to.have.status(200);
      expect(res).to.be.html;
      expect(res.text).to.contain('Food Budget Finder')
    });
  });


  it('should list average price', function() {
    let res;
    return chai.request(app)
      .get('/makeRequest/Phoenix')
      .then(function(_res) {
        res = _res;
        expect(res).to.have.status(200);
        expect(res.body.makeRequest).to.have.length.of.at.least(1);
        return searchSchema.count();
      })
      .then(function(count) {
        expect(res.body.makeRequest).to.have.length.of(count);
      });
  });

  it('should list average price on GET', function() {
    return chai.request(app)
      .get('/userList/')
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body.length).to.be.at.least(1);

        const expectedKeys = ['budget', 'location', 'time'];
        res.body.forEach(function(item) {
          expect(item).to.be.a('object');
          expect(item).to.include.keys(expectedKeys);
        });
      });
  });

});

// it('should add an item on POST', function() {
//   const newItem = {name: 'coffee', checked: false};
//   return chai.request(app)
//     .post('/userList')
//     .send(newItem)
//     .then(function(res) {
//       expect(res).to.have.status(201);
//       expect(res).to.be.json;
//       expect(res.body).to.be.a('object');
//       expect(res.body).to.include.keys('budget', 'location', 'time');
//       expect(res.body.id).to.not.equal(null);
//       // response should be deep equal to `newItem` from above if we assign
//       // `id` to it from `res.body.id`
//       expect(res.body).to.deep.equal(Object.assign(newItem, {id: res.body.id}));
//     });
// });





