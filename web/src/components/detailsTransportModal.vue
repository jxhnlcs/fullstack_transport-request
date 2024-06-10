<template>
  <div class="modal">
    <div class="modal-content">
      <span class="close" @click="$emit('close')">&times;</span>
      <h2>Detalhes da Solicitação de Transporte</h2>
      <div class="details">
        <div class="form-row">
          <div class="form-group">
            <label>Nome do Paciente:</label>
            <span>{{ requestData.patient_name }}</span>
          </div>
          <div class="form-group">
            <label>Origem:</label>
            <span>{{ requestData.initial_point }}</span>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Destino:</label>
            <span>{{ requestData.destination_point }}</span>
          </div>
          <div class="form-group">
            <label>Prioridade:</label>
            <span>{{ requestData.priority }}</span>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Status:</label>
            <span>{{ requestData.status }}</span>
          </div>
          <div class="form-group">
            <label>Data:</label>
            <span>{{ formatDate(requestData.data) }}</span>
          </div>
        </div>
      </div>
      <div class="actions">
        <button
          @click="startTransport"
          class="start-btn"
          v-if="requestData.status === 'Aguardando transporte'"
        >
          Iniciar Transporte
        </button>
        <button
          @click="finalizeTransport"
          class="finalize-btn"
          v-if="requestData.status === 'Em transporte'"
        >
          Finalizar Transporte
        </button>
        <button
          @click="reportIncident"
          class="incident-btn"
          v-if="requestData.status === 'Em transporte'"
        >
          Relatar Incidente
        </button>
        <button @click="togglePriorityForm" class="priority-btn">
          Alterar Prioridade
        </button>
      </div>
      <div v-if="showPriorityForm" class="priority-form">
        <label for="priority">Nova Prioridade:</label>
        <select v-model="newPriority" id="priority">
          <option value="Baixa">Baixa</option>
          <option value="Média">Média</option>
          <option value="Alta">Alta</option>
        </select>
        <button @click="submitPriorityChange" class="submit-priority-btn">
          Confirmar
        </button>
      </div>
      <div v-if="showIncidentForm" class="incident-form">
        <textarea
          v-model="incidentDescription"
          placeholder="Descreva o incidente..."
        ></textarea>
        <button @click="submitIncident" class="submit-incident-btn">
          Enviar Incidente
        </button>
      </div>
      <div v-if="incidents.length > 0" class="incident-list">
        <h3>Incidentes Relatados</h3>
        <table>
          <thead>
            <tr>
              <th>Descrição</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="incident in incidents" :key="incident.id">
              <td>{{ incident.descricao }}</td>
              <td>{{ formatDateHour(incident.dataHora) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="historics.length > 0" class="history-timeline">
        <h3>Histórico do Transporte</h3>
        <div v-for="historic in historics" :key="historic.id" class="timeline-item">
          <i class="bx bx-timer"></i>
          <div class="timeline-content">
            <span>{{ formatDateHour(historic.timestamp) }}</span>
            <p>{{ historic.descricao }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "@/utils/axios";
import Swal from "sweetalert2";
import moment from "moment-timezone";

export default {
  props: {
    requestData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      showIncidentForm: false,
      showPriorityForm: false,
      newPriority: this.requestData.priority,
      incidentDescription: "",
      incidents: [],
      historics: [],
    };
  },
  created() {
    this.fetchIncidents();
    this.fetchHistorics();
  },
  methods: {
    async startTransport() {
      const confirmResult = await Swal.fire({
        title: "Tem certeza?",
        text: "Você deseja iniciar o transporte desta solicitação?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sim, iniciar!",
        cancelButtonText: "Cancelar",
      });

      if (confirmResult.isConfirmed) {
        try {
          await axios.put(`/transport-requests/${this.requestData.id}/status`, {
            status: "Em transporte",
          });
          this.$emit("dataUpdated");
          this.$emit("close");
          Swal.fire({
            icon: "success",
            title: "Transporte Iniciado",
            text: "O transporte foi iniciado com sucesso!",
          });
        } catch (error) {
          console.error("Erro ao iniciar o transporte:", error);
          Swal.fire({
            icon: "error",
            title: "Erro",
            text: "Houve um erro ao iniciar o transporte. Tente novamente mais tarde.",
          });
        }
      }
    },
    async finalizeTransport() {
      const confirmResult = await Swal.fire({
        title: "Tem certeza?",
        text: "Você deseja finalizar o transporte desta solicitação?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sim, finalizar!",
        cancelButtonText: "Cancelar",
      });

      if (confirmResult.isConfirmed) {
        try {
          await axios.put(`/transport-requests/${this.requestData.id}/status`, {
            status: "Chegou ao destino",
          });
          this.$emit("dataUpdated");
          this.$emit("close");
          Swal.fire({
            icon: "success",
            title: "Transporte Finalizado",
            text: "O transporte foi finalizado com sucesso!",
          });
        } catch (error) {
          console.error("Erro ao finalizar o transporte:", error);
          Swal.fire({
            icon: "error",
            title: "Erro",
            text: "Houve um erro ao finalizar o transporte. Tente novamente mais tarde.",
          });
        }
      }
    },
    async reportIncident() {
      this.showIncidentForm = true;
    },
    async submitIncident() {
      const confirmResult = await Swal.fire({
        title: "Tem certeza?",
        text: "Você deseja relatar este incidente?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sim, relatar!",
        cancelButtonText: "Cancelar",
      });

      if (confirmResult.isConfirmed) {
        try {
          await axios.post("/incidents", {
            solicitacaoId: this.requestData.id,
            descricao: this.incidentDescription,
          });
          this.fetchIncidents();
          this.$emit("incidentReported");
          this.incidentDescription = "";
          this.showIncidentForm = false;
          Swal.fire({
            icon: "success",
            title: "Incidente Relatado",
            text: "O incidente foi relatado com sucesso!",
          });
        } catch (error) {
          console.error("Erro ao relatar o incidente:", error);
          Swal.fire({
            icon: "error",
            title: "Erro",
            text: "Houve um erro ao relatar o incidente. Tente novamente mais tarde.",
          });
        }
      }
    },
    async fetchIncidents() {
      try {
        const response = await axios.get(
          `/incidents/solicitacao/${this.requestData.id}`
        );
        this.incidents = response.data;
      } catch (error) {
        console.error("Erro ao buscar incidentes:", error);
      }
    },
    async fetchHistorics() {
      try {
        const response = await axios.get(
          `/historic/${this.requestData.id}`
        );
        this.historics = response.data;
      } catch (error) {
        console.error("Erro ao buscar histórico:", error);
      }
    },
    formatDate(dateString) {
      return moment(dateString).tz("America/Sao_Paulo").format("DD/MM/YYYY");
    },
    formatDateHour(dateString) {
      return moment(dateString).tz("America/Sao_Paulo").format("DD/MM/YYYY - HH:mm:ss");
    },
    togglePriorityForm() {
      this.showPriorityForm = !this.showPriorityForm;
    },
    async submitPriorityChange() {
      try {
        await axios.put(`/transport-requests/${this.requestData.id}/priority`, {
          priority: this.newPriority,
        });
        this.requestData.priority = this.newPriority;
        this.showPriorityForm = false;
        this.fetchHistorics();
        this.$emit("dataUpdated");
        Swal.fire({
          icon: "success",
          title: "Prioridade Alterada",
          text: "A prioridade foi alterada com sucesso!",
        });
      } catch (error) {
        console.error("Erro ao alterar a prioridade:", error);
        Swal.fire({
          icon: "error",
          title: "Erro",
          text: "Houve um erro ao alterar a prioridade. Tente novamente mais tarde.",
        });
      }
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

.details {
  margin-bottom: 20px;
}

.form-row {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.form-group {
  flex: 1;
  margin-bottom: 10px;
}

.form-group label {
  display: block;
  font-weight: bold;
  color: #555;
}

.form-group span {
  display: block;
  color: #333;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.start-btn,
.finalize-btn,
.incident-btn,
.priority-btn,
.submit-incident-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #2980b9;
  color: white;
  font-size: 16px;
  cursor: pointer;
}

.start-btn:hover,
.finalize-btn:hover,
.incident-btn:hover,
.priority-btn:hover,
.submit-incident-btn:hover {
  background-color: #1a5a7f;
  transition: background-color 0.3s ease;
}

.incident-form {
  margin-top: 20px;
  text-align: center;
}

.incident-form textarea {
  width: 100%;
  height: 100px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 16px;
  color: #333;
  box-sizing: border-box;
}

.incident-form textarea:focus {
  outline: none;
  border-color: #2980b9;
}

.incident-list {
  margin-top: 20px;
  max-height: 15vh; /* Defina a altura máxima aqui */
  overflow-y: auto;
}

.incident-list h3 {
  text-align: center;
  margin-bottom: 10px;
}

.incident-list table {
  width: 100%;
  border-collapse: collapse;
}

.incident-list th,
.incident-list td {
  padding: 8px;
  text-align: left;
  border: 1px solid #ccc;
}

.incident-list th {
  background-color: #f2f2f2;
}

.history-timeline {
  margin-top: 20px;
  max-height: 20vh; /* Defina a altura máxima aqui */
  overflow-y: auto; /* Adicione rolagem vertical */
}

.history-timeline h3 {
  text-align: center;
  margin-bottom: 10px;
}

.timeline-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.timeline-item i {
  font-size: 24px;
  margin-right: 10px;
}

.timeline-content {
  display: flex;
  flex-direction: column;
}

.priority-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}

.priority-form label {
  font-weight: bold;
  margin-bottom: 10px;
}

.priority-form select {
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 16px;
  color: #333;
  margin-bottom: 10px;
}

.priority-form .submit-priority-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #2980b9;
  color: white;
  font-size: 16px;
  cursor: pointer;
}

</style>
