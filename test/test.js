const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

const expect = chai.expect;

chai.use(chaiHttp);


describe('MOCK_STATUS_UPDATES', function() {

    before(function() {
      return runServer();
    });

    after(function() {
      return closeServer();
    });

it('should list items on GET', function() {


  return chai.request(app)
      .get('/mock_status_updates')
      .then(function(res) {
        console.log('res.body', res.body);
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body.statusUpdates).to.be.a('array');
        expect(res.body.statusUpdates.length).to.be.at.least(0);
        const expectedKeys = ['name', 'prices'];
        res.body.statusUpdates.forEach(function(item) {
          expect(item).to.be.a('object');
          expect(item).to.include.keys(expectedKeys);
        });
      });
  });
});

// it('should add an item on POST', function() {
//   const newItem = {name: '', average_price: ''};
//   return chai.request(app)
//     .post('/mock_status_updates')
//     .send(newItem)
//     .then(function(res) {
//       expect(res).to.have.status(201);
//       expect(res).to.be.json;
//       expect(res.body).to.be.a('object');
//       expect(res.body).to.include.keys('name', 'average_price');
//       expect(res.body.id).to.not.equal(null);
//       expect(res.body).to.deep.equal(Object.assign(newItem, {id: res.body.id}));
//     });
// });

// it('should update items on PUT', function() {
//   const updateData = {
//     name: '',
//     average_price: ''
//   };

//   return chai.request(app)
//     .get('/mock_status_updates')
//     .then(function(res) {
//       updateData.id = res.body[0].id;
//       return chai.request(app)
//         .put(`/mock_status_updates/${updateData.id}`)
//         .send(updateData);
//     })

//     .then(function(res) {
//       expect(res).to.have.status(200);
//       expect(res).to.be.json;
//       expect(res.body).to.be.a('object');
//       expect(res.body).to.deep.equal(updateData);
//     });
// });



