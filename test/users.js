const mongoose = require('mongoose');
const User = require('../models/user');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);

let api = '/api/v1'

describe('USERS', ()=>{

  // TEST GET /feed
  describe('GET ', ()=>{
    it('It should get user feed', (done)=>{
      chai.request(server)
      .get(api + '/users/feed')
      .end((err, res)=>{
        res.should.have.status(401);
        res.body.should.be.a('object');
        done();
      });
    });
  });
});
