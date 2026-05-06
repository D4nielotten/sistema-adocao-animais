const AUTH_STORAGE_KEY = "saa_auth";
const origemAtual = window.location.origin || "";
const CANDIDATAS_API = [origemAtual];

for (let porta = 3000; porta <= 3010; porta += 1) {
  CANDIDATAS_API.push("http://localhost:" + porta);
  CANDIDATAS_API.push("http://127.0.0.1:" + porta);
}

const CANDIDATAS_API_UNICAS = CANDIDATAS_API.filter(function (url, idx, arr) {
  return !!url && arr.indexOf(url) === idx;
});

let API_BASE = null;

async function obterApiBase() {
  if (API_BASE) return API_BASE;

  for (let i = 0; i < CANDIDATAS_API_UNICAS.length; i += 1) {
    const base = CANDIDATAS_API_UNICAS[i];
    try {
      const res = await fetch(base + "/health");
      if (res.ok) {
        API_BASE = base;
        return API_BASE;
      }
    } catch (_) {
      // tentar a proxima URL candidata
    }
  }

  API_BASE = "http://localhost:3000";
  return API_BASE;
}

function lerAuth() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function salvarAuth(auth) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
}

function limparAuth() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

const auth = lerAuth();
const perfilEmail = document.getElementById("perfilEmail");
const perfilRole = document.getElementById("perfilRole");
const perfilNome = document.getElementById("perfilNome");
const perfilFoto = document.getElementById("perfilFoto");
const perfilSalvar = document.getElementById("perfilSalvar");
const perfilLogout = document.getElementById("perfilLogout");
const perfilMensagem = document.getElementById("perfilMensagem");
const avatarPreview = document.getElementById("avatarPreview");
const avatarFallback = document.getElementById("avatarFallback");

let novoIconeData = null;
let iconLeituraEmProgresso = false;
const MAX_ICON_SIZE = 2 * 1024 * 1024;

if (!auth || !auth.token) {
  window.location.href = "login.html";
}

function obterNomePadrao(email) {
  if (!email) return "";
  return email.split("@")[0] || email;
}

function mostrarAvatar(src) {
  if (src) {
    avatarPreview.src = src;
    avatarPreview.classList.add("active");
    avatarFallback.style.display = "none";
  } else {
    avatarPreview.src = "";
    avatarPreview.classList.remove("active");
    avatarFallback.style.display = "flex";
  }
}

async function carregarPerfil() {
  try {
    const base = await obterApiBase();
    const response = await fetch(`${base}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Falha ao buscar perfil");
    }

    const perfil = await response.json();
    if (perfilEmail) perfilEmail.textContent = perfil.email;
    if (perfilRole) perfilRole.textContent = perfil.role;
    if (perfilNome) perfilNome.value = perfil.name || obterNomePadrao(perfil.email);
    mostrarAvatar(perfil.icon || null);

    auth.name = perfil.name || null;
    auth.icon = perfil.icon || null;
    salvarAuth(auth);
  } catch (_) {
    if (perfilEmail) perfilEmail.textContent = auth.email || "-";
    if (perfilRole) perfilRole.textContent = auth.role || "-";
    if (perfilNome) perfilNome.value = auth.name || obterNomePadrao(auth.email);
    mostrarAvatar(auth.icon || null);
  }
}

carregarPerfil();

if (perfilFoto) {
  perfilFoto.addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > MAX_ICON_SIZE) {
      perfilMensagem.textContent = "Imagem muito grande. Máximo 2MB.";
      perfilMensagem.style.color = "#dc2626";
      perfilFoto.value = "";
      return;
    }

    iconLeituraEmProgresso = true;
    perfilMensagem.textContent = "Carregando imagem...";
    perfilMensagem.style.color = "#2563eb";

    const reader = new FileReader();
    reader.onload = function (e) {
      novoIconeData = e.target.result;
      mostrarAvatar(novoIconeData);
    };
    reader.onloadend = function () {
      iconLeituraEmProgresso = false;
      perfilMensagem.textContent = "";
    };
    reader.onerror = function () {
      iconLeituraEmProgresso = false;
      perfilMensagem.textContent = "Não foi possível carregar a imagem.";
      perfilMensagem.style.color = "#dc2626";
    };
    reader.readAsDataURL(file);
  });
}

if (perfilSalvar) {
  perfilSalvar.addEventListener("click", async function () {
    if (!auth) return;
    const nome = perfilNome.value.trim();
    if (!nome) {
      perfilMensagem.textContent = "Informe um nome de usuário válido.";
      perfilMensagem.style.color = "#dc2626";
      return;
    }

    if (iconLeituraEmProgresso) {
      perfilMensagem.textContent = "Aguarde o carregamento da imagem antes de salvar.";
      perfilMensagem.style.color = "#dc2626";
      return;
    }

    const payload = {
      name: nome,
      icon: novoIconeData !== null ? novoIconeData : auth.icon || null,
    };

    try {
      const base = await obterApiBase();
      const response = await fetch(`${base}/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        const errorMessage = errorBody && errorBody.erro ? errorBody.erro : "Falha ao atualizar perfil";
        throw new Error(errorMessage);
      }

      const data = await response.json();
      auth.name = data.name || null;
      auth.icon = data.icon || null;
      salvarAuth(auth);
      mostrarAvatar(data.icon || null);
      novoIconeData = null;

      perfilMensagem.textContent = "Perfil atualizado com sucesso.";
      perfilMensagem.style.color = "#16a34a";
      setTimeout(function () {
        perfilMensagem.textContent = "";
      }, 3000);
    } catch (err) {
      perfilMensagem.textContent = err.message || "Não foi possível salvar o perfil.";
      perfilMensagem.style.color = "#dc2626";
    }
  });
}

if (perfilLogout) {
  perfilLogout.addEventListener("click", function () {
    limparAuth();
    window.location.href = "index.html";
  });
}
