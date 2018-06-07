const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');
const should = chai.should();
const { userList } = require('../models');
const { app, runServer, closeServer } = require('../server');
const { DATABASE_URL } = require('../config')

const expect = chai.expect;

chai.use(chaiHttp);

let authToken;
function seedUserListData() {
    
  console.info('seeding user list data');
  const seedData = [];
  for (let i = 1; i <= 10; i++) {
    seedData.push({
      budget: 1,
      location: 'Phoenix',
      meals: 1,
      time: 1,
      info: 'hi'
    });
  }

  return chai.request(app).post('/api/users').send({
    firstName: "m",
    lastName: "m",
    password: "user",
    username: "user"

  }).then((o) => {return userList.insertMany(seedData)})
  .then((data)=> {return chai.request(app).post('/api/auth/login').send({
    username: 'user',
    password: 'user'
  })
  .then(obj => {authToken = obj.body.authToken;return data})
  
})
}

function tearDownDb() {
  // return new Promise((resolve, reject) => {
  //   console.warn('Deleting database');
  //   mongoose.connection.dropDatabase()
  //     .then(result => resolve(result))
  //     .catch(err => reject(err));
  // });
}


describe('userList', function () {
  before(function () {
  return runServer(DATABASE_URL);
   
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

  
  describe('GET endpoint', function () {
    it('should list items on GET', function () {
      return chai.request(app)
        .get('/')
        .then(function (res) {
          expect(res).to.have.status(200);
          expect(res).to.be.html;
          expect(res.text).to.contain('FoodCoster')
        });
    });

    it('should list average price on GET', function () {
      let res;
      return chai.request(app)
        .get('/makeRequest/Chicago')
        .then(function (_res) {
          res = _res;
          expect(res).to.have.status(200);
          expect(res.body.data.average_price).to.be.not.null;
        });
    });
  });

  it('should return search data with right fields', function () {

    let resPost;
    return chai.request(app)
      .get('/searchData')
      .set('Authorization', 'Bearer ' + authToken)
      .then(function (res) {
        console.log('burrito')
        console.log(res.body);
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body.firstName).to.have.length.of.at.least(1)
        expect(res.body).to.include.keys('firstName', 'lastName', 'password', 'username', 'posts')
      
      })
  });

  describe('POST endpoint', function () {

    it('should add search data on post', function () {
  
      const newListItem = {
        budget: faker.random.number({ min: 1, max: 5000 }),
        location: faker.address.city(),
        meals: faker.random.number({ min : 1, max: 4 }),
        time: faker.random.number({ min: 1, max: 8 }),
        info: faker.random.words(),
    
      }
      console.log(authToken);

      return chai.request(app)
        .post('/searchData')
        .set('Authorization', 'Bearer ' + authToken)
        .send(newListItem)
        .then(function(res) { 
          expect(res).to.have.status(201);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.include.keys(
            'budget', 'location', 'time', 'meals', 'info', 'unit' );
          expect(res.body.id).to.not.be.null;
          expect(res.body.budget).to.equal(newListItem.budget);
          expect(res.body.location).to.equal(newListItem.location);
          expect(res.body.time).to.equal(newListItem.time);
          expect(res.body.meals).to.equal(newListItem.meals);
          expect(res.body.info).to.equal(newListItem.info);

          return userList.findById(res.body.id);
        })
        // .then(function(listItem) {
        // console.log('XXXXXXXXXXXXXXXXXXXXX');
        // console.log(listItem);
        // expect(listItem.budget).to.equal(newListItem.budget);
        // expect(listItem.location).to.equal(newListItem.location);
        // expect(listItem.meals).to.equal(newListItem.meals);
        // expect(listItem.time).to.equal(newListItem.time);
        // expect(listItem.info).to.equal(newListItem.info);
        // });
    })
  });

  describe('PUT endpoint', function () {

    it('should update fields you send over', function () {
      const updateData = {
        budget: 1,
        location: 'Athens',
        meals: 1,
        time: 1,
      };

      return userList
      .findOne()
      .then(function(post) {
        updateData.id = post.id;
        
        return chai.request(app)
          .put(`/searchData/${post.id}`)
          .set('Authorization', 'Bearer ' + authToken)
          .send(updateData);
      })
      .then(function(res) {
        expect(res).to.have.status(204);
    
        return userList.findById(updateData.id);
      })
      .then(function(listItem) {
        console.log('ZZZZZZZZZZZZZZ');
        console.log(listItem);
        expect(listItem.location).to.equal(updateData.location);
        expect(listItem.budget).to.equal(updateData.budget);
        expect(listItem.meals).to.equal(updateData.meals);
        expect(listItem.time).to.equal(updateData.time);
      });
    });
  });

  describe('DELETE endpoint', function () {

    it('should delete a post by id', function () {

      let post;

      return userList
        .findOne()
        .then(_post => {
          post = _post;
          return chai.request(app).delete(`/searchData/${post.id}`)
          .set('Authorization', 'Bearer ' + authToken)
        })
        .then(res => {
          res.should.have.status(200);
          return userList.findById(post.id);
        })
        .then(_post => {
          should.not.exist(_post);
        });
    });
  });
});


