<template>
  <div class="table-container">
    <div class="header">
      <h1>Solicitações de Transporte de Maca</h1>
      <button v-if="isAdmin" @click="openModal" class="new-request-btn"><i class="bx bx-plus-medical"></i><span>Nova Solicitação</span></button>
    </div>
    <div class="table-wrapper">
      <template v-if="requests.length > 0">
        <table class="transport-table">
          <thead>
            <tr>
              <th class="rounded-tl">ID</th>
              <th>Paciente</th>
              <th>Origem</th>
              <th>Destino</th>
              <th>Transporte</th>
              <th>Prioridade</th>
              <th v-if="isAdmin">Status</th>
              <th v-if="isAdmin">Maqueiro</th>
              <th class="rounded-tr">Data</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="request in requests" :key="request.id">
              <td>{{ request.id }}</td>
              <td>{{ request.patient_name }}</td>
              <td>{{ request.initial_point }}</td>
              <td>{{ request.destination_point }}</td>
              <td>{{ request.status }}</td>
              <td>{{ request.priority }}</td>
              <td v-if="isAdmin">{{ request.request_status }}</td>
              <td v-if="isAdmin">{{ request.maqueiro_name }}</td>
              <td>{{ formatDate(request.data) }}</td>
            </tr>
          </tbody>
        </table>
      </template>
      <template v-else>
        <p>Não existem solicitações de transporte.</p>
      </template>
    </div>
    <NewRequestModal v-if="showModal" @close="closeModal" @submit-request="createRequest" :requestData.sync="newRequestData" />
  </div>
</template>

<script>
import axios from '@/utils/axios';
import Swal from 'sweetalert2';
import { jwtDecode } from 'jwt-decode';
import Sidebar from '@/components/sidebar.vue';
import NewRequestModal from '@/components/newRequestModal.vue';

export default {
  components: {
    Sidebar,
    NewRequestModal
  },

  data() {
    return {
      requests: [],
      maqueiro_id: null,
      isAdmin: false,
      showModal: false,
      newRequestData: {
        patient_name: '',
        initial_point: '',
        destination_point: '',
        priority: 'Baixa',
        status: 'Aguardando transporte',
        maqueiro_id: null,
        data: new Date().toISOString().substr(0, 10)
      }
    };
  },

  created() {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      this.maqueiro_id = decodedToken.userid;
      this.perms = decodedToken.perms;
      this.isAdmin = decodedToken.perms === 'Admin';
      this.fetchRequests();
    } else {
      console.log('Nenhum token encontrado no localStorage');
    }
  },
  
  methods: {
    async fetchRequests() {
      try {
        const endpoint = this.isAdmin ? '/transport-requests' : `/transport-requests/maqueiro/${this.maqueiro_id}`;
        const response = await axios.get(endpoint);
        this.requests = response.data;
      } catch (error) {
        console.error('Erro ao buscar solicitações de transporte:', error);
      }
    },
    
    async createRequest() {
    try {
      await axios.post('/transport-requests', this.newRequestData);
      this.closeModal();
      this.fetchRequests();
      this.$emit('dataUpdated');
      Swal.fire({
        icon: 'success',
        title: 'Solicitação Adicionada',
        text: 'A solicitação foi adicionada com sucesso!',
      });
    } catch (error) {
      console.error('Erro ao criar nova solicitação:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Houve um erro ao adicionar a solicitação. Tente novamente mais tarde.',
      });
    }
  },

    formatDate(dateString) {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    },

    openModal() {
      this.showModal = true;
    },

    closeModal() {
      this.showModal = false;
      this.newRequestData = {
        patient_name: '',
        initial_point: '',
        destination_point: '',
        priority: 'Baixa',
        status: 'Aguardando transporte',
        maqueiro_id: null,
        data: new Date().toISOString().substr(0, 10)
      };
    },
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