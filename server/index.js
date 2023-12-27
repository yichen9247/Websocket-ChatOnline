
const fs = require('fs');
const http = require('http');
const WebSocket = require('ws');
const dateTool = require('./class/time.js');

let onlineUsers = 0;
const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('ChatOnline Server is already running\n');
});
const wss = new WebSocket.Server({ server });

const clearHistory = (content) => {
  fs.writeFile('history.json',JSON.stringify(["{\"code\":0,\"name\":\"system\",\"message\":\"null\",\"userid\":\"0\",\"userqq\":0,\"channel\":\"0\",\"time\":\"2023-12-24 13:27\"}"]),(error) => {
    writeRunningLog("History clear complete!\n");
    fs.readFile('history.json','utf8',(error,data) => {
      let dataJson = JSON.parse(data);
      dataJson.push(content);
      fs.writeFile('history.json',JSON.stringify(dataJson),(err) => broadcastMessage(content));
    });
  });
};

const writeHistory = (content) => {
  fs.readFile('history.json','utf8',(error,data) => {
    let dataJson = JSON.parse(data);
    if (dataJson.length > 300) {
      clearHistory(content);
      broadcastMessage(JSON.stringify({ 'code': 500 }));
    } else {
      dataJson.push(content);
      fs.writeFile('history.json',JSON.stringify(dataJson),(err) => broadcastMessage(content));
    }
  });
}

const writeRunningLog = (content) => {
  console.log(content);
  fs.appendFile('running.log',content,(error) =>{});
}
const broadcastMessage = (message) => wss.clients.forEach(client => client.readyState === WebSocket.OPEN && client.send(message));

wss.on('connection',ws => {
  ws.on('message',message => {
      const date = new dateTool().Date();
      const messageObject = JSON.parse(message.toString());
      const getMessageTime = date.Year + "-" + date.Month + "-" + date.Date + " " + date.Hou + ":" + date.Min;
      if (messageObject.code === 101) {
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

  fs.readFile('history.json','utf8',(error,data) => {
    let dataJson = JSON.parse(data);
    ws.send(JSON.stringify({ code: 100, data: dataJson }));
  });
});
server.listen(5100,() => writeRunningLog("ChatOnline Server started on port 5100！\n"));