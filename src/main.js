
import './assets/index.css'
import 'element-plus/dist/index.css'

import App from './App.vue'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

const app = createApp(App);

app.use(createPinia());

app.mount('#app');
