
import { ref } from "vue"
import { defineStore } from "pinia"

const getQueryString = (name) => {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}

export const useOnlineChatStore = defineStore('onlineChatStore',() => {
    const userid = ref(0);
    const userqq = ref(0);
    const sendst = ref(0);
    const logind = ref(false);
    const onlineUser = ref(0);
    const username = ref(null);
    const connection = ref(false);
    const chatChannel = getQueryString("channel") !== 0 ? ref(Number(getQueryString("channel"))) : ref(0);
    
    const setSendSt = (value) => sendst.value = value;
    const setUserQQ = (value) => userqq.value = value;
    const setUserId = (value) => userid.value = value;
    const setLogind = (state) => logind.value = state;
    const setUserName = (value) => username.value = value;
    const setConnection = (state) => connection.value = state;
    const setOnlineUsers = (value) => onlineUser.value = value;
    const setChatChannel = (value) => chatChannel.value = value;

    return ({ userid, userqq, sendst, logind, username, onlineUser, connection, chatChannel, setUserId, setUserQQ, setSendSt, setLogind, setUserName, setConnection, setOnlineUsers, setChatChannel });
});