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
});

return chai.request(app)
  .post('/searchData')
  .send(newListItem)
  .then(function(res) {
    expect(res).to.have.status(201);
    expect(res).to.be.json;
    expect(res.body).to.be.a('object');
    expect(res.body).to.include.keys(
      'budget', 'location', 'time');
    // cause Mongo should have created id on insertion
    expect(res.body.id).to.not.be.null;
    expect(res.body.budget).to.equal(newListItem.budget);
    expect(res.body.location).to.equal(newListItem.location);
    expect(res.body.time).to.equal(newListItem.time);

    return Restaurant.findById(res.body.id);
  })
  .then(function(listItem) {
    expect(listItem.name).to.equal(newListItem.name);
    expect(listItem.cuisine).to.equal(newListItem.cuisine);
    expect(listItem.borough).to.equal(newListItem.borough);
  });


