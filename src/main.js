
import Vant from 'vant'
import Pace from 'pace-js'
import './assets/index.css'
import 'vant/lib/index.css'
import 'element-plus/dist/index.css'

import App from './App.vue'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

const app = createApp(App);

app.use(Vant);
app.use(createPinia());

app.mount('#app');