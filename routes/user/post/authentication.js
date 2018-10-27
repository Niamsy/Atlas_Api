const router = require('express').Router();
const TokenGenerator = require('uuid-token-generator');
const SHA256 = require('crypto-js/sha256');

const hub = require('hub');
const { con } = require('../../../index');

const tokgen = new TokenGenerator();

function generateToken() {
  const apiToken = tokgen.generate();
  if (hub.connectedUserToken[apiToken] != null) {
    return generateToken();
  }
  return apiToken;
}

router.post('/', async (req, res, next) => {
  const { username, password } = req.headers;

  if (username === undefined || password === undefined) {
    return res.status(400).json({ message: 'Header values are incorrect.' });
  }

  try {
    const result = await con.query(
      `SELECT id, name, password FROM users
        WHERE name = ${con.escape(username)}
        AND password = '${SHA256(password)}'`
    );
    if (result[0].length === 0) {
      return res.status(400).json({ message: 'Bad authentication' });
    }
    for (const key in hub.connectedUserToken) {
      if (hub.connectedUserToken[key] === result[0][0].id) {
        return res.status(200).json({ api_token: key });
      }
    }
    const apiToken = generateToken();
    hub.connectedUserToken[apiToken] = result[0][0].id;
    await con.query(
      `UPDATE users SET last_connection_at = ${con.escape(new Date())} WHERE id = '${
        hub.connectedUserToken[apiToken]
      }'`
    );
    console.log(apiToken);
    return res.status(200).json({ api_token: apiToken });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
