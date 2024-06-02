<template>
  <div>
    <h1>Home</h1>
  </div>
</template>

<script>

import { jwtDecode } from 'jwt-decode';

export default {

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
