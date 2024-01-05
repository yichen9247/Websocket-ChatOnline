
const fs = require('fs');
const mysql = require('mysql');
const database = require('../data.js');
const connection = mysql.createConnection(database);

connection.connect((error) => {  
    if (error) throw error;  
    console.log('Sync：Connected to the MySQL server!\n');  
    
    connection.query('SHOW TABLES LIKE "users"', (error, result) => {
        if (error) throw error;
        if (result.length === 0) {
          connection.query('CREATE TABLE users (userid BIGINT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(255), userqq BIGINT)', (err, result) => {  
            if (error) throw error;
          });
        }
    });
  
    connection.query('SHOW TABLES LIKE "history"', (error, result) => {
      if (error) throw error;
      if (result.length === 0) {
        connection.query('CREATE TABLE history (chatData LONGTEXT)', (error, result) => {  
            if (error) throw error;
            const historyText = JSON.stringify(["{\"code\":0,\"name\":\"system\",\"message\":\"null\",\"userid\":\"0\",\"userqq\":0,\"channel\":\"0\",\"time\":\"2023-12-24 13:27\"}"]);
            const query = 'INSERT INTO history (chatData) VALUES (?)';  
            connection.query(query, historyText, (error, result) => {  
                if (error) throw error;
            });
        });
      }
    });
});

const databaseSYncWithLocation = () => {
    connection.query('SELECT chatData FROM history', (error, results, fields) => {  
        if (error) throw error;
        fs.writeFile('cache/history.json',results[0].chatData,(error) => {
            if (error) throw error;
        });
    });
}

module.exports = {
    databaseSYncWithLocation: databaseSYncWithLocation,
};