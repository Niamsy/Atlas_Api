const { con } = require('../index');

after(async () => {
  await con.query(`DELETE FROM users WHERE name = 'tozzizo'`);
});
