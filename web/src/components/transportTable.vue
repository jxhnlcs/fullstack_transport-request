<template>
  <div class="table-container">
    <div class="header">
      <h1>Solicitações de Transporte</h1>
      <button v-if="isAdmin" @click="openNewRequestModal" class="new-request-btn">
        <i class="bx bx-plus-medical"></i><span>Nova Solicitação</span>
      </button>
    </div>

    <div v-if="!isAdmin && pendingRequests.length > 0">
      <h4 style="margin-top: 15px">
        Novas Solicitações ({{ pendingRequests.length }})
      </h4>
      <div class="pending-list" style="margin-top: -10px">
        <template v-if="pendingRequests.length > 0">
          <table class="transport-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Paciente</th>
                <th>Origem</th>
                <th>Destino</th>
                <th>Prioridade</th>
                <th>Data</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="request in pendingRequests" :key="request.id">
                <td>{{ request.id }}</td>
                <td>{{ request.patient_name }}</td>
                <td>{{ request.initial_point }}</td>
                <td>{{ request.destination_point }}</td>
                <td>{{ request.priority }}</td>
                <td>{{ formatDate(request.data) }}</td>
                <td>
                  <button
                    @click="updateRequestStatus(request.id, 'Aceito')"
                    class="accept-btn"
                  >
                    <i class="bx bx-check"></i>
                  </button>
                  <button
                    @click="rejectRequest(request.id)"
                    class="reject-btn"
                  >
                    <i class="bx bx-x"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </template>
        <template v-else>
          <p>Não existem solicitações pendentes.</p>
        </template>
      </div>
    </div>

    <div class="table-wrapper">
      <template v-if="acceptedRequests.length > 0">
        <h4 style="margin-top: 15px" v-if="isAdmin">
          Total de Solicitações ({{ acceptedRequests.length }})
        </h4>
        <h4 style="margin-top: 15px" v-else>
          Minhas Solicitações ({{ requests.length }})
        </h4>
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
            <tr
              v-for="request in acceptedRequests"
              :key="request.id"
              @click="isAdmin ? openEditModal(request) : openDetailsModal(request)"
            >
              <td>{{ request.id }}</td>
              <td>{{ request.patient_name }}</td>
              <td>{{ request.initial_point }}</td>
              <td>{{ request.destination_point }}</td>
              <td>{{ request.status }}</td>
              <td>{{ request.priority }}</td>
              <td v-if="isAdmin">{{ request.request_status }}</td>
              <td v-if="isAdmin">{{ request.maqueiro_id ? request.maqueiro_name : 'Aguardando maqueiro' }}</td>
              <td>{{ formatDate(request.data) }}</td>
            </tr>
          </tbody>
        </table>
      </template>
      <template v-else>
        <p style="margin-top: 10px">
          Não existem solicitações de transporte aceitas.
        </p>
      </template>
    </div>

    <NewRequestModal
      v-if="showNewRequestModal"
      @close="closeModal"
      @submit-request="createOrUpdateRequest"
      :requestData.sync="newRequestData"
      :isEditMode="isEditMode"
      @delete-request="deleteRequest"
    />
    
    <DetailsTransportModal
      v-if="showDetailsModal"
      @close="closeModal"
      :requestData="newRequestData"
      @dataUpdated="handleDataUpdated"
      @incidentReported="handleIncidentReported"
    />
  </div>
</template>

<script>
import axios from "@/utils/axios";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import Sidebar from "@/components/sidebar.vue";
import NewRequestModal from "@/components/newRequestModal.vue";
import DetailsTransportModal from "@/components/detailsTransportModal.vue";

