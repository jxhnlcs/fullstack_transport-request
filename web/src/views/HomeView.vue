<template>
  <div>
    <h1>Home</h1>
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>

import HelloWorld from '@/components/HelloWorld.vue'

export default {
  components: {
    HelloWorld
  },

  beforeRouteEnter(to, from, next) {
    const documentTitle = typeof to.meta.title === 'string' ? to.meta.title : 'Cleriston Transporte';
    document.title = documentTitle;
    next();
  }
}
</script>
