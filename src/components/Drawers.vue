<script setup>
    import "./styles/Drawers.css"
    import { ref, watch } from "vue"
    import '@mdui/icons/brightness-6.js'
    import { useOnlineChatStore } from "@/stores/onlineChatStore"
    import { useOnelDialogStore } from "@/stores/onelDialogStore"

    const onlineChatStore = useOnlineChatStore();
    const onelDialogStore = useOnelDialogStore();

    const openPersonalDialog = () => {
        if (onlineChatStore.logind && onlineChatStore.connection) {
            onelDialogStore.setPersonalCenter(true);
        } else {
            ElMessage({ message: '你还没有登录到聊天室哦！', type: 'warning' });
        }
    }

    const searchFromChannel = (channel) => {
        if (onlineChatStore.logind && onlineChatStore.connection) {
            onelDialogStore.setSearchalCenter(true);
        } else {
            ElMessage({ message: '你还没有登录到聊天室哦！', type: 'warning' });
        }
    }

    const aboutThisChatPage = (channel) => {
        ElMessageBox.alert('这是一个基于Vue3和Websocket实时通讯技术以及Element Plus构建的前端网页在线聊天室，旨在使用最少的代码和最简单的逻辑来模拟在线聊天环境。', '关于项目', {
            confirmButtonText: '朕已知晓',
            callback: (action) => {},
        });
    }

    const settingFromChatPage = () => {
        if (onlineChatStore.logind && onlineChatStore.connection) {
            onelDialogStore.setSettinglCenter(true);
        } else {
            ElMessage({ message: '你还没有登录到聊天室哦！', type: 'warning' });
        }
    }

    const openGithubSite = () => window.open('https://github.com/yichen9247/Websocket-ChatOnline');
    const circleUrl = ref(onlineChatStore.userqq === 0 ? "https://dn-qiniu-avatar.qbox.me/avatar/" : `https://q2.qlogo.cn/headimg_dl?dst_uin=${onlineChatStore.userqq}&spec=5`);

    watch(onlineChatStore,() => {
        circleUrl.value = onlineChatStore.userqq === 0 ? "https://dn-qiniu-avatar.qbox.me/avatar/" : `https://q2.qlogo.cn/headimg_dl?dst_uin=${onlineChatStore.userqq}&spec=5`;
    },{deep:true});
</script>

