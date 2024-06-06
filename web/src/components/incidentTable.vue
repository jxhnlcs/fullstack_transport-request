<template>
  <div class="table-container">
    <h1>Incidentes Recentes</h1>
    <div class="table-wrapper">
      <template v-if="incidents.length > 0">
        <table class="incident-table">
          <thead>
            <tr>
              <th class="rounded-tl">ID</th>
              <th>Paciente</th>
              <th>Descrição</th>
              <th>Data e Hora</th>
              <th v-if="isAdmin" class="rounded-tr">Maqueiro</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="incident in incidents" :key="incident.id">
              <td>{{ incident.id }}</td>
              <td>{{ incident.patient_name }}</td>
              <td>{{ incident.descricao }}</td>
              <td>{{ formatDate(incident.dataHora) }}</td>
              <td v-if="isAdmin">{{ incident.maqueiro_name }}</td>
            </tr>
          </tbody>
        </table>
      </template>
      <template v-else>
        <p style="margin-top: 10px;">Não há incidentes para este maqueiro.</p>
      </template>
    </div>
  </div>
</template>

<script>
import axios from '@/utils/axios';
import { jwtDecode } from 'jwt-decode';

export default {

  props: ['incidentDataUpdated'],

  watch: {
    incidentDataUpdated() {
      this.fetchIncidents();
    }
  },

  data() {
    return {
      incidents: [],
      maqueiro_id: null,
      isAdmin: false,
    };
  },
  created() {

    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      this.maqueiro_id = decodedToken.userid;
      console.log(this.maqueiro_id)
      this.perms = decodedToken.perms
      this.isAdmin = decodedToken.perms === 'Admin';
      this.fetchIncidents();
    } else {
      console.log('Nenhum token encontrado no localStorage');
    }
  },

  methods: {
    async fetchIncidents() {
      try {
        console.log("fazendo fetch")
        const endpoint = this.isAdmin ? '/incidents' : `/incidents/maqueiro/${this.maqueiro_id}`;
        const response = await axios.get(endpoint);
        this.incidents = response.data;
      } catch (error) {
        console.error('Erro ao buscar incidentes:', error);
      }
    },

    formatDate(dateString) {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    }
  },
};
</script>

<style scoped>
.table-container {
  padding: 20px;
  background: #fff;
  border-radius: 10px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  height: 100%;
}

.table-container h1{
  font-size: 16px;
  color: #373D3F;
}

.table-wrapper {
  overflow: auto;
  flex-grow: 1;
  max-height: 100px;
}

.incident-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.incident-table th,
.incident-table td {
  border: none;
  padding: 8px;
  text-align: left;
}

.incident-table th {
  background-color: #f2f2f2;
}

.incident-table th.rounded-tl {
  border-top-left-radius: 10px;
}

.incident-table th.rounded-tr {
  border-top-right-radius: 10px;
}

.incident-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.incident-table tr:hover {
  background-color: #f1f1f1;
  cursor: pointer;
}
</style>
