<script setup>
    
    import "./csses/ChatBin.css"
    import { ElMessage } from 'element-plus'
    import { useOnlineChatStore } from "../stores/onlineChatStore"

    const onlineChatStore = useOnlineChatStore();

    const chatMessage = defineProps({
        message: Object
    });

    const circleUrl = "https://dn-qiniu-avatar.qbox.me/avatar/"
</script>

<template>
    <span class="chat-message" v-if="message.channel === onlineChatStore.chatChannel" :data-type="message.code">
        <el-tag type="info" class="mx-1" effect="dark" v-if="message.code === 101">{{ message.message }}</el-tag>
        <div class="message-info" v-if="message.code === 201" :style="{ justifyContent: message.userid === onlineChatStore.userid && 'flex-end' }">
            <el-avatar class="avatar-info" shape="square" size="small" :src="message.userqq !== 0 ? `https://q2.qlogo.cn/headimg_dl?dst_uin=${message.userqq}&spec=5` : circleUrl" v-if="message.userid !== onlineChatStore.userid"/>
            <div class="content-box">
                <div class="user-info">
                    <span class="user-name" v-if="message.userid !== onlineChatStore.userid">{{ message.name }}</span>
                    <span class="user-time">{{ message.time }}</span>
                    <span class="user-name" v-if="message.userid === onlineChatStore.userid">{{ message.name }}</span>
                </div>
                <div class="message-content">{{ message.message }}</div>
            </div>
            <el-avatar class="avatar-info" shape="square" size="small" :src="message.userqq !== 0 ? `https://q2.qlogo.cn/headimg_dl?dst_uin=${message.userqq}&spec=5` : circleUrl" v-if="message.userid === onlineChatStore.userid"/>
        </div>
    </span>
</template>