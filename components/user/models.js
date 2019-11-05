var db = require('../../database/db');

module.exports = {
  get: (username, password) => {
    return db.load(
      `select * from user where username = '${username}' and password = '${password}'`
    );
  },
  getByID: id => {
    return db.load(`select * from user where id = ${id}`);
  },
  getByUsername: username => {
    return db.load(`select * from user where username = '${username}'`);
  },
  add: entity => {
    return db.add('user', entity);
  },
  update: entity => {
    return db.update('user', 'id', entity);
  }
};
