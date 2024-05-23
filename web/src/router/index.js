import { createRouter, createWebHistory } from 'vue-router';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';

import LoginView from '../views/LoginView.vue';

const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginView,
    meta: { title: 'Login' },
  },

  {
    path: '/home',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
    meta: { title: 'Home' },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');

  if (to.name !== 'login') {
    if (!token) {
      Swal.fire({
        position: 'center',
        icon: 'info',
        title: 'Por favor, efetue login primeiro!',
        showConfirmButton: false,
        timer: 2000,
      });
      next({ name: 'login' });
    } else {
      const decodedToken = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);

      if (decodedToken.exp < currentTime) {
        localStorage.removeItem('token');
        next({ name: 'login' });
      } else {
        next();
      }
    }
  } else {
    next();
  }
});

export default router;