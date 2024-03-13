<script setup>
  import "./App.css"
  import Pace from 'pace-js'
  import { reactive } from "vue"
  import Cookies from "js-cookie"
  import "@/assets/paces/pace.css"
  import { showFailToast } from 'vant'
  import config from "@/scripts/config.js"
  import isMobile from "@/scripts/mobile.js"
  import channelList from "../server/chan.js"
  import SideBar from "@/components/SideBar.vue"
  import ChatBin from "@/components/ChatBin.vue"
  import NoneMain from "@/components/NoneMain.vue"
  import { ElMessage, ElMessageBox  } from 'element-plus'
  import AppDialog from "@/components/dialog/AppDialog.vue"
  import { useOnlineChatStore } from "@/stores/onlineChatStore"

  let socket = null,interval = 0;
  const messageList = reactive([]);
  const onlineChatStore = useOnlineChatStore();

  const createWebSocket = () => {
    if ("WebSocket" in window) {
      socket = new WebSocket('ws://127.0.0.1:5100/');

      socket.onerror = (error) => {
        onlineChatStore.setOnlineUsers(0);
        onlineChatStore.setConnection(false);
        console.error('WebSocket error: ' + error);
      };

      socket.onopen = (event) => {
        console.log('WebSocket connected');
        setTimeout(() => {
          onlineChatStore.setConnection(true);
          setTimeout(() => document.querySelector(".content-main").scrollTo({ top: document.querySelector(".content-main").scrollHeight, behavior: 'smooth' }),100);
        },800);
        if (Cookies.get('userid') !== undefined && Cookies.get('username') !== undefined) {
          onlineChatStore.setLogind(true);
          onlineChatStore.setUserName(Cookies.get('username'));
          onlineChatStore.setUserId(Number(Cookies.get('userid')));
        } else openRegisterDialog();
        if (Cookies.get('userqq') !== undefined) onlineChatStore.setUserQQ(Cookies.get('userqq'));
      };

      socket.onmessage = (event) => {
        const messageObject = JSON.parse(event.data);
        messageObject.code === 102 && onlineChatStore.setOnlineUsers(messageObject.online);
        messageObject.code === 101 && messageList.push(messageObject) & scrollMessage(messageObject);
        messageObject.code === 201 && messageList.push(messageObject) & scrollMessage(messageObject);
        messageObject.code === 203 && messageList.push(messageObject) & scrollMessage(messageObject);
        messageObject.code === 103 && messageList.push(messageObject) & scrollMessage(messageObject);
        messageObject.code === 500 && ElMessage({ message: messageObject.msg, type: 'warning' }) & scrollMessage(messageObject);
        messageObject.code === 100 && messageObject.data.forEach(element => messageList.push(JSON.parse(element))) & scrollMessage(messageObject);
        messageObject.code === 403 && (isMobile.isMobile() ? showFailToast(messageObject.msg) : ElMessage({ message: messageObject.msg, type: 'error' }));
      };

      socket.onclose = (event) => {
        onlineChatStore.setOnlineUsers(0);
        onlineChatStore.setConnection(false);
        console.log('WebSocket disconnected');
        setTimeout(() => createWebSocket(),200);
        if (!isMobile.isMobile()) ElMessage({ message: '与通信服务器的连接已断开！', type: 'error' });
      };
    }
  }

  createWebSocket();

  const scrollMessage = (messageObject) => {
    if (messageObject.channel === onlineChatStore.chatChannel) {
      setTimeout(() => document.querySelector(".content-main").scrollTo({ top: document.querySelector(".content-main").scrollHeight, behavior: 'smooth' }),100);
    }
  }
  
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
        socket.send(JSON.stringify({ 'code': 101, 'name': value, 'userid': userid, 'userqq': onlineChatStore.userqq, 'channel': onlineChatStore.chatChannel, 'clientCorsPassword': config.clientCorsPassword }));
      }
    }).catch(() => ElMessage({ type: 'info', message: '正在以游客的身份进行浏览！' }));
  }

  const sendMessage = (code) => {socket.send(JSON.stringify({ 'code': code }))}
  const sendJoinMessage = (channel) => onlineChatStore.logind ? socket.send(JSON.stringify({ 'code': 101, 'name': onlineChatStore.username, 'userid': onlineChatStore.userid, 'userqq': onlineChatStore.userqq, 'channel': channel, 'clientCorsPassword': config.clientCorsPassword })) : openRegisterDialog();
  const sendChatMessage = (code, message) => {
    if (onlineChatStore.logind) {
      if (interval === 0) {
        interval = 3;
        let intervalTimer = setInterval(() => {
          interval--;
          if (interval === 0) clearInterval(intervalTimer);
        }, 1000);

        if (code === 103) {
          socket.send(JSON.stringify({ 'code': 103, 'name': onlineChatStore.username, 'userid': onlineChatStore.userid, 'message': message, 'channel': onlineChatStore.chatChannel, 'userqq': onlineChatStore.userqq, 'chatCode': 1, 'clientCorsPassword': config.clientCorsPassword }))
        } else code ? socket.send(JSON.stringify({ 'code': 201, 'name': onlineChatStore.username, 'userid': onlineChatStore.userid, 'message': message, 'channel': onlineChatStore.chatChannel, 'userqq': onlineChatStore.userqq, 'chatCode': 1 })) : socket.send(JSON.stringify({ 'code': 201, 'name': onlineChatStore.username, 'userid': onlineChatStore.userid, 'message': message, 'channel': onlineChatStore.chatChannel, 'userqq': onlineChatStore.userqq, 'chatCode': 0, 'clientCorsPassword': config.clientCorsPassword }));
      } else ElMessage({ type: 'warning', message: '发送消息时间间隔不能低于3秒！' });
    } else openRegisterDialog();
  }
</script>

<template>
  <transition name="el-fade-in">
    <main id="pagemain">
      <AppDialog @sendJoinMessage="sendJoinMessage"/>
      <SideBar/><NoneMain v-if="onlineChatStore.chatChannel === 0 && !channelList.some(item => item.id === 0)"/>
      <ChatBin v-else :messageList="messageList" @sendChatMessage="sendChatMessage"/>
    </main>
  </transition>
</template>