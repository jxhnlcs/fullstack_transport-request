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
            value="800K"
            description="Total Patients"
            percentage="+20%"
            iconClass="bxs-user"
            iconBgColor="#2980B9"
          />
          <Card
            value="150K"
            description="New Patients"
            percentage="+15%"
            iconClass="bxs-user-plus"
            iconBgColor="#8e44ad"
          />
          <Card
            value="150K"
            description="Recovered Patients"
            percentage="+10%"
            iconClass="bxs-heart"
            iconBgColor="#27ae60"
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
import Sidebar from "../components/sidebar.vue";
import Navbar from "../components/navbar.vue";
import Card from "../components/card.vue";
import TransportTable from "../components/transportTable.vue";
import TransportChart from "../components/transportChart.vue";
import IncidentTable from "../components/incidentTable.vue";
import { jwtDecode } from "jwt-decode";

export default {
  components: {
    Sidebar,
    Navbar,
    Card,
    TransportTable,
    TransportChart,
    IncidentTable,
  },

  beforeRouteEnter(to, from, next) {
    const documentTitle =
      typeof to.meta.title === "string"
        ? to.meta.title
        : "Cleriston Transporte";
    document.title = documentTitle;
    next();
  },

  created() {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      console.log(decodedToken);
    } else {
      console.log("Nenhum token encontrado no localStorage");
    }
  },
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
  overflow: hidden;
}

.incident-table-container {
  margin-top: 20px;
  flex-grow: 1;
  overflow: hidden;
}

</style>