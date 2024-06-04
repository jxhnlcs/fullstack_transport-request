<template>
  <nav class="navbar">
    <div class="navbar-container">
      <div class="search-container">
        <input
          type="text"
          id="search"
          v-model="searchQuery"
          @input="search"
          placeholder="Pesquisar"
        />
      </div>
    </div>
  </nav>
</template>

<script>

export default {
  data() {
    return {
      searchQuery: "",
    };
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
  background-color: #ebebeb;
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