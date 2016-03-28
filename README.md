## Simple authentication using your Ethereum address

Inspired by [Bitcoin Identity](https://en.bitcoin.it/wiki/Identity_protocol_v1),
Ethereum transactions, and [JSON Web Tokens (JWT)](https://jwt.io/introduction/).  

Use your Ethereum address to sign and generate a token (similar to a JWT) that
can be validated on the server side, or whoever you send it to.

Format of the token:
```
  token = base64(payload).base64(signature)
```

Where payload is a an object and the signature is created and checked using the same
crypto used for Ethereum Transactions

### Example:

Create a token:
```
  token = ethauth.sign(your_private_key, data_object);
```

Validating the token, checks the signature extracting the public key and the
Ethereum address of the signer:

```
  ethauth.validate(token, function(err,payload) {
    ...
  })
  // where payload is an object like this:
  {
    id: some_ethereum_address,
    payload: the data
  }
```
