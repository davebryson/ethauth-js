'use strict';

var ethauth = require('../index.js');
var assert = require('assert');

var bobsToken = "eyJuYW1lIjoiYm9iIiwiY3JlYXRlZCI6MTQ1OTEyNTM2MjU2MH0.eyJ2IjoyNywiciI6IjliOTZhNjU0ZTczNDA3OWU2MTM5YTU1ZjI5ZDE4NWM2MzgyNTkxN2I1ZDUzODFmYTFjMjY1Y2ZkNWFmYmYxYmUiLCJzIjoiMTg1M2U4ODMxZDMwZjM4MGY3MGNmM2ViZGYyY2JkZjc1ZThjNDRhYjU0OTgwMjY0NDUxNjI4NTBjOWU0MmVmNSJ9";
var pythonToken = "eyJuYW1lIjogImJvYiIsICJjcmVhdGVkIjogMTQ1OTIxMzYxMX0.eyJzIjogIjc5ZDBkMmNhZDA5ZmJkZGU3MDBlZmIyNzI2ZjEzN2RmYWFkYzdlYmQ4YjYwZTdmNWRjZjE1MDU5MTZmN2QxN2EiLCAiciI6ICJjOTEwMGY4NWMwOTdhMDgwMzYwZTVmODYxOThkOTFkZmVhYWE5YzcxMjk3OTBjYWJhM2FkYmU3YTdlMDI0MmZkIiwgInYiOiAyN30";

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
    ethauth.validate(bobsToken, (err, result) => {
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

  it('should validate a token from the Python impl',(done) => {
    ethauth.validate(pythonToken, (err, result) => {
      assert(err === null);
      assert(result.id, bob.id);
      assert(result.payload.created);
      assert(result.payload.name, 'bob');
      done();
    });
  });

  it('should fail on bad token', (done) => {
    ethauth.validate('bad.token', (err, result) => {
      assert(err);
      assert(result === null);
      done();
    });
  });

  it('should fail on bad token without dot', (done) => {
    ethauth.validate('badtoken', (err, result) => {
      assert(err);
      assert(result === null);
      done();
    });
  });

});