export default {
  components: {
    Sidebar,
    NewRequestModal,
    DetailsTransportModal
  },

  data() {
    return {
      requests: [],
      maqueiro_id: null,
      isAdmin: false,
      showNewRequestModal: false,
      showDetailsModal: false,
      isEditMode: false,
      newRequestData: {
        patient_name: "",
        initial_point: "",
        destination_point: "",
        request_status: "Pendente",
        priority: "Baixa",
        status: "Aguardando transporte",
        maqueiro_id: null,
        data: new Date().toISOString().substr(0, 10),
      },
    };
  },

  computed: {
    pendingRequests() {
      return this.requests.filter(
        (request) => request.request_status === "Pendente" && !this.isRejectedByCurrentMaqueiro(request)
      );
    },
    acceptedRequests() {
      return this.requests.filter(
        (request) => request.request_status === "Aceito" || this.isAdmin
      );
    },
  },

  created() {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      this.maqueiro_id = decodedToken.userid;
      this.perms = decodedToken.perms;
      this.isAdmin = decodedToken.perms === "Admin";
      this.fetchRequests();
    } else {
      console.log("Nenhum token encontrado no localStorage");
    }
  },

  methods: {
    async fetchRequests() {
      try {
        const endpoint = this.isAdmin
          ? "/transport-requests"
          : `/transport-requests/maqueiro/${this.maqueiro_id}`;
        const response = await axios.get(endpoint);
        this.requests = response.data;
      } catch (error) {
        console.error("Erro ao buscar solicitações de transporte:", error);
        if (error.response && error.response.status === 404) {
          this.requests = [];
        }
      }
    },

    async createOrUpdateRequest() {
      const confirmResult = await Swal.fire({
        title: this.isEditMode
          ? "Tem certeza que deseja atualizar a solicitação?"
          : "Tem certeza que deseja adicionar a solicitação?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sim",
        cancelButtonText: "Cancelar",
        reverseButtons: true,
      });

      if (confirmResult.isConfirmed) {
        try {
          if (this.isEditMode) {
            await axios.put(
              `/transport-requests/${this.newRequestData.id}`,
              this.newRequestData
            );
            Swal.fire({
              icon: "success",
              title: "Solicitação Atualizada",
              text: "A solicitação foi atualizada com sucesso!",
            });
          } else {
            await axios.post("/transport-requests", this.newRequestData);
            Swal.fire({
              icon: "success",
              title: "Solicitação Adicionada",
              text: "A solicitação foi adicionada com sucesso!",
            });
          }
          this.closeModal();
          this.fetchRequests();
          this.$emit("dataUpdated");
        } catch (error) {
          console.error("Erro ao salvar a solicitação:", error);
          Swal.fire({
            icon: "error",
            title: "Erro",
            text: "Houve um erro ao salvar a solicitação. Tente novamente mais tarde.",
          });
        }
      }
    },

    async updateRequestStatus(id, status) {
      const confirmResult = await Swal.fire({
        title: "Tem certeza?",
        text: `Você deseja ${status.toLowerCase()} esta solicitação?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: `Sim, ${status.toLowerCase()}!`,
        cancelButtonText: "Cancelar",
      });

      if (confirmResult.isConfirmed) {
        try {
          await axios.put(`/transport-requests/${id}/request-status`, {
            request_status: status,
            maqueiro_id: status === 'Aceito' ? this.maqueiro_id : null
          });
          this.fetchRequests();
          this.$emit("dataUpdated");
          Swal.fire({
            icon: "success",
            title: `Solicitação ${status}`,
            text: `A solicitação foi ${status.toLowerCase()} com sucesso!`,
          });
        } catch (error) {
          console.error(`Erro ao atualizar a solicitação: ${status}`, error);
          Swal.fire({
            icon: "error",
            title: "Erro",
            text: `Houve um erro ao atualizar a solicitação. Tente novamente mais tarde.`,
          });
        }
      }
    },

    async rejectRequest(id) {
      const confirmResult = await Swal.fire({
        title: "Tem certeza?",
        text: `Você deseja recusar esta solicitação?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: `Sim, recusar!`,
        cancelButtonText: "Cancelar",
      });

      if (confirmResult.isConfirmed) {
        try {
          await axios.put(`/transport-requests/${id}/reject`, {
            maqueiro_id: this.maqueiro_id
          });
          this.requests = this.requests.filter(request => request.id !== id);
          this.$emit("dataUpdated");
          Swal.fire({
            icon: "success",
            title: `Solicitação recusada`,
            text: `A solicitação foi recusada com sucesso!`,
          });
        } catch (error) {
          console.error(`Erro ao recusar a solicitação`, error);
          Swal.fire({
            icon: "error",
            title: "Erro",
            text: `Houve um erro ao recusar a solicitação. Tente novamente mais tarde.`,
          });
        }
      }
    },

    isRejectedByCurrentMaqueiro(request) {
      if (!request.rejected_by) return false;
      const rejectedMaqueiros = request.rejected_by.split(',');
      return rejectedMaqueiros.includes(String(this.maqueiro_id));
    },

    async confirmDeleteRequest(id) {
      Swal.fire({
        title: "Tem certeza?",
        text: "Você não poderá reverter isso!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sim, deletar!",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          this.deleteRequest(id);
        }
      });
    },

    async deleteRequest(id) {
      try {
        await axios.delete(`/transport-requests/${id}`);
        this.closeModal();
        this.fetchRequests();
        this.$emit("dataUpdated");
        Swal.fire({
          icon: "success",
          title: "Solicitação Deletada",
          text: "A solicitação foi deletada com sucesso!",
        });
      } catch (error) {
        console.error("Erro ao deletar a solicitação:", error);
        Swal.fire({
          icon: "error",
          title: "Erro",
          text: "Houve um erro ao deletar a solicitação. Tente novamente mais tarde.",
        });
      }
    },

    openModal() {
      this.showModal = true;
    },

    openNewRequestModal() {
      this.showModal = true;
      this.isEditMode = false;
      this.showNewRequestModal = true;
      this.showDetailsModal = false;
      this.newRequestData = {
        patient_name: "",
        initial_point: "",
        destination_point: "",
        request_status: "Pendente",
        priority: "Baixa",
        status: "Aguardando transporte",
        maqueiro_id: null,
        data: new Date().toISOString().substr(0, 10),
      };
    },

    openEditModal(request) {
      this.showModal = true;
      this.isEditMode = true;
      this.showNewRequestModal = true;
      this.showDetailsModal = false;
      this.newRequestData = { ...request };
      this.newRequestData.data = new Date(request.data)
        .toISOString()
        .substr(0, 10);
    },

    openDetailsModal(request) {
      this.showModal = true;
      this.isEditMode = false;
      this.showNewRequestModal = false;
      this.showDetailsModal = true;
      this.newRequestData = { ...request };
      this.newRequestData.data = new Date(request.data)
        .toISOString()
        .substr(0, 10);
    },

    closeModal() {
      this.showModal = false;
      this.isEditMode = false;
      this.showNewRequestModal = false;
      this.showDetailsModal = false;
      this.newRequestData = {
        patient_name: "",
        initial_point: "",
        destination_point: "",
        request_status: "Pendente",
        priority: "Baixa",
        status: "Aguardando transporte",
        maqueiro_id: null,
        data: new Date().toISOString().substr(0, 10),
      };
    },

    formatDate(dateString) {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    },

    handleIncidentReported() {
      this.$emit('incidentReported');
    },

    handleDataUpdated() {
      this.fetchRequests();
      this.$emit('dataUpdated');
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
  color: #373d3f;
}

.new-request-btn {
  background-color: #2980b9;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.new-request-btn i {
  margin-right: 10px;
}

.new-request-btn:hover {
  transition: 0.5s;
  background-color: #1a5a7f;
}

.table-wrapper,
.pending-list {
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

.accept-btn,
.reject-btn {
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 5px;
}

.accept-btn {
  background-color: #27ae60;
  color: white;
}

.reject-btn {
  background-color: #e74c3c;
  color: white;
}
</style>