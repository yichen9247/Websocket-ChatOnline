<script setup>
    import "./styles/ChatBin.css"

    import { ref } from 'vue'
    import axios from "axios"
    import { showFailToast } from 'vant'
    import { ElMessage } from 'element-plus'
    import isMobile from "@/scripts/mobile.js"
    import Drawers from "@/components/Drawers.vue"
    import Message from "@/components/Message.vue"
    import channelList from "../../server/chan.js"
    import { Menu } from '@element-plus/icons-vue'
    import { useOnlineChatStore } from "@/stores/onlineChatStore"
    import { useOnelDialogStore } from "@/stores/onelDialogStore"

    const loadingSvg = `
        <path class="path" d="  
          M 30 15  
          L 28 17  
          M 25.61 25.61  
          A 15 15, 0, 0, 1, 15 30  
          A 15 15, 0, 1, 1, 27.99 7.5  
          L 15 15  
        " style="stroke-width: 4px; stroke: rgba(32, 165, 58, 1); fill: rgba(0, 0, 0, 0)"/>
    `;

    let mousedown = null;
    const chatText = ref("");
    const contents = ref(null);

    const onlineChatStore = useOnlineChatStore();
    const onelDialogStore = useOnelDialogStore();
    const emit = defineEmits(['sendChatMessage']);

    const chatMessage = defineProps({
        messageList: Object
    });

    watch(chatMessage.messageList,(news,olds) => {
        if (news[news.length-1].code === 101) {
            // ElNotification({
            //     offset: 28,
            //     duration: 2000,
            //     type: 'success',
            //     title: '系统通知',
            //     showClose: false,
            //     message: news[news.length-1].message,
            // });
        }
    },{deep:true});

    const sendChatMessage = () => {
        if (onlineChatStore.connection) {
            if (channelList.some(item => item.id === onlineChatStore.chatChannel)) {
                if (chatText.value === "") {
                    if (isMobile.isMobile()) {
                        showFailToast('格式不正确');
                    } else ElMessage({ message: '请参照正确的聊天内容格式！', type: 'warning' });
                } else {
                    const regex = /# (.*)/gm;
                    onlineChatStore.setSendSt(1);
                    const checkText = async () => {
                        const checkUrl = await axios.get('https://v2.alapi.cn/api/censor/text?token=MPCPPpyj3e1QWU7y&text=' + chatText.value.replace(regex, '$1'));
                        try {
                            const sendFun = () => {
                                if (channelList.find(item => item.id === onlineChatStore.chatChannel).admin === onlineChatStore.userid) {
                                    chatText.value.match(regex) ? emit('sendChatMessage', 1, chatText.value.replace(regex, '$1')) : emit('sendChatMessage', 0, chatText.value);
                                } else {
                                    chatText.value.match(regex) ? emit('sendChatMessage', 0, chatText.value.replace(regex, '$1')) : emit('sendChatMessage', 0, chatText.value);
                                }
                            }

                            if (checkUrl.data.code !== 102) {
                                if (checkUrl.data.data.conclusion === "不合规") {
                                    if (isMobile.isMobile()) {
                                        showFailToast('请注意措辞');
                                    } else ElMessage({ message: '请注意您的措辞！', type: 'error' });
                                } else sendFun();
                            } else sendFun();
                        } catch (e) {
                            if (isMobile.isMobile()) {
                                showFailToast('消息被拦截');
                            } else ElMessage({ message: '消息发送遭到阻拦！', type: 'error' });
                        } finally {
                            chatText.value = "";
                            onlineChatStore.setSendSt(0);
                        }
                    };
                    checkText();
                }
            } else {
                if (isMobile.isMobile()) {
                    showFailToast('频道未开启');
                } else ElMessage({ message: '该频道暂未开启！', type: 'error' });
            }
        } else {
            if (isMobile.isMobile()) {
                showFailToast('服务器崩了');
            } else ElMessage({ message: '与通信服务器的连接已断开！', type: 'error' });
        }
    }

    const sendChatHitokoto = () => {
        onlineChatStore.setSendSt(2);
        const sendText = async () => {
            try {
                const hitokoto = await axios.get('https://international.v1.hitokoto.cn/');
                emit('sendChatMessage', 0, hitokoto.data.hitokoto);
                onlineChatStore.setSendSt(0);
            } catch (e) {
                onlineChatStore.setSendSt(0);
                if (isMobile.isMobile()) {
                    showFailToast('消息被拦截');
                } else ElMessage({ message: '消息发送遭到阻拦！', type: 'error' });
            }
        }
        sendText();
    }

    const handleKeydown = (event) => (event.ctrlKey && event.key === "Enter") && sendChatMessage();
    const avatarClaps = (sideName,userName) => emit('sendChatMessage', 103, sideName + ' 拍了拍 ' + userName);

    const backMainChannel = (channel) => {
        history.pushState(null,null,"/");
        onlineChatStore.setChatChannel(0);
    };

    const openDrawer = () => {
        if (onlineChatStore.logind && onlineChatStore.connection) {
            onelDialogStore.setMobilesidebars(true);
        } else {
            if (isMobile.isMobile()) {
                showFailToast('用户未登录');
            } else ElMessage({ message: '你还没有登录到聊天室哦！', type: 'warning' });
        }
    };

    const avtMouseup = () => {
        mousetime = 0;
        clearInterval(mousedown);
    };

    const avtMousedown = (username) => {
        mousedown = setInterval(() => {
            chatText.value = chatText.value + "@" + username + " ";
        },1000);
    };

    const idDeveloper = () => ElMessage({ message: '当前功能正在开发中！', type: 'warning' });
    onlineChatStore.chatChannel !== 0 && ElMessage({ message: '当前为自定义频道模式，请遵守聊天规则！', type: 'warning' });
    const fastOptionDown = () => document.querySelector(".content-main").scrollTo({ top: document.querySelector(".content-main").scrollHeight, behavior: 'smooth' });
