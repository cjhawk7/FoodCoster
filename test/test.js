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


function seedUserListData() {
  console.info('seeding user list data');
  const seedData = [];
  for (let i = 1; i <= 10; i++) {
    seedData.push({
      budget: faker.random.number({min:1, max:5000}), 
      location: faker.address.city(),
      time: faker.random.number({min:1, max:8})
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

//not sure if describe is being used here or not
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
    //need to get ID for property from database
      .get('/userList/5aecaaa170003aa5b9f40784')
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
});
