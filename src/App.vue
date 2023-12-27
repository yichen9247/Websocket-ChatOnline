<script setup>
  import "./App.css"
  import Cookies from "js-cookie"
  import { reactive, watch } from "vue"
  import SideBar from "@/components/SideBar.vue"
  import ChatBin from "@/components/ChatBin.vue"
  import ELDialog from "@/components/ELDialog.vue"
  import { ElMessage, ElMessageBox  } from 'element-plus'
  import { useOnlineChatStore } from "@/stores/onlineChatStore"

  let socket = null;
  const messageList = reactive([]);
  const onlineChatStore = useOnlineChatStore();

  const createWebSocket = () => {
    if ("WebSocket" in window) {
      socket = new WebSocket('ws://localhost:5100/');

      socket.onerror = (error) => {
        onlineChatStore.setOnlineUsers(0);
        onlineChatStore.setConnection(false);
        console.error('WebSocket error: ' + error);
      };

      socket.onopen = (event) => {  
        console.log('WebSocket connected');
        setTimeout(() => onlineChatStore.setConnection(true),800);
        if (Cookies.get('userid') !== undefined && Cookies.get('username') !== undefined) {
          onlineChatStore.setLogind(true);
          onlineChatStore.setUserName(Cookies.get('username'));
          onlineChatStore.setUserId(Number(Cookies.get('userid')));
        } else {
          openRegisterDialog();
        }
        if (Cookies.get('userqq') !== undefined) {
          onlineChatStore.setUserQQ(Cookies.get('userqq'));
        }
      };

      socket.onmessage = (event) => {
        const messageObject = JSON.parse(event.data);
        messageObject.code === 101 && messageList.push(messageObject);
        messageObject.code === 201 && messageList.push(messageObject);
        messageObject.code === 102 && onlineChatStore.setOnlineUsers(messageObject.online);
        messageObject.code === 100 && messageObject.data.forEach(element => messageList.push(JSON.parse(element)));
        messageObject.code === 500 && ElMessage({ message: '服务端聊天记录已重置！', type: 'warning' });
        onlineChatStore.connection && setTimeout(() => document.querySelector(".content-main").scrollTo({ top: document.querySelector(".content-main").scrollHeight, behavior: 'smooth' }),100);
      };

      socket.onclose = (event) => {
        onlineChatStore.setOnlineUsers(0);
        onlineChatStore.setConnection(false);
        console.log('WebSocket disconnected');
        setTimeout(() => createWebSocket(),200);
        ElMessage({ message: '与通信服务器的连接已断开！', type: 'error' });
      };
    }
  }

  createWebSocket();
  watch(onlineChatStore,() => {
    onlineChatStore.connection && setTimeout(() => document.querySelector(".content-main").scrollTo({ top: document.querySelector(".content-main").scrollHeight, behavior: 'smooth' }),100);
  },{deep:true});

  const openRegisterDialog = () => {
    ElMessageBox.prompt('请输入你在此聊天室中的昵称', '创建身份', { confirmButtonText: '创建', cancelButtonText: '取消' }).then(({ value }) => {
      if (value === null) {
        openRegisterDialog();
        ElMessage({ type: 'warning', message: '请输入正确的聊天室昵称！' });
      } else {
        onlineChatStore.setLogind(true);
        onlineChatStore.setUserName(value);
        const userid = Math.floor(111111111 + Math.random() * 9999999999);
        Cookies.set('userid',userid,{ expires: 30 });
        Cookies.set('username',value,{ expires: 30 });
        onlineChatStore.setUserId(userid);
        socket.send(JSON.stringify({ 'code': 101, 'name': value, 'userid': userid, 'userqq': onlineChatStore.userqq, 'channel': onlineChatStore.chatChannel }));
      }
    }).catch(() => {
      ElMessage({ type: 'info', message: '正在以游客的身份进行浏览！' });
    });
  }

  const sendJoinMessage = (channel) => onlineChatStore.logind ? socket.send(JSON.stringify({ 'code': 101, 'name': onlineChatStore.username, 'userid': onlineChatStore.userid, 'userqq': onlineChatStore.userqq, 'channel': channel })) : openRegisterDialog();
  const sendChatMessage = (message) => onlineChatStore.logind ? socket.send(JSON.stringify({ 'code': 201, 'name': onlineChatStore.username, 'userid': onlineChatStore.userid, 'message': message, 'channel': onlineChatStore.chatChannel, 'userqq': onlineChatStore.userqq })) : openRegisterDialog();
</script>

<template>
  <main id="pagemain">
    <ELDialog @sendJoinMessage="sendJoinMessage"/>
    <SideBar/><ChatBin :messageList="messageList" @sendChatMessage="sendChatMessage"/>
  </main>
</template>