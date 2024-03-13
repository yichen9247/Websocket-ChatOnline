<script setup>
    import "./styles/MSettings.css"

    import { ref } from 'vue'
    import History from "../../../../cache/history.json"
    import channelList from "../../../../server/chan.js"
    import { useOnlineChatStore } from "@/stores/onlineChatStore"

    const onlineChatStore = useOnlineChatStore();

    const active = ref(0);
    const useHistoryNu = ref(Math.floor(History.length / 6));

    const colors = [
        { color: '#6f7ad3', percentage: 0 },
        { color: '#1989fa', percentage: 20 },
        { color: '#5cb87a', percentage: 40 },
        { color: '#e6a23c', percentage: 60 },
        { color: '#f56c6c', percentage: 80 },
    ]
</script>

<template>
    <div id="m-settings">
        <van-tabs v-model:active="active" animated>
            <van-tab title="系统概览">
                <div class="tab-h">系统概览</div>
                <div class="tab-b">
                    <div class="flex-line">
                        <el-progress type="dashboard" :percentage="useHistoryNu" :color="colors">
                            <template #default="{ percentage }">
                              <span class="percentage-value">{{ percentage }}%</span>
                              <span class="percentage-label">聊天记录占比</span>
                            </template>
                        </el-progress>

                        <div class="progress-content">
                            <span class="content-text">当前已经使用：{{ History.length }}条</span>
                            <span class="content-text">剩余记录配额：{{ 600 - History.length }}条</span>
                            <span class="content-text">聊天记录限额：600条</span>
                            <span class="content-text">TIPS：当配额已满时，系统会提前告知用户并自动清理聊天记录</span>
                        </div>
                    </div>
                </div>
            </van-tab>
            <van-tab title="主题设置">
                <div class="tab-h">主题设置</div>
                <div class="tab-b">
                    <el-empty description="此处正在努力施工中" />
                </div>
            </van-tab>
            <van-tab title="聊天设置">
                <div class="tab-h">聊天设置</div>
                <div class="tab-b">
                    <el-empty description="此处正在努力施工中" />
                </div>
            </van-tab>
            <van-tab title="关于项目">
                <div class="tab-h">关于项目</div>
                <div class="tab-b">
                    <el-text class="mx-1">这是一个基于Vue3和Websocket实时通讯技术以及Element Plus构建的前端网页在线聊天室，旨在使用最少的代码和最简单的逻辑来模拟在线聊天环境。</el-text>
                </div>
            </van-tab>
        </van-tabs>
    </div>
</template>