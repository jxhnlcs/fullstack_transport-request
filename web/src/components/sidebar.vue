<template>
  <div>
    <nav>
      <div class="sidebar-top">
        <span class="shrink-btn" @click="toggleSidebar" ref="shrinkBtn">
          <i class="bx bx-chevron-left"></i>
        </span>
        <img src="../assets/images/logo.png" class="icon-logo" alt="Logotipo">
        <img class="hide logomarca" src="../assets/images/logomarca.png" alt="Logomarca">
      </div>
      <div class="sidebar-links">
        <ul>
          <h4 class="hide">Principais Recursos</h4>
          <li class="tooltip-element" data-tooltip="0">
            <router-link to="/home">
              <a href="#">
                <div class="icon">
                  <i class="bx bxs-dashboard"></i>
                  <i class="bx bxs-dashboard"></i>
                </div>
                <span class="link hide">Painel de Controle</span>
              </a>
            </router-link>
          </li>
        </ul>
      </div>

      <div class="sidebar-footer">
        <div class="admin-user tooltip-element" data-tooltip="1">
          <div class="admin-profile hide">
            <div class="admin-info">
              <h3>{{ name }}</h3>
              <h5>{{ role }}</h5>
            </div>
          </div>
          <a class="log-out" @click="confirmLogout">
            <i class="bx bx-log-out"></i>
          </a>
        </div>

      </div>
    </nav>
  </div>
</template>

<script>

import Swal from 'sweetalert2';
import { jwtDecode } from 'jwt-decode';

export default {
  data() {
    return {
      activeIndex: null,
      isDropdownOpen: false,
    }
  },

  created() {
      const token = localStorage.getItem('token');
      if (token) {
        const decodedToken = jwtDecode(token);
        this.name = decodedToken.name;
        this.role = decodedToken.role;
      } else {
        console.log('Nenhum token encontrado no localStorage');
      }
    },

  methods: {
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen
    },

    async confirmLogout() {
      const confirmResult = await Swal.fire({
        title: 'Tem certeza que deseja sair?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sim',
        cancelButtonText: 'Cancelar',
        reverseButtons: true,
      })

      if (confirmResult.isConfirmed) {
        localStorage.removeItem('token')
        window.location.href = '/'
      }
    },

    toggleSidebar() {
      this.$el.classList.toggle('shrink')
      this.$refs.shrinkBtn.classList.add('hovered')
      setTimeout(() => {
        this.$refs.shrinkBtn.classList.remove('hovered')
      }, 500)

      const sidebar = this.$el.querySelector('nav')
      const links = this.$el.querySelectorAll('.link')
      const h4Headings = this.$el.querySelectorAll('.sidebar-links h4')
      const logo = this.$el.querySelector('.sidebar-top .icon-logo')
      const shrinkIcon = this.$el.querySelector('.shrink-btn i')
      const sidebarFooter = this.$el.querySelector('.sidebar-footer')
      const nameHeading = this.$el.querySelector('.sidebar-top .logomarca')

      if (this.$el.classList.contains('shrink')) {
        sidebarFooter.classList.add('footer-auto-margin')
      } else {
        sidebarFooter.classList.remove('footer-auto-margin')
      }

      if (this.$el.classList.contains('shrink')) {
        nameHeading.classList.add('hide-name')
      } else {
        nameHeading.classList.remove('hide-name')
      }

      if (this.$el.classList.contains('shrink')) {
        sidebar.style.width = '5.4rem'
        links.forEach(link => {
          link.style.opacity = '0'
          link.style.transitionDelay = '0.3s'
        })

        h4Headings.forEach(h4 => {
          h4.style.display = 'none'
        })

        logo.style.marginBottom = '15px'
        shrinkIcon.classList.remove('bx-chevron-left')
        shrinkIcon.classList.add('bx-chevron-right')
      } else {
        sidebar.style.width = '16rem'
        links.forEach(link => {
          link.style.opacity = '1'
          link.style.transitionDelay = '0s'
        })

        h4Headings.forEach(h4 => {
          h4.style.display = ''
        })

        logo.style.marginLeft = '0'
        logo.style.marginBottom = '0'

        shrinkIcon.classList.remove('bx-chevron-right')
        shrinkIcon.classList.add('bx-chevron-left')
      }
    },
  },
}
</script>

<style scoped>
a {
  text-decoration: none;
}

ul {
  list-style: none;
}

nav {
  position: sticky;
  top: 0;
  left: 0;
  background-color: #2980B9;
  height: 100vh;
  width: 16rem;
  padding: 1.8rem 0.85rem;
  color: #fff;
  display: flex;
  flex-direction: column;
  transition: width 0.5s ease-in-out;
}


nav::before {
  content: '';
  position: absolute;
  width: 2rem;
  height: 100vh;
  top: 0;
  left: 100%;
}

main {
  flex: 1;
  padding: 2rem;
  color: #1f2027;
  display: flex;
  flex-direction: column;
}

main h1 {
  margin-bottom: 1rem;
}

main .copyright {
  margin-top: auto;
  font-size: 0.9rem;
}

main .copyright span {
  color: #274CB3;
  font-weight: 500;
  cursor: pointer;
}

.sidebar-top {
  position: relative;
  display: flex;
  align-items: center;
}

