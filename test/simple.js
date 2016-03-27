'use strict';

var ethauth = require('../index.js');
var assert = require('assert');

describe("Sign and Validate", (done) => {
  let bob, alice;

  before((done) => {
    bob = {
      id: "0x27db8a572e88a99cab98bddf7f55273556337da0",
      password: "hello bob"
    };

    alice = {
      id: "0xa819f0ff06a47610f78e7ccaed67cc51314dbe19",
      password: "hello alice"
    };
    done();
  });

  it('should generate a token', (done) => {
    let sk = ethauth.sha256("hello world");
    let token = ethauth.sign(sk, {
      name: 'bob'
    });
    assert(token);
    assert(token.split('.').length, 2);
    done();
  });

  it('should validate bobs token', (done) => {
    let sk = ethauth.sha256(bob.password);
    let token = ethauth.sign(sk, {
      name: 'bob'
    });
    assert(token);

    ethauth.validate(token, (err, result) => {
      assert(err === null);
      assert(result.id, bob.id);
      assert(result.payload.created);
      assert(result.payload.name, 'bob');
      done();
    });
  });

  it('should validate alices token', (done) => {
    let sk = ethauth.sha256(alice.password);
    let token = ethauth.sign(sk, {
      name: 'alice'
    });
    assert(token);

    ethauth.validate(token, (err, result) => {
      assert(err === null);
      assert(result.id, alice.id);
      assert(result.payload.created);
      assert(result.payload.name, 'alice');
      done();
    });
  });

  it('should fail on bad token', (done) => {
    ethauth.validate('badtoken', (err, result) => {
      assert(err);
      assert(result === null);
      done();
    });
  });

});
