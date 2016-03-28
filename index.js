'use strict';

/**
 * Simple Authentication with you Ethereum address
 *
 */
var utils = require('ethereumjs-util');
var base64 = require('base64url');

// Private
function _convertToBuffer(value) {
  if (!Buffer.isBuffer(value)) {
    if (utils.isHexPrefixed(value))
      return new Buffer(utils.stripHexPrefix(value), 'hex');
    return new Buffer(value, 'hex');
  }
  return value;
}

exports.sha256 = (data) => {
  return utils.sha256(data);
};

/**
 * Create a token with your private key and some data
 * @param sk - your secret key
 * @param data - payload
 * @returns the token
 */
exports.sign = (sk, data) => {
  let payload = data || {};
  let token = [];

  let secret_key = _convertToBuffer(sk);

  // Encode the payload
  payload.created = new Date().getTime();
  let encodedPayload = base64(JSON.stringify(payload));
  token.push(encodedPayload);

  // Sign it and create token
  let hash = exports.sha256(encodedPayload);
  let sig = utils.ecsign(hash, secret_key);
  let sigObj = {
    v: sig.v,
    r: sig.r.toString('hex'),
    s: sig.s.toString('hex')
  };

  let encodedSignature = base64.encode(JSON.stringify(sigObj));
  token.push(encodedSignature);

  return token.join('.');
};

/**
 * Validate a token
 * @param the token
 * @param callback - function(err,result)
 */
exports.validate = (token, callback) => {
  try {
    let parts = token.split('.')
    let sig = JSON.parse(base64.decode(parts[1]))
    let y = utils.ecrecover(exports.sha256(parts[0]),
      sig.v, new Buffer(sig.r, 'hex'), new Buffer(sig.s, 'hex'))
    callback(null, {
      payload: JSON.parse(base64.decode(parts[0])),
      id: "0x" + utils.publicToAddress(y).toString('hex')
    });
  } catch (e) {
    callback(Error("Problem validating the token: " + e.message), null);
  }
};
