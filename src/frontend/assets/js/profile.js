const AUTH_STORAGE_KEY = "saa_auth";

function lerAuth() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function limparAuth() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

const auth = lerAuth();
const perfilEmail = document.getElementById("perfilEmail");
const perfilRole = document.getElementById("perfilRole");
const perfilLogout = document.getElementById("perfilLogout");

if (!auth) {
  window.location.href = "login.html";
}

if (perfilEmail) {
  perfilEmail.textContent = auth ? auth.email : "-";
}

if (perfilRole) {
  perfilRole.textContent = auth ? auth.role : "-";
}

if (perfilLogout) {
  perfilLogout.addEventListener("click", function () {
    limparAuth();
    window.location.href = "index.html";
  });
}
