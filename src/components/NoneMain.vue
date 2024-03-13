<script setup>
    import "./styles/SearchMain.css"
    import isMobile from "@/scripts/mobile.js"
    import { useOnlineChatStore } from "@/stores/onlineChatStore"
    import { useOnelDialogStore } from "@/stores/onelDialogStore"

    const onlineChatStore = useOnlineChatStore();
    const onelDialogStore = useOnelDialogStore();

    const searchFromChannel = (channel) => {
        if (onlineChatStore.logind && onlineChatStore.connection) {
            onelDialogStore.setSearchalCenter(true);
        } else {
            if (isMobile.isMobile()) {
                showFailToast('用户未登录');
            } else ElMessage({ message: '你还没有登录到聊天室哦！', type: 'warning' });
        }
    }
</script>

<template>
    <div id="search-main">
        <el-empty description=" " @click="searchFromChannel"/>
    </div>
</template>