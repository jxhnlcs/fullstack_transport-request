import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '@/assets/css/global.css';
import '@fortawesome/fontawesome-free/css/all.css';
import apexcharts from './plugins/apexchart';

createApp(App).use(router).use(apexcharts).mount('#app')