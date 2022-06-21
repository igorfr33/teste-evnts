const mysql = require('mysql')

var pool = mysql.createPool({
    'user': 'root',
    'password': 'root',
    'database': 'teste_evnts',
    'host': 'localhost',
    'port': 3306 
});

exports.pool = pool