</script>

<template>
    <el-drawer v-model="onelDialogStore.mobilesidebars" size="80%" :show-close="false" class="mobile-side-bar" :destroy-on-close="true" title="I am the title" :with-header="false" direction="ltr" v-if="isMobile.isMobile()">
        <Drawers/>
    </el-drawer>

    <div id="chat-content">
        <el-container>
            <el-header class="content-header">
                <el-button class="h-button" v-if="isMobile.isMobile()" :icon="Menu" @click="openDrawer"></el-button>
                <span class="headerText" v-text="channelList.some(item => item.id === onlineChatStore.chatChannel) ? channelList.find(item => item.id === onlineChatStore.chatChannel).name : channelList.find(item => item.id === 0).name"></span>
                <el-tooltip class="box-item" effect="dark" :content="`连接状态：${onlineChatStore.connection ? '在线' : '离线'}`" placement="right" v-if="!isMobile.isMobile()">
                    <span class="systemStat" :style="{ backgroundColor: onlineChatStore.connection ? 'var(--dominColor)' : '#F56C6C' }"></span>
                </el-tooltip>
                <el-skeleton style="width:300px; height: 28px; border: 5px solid #ffffff; border-radius: 0.25rem;" :rows="0" animated v-if="channelList.find(item => item.id === onlineChatStore.chatChannel).playlist !== 0 && !onlineChatStore.connection" />
                <el-tooltip class="box-item" effect="dark" content="全站网易云音乐" placement="right" v-if="channelList.find(item => item.id === onlineChatStore.chatChannel).playlist !== 0 && (onlineChatStore.connection && !isMobile.isMobile())">
                    <iframe class="pciframe" frameborder="no" border="0" marginwidth="0" marginheight="0" width=300 height=52 :src="`https://music.163.com/outchain/player?type=0&id=${channelList.find(item => item.id === onlineChatStore.chatChannel).playlist}&auto=0&height=32`"></iframe>
                </el-tooltip>
                <span class="onlineText" v-if="!isMobile.isMobile()">在线人数：{{ onlineChatStore.onlineUser }}</span>
            </el-header>

            <el-main class="content-main main-empty" ref="contents" v-if="messageList.length === 1 || !onlineChatStore.connection" v-loading="!onlineChatStore.connection" element-loading-text="正在从服务器获取数据" element-loading-background="#dae8f1" :element-loading-spinner="loadingSvg" element-loading-svg-view-box="-10, -10, 50, 50">
                <el-empty description=" " @click="searchFromChannel"/>
            </el-main>

            <el-main class="content-main" ref="contents" v-if="messageList.length > 1 && channelList.some(item => item.id === onlineChatStore.chatChannel) && onlineChatStore.connection" v-loading="!onlineChatStore.connection" element-loading-text="正在从服务器获取数据" element-loading-background="#dae8f1" :element-loading-spinner="loadingSvg" element-loading-svg-view-box="-10, -10, 50, 50">
                <el-button class="fast-option" type="warning" plain v-if="messageList.length   > 10 && onlineChatStore.chatChannel === 0" @click="fastOptionDown">快速定位到最新的聊天记录</el-button>
                <Message v-for="(message) in messageList" :message="message" v-if="onlineChatStore.connection" @avatarClaps="avatarClaps" @avtMousedown="avtMousedown" @avtMouseup="avtMouseup"/>
            </el-main>

            <el-main class="content-main" ref="contents" v-if="!channelList.some(item => item.id === onlineChatStore.chatChannel)" v-loading="!onlineChatStore.connection" element-loading-text="正在从服务器获取数据" element-loading-background="#dae8f1" :element-loading-spinner="loadingSvg" element-loading-svg-view-box="-10, -10, 50, 50">
                <el-result icon="error" title="该频道未开启">
                    <template #extra>
                        <el-button type="primary" @click="backMainChannel(onlineChatStore.chatChannel)">返回到主频道</el-button>
                    </template>
                </el-result>
            </el-main>
            
            <el-footer class="content-footer">
                <el-input autosize type="textarea" class="chat-input" v-model="chatText" placeholder="请在此输入聊天内容，按Ctrl+Enter发送..." clearable maxlength="100" show-word-limit @keydown="handleKeydown"/>
                <el-button class="chat-button" type="primary" plain @click="sendChatMessage" v-text="onlineChatStore.sendst === 1 ? '发送消息（发送中）' : '发送消息'"></el-button>
                <el-button class="more-button" type="primary" plain @click="sendChatHitokoto" v-loading="onlineChatStore.sendst === 2" element-loading-background="#90d29d" :element-loading-spinner="loadingSvg" element-loading-svg-view-box="-10, -10, 50, 50" v-if="!isMobile.isMobile()">
                    <svg t="1708769523336" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5067" width="20" height="20"><path d="M925.696 384q19.456 0 37.376 7.68t30.72 20.48 20.48 30.72 7.68 37.376q0 20.48-7.68 37.888t-20.48 30.208-30.72 20.48-37.376 7.68l-287.744 0 0 287.744q0 20.48-7.68 37.888t-20.48 30.208-30.72 20.48-37.376 7.68q-20.48 0-37.888-7.68t-30.208-20.48-20.48-30.208-7.68-37.888l0-287.744-287.744 0q-20.48 0-37.888-7.68t-30.208-20.48-20.48-30.208-7.68-37.888q0-19.456 7.68-37.376t20.48-30.72 30.208-20.48 37.888-7.68l287.744 0 0-287.744q0-19.456 7.68-37.376t20.48-30.72 30.208-20.48 37.888-7.68q39.936 0 68.096 28.16t28.16 68.096l0 287.744 287.744 0z" p-id="5068" fill="#ffffff"></path></svg>
                </el-button>
            </el-footer>
        </el-container>
    </div>
</template>

<style>
    .main-empty {
        justify-content: center;
    }

    .el-drawer__body {
        padding: unset;
    }

    .fast-option {
        min-height: 40px;
        margin-bottom: 30px;
        box-shadow: none!important;
        color: #e6a23c!important;
        border-color: #f3d19e!important;
        background-color: #fdf6ec!important;
    }
</style>