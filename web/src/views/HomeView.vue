<template>
  <div class="app">
    <div class="sidebar">
      <Sidebar />
    </div>
    <div class="content">
      <h1>Dashboard</h1>
    </div>
  </div>
</template>

<script>

import Sidebar from '../components/sidebar.vue'
import { jwtDecode } from 'jwt-decode';

export default {

  components: {
    Sidebar,
  },

  beforeRouteEnter(to, from, next) {
    const documentTitle = typeof to.meta.title === 'string' ? to.meta.title : 'Cleriston Transporte';
    document.title = documentTitle;
    next();
  },
  
  created() {
      const token = localStorage.getItem('token');
      if (token) {
        const decodedToken = jwtDecode(token);
        console.log(decodedToken);
      } else {
        console.log('Nenhum token encontrado no localStorage');
      }
    },
}
</script>

<style scoped>
.app {
  display: flex;
}

.content {
  margin: 20px;
}
</style>