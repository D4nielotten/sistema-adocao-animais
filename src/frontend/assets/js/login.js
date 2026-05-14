const origemAtual = window.location.origin || "";
const CANDIDATAS_API = [origemAtual];

for (let porta = 3000; porta <= 3010; porta += 1) {
  CANDIDATAS_API.push("http://localhost:" + porta);
  CANDIDATAS_API.push("http://127.0.0.1:" + porta);
}

const CANDIDATAS_API_UNICAS = CANDIDATAS_API.filter(function (url, idx, arr) {
  return !!url && arr.indexOf(url) === idx;
});

let API = null;

async function obterApiBase() {
  if (API) return API;

  for (let i = 0; i < CANDIDATAS_API_UNICAS.length; i += 1) {
    const base = CANDIDATAS_API_UNICAS[i];
    try {
      const res = await fetch(base + "/health");
      if (res.ok) {
        API = base;
        return API;
      }
    } catch (_) {
      // Tenta a proxima URL candidata.
    }
  }

  API = "http://localhost:3000";
  return API;
}

const AUTH_STORAGE_KEY = "saa_auth";

function salvarAuth(auth) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
}

// Função de Modal Customizado
function exibirModal(titulo, mensagem, tipo = 'info') {
  const modal = document.getElementById('customModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalMessage = document.getElementById('modalMessage');
  const modalIcon = document.getElementById('modalIcon');
  
  if (!modal) return;
  
  modalTitle.textContent = titulo;
  modalMessage.textContent = mensagem;
  
  // Limpar classes anteriores de ícone
  modalIcon.className = 'modal-icon';
  
  // Adicionar ícone baseado no tipo
  if (tipo === 'success') {
    modalIcon.innerHTML = '<i class="fas fa-check-circle"></i>';
    modalIcon.classList.add('success');
  } else if (tipo === 'error') {
    modalIcon.innerHTML = '<i class="fas fa-exclamation-circle"></i>';
    modalIcon.classList.add('error');
  } else if (tipo === 'warning') {
    modalIcon.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
    modalIcon.classList.add('warning');
  } else {
    modalIcon.innerHTML = '<i class="fas fa-info-circle"></i>';
    modalIcon.classList.add('info');
  }
  
  modal.classList.add('active');
}

function fecharModal() {
  const modal = document.getElementById('customModal');
  if (modal) {
    modal.classList.remove('active');
  }
}

// Fechar modal ao clicar fora
document.addEventListener('click', function(e) {
  const modal = document.getElementById('customModal');
  if (e.target === modal) {
    fecharModal();
  }
});

// Função de Modal de Confirmação
function exibirConfirmacao(titulo, mensagem) {
  return new Promise((resolve) => {
    const modal = document.getElementById('customModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalMessage = document.getElementById('modalMessage');
    const modalIcon = document.getElementById('modalIcon');
    const modalButtons = document.getElementById('modalButtons') || document.querySelector('.modal-buttons');
    
    if (!modal || !modalButtons) return resolve(false);
    
    modalTitle.textContent = titulo;
    modalMessage.textContent = mensagem;
    
    modalIcon.className = 'modal-icon warning';
    modalIcon.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
    
    // Limpar botões anteriores
    modalButtons.innerHTML = `
      <button class="modal-btn modal-btn-secondary" onclick="fecharConfirmacao(false)">Cancelar</button>
      <button class="modal-btn modal-btn-primary" onclick="fecharConfirmacao(true)">Confirmar</button>
    `;
    
    // Armazenar a função resolve para usar no onclick
    window.fecharConfirmacao = function(resultado) {
      fecharModal();
      resolve(resultado);
    };
    
    modal.classList.add('active');
  });
}

const formLogin = document.getElementById("formLogin");
const formRegister = document.getElementById("formRegister");

if (formLogin) {
  formLogin.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
      const apiBase = await obterApiBase();
      const res = await fetch(apiBase + "/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error();
      const data = await res.json();
      salvarAuth({
        token: data.token,
        role: data.role,
        email: data.email,
        name: data.name || null,
        icon: data.icon || null,
      });
      window.location.href = "index.html";
    } catch {
      exibirModal('Erro de Login', 'Não foi possível entrar. Verifique suas credenciais.', 'error');
    }
  });
}

if (formRegister) {
  formRegister.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;

    try {
      const apiBase = await obterApiBase();
      const res = await fetch(apiBase + "/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error();
      exibirModal('Cadastro Realizado!', 'Sua conta foi criada com sucesso. Agora faça login.', 'success');
      formRegister.reset();
    } catch {
      exibirModal('Erro de Cadastro', 'Não foi possível cadastrar. Este email pode já estar registrado.', 'error');
    }
  });
}

// Função para alternar visibilidade da senha
document.querySelectorAll('.toggle-password').forEach(button => {
  button.addEventListener('click', function() {
    const targetId = this.getAttribute('data-target');
    const input = document.getElementById(targetId);
    const icon = this.querySelector('i');
    if (input.type === 'password') {
      input.type = 'text';
      icon.classList.remove('fa-eye');
      icon.classList.add('fa-eye-slash');
    } else {
      input.type = 'password';
      icon.classList.remove('fa-eye-slash');
      icon.classList.add('fa-eye');
    }
  });
});
