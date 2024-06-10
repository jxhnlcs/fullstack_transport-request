<template>
  <nav class="navbar">
    <div class="navbar-container">
      <div class="search-container">
        <input
          type="text"
          id="search"
          v-model="searchQuery"
          @input="search"
        />
      </div>
      <button v-if="isAdmin" class="add-button"><i class="bx bx-user-plus"></i></button>
    </div>
  </nav>
</template>

<script>

import { jwtDecode } from 'jwt-decode';

export default {
  data() {
    return {
      searchQuery: "",
      isAdmin: false,
    };
  },

  created() {
      const token = localStorage.getItem('token');
      if (token) {
        const decodedToken = jwtDecode(token);
        this.perms = decodedToken.perms;
        this.isAdmin = decodedToken.perms === 'Admin';
      } else {
        console.log('Nenhum token encontrado no localStorage');
      }
    },

  methods: {
    search() {
      this.$emit("search-events", this.searchQuery);
    },
  },
};
</script>

<style scoped>
.navbar {
  background-color: #ffffff;
  padding: 14px;
  width: 100%;
}

.navbar-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.add-button {
  background-color: #2980B9;
  color: rgb(255, 255, 255);
  font-size: 20px;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px
}

.search-container {
  display: flex;
  align-items: center;
  margin-right: 10px;
}

label {
  color: white;
  margin-right: 5px;
}

input {
  width: 200px;
  padding: 10px;
  border-radius: 16px;
  outline: none;
  background-color: #ffffff;
  border: none;
}


@media (max-width: 768px) {
  .navbar-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>