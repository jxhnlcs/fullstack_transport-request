<template>
  <div class="modal">
    <div class="modal-content">
      <span class="close" @click="$emit('close')">&times;</span>
      <h2>Nova Solicitação de Transporte</h2>
      <form @submit.prevent="submitRequest">
        <div class="form-row">
          <div class="form-group">
            <label for="patient_name">Paciente</label>
            <input
              type="text"
              id="patient_name"
              v-model="requestData.patient_name"
              required
            />
          </div>
          <div class="form-group">
            <label for="initial_point">Origem</label>
            <input
              type="text"
              id="initial_point"
              v-model="requestData.initial_point"
              required
            />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="destination_point">Destino</label>
            <input
              type="text"
              id="destination_point"
              v-model="requestData.destination_point"
              required
            />
          </div>
          <div class="form-group">
            <label for="priority">Prioridade</label>
            <select id="priority" v-model="requestData.priority" required>
              <option value="Baixa">Baixa</option>
              <option value="Média">Média</option>
              <option value="Alta">Alta</option>
            </select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="status">Status</label>
            <select id="status" v-model="requestData.status" required>
              <option value="Aguardando transporte">
                Aguardando transporte
              </option>
              <option value="Em transporte">Em transporte</option>
              <option value="Chegou ao destino">Chegou ao destino</option>
            </select>
          </div>
          <div class="form-group">
            <label for="maqueiro_id">Maqueiro</label>
            <select id="maqueiro_id" v-model="requestData.maqueiro_id" required>
              <option
                v-for="maqueiro in maqueiros"
                :key="maqueiro.id"
                :value="maqueiro.id"
              >
                {{ maqueiro.name }}
              </option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label for="data">Data</label>
          <input type="date" id="data" v-model="requestData.data" required />
        </div>
        <button type="submit" class="submit-btn">Criar Solicitação</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "@/utils/axios";

export default {
  props: {
    requestData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      maqueiros: [],
    };
  },
  created() {
    this.fetchMaqueiros();
    this.setDefaultDate();
  },
  methods: {
    async fetchMaqueiros() {
      try {
        const response = await axios.get("/users");
        this.maqueiros = response.data.filter(
          (user) => user.role === "Maqueiro"
        );
      } catch (error) {
        console.error("Erro ao buscar maqueiros:", error);
      }
    },
    setDefaultDate() {
      const today = new Date().toISOString().substr(0, 10);
      if (!this.requestData.data) {
        this.$emit("update:requestData", { ...this.requestData, data: today });
      }
    },
    submitRequest() {
      if (!this.requestData.data) {
        this.setDefaultDate();
      }
      this.$emit("submit-request");
    },
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
  max-width: 500px;
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

.form-row {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.form-group {
  flex: 1;
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
  width: 100%;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #2980b9;
  color: white;
  font-size: 16px;
  cursor: pointer;
}

.submit-btn:hover {
  background-color: #1a5a7f;
  transition: background-color 0.3s ease;
}
</style>
