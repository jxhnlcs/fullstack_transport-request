<template>
  <div class="table-container">
    <div class="header">
      <h1>Solicitações de Transporte de Maca</h1>
      <button @click="newRequest" class="new-request-btn"><i class="bx bx-plus-medical"></i><span>Nova Solicitação</span></button>
    </div>
    <div class="table-wrapper">
      <template v-if="requests.length > 0">
        <table class="transport-table">
          <thead>
            <tr>
              <th class="rounded-tl">ID</th>
              <th>Nome do Paciente</th>
              <th>Data</th>
              <th>Destino Inicial</th>
              <th>Destino Final</th>
              <th>Transporte</th>
              <th>Prioridade</th>
              <th class="rounded-tr">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="request in requests" :key="request.id">
              <td>{{ request.id }}</td>
              <td>{{ request.patient_name }}</td>
              <td>{{ formatDate(request.data) }}</td>
              <td>{{ request.initial_point }}</td>
              <td>{{ request.destination_point }}</td>
              <td>{{ request.status }}</td>
              <td>{{ request.priority }}</td>
              <td>{{ request.request_status }}</td>
            </tr>
          </tbody>
        </table>
      </template>
      <template v-else>
        <p class="no-requests-message">Não existem solicitações de transporte.</p>
      </template>
    </div>
  </div>
</template>

<script>
import axios from '@/utils/axios';
import { jwtDecode } from 'jwt-decode';
import Sidebar from '@/components/sidebar.vue';

export default {
  name: 'TransportRequests',
  components: {
    Sidebar,
  },
  data() {
    return {
      requests: [],
      maqueiro_id: null,
    };
  },
  created() {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      this.maqueiro_id = decodedToken.userid;
      this.fetchRequests();
    } else {
      console.log('Nenhum token encontrado no localStorage');
    }
  },
  methods: {
    async fetchRequests() {
      try {
        const response = await axios.get('/transport-requests');
        this.requests = response.data;
      } catch (error) {
        console.error('Erro ao buscar solicitações de transporte:', error);
      }
    },
    
    newRequest() {
      // Implementação da lógica para nova solicitação
    },

    formatDate(dateString) {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    }
  },
};
</script>

<style scoped>
.table-container {
  padding: 20px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  height: 100%;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header h1 {
  font-size: 16px;
  color: #373D3F;
}

.new-request-btn {
  background-color: #2980B9;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.new-request-btn i{
  margin-right: 10px;
}

.new-request-btn:hover {
  transition: 0.5s;
  background-color: #1a5a7f;
}

.table-wrapper {
  overflow: auto;
  flex-grow: 1;
}

.transport-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.transport-table th,
.transport-table td {
  border: none;
  padding: 8px;
  text-align: left;
}

.transport-table th {
  background-color: #f2f2f2;
}

.transport-table th.rounded-tl {
  border-top-left-radius: 10px;
}

.transport-table th.rounded-tr {
  border-top-right-radius: 10px;
}

.transport-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.transport-table tr:hover {
  background-color: #f1f1f1;
  cursor: pointer;
}
</style>