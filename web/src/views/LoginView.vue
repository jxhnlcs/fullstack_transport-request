<template>
  <div class="container">
    <div class="forms-container">
      <div class="signin">
        <form class="sign-in-form" @submit.prevent="handleSignIn">
          <h2 class="title">Login</h2>
          <div class="input-field">
            <i class="fas fa-user"></i>
            <input type="text" v-model="signInUsername" placeholder="Usuário" />
          </div>
          <div class="input-field">
            <i class="fas fa-lock"></i>
            <input
              type="password"
              v-model="signInPassword"
              placeholder="Senha"
            />
          </div>
          <input type="submit" value="Entrar" class="btn solid" />
        </form>
      </div>
    </div>
    <div class="panels-container">
      <div class="panel left-panel">
        <div class="content">
          <h3>Sistema de Transporte de Macas</h3>
          <p>
            Bem-vindo ao Sistema de Maqueiros do Cleriston Andrade! Descubra um
            mundo de possibilidades no nosso sistema avançado e moderno.
          </p>
        </div>
        <img src="../assets/gifs/login-animate.svg" class="image" alt="" />
      </div>
    </div>
  </div>
</template>

<script>
import Swal from "sweetalert2";
import axios from "@/utils/axios";

export default {
  data() {
    return {
      signInUsername: "",
      signInPassword: "",
    };
  },

  beforeRouteEnter(to, from, next) {
    const documentTitle =
      typeof to.meta.title === "string"
        ? to.meta.title
        : "Cleriston Transporte";
    document.title = documentTitle;
    next();
  },

  methods: {
    async handleSignIn() {
      try {
        const firstAccessResponse = await axios.post('/verify-first-access', {
          username: this.signInUsername,
          password: this.signInPassword,
        });

        console.log('Resposta da verificação de primeiro acesso:', firstAccessResponse.data);

        if (firstAccessResponse.data.first_access === 0) {
          const { value: newPassword } = await Swal.fire({
            title: 'Primeiro Acesso',
            input: 'password',
            inputLabel: 'Adicione sua nova senha',
            inputPlaceholder: 'Digite sua nova senha',
            inputAttributes: {
              maxlength: 100,
              autocapitalize: 'off',
              autocorrect: 'off'
            },
            showCancelButton: true
          });

          if (newPassword) {
            await axios.post('/update-password', {
              userId: firstAccessResponse.data.userid,
              newPassword: newPassword,
            });

            this.signInPassword = newPassword;

            await Swal.fire({
              title: 'Senha atualizada!',
              text: 'O login será efetuado com sua nova senha!',
              icon: 'success',
            });

            await this.performLogin();
          }
        } else {
          await this.performLogin();
        }
      } catch (error) {
        console.error('Erro ao verificar o primeiro acesso:', error);

        if (error.response && error.response.status === 404) {
          await Swal.fire({
            icon: 'error',
            title: 'Usuário não encontrado',
            text: 'Usuário não encontrado. Por favor, tente novamente.',
          });
        } else if (error.response && error.response.status === 401) {
          await Swal.fire({
            icon: 'error',
            title: 'Senha não coincide',
            text: 'Senha não coincide com a senha aleatória. Por favor, tente novamente.',
          });
        } else {
          await Swal.fire({
            icon: 'error',
            title: 'Erro ao verificar o primeiro acesso',
            text: 'Ocorreu um erro ao verificar o primeiro acesso. Por favor, tente novamente mais tarde.',
          });
        }
      }
    },

    async performLogin() {
      try {
        const response = await axios.post('/login', {
          username: this.signInUsername,
          password: this.signInPassword,
        });

        console.log('Resposta do login:', response.data);

        if (response.data.authenticated) {
          localStorage.setItem('token', response.data.token);

          await Swal.fire({
            icon: 'success',
            title: 'Login feito com sucesso',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer);
              toast.addEventListener('mouseleave', Swal.resumeTimer);
            },
          });

          this.$router.push('/home');
        } else if (response.status === 401) {
          await Swal.fire({
            icon: 'error',
            title: 'Senha Incorreta',
            text: 'Credenciais inválidas. Por favor, tente novamente.',
          });
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          await Swal.fire({
            icon: 'error',
            title: 'Credenciais inválidas',
            text: 'Credenciais inválidas. Por favor, tente novamente.',
          });
        } else {
          await Swal.fire({
            icon: 'error',
            title: 'Erro ao efetuar o login',
            text: 'Ocorreu um erro ao processar o login. Por favor, tente novamente mais tarde.',
          });
        }
      }
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&display=swap");

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Montserrat", sans-serif;
}

body,
input {
  font-family: "Montserrat", sans-serif;
}

.container {
  position: relative;
  width: 100%;
  background-color: #fff;
  min-height: 100vh;
  overflow: hidden;
}

