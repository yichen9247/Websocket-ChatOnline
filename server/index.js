
const fs = require('fs');
const http = require('http');
const mysql = require('mysql');
const WebSocket = require('ws');
const database = require('./data.js');
const dateTool = require('./class/time.js');
const syncLocalHistory = require('./class/sync.js');

let synconce = 0;
let onlineUsers = 0;
let connectionFaild = false;

const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('ChatOnline Server is already running\n');
});

const wss = new WebSocket.Server({ server });
const connection = mysql.createConnection(database);

connection.connect((error) => {  
  if (error) {
    connectionFaild = true;
    console.error('Error connecting to the MySQL server: ' + error.stack);
    return;
  };
  syncLocalHistory.databaseSYncWithLocation();
  console.log('Server：Connected to the MySQL server!\n');  
});

const registerUser = (userid, username, userqq) => {
  !connectionFaild && connection.query('SHOW TABLES LIKE "users"', (error, result) => {
    if (error) throw error;
    connection.query('SELECT * FROM users WHERE username = ?', [username], (error, results, fields) => {  
      if (error) throw error;
      const query = 'INSERT INTO users (userid, username, userqq) VALUES (?, ?, ?)';  
        connection.query(query, [userid, username, userqq], (error, result) => {  
          if (error) throw error;
      });
    });
  });
}

const clearHistory = (content) => {
  connection.query('SELECT chatData FROM history', (error, results, fields) => {  
    if (error) throw error;
    const query = 'UPDATE history SET chatData = ?'; 
    let historyText = JSON.stringify(["{\"code\":0,\"name\":\"system\",\"message\":\"null\",\"userid\":\"0\",\"userqq\":0,\"channel\":\"0\",\"time\":\"2023-12-24 13:27\"}"]);
    connection.query(query, historyText, (error, result) => {
      if (error) throw error;
      let dataJson = JSON.parse(results[0].chatData);
      dataJson.push(content);
      connection.query(query, historyText, (error, result) => {
        if (error) throw error;
        broadcastMessage(content);
      });
    });
  });

  fs.writeFile('cache/history.json',JSON.stringify(["{\"code\":0,\"name\":\"system\",\"message\":\"null\",\"userid\":\"0\",\"userqq\":0,\"channel\":\"0\",\"time\":\"2023-12-24 13:27\"}"]),(error) => {
    writeRunningLog("History clear complete!\n");
    fs.readFile('cache/history.json','utf8',(error,data) => {
      let dataJson = JSON.parse(data);
      dataJson.push(content);
      fs.writeFile('cache/history.json',JSON.stringify(dataJson),(error) => broadcastMessage(content));
    });
  });
};

const writeHistory = (content) => {
  connectionFaild && fs.readFile('cache/history.json','utf8',(error,data) => {
    let dataJson = JSON.parse(data);
    if (dataJson.length > 600) {
      clearHistory(content);
      broadcastMessage(JSON.stringify({ 'code': 500 }));
    } else {
      dataJson.push(content);
      fs.writeFile('cache/history.json',JSON.stringify(dataJson),(error) => broadcastMessage(content));
    }
  });

  !connectionFaild && connection.query('SELECT chatData FROM history', (error, results, fields) => {  
    if (error) throw error;
    let dataJson = JSON.parse(results[0].chatData);
    if (dataJson.length > 600) {
      clearHistory(content);
      broadcastMessage(JSON.stringify({ 'code': 500 }));
    } else {
      dataJson.push(content);
      databaseClearWithLocation();
      const query = 'UPDATE history SET chatData = ?';  
      connection.query(query, JSON.stringify(dataJson), (error, result) => {  
        if (error) throw error;
        broadcastMessage(content);
      });
    }
  });
}

const writeRunningLog = (content) => {
  console.log(content);
  fs.appendFile('cache/running.log',content,(error) =>{});
}

const databaseClearWithLocation = () => {
  if (synconce <= 20) {
    synconce++;
  } else {
    synconce = 0;
    syncLocalHistory.databaseSYncWithLocation();
  }
}

const broadcastMessage = (message) => wss.clients.forEach(client => client.readyState === WebSocket.OPEN && client.send(message));

wss.on('connection',ws => {
  ws.on('message',message => {
      const date = new dateTool().Date();
      const messageObject = JSON.parse(message.toString());
      const getMessageTime = date.Year + "-" + date.Month + "-" + date.Date + " " + date.Hou + ":" + date.Min;
      if (messageObject.code === 101) {
        // registerUser(messageObject.userid,messageObject.name,messageObject.userqq);
        writeHistory(JSON.stringify({ 'code': 101, name: '系统', message: messageObject.name + '加入到了聊天室', userid: messageObject.userid, channel: messageObject.channel, userqq: messageObject.userqq, time: getMessageTime }));
        writeRunningLog("[JOIN]" + JSON.stringify({ 'code': 101, name: '系统', message: messageObject.name + '加入到了聊天室', userid: messageObject.userid, channel: messageObject.channel, userqq: messageObject.userqq, time: getMessageTime }) + "\n");
      }
      if (messageObject.code === 201) {
        writeHistory(JSON.stringify({ 'code': 201, name: messageObject.name, message: messageObject.message, userid: messageObject.userid, channel: messageObject.channel, userqq: messageObject.userqq, time: getMessageTime }));
        writeRunningLog("[CHAT]" + JSON.stringify({ 'code': 201, name: messageObject.name, message: messageObject.message, userid: messageObject.userid, channel: messageObject.channel, userqq: messageObject.userqq, time: getMessageTime }) + "\n");
      }
  });

  onlineUsers++;
  wss.clients.forEach(client => {
    client.readyState === WebSocket.OPEN && client.send(JSON.stringify({ 'code': 102, 'online': onlineUsers }))
  })

  ws.on('close',() => {
    onlineUsers--;
    wss.clients.forEach(client => {
      client.readyState === WebSocket.OPEN && client.send(JSON.stringify({ 'code': 102, 'online': onlineUsers }))
    })
  });

  const initChatServer = () => {
    connectionFaild && fs.readFile('cache/history.json','utf8',(error,data) => {
      let dataJson = JSON.parse(data);
      ws.send(JSON.stringify({ code: 100, data: dataJson }));
    });

    !connectionFaild && connection.query('SELECT chatData FROM history', (error, results, fields) => {  
      if (error) throw error;
      let dataJson = JSON.parse(results[0].chatData);
      ws.send(JSON.stringify({ code: 100, data: dataJson }));
    });
  }

  initChatServer();
});

server.listen(5100,() => writeRunningLog("ChatOnline Server started on port 5100！\n"));