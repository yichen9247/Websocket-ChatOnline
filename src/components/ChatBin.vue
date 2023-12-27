<script setup>
    import "./csses/ChatBin.css"

    import { ref } from 'vue'
    import Message from "./Message.vue"
    import { ElMessage } from 'element-plus'
    import channelList from "../../server/chan.js"
    import { useOnlineChatStore } from "../stores/onlineChatStore"

    const loadingSvg = `
        <path class="path" d="
          M 30 15
          L 28 17
          M 25.61 25.61
          A 15 15, 0, 0, 1, 15 30
          A 15 15, 0, 1, 1, 27.99 7.5
          L 15 15
        " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
    `;

    const chatText = ref("");
    const contents = ref(null);

    const onlineChatStore = useOnlineChatStore();
    const emit = defineEmits(['sendChatMessage']);

    const chatMessage = defineProps({
        messageList: Object
    });

    const sendChatMessage = () => {
        if (onlineChatStore.connection) {
            if (channelList.some(item => item.id === onlineChatStore.chatChannel)) {
                if (chatText.value === "") {
                    ElMessage({ message: '请参照正确的聊天内容格式！', type: 'warning' });
                } else {
                    emit('sendChatMessage',chatText.value);
                    chatText.value = "";
                }
            } else {
                ElMessage({ message: '该频道暂未开启！', type: 'warning' });
            }
        } else {
            ElMessage({ message: '与通信服务器的连接已断开！', type: 'error' });
        }
    }

    const handleKeydown = (event) => event.key === "Enter" && sendChatMessage();

    const backMainChannel = (channel) => {
        history.pushState(null,null,"/");
        onlineChatStore.setChatChannel(0);
    };
    onlineChatStore.chatChannel !== 0 && ElMessage({ message: '当前为自定义频道模式，请遵守聊天规则！', type: 'warning' });
</script>

<template>
    <div id="chat-content">
        <el-container>
            <el-header class="content-header">
                <span class="headerText" v-text="channelList.some(item => item.id === onlineChatStore.chatChannel) ? channelList.find(item => item.id === onlineChatStore.chatChannel).name : channelList.find(item => item.id === 0).name"></span>
                <el-tooltip class="box-item" effect="dark" :content="`连接状态：${onlineChatStore.connection ? '在线' : '离线'}`" placement="right">
                    <span class="systemStat" :style="{ backgroundColor: onlineChatStore.connection ? '#67C23A' : '#F56C6C' }"></span>
                </el-tooltip>
                <span class="onlineText">在线人数：{{ onlineChatStore.onlineUser }}</span>
            </el-header>

            <el-main class="content-main" ref="contents" v-if="channelList.some(item => item.id === onlineChatStore.chatChannel)" v-loading="!onlineChatStore.connection" element-loading-text="正在从服务器获取数据" element-loading-background="#dae8f1" :element-loading-spinner="loadingSvg" element-loading-svg-view-box="-10, -10, 50, 50">
                <Message v-for="(message) in messageList" :message="message" v-if="onlineChatStore.connection" />
            </el-main>

            <el-main class="content-main" ref="contents" v-if="!channelList.some(item => item.id === onlineChatStore.chatChannel)" v-loading="!onlineChatStore.connection" element-loading-text="正在从服务器获取数据" element-loading-background="#dae8f1" :element-loading-spinner="loadingSvg" element-loading-svg-view-box="-10, -10, 50, 50">
                <el-result icon="error" title="该频道未开启">
                    <template #extra>
                        <el-button type="primary" @click="backMainChannel(onlineChatStore.chatChannel)">返回到主频道</el-button>
                    </template>
                </el-result>
            </el-main>
            
            <el-footer class="content-footer">
                <el-input class="chat-input" v-model="chatText" placeholder="请在此输入聊天内容..." clearable maxlength="100" show-word-limit type="text" @keydown="handleKeydown"/>
                <el-button class="chat-button" type="primary" plain @click="sendChatMessage">发送消息</el-button>
            </el-footer>
        </el-container>
    </div>
</template>