<template>
    <div id="drawer-main">
        <el-button class="side-bright-button" circle>
            <mdui-icon-brightness-6></mdui-icon-brightness-6>
        </el-button>
        <img class="side-out-image" src="../assets/background-01.jpg" draggable="false">
        <div class="side-out-autho drawer-card" @click="openPersonalDialog">
            <img class="avatar-image" :src="circleUrl" :alt="onlineChatStore.username">
            <div class="author-infos">
                <p class="username">{{ onlineChatStore.username }}</p>
                <p class="userhito">云中谁寄锦书来，雁字回时，月满西楼。</p>
            </div>
        </div>

        <div class="side-out-notice drawer-card">
            <van-notice-bar left-icon="volume-o"
            text="无论我们能活多久，我们能够享受的只有无法分割的此刻，此外别无其他。"/>
        </div>

        <div class="side-out-empty drawer-card">
            <van-empty description="正在努力开发中" />
        </div>

        <div class="side-out-navg drawer-card">
            <el-row :gutter="20">
                <el-col :span="6">
                    <div class="nav-item" @click="openGithubSite">
                        <svg t="1703493832460" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5620" width="30" height="30"><path d="M427.392 853.504a61.44 61.44 0 0 1-1.450667 15.530667 92.586667 92.586667 0 0 1-10.965333 27.605333c-15.061333 25.301333-40.661333 42.154667-73.642667 42.154667-77.653333 0-108.117333-38.101333-146.261333-133.504C169.216 740.693333 157.013333 725.461333 128 725.461333v-85.333333c77.653333 0 108.117333 38.101333 146.261333 133.504 25.856 64.597333 38.058667 79.786667 67.072 79.786667 0-12.373333-0.170667-23.296-0.512-38.144-0.853333-34.816-0.938667-41.941333 0.554667-51.2 0.64-20.352 5.888-34.773333 16.384-49.066667-95.232-20.736-159.445333-63.573333-196.309333-132.992l-13.824-32.426667C134.186667 510.848 128 467.072 128 416.426667c0-58.24 17.749333-110.336 50.944-153.856-10.368-41.386667-8.96-91.989333 13.909333-149.077334l7.466667-18.688 19.2-6.101333c2.56-0.853333 5.632-1.578667 9.301333-2.133333 37.290667-5.888 90.325333 8.106667 159.701334 52.48a565.930667 565.930667 0 0 1 127.274666-14.208c38.741333 0 77.226667 3.882667 114.048 11.605333 67.456-42.24 119.04-55.509333 155.306667-49.92 3.626667 0.597333 6.741333 1.322667 9.258667 2.133333l19.285333 6.101334 7.466667 18.773333c20.010667 50.218667 23.424 96.469333 16.128 136.96C875.434667 296.32 896 352.597333 896 416.512c0 53.888-3.84 94.378667-14.933333 133.802667l-11.733334 32.170666c-30.677333 69.333333-98.304 112.64-202.538666 133.248 10.837333 15.018667 15.872 30.250667 15.872 52.394667v42.666667l-0.042667 42.666666a13.013333 13.013333 0 0 0 0.341333 2.730667L682.666667 938.794667c-36.352 0-63.36-17.706667-76.672-45.653334a88.277333 88.277333 0 0 1-8.661334-40.277333v-84.736c0-3.584-0.128-3.797333-8.832-12.501333-23.296-23.296-33.834667-40.874667-33.834666-72.832v-38.613334l38.4-3.84c114.346667-11.52 176.512-43.221333 197.12-89.6l9.6-26.325333c7.68-27.562667 10.88-61.098667 10.88-107.946667 0-49.706667-17.365333-90.837333-50.218667-123.648L742.4 274.773333l7.381333-24.448c6.528-21.717333 8.106667-47.402667 1.152-76.714666a158.634667 158.634667 0 0 0-3.584 0.938666c-22.826667 6.4-51.370667 20.053333-85.76 43.008l-15.658666 10.453334-18.304-4.522667a467.754667 467.754667 0 0 0-111.829334-13.269333c-42.709333 0-84.906667 5.418667-123.946666 16.042666l-19.029334 5.205334-16.256-11.136c-35.541333-24.32-65.109333-38.826667-88.746666-45.568a158.293333 158.293333 0 0 0-4.864-1.28c-8.234667 33.92-4.992 61.781333 3.413333 82.688l9.984 25.088-18.346667 19.797333C228.693333 332.629333 213.333333 370.986667 213.333333 416.512c0 41.685333 4.864 76.202667 13.824 102.229333l11.178667 26.453334c27.904 52.352 87.168 83.84 192.853333 95.146666l38.144 4.096v38.357334c0 32-10.538667 49.536-33.834666 72.832-8.704 8.704-8.832 8.96-8.832 12.501333l-0.725334 7.893333c-0.512 2.56-0.512 9.258667 0.170667 37.205334 0.298667 12.8 0.469333 22.997333 0.554667 33.621333a33.962667 33.962667 0 0 1 0.725333 6.656z" p-id="5621" fill="#636363"></path></svg>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="nav-item" @click="searchFromChannel">
                        <svg t="1703496598838" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4121" width="30" height="30"><path d="M512 85.333333c235.637333 0 426.666667 191.029333 426.666667 426.666667S747.637333 938.666667 512 938.666667 85.333333 747.637333 85.333333 512 276.362667 85.333333 512 85.333333z m0 64c-200.298667 0-362.666667 162.368-362.666667 362.666667s162.368 362.666667 362.666667 362.666667 362.666667-162.368 362.666667-362.666667-162.368-362.666667-362.666667-362.666667z m149.162667 158.901334a42.666667 42.666667 0 0 1 54.602666 54.602666L637.642667 579.84a96 96 0 0 1-57.813334 57.802667l-216.992 78.122666a42.666667 42.666667 0 0 1-54.602666-54.602666l78.122666-217.002667a96 96 0 0 1 57.813334-57.802667z m-20.970667 75.573333l-174.346667 62.762667a32 32 0 0 0-19.274666 19.274666l-62.762667 174.346667 174.346667-62.762667a32 32 0 0 0 19.274666-19.274666l62.762667-174.346667z" fill="#636363" p-id="4122"></path></svg>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="nav-item" @click="aboutThisChatPage">
                        <svg t="1703496071634" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9471" width="30" height="30"><path d="M512 64c247.424 0 448 200.576 448 448s-200.576 448-448 448S64 759.424 64 512 264.576 64 512 64z m0 85.333333C311.701333 149.333333 149.333333 311.701333 149.333333 512s162.368 362.666667 362.666667 362.666667 362.666667-162.368 362.666667-362.666667S712.298667 149.333333 512 149.333333z m21.333333 277.333334a21.333333 21.333333 0 0 1 21.333334 21.333333v298.666667a21.333333 21.333333 0 0 1-21.333334 21.333333h-42.666666a21.333333 21.333333 0 0 1-21.333334-21.333333V448a21.333333 21.333333 0 0 1 21.333334-21.333333h42.666666z m0-170.666667a21.333333 21.333333 0 0 1 21.333334 21.333333v42.666667a21.333333 21.333333 0 0 1-21.333334 21.333333h-42.666666a21.333333 21.333333 0 0 1-21.333334-21.333333v-42.666667a21.333333 21.333333 0 0 1 21.333334-21.333333h42.666666z" fill="#636363" p-id="9472"></path></svg>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="nav-item" @click="settingFromChatPage">
                        <svg t="1703494205002" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8280" width="30" height="30"><path d="M469.333333 60.693333a85.333333 85.333333 0 0 1 85.333334 0l326.826666 188.714667a85.333333 85.333333 0 0 1 42.666667 73.898667v377.386666a85.333333 85.333333 0 0 1-42.666667 73.898667L554.666667 963.306667a85.333333 85.333333 0 0 1-85.333334 0L142.506667 774.592a85.333333 85.333333 0 0 1-42.666667-73.898667v-377.386666a85.333333 85.333333 0 0 1 42.666667-73.898667z m42.666667 73.898667L185.173333 323.306667v377.386666L512 889.408l326.826667-188.714667v-377.386666L512 134.592zM512 341.333333a170.666667 170.666667 0 1 1 0 341.333334 170.666667 170.666667 0 0 1 0-341.333334z m0 85.333334a85.333333 85.333333 0 1 0 0 170.666666 85.333333 85.333333 0 0 0 0-170.666666z" fill="#636363" p-id="8281"></path></svg>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>