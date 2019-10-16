var mysql = require('mysql');
var config = require('config');

var createConn = () => {
  const cfg = config.get('DB');
  return mysql.createConnection(cfg);
};

var conn = createConn();
conn.connect();

// shutdown hook
process.on('exit', function() {
  console.log('graceful shutdown');
  conn.end();
});

module.exports = {
  load: sql => {
    return new Promise((resolve, reject) => {
      conn.query(sql, (err, results, fields) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  },
  add: (tableName, entity) => {
    return new Promise((resolve, reject) => {
      var sql = `insert into ${tableName} set ?`;
      conn.query(sql, entity, (err, value) => {
        if (err) {
          reject(err);
        } else {
          resolve(err);
        }
      });
    });
  },
  update: (tableName, idField, entity) => {
    return new Promise((resolve, reject) => {
      var id = entity[idField];
      delete entity[idField];

      var sql = `update ${tableName} set ? where ${idField} = ?`;
      conn.query(sql, [entity, id], (err, value) => {
        if (err) {
          reject(err);
        } else {
          resolve(value.changedRows);
        }
      });
    });
  },

  delete: (tableName, idField, id) => {
    return new Promise((resolve, reject) => {
      var sql = `delete from ${tableName} where ${idField} = ?`;
      conn.query(sql, id, (err, value) => {
        if (err) {
          reject(err);
        } else {
          resolve(value.affectedRows);
        }
      });
    });
  }
};