.forms-container {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.signin {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  left: 75%;
  width: 50%;
  transition: 1s 0.7s ease-in-out;
  display: grid;
  grid-template-columns: 1fr;
  z-index: 5;
}

form {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0rem 5rem;
  transition: all 0.2s 0.7s;
  overflow: hidden;
  grid-column: 1 / 2;
  grid-row: 1 / 2;
}

form.sign-up-form {
  opacity: 0;
  z-index: 1;
}

form.sign-in-form {
  z-index: 2;
}

.title {
  font-size: 2.2rem;
  color: #444;
  margin-bottom: 10px;
}

.input-field {
  max-width: 380px;
  width: 100%;
  background-color: #f0f0f0;
  margin: 10px 0;
  height: 55px;
  border-radius: 5px;
  display: grid;
  grid-template-columns: 15% 85%;
  padding: 0 0.4rem;
  position: relative;
}

.input-field i {
  text-align: center;
  line-height: 55px;
  color: #acacac;
  transition: 0.5s;
  font-size: 1.1rem;
}

.input-field input {
  background: none;
  outline: none;
  border: none;
  line-height: 1;
  font-weight: 600;
  font-size: 1.1rem;
  color: #333;
}

.input-field input::placeholder {
  color: #aaa;
  font-weight: 500;
}

.btn {
  width: 150px;
  background-color: #2980b9;
  border: none;
  outline: none;
  height: 49px;
  border-radius: 4px;
  color: #fff;
  text-transform: uppercase;
  font-weight: 600;
  margin: 10px 0;
  cursor: pointer;
  transition: 0.5s;
}

.btn:hover {
  background-color: #477383;
}
.panels-container {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}

.container:before {
  content: "";
  position: absolute;
  height: 2000px;
  width: 2000px;
  top: -10%;
  right: 48%;
  transform: translateY(-50%);
  background-image: linear-gradient(
    -45deg,
    #2980b9 0%,
    #6dd5fa 100%,
    #ffffff 100%
  );
  transition: 1.8s ease-in-out;
  border-radius: 50%;
  z-index: 6;
}

.image {
  width: 100%;
  transition: transform 1.1s ease-in-out;
  transition-delay: 0.4s;
}

.panel {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-around;
  text-align: center;
  z-index: 6;
}

.left-panel {
  pointer-events: all;
  padding: 3rem 17% 2rem 12%;
}

.right-panel {
  pointer-events: none;
  padding: 3rem 12% 2rem 17%;
}

.panel .content {
  color: #fff;
  transition: transform 0.9s ease-in-out;
  transition-delay: 0.6s;
}

.panel h3 {
  font-weight: 600;
  line-height: 1;
  font-size: 1.5rem;
}

.panel p {
  font-size: 0.95rem;
  padding: 0.7rem 0;
}

.btn.transparent {
  margin: 0;
  background: none;
  border: 2px solid #fff;
  width: 130px;
  height: 41px;
  font-weight: 600;
  font-size: 0.8rem;
}

.right-panel .image,
.right-panel .content {
  transform: translateX(800px);
}

/* ANIMATION */

.container.sign-up-mode:before {
  transform: translate(100%, -50%);
  right: 52%;
}

.container.sign-up-mode .left-panel .image,
.container.sign-up-mode .left-panel .content {
  transform: translateX(-800px);
}

.container.sign-up-mode .signin {
  left: 25%;
}

.container.sign-up-mode form.sign-up-form {
  opacity: 1;
  z-index: 2;
}

.container.sign-up-mode form.sign-in-form {
  opacity: 0;
  z-index: 1;
}

.container.sign-up-mode .right-panel .image,
.container.sign-up-mode .right-panel .content {
  transform: translateX(0%);
}

.container.sign-up-mode .left-panel {
  pointer-events: none;
}

.container.sign-up-mode .right-panel {
  pointer-events: all;
}

@media (max-width: 870px) {
  .container {
    min-height: 800px;
    height: 100vh;
  }
  .signin {
    width: 100%;
    top: 95%;
    transform: translate(-50%, -100%);
    transition: 1s 0.8s ease-in-out;
    margin-top: -170px;
  }

  .signin,
  .container.sign-up-mode .signin {
    left: 50%;
  }

  .panels-container {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 2fr 1fr;
  }

  .panel {
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    padding: 2.5rem 8%;
    grid-column: 1 / 2;
  }

  .right-panel {
    grid-row: 3 / 4;
  }

  .left-panel {
    grid-row: 1 / 2;
  }

  .image {
    width: 200px;
    transition: transform 0.9s ease-in-out;
    transition-delay: 0.6s;
  }

  .panel .content {
    padding-right: 15%;
    transition: transform 0.9s ease-in-out;
    transition-delay: 0.8s;
  }

  .panel h3 {
    font-size: 1.2rem;
  }

  .panel p {
    font-size: 0.7rem;
    padding: 0.5rem 0;
  }

  .btn.transparent {
    width: 110px;
    height: 35px;
    font-size: 0.7rem;
  }

  .container:before {
    width: 1500px;
    height: 1500px;
    transform: translateX(-50%);
    left: 30%;
    bottom: 68%;
    right: initial;
    top: initial;
    transition: 2s ease-in-out;
  }

  .container.sign-up-mode:before {
    transform: translate(-50%, 100%);
    bottom: 32%;
    right: initial;
  }

  .container.sign-up-mode .left-panel .image,
  .container.sign-up-mode .left-panel .content {
    transform: translateY(-300px);
  }

  .container.sign-up-mode .right-panel .image,
  .container.sign-up-mode .right-panel .content {
    transform: translateY(0px);
  }

  .right-panel .image,
  .right-panel .content {
    transform: translateY(300px);
  }

  .container.sign-up-mode .signin {
    top: 5%;
    transform: translate(-50%, 0);
  }
}

@media (max-width: 570px) {
  form {
    padding: 0 1.5rem;
  }

  .signin {
    margin-top: -180px;
  }

  .image {
    display: none;
  }
  .panel .content {
    padding: 0.5rem 1rem;
  }
  .container {
    padding: 1.5rem;
  }

  .container:before {
    bottom: 72%;
    left: 50%;
  }

  .container.sign-up-mode:before {
    bottom: 28%;
    left: 50%;
  }
}
</style>
