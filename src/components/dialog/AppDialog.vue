<script setup>
    import "./styles/AppDialog.css"

    import axios from "axios"
    import Cookies from "js-cookie"
    import { ref, watch } from "vue"
    import isMobile from "@/scripts/mobile.js"
    import channelList from "../../../server/chan.js"
    import { ElMessage, ElMessageBox } from 'element-plus'
    import { useOnlineChatStore } from "@/stores/onlineChatStore"
    import { useOnelDialogStore } from "@/stores/onelDialogStore"

    import MSettings from "@/components/dialog/Settings/MSettings.vue"
    import PSettings from "@/components/dialog/Settings/PSettings.vue"

    const avatarInput = ref('');
    const searchInput = ref('');
    const nameInfoInput = ref('');
    const onlineChatStore = useOnlineChatStore();
    const onelDialogStore = useOnelDialogStore();
    const emit = defineEmits(['sendJoinMessage']);

    const setUserAvatar = () => {
        if (avatarInput.value !== "") {
            onlineChatStore.setUserQQ(avatarInput.value);
            Cookies.set('userqq',avatarInput.value,{ expires: 30 });
            ElMessage({ message: '设置头像成功！', type: 'success' });
        } else {
            ElMessage({ message: 'QQ号请不要为空！', type: 'warning' });
        }
    }

    const setUserNameInfo = () => {
        if (nameInfoInput.value !== "") {
            const checkText = async () => {
                const checkUrl = await axios.get('https://v2.alapi.cn/api/censor/text?token=MPCPPpyj3e1QWU7y&text=' + nameInfoInput.value);
                const editName = () => {
                    onlineChatStore.setUserName(nameInfoInput.value);
                    ElMessage({ message: '设置昵称成功！', type: 'success' });
                    Cookies.set('username',nameInfoInput.value,{ expires: 30 });
                }
                
                if (checkUrl.data.code !== 102) {
                    if (checkUrl.data.data.conclusion === "不合规") {
                        ElMessage({ message: '昵称不合规请检查！', type: 'error' });
                    } else editName();
                } else editName();
            }
            checkText();
        } else {
            ElMessage({ message: '昵称请不要为空！', type: 'warning' });
        }
    }

    const searchChannel = (channel) => {
        if (onlineChatStore.logind && onlineChatStore.connection) {
            if (channelList.some(item => item.id === Number(searchInput.value))) {
                if (onlineChatStore.chatChannel !== Number(searchInput.value)) {
                    onelDialogStore.setSearchalCenter(false);
                    let channelName = channelList.find(item => item.id === Number(searchInput.value)).name;
                    ElMessageBox.confirm(`查找到频道【${channelName}】，是否加入？`, '搜索频道', {
                        type: 'warning',
                        cancelButtonText: '取消',
                        confirmButtonText: '进入频道'
                    }).then(() => {
                        onlineChatStore.setChatChannel(Number(searchInput.value));
                        history.pushState(null,null,`/?channel=${Number(searchInput.value)}`);
                        emit('sendJoinMessage',Number(searchInput.value));
                        searchInput.value = "";
                        ElMessage({ message: '加入聊天室成功，请遵守聊天规则！', type: 'success' });
                    }).catch(() => {});
                } else {
                    ElMessage({ message: '你当前已在该频道中，请勿重复加入！', type: 'warning' });
                }
            } else {
                ElMessage({ message: '未查找到该频道或者该频道已经关闭！', type: 'warning' });
            }
        } else {
            ElMessage({ message: '你还没有登录到聊天室哦！', type: 'warning' });
        }
    }

    const circleUrl = ref("https://dn-qiniu-avatar.qbox.me/avatar/");
    watch(onlineChatStore,() => {
        circleUrl.value = onlineChatStore.userqq === 0 ? "https://dn-qiniu-avatar.qbox.me/avatar/" : `https://q2.qlogo.cn/headimg_dl?dst_uin=${onlineChatStore.userqq}&spec=5`;
    },{deep:true});
</script>

<template>
    <el-dialog v-model="onelDialogStore.personalCenter" title="个人中心" width="25%" align-center destroy-on-close center>
        <div class="personCenter">
            <div class="info-line" style="height: 70px;">
                <el-image class="avatar" shape="square" size="small" :src="circleUrl" :preview-src-list="[circleUrl]"/>
                <div class="avatar-edit-content">
                    <span class="title-text">设置头像</span>
                    <div class="flex-line">
                        <el-input v-model="avatarInput" maxlength="12" placeholder="请输入你的QQ号以获取头像" show-word-limit type="text" clearable validate-event />
                        <el-button type="primary" @click="setUserAvatar()">设置头像</el-button>
                    </div>
                </div>
            </div>
            
            <div class="info-line">
                <div class="flex-line">
                    <span class="title-text" style="margin-right: 10px;">设置昵称：</span>
                    <div class="flex-line">
                        <el-input v-model="nameInfoInput" maxlength="5" placeholder="请在此输入合法的互联网昵称" show-word-limit type="text" clearable validate-event />
                        <el-button type="primary" @click="setUserNameInfo()">设置昵称</el-button>
                    </div>
                </div>
            </div>

            <div class="info-lines">
                <span class="id-info" v-text="channelList.find(item => item.id === onlineChatStore.chatChannel).admin === onlineChatStore.userid ? '用户身份：管理员' : '用户身份：普通用户'"></span>
                &nbsp;&nbsp;&nbsp;<span class="id-info">用户号码：{{ onlineChatStore.userid }}</span>
            </div>
        </div>
    </el-dialog>

    <el-dialog v-model="onelDialogStore.searchalCenter" title="搜索频道" width="450px" align-center destroy-on-close center>
        <div class="flex-line" style="display: flex;">
            <el-input v-model="searchInput" maxlength="5" placeholder="请在此输入管理员提供的频道ID" show-word-limit type="text" clearable validate-event />
            <el-button type="primary" @click="searchChannel()" style="margin-left: 15px;">搜索频道</el-button>
        </div>
    </el-dialog>
    
    <el-dialog v-model="onelDialogStore.settinglCenter" title="系统设置" width="650px" align-center destroy-on-close center>
        <PSettings v-if="!isMobile.isMobile()"/>
        <MSettings v-else/>
    </el-dialog>
</template>