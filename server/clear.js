
const fs = require('fs');
const mysql = require('mysql');
const config = require('./config.js');
const database = require('./data.js');

let connection = null;
let connectionFaild = config.connectionFaild;

if (!config.localStorage) {
  connection = mysql.createConnection(database);
}

!connectionFaild && connection.connect((error) => {  
    if (error) throw error;
    console.log('Connected to the MySQL server!\n');  
    
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
            const historyText = JSON.stringify(["{\"code\":0,\"name\":\"system\",\"message\":\"null\",\"userid\":\"0\",\"userqq\":0,\"channel\":\"0\",\"time\":\"2023-12-24 13:27\",\"chatCode\":\"0\"}"]);
            const query = 'INSERT INTO history (chatData) VALUES (?)';  
            connection.query(query, historyText, (error, result) => {  
                if (error) throw error;
            });
        });
      }
    });

    clearHistory();
});

const clearHistory = () => {
    connection.query('SELECT chatData FROM history', (error, results, fields) => {  
        if (error) throw error;
        const query = 'UPDATE history SET chatData = ?'; 
        let historyText = JSON.stringify(["{\"code\":0,\"name\":\"system\",\"message\":\"null\",\"userid\":\"0\",\"userqq\":0,\"channel\":\"0\",\"time\":\"2023-12-24 13:27\",\"chatCode\":\"0\"}"]);
        connection.query(query, historyText, (error, result) => {
            if (error) throw error;
            console.log("MySQL Database History Clear complete!\n");
            connection.end();
        });
    });
};

fs.readFile('cache/history.json','utf8',(error,data) => fs.writeFile('cache/history.json',JSON.stringify(["{\"code\":0,\"name\":\"system\",\"message\":\"null\",\"userid\":\"0\",\"userqq\":0,\"channel\":\"0\",\"time\":\"2023-12-24 13:27\",\"chatCode\":\"0\"}"]),(error) => console.log("Location Database Clear complete!")));