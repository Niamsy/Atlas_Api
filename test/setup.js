const con = require('../index').con;
let chai = require('chai');

after(async () => {
  await con.query(`DELETE
                   FROM users
                   WHERE name = 'tozzizo'`);
});
