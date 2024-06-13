<template>
  <div class="modal">
    <div class="modal-content">
      <span class="close" @click="closeModal">&times;</span>
      <h2>Usuários</h2>
      <form @submit.prevent="submitUser">
        <div class="form-row">
          <div class="form-group">
            <label for="name">Nome</label>
            <input type="text" id="name" v-model="userData.name" required />
          </div>
          <div class="form-group">
            <label for="username">Nome de Usuário</label>
            <input
              type="text"
              id="username"
              v-model="userData.username"
              required
            />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" v-model="userData.email" required />
          </div>
        </div>
        <div class="modal-actions">
          <button type="submit" class="submit-btn" :disabled="!isFormValid">Criar Usuário</button>
        </div>
      </form>

      <div class="user-list">
        <h2>Lista de Usuários</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Nome de Usuário</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>{{ user.id }}</td>
              <td>{{ user.name }}</td>
              <td>{{ user.username }}</td>
              <td>{{ user.email }}</td>
            </tr>
          </tbody>
        </table>
        <user-modal
          v-if="showModal"
          @close="closeModal"
          :userData="selectedUser"
          :isEditMode="isEditMode"
        ></user-modal>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "@/utils/axios";
import Swal from "sweetalert2";

export default {
  props: {
    userData: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      users: [],
    };
  },

  created() {
    this.fetchUsers();
  },

  computed: {
    isFormValid() {
      return (
        this.userData.name.trim() !== "" &&
        this.userData.username.trim() !== "" &&
        this.userData.email.trim() !== ""
      );
    },
  },

  methods: {
    async fetchUsers() {
      try {
        const response = await axios.get("/users");
        this.users = response.data;
        console.log(this.users);
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      }
    },

    async submitUser() {
      try {
      await axios.post("/register", this.userData);
      Swal.fire({
        title: "Usuário Criado!",
        text: "O novo usuário foi criado com sucesso.",
        icon: "success",
        confirmButtonText: "OK",
      });
      this.resetForm();
      this.$emit("close");
      } catch (error) {
      Swal.fire({
        title: "Erro!",
        text: "Ocorreu um erro ao salvar o usuário.",
        icon: "error",
        confirmButtonText: "OK",
      });
      }
    },

    resetForm() {
      this.userData.name = '';
      this.userData.username = '';
      this.userData.email = '';
    },

    closeModal() {
      this.resetForm();
      this.$emit('close');
    }
  },
};
</script>

<style scoped>
.modal {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.7);
}

.modal-content {
  background-color: #fff;
  padding: 30px;
  border-radius: 15px;
  width: 80%;
  max-width: 600px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  position: relative;
}

.close {
  color: #aaa;
  position: absolute;
  top: 15px;
  right: 20px;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
}

.close:hover,
.close:focus {
  color: #000;
  text-decoration: none;
  cursor: pointer;
}

h2 {
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
  text-align: center;
}

.form-group {
  margin-bottom: 20px;
  width: calc(50% - 10px);
  display: inline-block;
}

.form-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 16px;
  color: #333;
  box-sizing: border-box;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #2980b9;
}

.submit-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #2980b9;
  color: white;
  font-size: 16px;
  cursor: pointer;
}

.submit-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.submit-btn:hover:enabled {
  background-color: #1a5a7f;
  transition: background-color 0.3s ease;
}

.modal-actions {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.user-list {
  margin-top: 30px;
  max-height: 300px;
  overflow-y: auto;
  padding: 20px;
}

.user-list h2 {
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
}

.user-list table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.user-list th,
.user-list td {
  padding: 10px;
  border: 1px solid #ccc;
  text-align: left;
}

.user-list th {
  background-color: #f4f4f4;
  font-weight: bold;
}

.user-list button {
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: #2980b9;
  color: white;
  font-size: 14px;
}

.user-list button:hover {
  background-color: #1a5a7f;
  transition: background-color 0.3s ease;
}

</style>