.sidebar-top .icon-logo {
  width: 3.1rem;
  margin: 0 0.1rem;
  font-size: 3rem;
}

.sidebar-top img {
  cursor: default;
  width: 130px;

  padding-left: 0.5rem;
  font-weight: 600;
  font-size: 1.65rem;
}

.shrink-btn {
  position: absolute;
  top: 50%;
  height: 27px;
  padding: 0 0.3rem;
  background-color: #547ae5;
  border-radius: 6px;
  cursor: pointer;
  box-shadow: 0 3px 10px -3px rgba(70, 46, 118, 0.3);
  right: -2.65rem;
  transform: translateY(-50%) translateX(-8px);
  opacity: 0;
  pointer-events: none;
  transition: 0.3s;
}

.shrink-btn i {
  line-height: 27px;
  transition: 0.3s;
}

.shrink-btn:hover {
  background-color: #3651d4;
}

nav:hover .shrink-btn,
.shrink-btn.hovered {
  transform: translateY(-50%) translateX(0px);
  opacity: 1;
  pointer-events: all;
}

.sidebar-links ul {
  position: relative;
  margin-top: 20px;
}

.sidebar-links li {
  position: relative;
  padding: 2.5px 0;
  cursor: pointer;
}

.sidebar-links a {
  color: #cfcde7;
  font-weight: 400;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  height: 53px;
}

.icon {
  font-size: 1.3rem;
  text-align: center;
  min-width: 3.7rem;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
}

.icon i {
  grid-column: 1 / 2;
  grid-row: 1 / 2;
  transition: 0.3s;
}

.icon i:last-child {
  opacity: 0;
  color: #fff;
}

.bx-caret-down {
  margin-left: 10px;
}

.ul_relatorios {
  margin-left: 10px;
}

.sidebar-links a.router-link-exact-active span {
  color: #ffffff;
}

.sidebar-links a.router-link-exact-active .icon i {
  color: #fdfdfd;
}

.sidebar-links a.router-link-exact-active .icon i:last-child {
  opacity: 0;
}

.sidebar-links a.router-link-exact-active .link {
  opacity: 1;
  /* Opacidade do texto quando o link está ativo */
}


.sidebar-links a.active,
.sidebar-links a:hover {
  color: #fff;
}

.sidebar-links a .link {
  transition: opacity 0.3s 0.2s, color 0.3s;
}

.sidebar-links a.active i:first-child {
  opacity: 0;
}

.sidebar-links a.active i:last-child {
  opacity: 1;
}

.sidebar-links h4 {
  position: relative;
  font-size: 0.8rem;
  text-transform: uppercase;
  font-weight: 600;
  padding: 0 0.8rem;
  color: #cfcde7;
  letter-spacing: 0.5px;
  height: 45px;
  line-height: 45px;
  transition: opacity 0.3s 0.2s, height 0.5s 0s;
  cursor: default;
}

.sidebar-footer {
  position: relative;
  margin-top: auto;
}

.footer-auto-margin {
  margin-top: auto;
}

.hide-name {
  display: none;
}

.admin-user {
  display: flex;
  align-items: center;
}

.admin-profile {
  white-space: nowrap;
  max-width: 100%;
  transition: opacity 0.3s 0.2s, max-width 0.7s 0s ease-in-out;
  display: flex;
  align-items: center;
  flex: 1;
  overflow: hidden;
}

.admin-info {
  padding-left: 0.3rem;
}

.admin-info h3 {
  font-weight: 500;
  font-size: 1rem;
  line-height: 1;
  cursor: default;
}

.admin-info h5 {
  font-weight: 400;
  font-size: 0.75rem;
  color: #cfcde7;
  margin-top: 0.3rem;
  line-height: 1;
  cursor: default;
}

.log-out {
  display: flex;
  height: 40px;
  min-width: 2.4rem;
  background-color: #567be0;
  color: #cfcde7;
  align-items: center;
  justify-content: center;
  font-size: 1.15rem;
  border-radius: 10px;
  margin: 0 0.65rem;
  transition: color 0.3s;
  cursor: pointer;
}

.log-out:hover {
  color: #fff;
}

.hide {
  transition: opacity 0.3s 0.2s;
}

body.shrink nav {
  width: 5.4rem;
}

body.shrink .hide {
  opacity: 0;
  pointer-events: none;
  transition-delay: 0s;
}

body.shrink .shrink-btn i {
  transform: rotate(-180deg);
}

body.shrink .sidebar-links h4 {
  height: 10px;
}

body.shrink .account {
  opacity: 1;
  pointer-events: all;
  transition: opacity 0.3s 0.3s, color 0.3s 0s;
}

body.shrink .admin-profile {
  max-width: 0;
  transition: opacity 0.3s 0s, max-width 0.7s 0s ease-in-out;
}

body.shrink .tooltip {
  display: grid;
}

@media only screen and (max-width: 1000px) {
  nav {
    height: 101vh;
    width: 4.4rem;
    padding: 1.8rem 0.1rem;
  }

  .sidebar-top .icon-logo {
    margin: 0 0.1rem;
  }

  .icon {
    margin-top: 40px;
    font-size: 2rem;
  }

  .sidebar-links li {
    margin-top: 30px;
  }

  .shrink-btn {
    display: none;
  }

  .hide {
    display: none;
  }
}
</style>