# Simple authentication using your Ethereum address

Inspired by [Bitcoin Identity](https://en.bitcoin.it/wiki/Identity_protocol_v1),
Ethereum transactions, and [JSON Web Tokens (JWT)](https://jwt.io/introduction/).  

Use your Ethereum address to sign and generate a token (similar to a JWT) that
can be validated on the server side, or whoever you send it to.

Format of the token:
```
  token = base64(payload).base64(signature)
```

Create a token:
```
  token = ethauth.sign(your_private_key, data);
```

Validating the signature returns the payload and the Ethereum address of the signer:
```
  ethauth.validate(token) =>
  {
    id: some_ethereum_address,
    payload: the data
  }
```
