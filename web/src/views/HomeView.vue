<template>
  <div class="app">
    <div class="sidebar">
      <Sidebar />
    </div>
    <div class="column-content">
      <Navbar />
      <div class="content">
        <div class="cards">
          <Card
            :value="totalTransports"
            description="Total de Transportes"
            :percentage="totalTransportsPercentage"
            iconClass="bxs-ambulance"
            iconBgColor="#2980B9"
          />
          <Card
            :value="pendingTransports"
            description="Transportes Pendentes"
            :percentage="pendingTransportsPercentage"
            iconClass="bxs-time"
            iconBgColor="#8e44ad"
          />
          <Card
            :value="completedTransports"
            description="Transportes Finalizados"
            :percentage="completedTransportsPercentage"
            iconClass="bx-check-double"
            iconBgColor="#27ae60"
          />
          <Card
            :value="totalIncidents"
            description="Total de Incidentes"
            :percentage="totalIncidentsPercentage"
            iconClass="bx-error"
            iconBgColor="#FF6347"
          />
        </div>
        <div class="table-chart-container">
          <TransportTable />
          <TransportChart />
        </div>
        <div class="incident-table-container">
          <IncidentTable />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/utils/axios';
import Sidebar from '@/components/sidebar.vue';
import Navbar from '@/components/navbar.vue';
import Card from '@/components/card.vue';
import TransportTable from '@/components/transportTable.vue';
import TransportChart from '@/components/transportChart.vue';
import IncidentTable from '@/components/incidentTable.vue';
import { jwtDecode } from 'jwt-decode';

export default {

  components: {
    Sidebar,
    Navbar,
    Card,
    TransportTable,
    TransportChart,
    IncidentTable,
  },

  data() {
    return {
      totalTransports: 0,
      totalTransportsPercentage: "+0%",
      pendingTransports: 0,
      pendingTransportsPercentage: "+0%",
      completedTransports: 0,
      completedTransportsPercentage: "+0%",
      totalIncidents: 0,
      totalIncidentsPercentage: "+0%",
      maqueiro_id: null,
      lastTotalTransports: 0,
      lastPendingTransports: 0,
      lastCompletedTransports: 0,
      lastTotalIncidents: 0,
    };
  },

  created() {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      this.maqueiro_id = decodedToken.userid;
      this.fetchData();
    } else {
      console.log('Nenhum token encontrado no localStorage');
    }
  },

  methods: {
    async fetchData() {
      try {
        await this.fetchTransports();
        await this.fetchIncidents();
        this.updatePercentages();
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    },
    
    async fetchTransports() {
      const response = await axios.get('/transport-requests');
      const transports = response.data;

      this.pendingTransports = transports.filter(transport => transport.request_status === 'Pendente').length;
      this.completedTransports = transports.filter(transport => transport.status === 'Chegou ao destino').length;
      this.totalTransports = transports.length;
    },

    async fetchIncidents() {
      const response = await axios.get('/incidents');
      const incidents = response.data;
      this.totalIncidents = incidents.length;
    },

    updatePercentages() {
      this.totalTransportsPercentage = this.calculatePercentageChange(this.lastTotalTransports, this.totalTransports);
      this.pendingTransportsPercentage = this.calculatePercentageChange(this.lastPendingTransports, this.pendingTransports);
      this.completedTransportsPercentage = this.calculatePercentageChange(this.lastCompletedTransports, this.completedTransports);
      this.totalIncidentsPercentage = this.calculatePercentageChange(this.lastTotalIncidents, this.totalIncidents);

      this.lastTotalTransports = this.totalTransports;
      this.lastPendingTransports = this.pendingTransports;
      this.lastCompletedTransports = this.completedTransports;
      this.lastTotalIncidents = this.totalIncidents;
    },

    calculatePercentageChange(oldValue, newValue) {
      if (oldValue === 0) {
        return newValue > 0 ? `+${newValue}` : "0%";
      }
      const change = ((newValue - oldValue) / oldValue) * 100;
      return change > 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`;
    },
  },

  beforeRouteEnter(to, from, next) {
    const documentTitle = typeof to.meta.title === 'string' ? to.meta.title : 'Cleriston Transporte';
    document.title = documentTitle;
    next();
  }
};
</script>

<style scoped>
.app {
  display: flex;
  background-color: #ebebeb;
  height: 100vh;
}

.column-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.content {
  flex-grow: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  grid-gap: 20px;
}

.table-chart-container {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  flex-grow: 1;
  margin-top: 20px;
  overflow: hidden;
}

.table-chart-container > * {
  flex: 1;
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: auto;
  display: flex;
  flex-direction: column;
}

.incident-table-container {
  margin-top: 20px;
  flex-grow: 1;
  overflow: hidden;
}

</style>