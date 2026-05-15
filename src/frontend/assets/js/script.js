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
      // Tenta a próxima URL candidata.
    }
  }

  API = "http://localhost:3000";
  return API;
}

const AUTH_STORAGE_KEY = "saa_auth";

function lerAuth() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

let auth = lerAuth();

// Função de Modal Customizado
function exibirModal(titulo, mensagem, tipo = 'info') {
  const modal = document.getElementById('customModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalMessage = document.getElementById('modalMessage');
  const modalIcon = document.getElementById('modalIcon');
  const modalButtons = document.getElementById('modalButtons') || document.querySelector('.modal-buttons');
  
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

  if (modalButtons) {
    modalButtons.innerHTML = '<button class="modal-btn modal-btn-primary" onclick="fecharModal()">OK</button>';
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
      <button class="modal-btn modal-btn-primary" onclick="fecharConfirmacao(true)">Remover</button>
    `;
    
    // Armazenar a função resolve para usar no onclick
    window.fecharConfirmacao = function(resultado) {
      fecharModal();
      resolve(resultado);
    };
    
    modal.classList.add('active');
  });
}

function salvarAuth(auth) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
}

function limparAuth() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

function authAdmin() {
  return auth && auth.role === "admin";
}

const authStatus = document.getElementById("authStatus");
const authLink = document.getElementById("authLink");
const registerLink = document.getElementById("registerLink");
const profileLink = document.getElementById("profileLink");
const logoutBtn = document.getElementById("logoutBtn");
const adminSection = document.getElementById("adminSection");
const loginModal = document.getElementById("loginModal");
const loginModalClose = document.getElementById("loginModalClose");

function atualizarAuthUI() {
  if (authStatus) {
    const nomeExibicao = auth ? auth.name || auth.email : "Visitante";
    authStatus.textContent = auth ? `Logado como ${nomeExibicao} (${auth.role})` : "Visitante";
  }
  if (authLink) {
    authLink.classList.toggle("is-hidden", !!auth);
  }
  if (registerLink) {
    registerLink.classList.toggle("is-hidden", !!auth);
  }
  if (profileLink) {
    profileLink.classList.toggle("is-hidden", !auth);
  }
  if (logoutBtn) {
    logoutBtn.classList.toggle("is-hidden", !auth);
  }
  if (adminSection) {
    adminSection.classList.toggle("is-hidden", !authAdmin());
  }
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", function () {
    limparAuth();
    auth = null;
    atualizarAuthUI();
    mostrarAnimais();
  });
}

function exigirLoginOuAvisar() {
  if (auth) return true;
  if (loginModal) {
    loginModal.classList.remove("modal-hidden");
  }
  return false;
}

if (loginModalClose && loginModal) {
  loginModalClose.addEventListener("click", function () {
    loginModal.classList.add("modal-hidden");
  });
}

if (loginModal) {
  loginModal.addEventListener("click", function (event) {
    if (event.target === loginModal) {
      loginModal.classList.add("modal-hidden");
    }
  });
}

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && loginModal && !loginModal.classList.contains("modal-hidden")) {
    loginModal.classList.add("modal-hidden");
  }
});

document.addEventListener("click", function (event) {
  const alvo = event.target.closest("button, a.btn, .btn-link");
  if (!alvo) return;
  if (auth) return;
  if (alvo.classList.contains("btn-filter")) return;
  if (alvo.dataset.public === "true") return;
  if (alvo.id === "authLink" || alvo.id === "registerLink" || alvo.id === "logoutBtn") return;
  event.preventDefault();
  event.stopImmediatePropagation();
  exigirLoginOuAvisar();
});

let animais = [];

const lista = document.getElementById("listaAnimais");
const contador = document.getElementById("contador");
const selectAnimalInteresse = document.getElementById("animalInteresse");

function formatarTelefoneBrasil(valor) {
  const digitos = String(valor || "").replace(/\D/g, "").slice(0, 11);
  if (digitos.length <= 2) return digitos;
  if (digitos.length <= 6) return "(" + digitos.slice(0, 2) + ") " + digitos.slice(2);
  if (digitos.length <= 10) {
    return "(" + digitos.slice(0, 2) + ") " + digitos.slice(2, 6) + "-" + digitos.slice(6);
  }
  return "(" + digitos.slice(0, 2) + ") " + digitos.slice(2, 7) + "-" + digitos.slice(7);
}

// Função para redimensionar imagens grandes
function redimensionarImagem(arquivo, larguraMaxima = 800, alturaMaxima = 600, qualidade = 0.8) {
  return new Promise((resolve) => {
    const leitor = new FileReader();
    
    leitor.onload = (evento) => {
      const img = new Image();
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let novaLargura = img.width;
        let novaAltura = img.height;
        
        // Calcular novas dimensões mantendo proporção
        if (img.width > larguraMaxima || img.height > alturaMaxima) {
          const razaoLargura = larguraMaxima / img.width;
          const razaoAltura = alturaMaxima / img.height;
          const escala = Math.min(razaoLargura, razaoAltura);
          
          novaLargura = img.width * escala;
          novaAltura = img.height * escala;
        }
        
        canvas.width = novaLargura;
        canvas.height = novaAltura;
        
        const contexto = canvas.getContext('2d');
        contexto.drawImage(img, 0, 0, novaLargura, novaAltura);
        
        // Converter para base64 com qualidade reduzida
        const imagemRedimensionada = canvas.toDataURL('image/jpeg', qualidade);
        resolve(imagemRedimensionada);
      };
      
      img.src = evento.target.result;
    };
    
    leitor.readAsDataURL(arquivo);
  });
}

// Preview de imagem no formulário
const fotoInput = document.getElementById("foto");
const previewFoto = document.getElementById("previewFoto");

if (fotoInput && previewFoto) {
  fotoInput.addEventListener("change", function(e) {
    const arquivo = e.target.files[0];
    
    if (arquivo) {
      const leitor = new FileReader();
      
      leitor.onload = function(evento) {
        previewFoto.src = evento.target.result;
        previewFoto.classList.add("active");
      };
      
      leitor.readAsDataURL(arquivo);
    } else {
      previewFoto.classList.remove("active");
    }
  });
}

function atualizarContador() {
  if (contador) {
    contador.innerHTML =
      "Temos " + animais.length + " animais esperando adoção";
  }
}

function atualizarOpcoesAnimalInteresse() {
  if (!selectAnimalInteresse) return;

  selectAnimalInteresse.innerHTML = "";

  const opcaoInicial = document.createElement("option");
  opcaoInicial.value = "";
  opcaoInicial.textContent = "Selecione o animal de interesse";
  opcaoInicial.disabled = true;
  opcaoInicial.selected = true;
  selectAnimalInteresse.appendChild(opcaoInicial);

  if (!Array.isArray(animais) || animais.length === 0) {
    const opcaoVazia = document.createElement("option");
    opcaoVazia.value = "";
    opcaoVazia.textContent = "Nenhum animal cadastrado";
    opcaoVazia.disabled = true;
    selectAnimalInteresse.appendChild(opcaoVazia);
    return;
  }

  animais.forEach(function (animal) {
    const opcao = document.createElement("option");
    opcao.value = animal.nome;
    opcao.textContent = animal.nome;
    selectAnimalInteresse.appendChild(opcao);
  });
}

function mostrarAnimais(listaFiltrada = animais) {
  if (!lista) return;
  lista.innerHTML = "";
  if (!Array.isArray(listaFiltrada) || listaFiltrada.length === 0) {
    lista.innerHTML = "<p>Nenhum animal encontrado para este filtro.</p>";
    atualizarContador();
    atualizarOpcoesAnimalInteresse();
    return;
  }
  listaFiltrada.forEach(function (animal) {
    let card = document.createElement("div");
    card.className = "card";
    const imgHtml = animal.foto
      ? `<img src="${animal.foto}" alt="${animal.nome}">`
      : `<div class="sem-foto">Sem foto</div>`;
    const botaoRemover = authAdmin()
      ? `
        <button type="button" class="btn btn-delete" data-remover-id="${animal.id}">
          <i class="fas fa-trash"></i> Remover
        </button>
      `
      : "";
    const botoesClasse = auth && auth.role === "cliente" ? "card-buttons card-buttons-single" : "card-buttons";

    card.innerHTML = `
      ${imgHtml}
      <h3>${animal.nome}</h3>
      <p><b>Espécie:</b> ${animal.especie}</p>
      <p><b>Porte:</b> ${animal.porte}</p>
      <p>${animal.descricao || ""}</p>

      <div class="${botoesClasse}">
        <a href="https://wa.me/5511999999999?text=Olá! Tenho interesse em adotar ${animal.nome}" target="_blank" class="btn-link">
          <button class="btn btn-contact">
            <i class="fab fa-whatsapp"></i> Falar com o protetor
          </button>
        </a>
        ${botaoRemover}
      </div>
    `;
    const btnRemover = card.querySelector("[data-remover-id]");
    if (btnRemover) {
      btnRemover.addEventListener("click", function () {
        const raw = btnRemover.getAttribute("data-remover-id");
        if (raw === null || raw === "") return;
        removerAnimal(Number(raw));
      });
    }
    lista.appendChild(card);
  });
  atualizarContador();
  atualizarOpcoesAnimalInteresse();
}

async function removerAnimal(id) {
  const n = Number(id);
  if (!Number.isFinite(n) || n < 1) return;
  if (!authAdmin()) {
    exibirModal('Permissão Negada', 'Você não tem permissão para remover animais.', 'error');
    return;
  }
  const confirmou = await exibirConfirmacao('Confirmar Remoção', 'Tem certeza que deseja remover este animal?');
  if (!confirmou) return;
  try {
    const apiBase = await obterApiBase();
    const res = await fetch(apiBase + "/animais/" + n, {
      method: "DELETE",
      headers: {
        Authorization: auth ? `Bearer ${auth.token}` : "",
      },
    });
    if (!res.ok) throw new Error();
    await carregarAnimais();
    exibirModal('Sucesso!', 'Animal removido com sucesso!', 'success');
  } catch {
    exibirModal('Erro', 'Não foi possível remover o animal.', 'error');
  }
}

const form = document.getElementById("formAnimal");
if (form) {
  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    if (!authAdmin()) {
      exibirModal('Permissão Negada', 'Você não tem permissão para cadastrar animais.', 'error');
      return;
    }
    let nome = document.getElementById("nome").value;
    let especie = document.getElementById("especie").value;
    let porte = document.getElementById("porte").value;
    let descricao = document.getElementById("descricao").value;
    let fotoInput = document.getElementById("foto");
    let arquivo = fotoInput.files[0];
    if (!arquivo) {
      exibirModal('Aviso', 'Por favor, escolha uma imagem para o animal.', 'warning');
      return;
    }
    
    try {
      // Redimensionar a imagem antes de enviar
      let imagemRedimensionada = await redimensionarImagem(arquivo, 800, 600, 0.8);
      
      const apiBase = await obterApiBase();
      const res = await fetch(apiBase + "/animais", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: auth ? `Bearer ${auth.token}` : "",
        },
        body: JSON.stringify({
          nome,
          especie,
          porte,
          descricao,
          foto: imagemRedimensionada,
        }),
      });
      if (!res.ok) throw new Error();
      form.reset();
      await carregarAnimais();
      exibirModal('Sucesso!', 'Animal cadastrado com sucesso!', 'success');
    } catch {
      exibirModal('Erro', 'Erro ao cadastrar. Verifique se o servidor e o PostgreSQL estão rodando.', 'error');
    }
  });
}

const formAdotante = document.getElementById("formAdotante");
if (formAdotante) {
  formAdotante.addEventListener("submit", async function (e) {
    e.preventDefault();

    if (!exigirLoginOuAvisar()) return;

    const nomeAdotante = document.getElementById("nomeAdotante");
    const telefoneAdotante = document.getElementById("telefoneAdotante");
    const animalInteresse = document.getElementById("animalInteresse");

    if (!nomeAdotante || !telefoneAdotante || !animalInteresse) {
      exibirModal('Erro', 'Não foi possível capturar os dados do formulário de interesse.', 'error');
      return;
    }

    const payload = {
      nome: nomeAdotante.value,
      telefone: telefoneAdotante.value,
      animalInteresse: animalInteresse.value,
    };

    try {
      const apiBase = await obterApiBase();
      const res = await fetch(apiBase + "/interesses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();

      formAdotante.reset();
      exibirModal('Sucesso!', 'Seu interesse foi registrado com sucesso!', 'success');
    } catch {
      exibirModal('Erro', 'Não foi possível registrar seu interesse agora. Tente novamente.', 'error');
    }
  });

  const telefoneAdotanteInput = document.getElementById("telefoneAdotante");
  if (telefoneAdotanteInput) {
    telefoneAdotanteInput.addEventListener("input", function (e) {
      const alvo = e.target;
      if (!alvo) return;
      alvo.value = formatarTelefoneBrasil(alvo.value);
    });
  }
}

async function filtrar(tipo) {
  if (tipo === "todos") {
    await carregarAnimais();
    return;
  }
  await carregarAnimais({ especie: tipo });
}

async function filtrarPorte(porte) {
  await carregarAnimais({ porte: porte });
}

function enviarMensagem() {
  let campo = document.getElementById("mensagem");
  let chat = document.getElementById("chatBox");
  if (!campo || !chat) return;
  if (campo.value.trim() === "") return;
  let msg = document.createElement("p");
  msg.innerText = "Adotante: " + campo.value;
  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;
  campo.value = "";
}

async function carregarAnimais(filtros = {}) {
  try {
    const apiBase = await obterApiBase();
    const params = new URLSearchParams();
    if (filtros.especie) params.append("especie", filtros.especie);
    if (filtros.porte) params.append("porte", filtros.porte);
    if (filtros.nome) params.append("nome", filtros.nome);

    const url = params.toString() ? apiBase + "/animais?" + params.toString() : apiBase + "/animais";
    const res = await fetch(url);
    if (!res.ok) throw new Error();
    animais = await res.json();
    mostrarAnimais();
  } catch (err) {
    console.error("Não foi possível carregar os animais do servidor.", err);
    if (lista) {
      lista.innerHTML = "<p>Não foi possível carregar os animais. Verifique se o servidor está rodando.</p>";
    }
  }
}

atualizarAuthUI();
carregarAnimais();
