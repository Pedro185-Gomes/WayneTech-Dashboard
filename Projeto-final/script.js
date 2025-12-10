// Usuários simulados
const users = {
  "batman": { password: "iambatman", role: "admin" },
  "alfred": { password: "butler", role: "gerente" },
  "robin": { password: "sidekick", role: "funcionario" }
};

let resources = JSON.parse(localStorage.getItem("resources")) || []; 
let editIndex = null;

function login() {
  const user = document.getElementById("user").value;
  const pass = document.getElementById("pass").value;

  if (users[user] && users[user].password === pass) {
    localStorage.setItem("userRole", users[user].role);
    window.location.href = "dashboard.html"; 
  } else {
    document.getElementById("error").innerText = "Credenciais inválidas!";
  }
}

function logout() {
  localStorage.removeItem("userRole");
  window.location.href = "login.html"; 
}

function addOrUpdateResource() {
  const role = localStorage.getItem("userRole");
  if (role !== "admin") {
    alert("Apenas administradores podem gerenciar recursos!");
    return;
  }

  const nome = document.getElementById("nome").value;
  const tipo = document.getElementById("tipo").value;
  const qtd = document.getElementById("quantidade").value;
  const status = document.getElementById("status").value;

  if (!nome || !tipo || !qtd || !status) {
    alert("Preencha todos os campos!");
    return;
  }

  if (editIndex !== null) {
    resources[editIndex] = { nome, tipo, qtd, status };
    editIndex = null;
  } else {
    resources.push({ nome, tipo, qtd, status });
  }

  saveResources();
  clearForm();
  renderTable();
  updateCards();
}

function editResource(index) {
  const role = localStorage.getItem("userRole");
  if (role !== "admin") {
    alert("Apenas administradores podem editar!");
    return;
  }

  const res = resources[index];
  document.getElementById("nome").value = res.nome;
  document.getElementById("tipo").value = res.tipo;
  document.getElementById("quantidade").value = res.qtd;
  document.getElementById("status").value = res.status;
  editIndex = index;
}

function removeResource(index) {
  const role = localStorage.getItem("userRole");
  if (role !== "admin") {
    alert("Apenas administradores podem remover!");
    return;
  }

  resources.splice(index, 1);
  saveResources();
  renderTable();
  updateCards();
}

function clearForm() {
  document.getElementById("nome").value = "";
  document.getElementById("tipo").value = "Equipamento";
  document.getElementById("quantidade").value = "";
  document.getElementById("status").value = "";
  editIndex = null;
}

function renderTable() {
  const tbody = document.getElementById("resourceTable");
  if (!tbody) return;
  tbody.innerHTML = "";
  resources.forEach((res, i) => {
    tbody.innerHTML += `
      <tr>
        <td>${res.nome}</td>
        <td>${res.tipo}</td>
        <td>${res.qtd}</td>
        <td>${res.status}</td>
        <td>
          <button onclick="editResource(${i})">Editar</button>
          <button onclick="removeResource(${i})">Remover</button>
        </td>
      </tr>`;
  });
}

function updateCards() {
  const totalEquip = resources.filter(r => r.tipo === "Equipamento").length;
  const totalVeic = resources.filter(r => r.tipo === "Veículo").length;
  const totalDisp = resources.filter(r => r.tipo === "Dispositivo de Segurança").length;

  document.getElementById("totalEquip").innerText = `Equipamentos: ${totalEquip}`;
  document.getElementById("totalVeic").innerText = `Veículos: ${totalVeic}`;
  document.getElementById("totalDisp").innerText = `Dispositivos: ${totalDisp}`;
}

function saveResources() {
  localStorage.setItem("resources", JSON.stringify(resources));
}

document.addEventListener("DOMContentLoaded", () => {
  const isDashboard = window.location.pathname.includes("dashboard.html");
  if (isDashboard) {
    if (!localStorage.getItem("userRole")) {
      window.location.href = "login.html";
    } else {
      renderTable();
      updateCards();
    }
  }
});

let chartTipo, chartStatus;

function renderCharts() {
  const ctxTipo = document.getElementById("chartTipo").getContext("2d");
  const ctxStatus = document.getElementById("chartStatus").getContext("2d");

  const totalEquip = resources.filter(r => r.tipo === "Equipamento").length;
  const totalVeic = resources.filter(r => r.tipo === "Veículo").length;
  const totalDisp = resources.filter(r => r.tipo === "Dispositivo de Segurança").length;

  const totalAtivos = resources.filter(r => r.status.toLowerCase() === "ativo").length;
  const totalManut = resources.filter(r => r.status.toLowerCase() === "em manutenção").length;

  if (chartTipo) chartTipo.destroy();
  if (chartStatus) chartStatus.destroy();

  chartTipo = new Chart(ctxTipo, {
    type: "pie",
    data: {
      labels: ["Equipamentos", "Veículos", "Dispositivos"],
      datasets: [{
        data: [totalEquip, totalVeic, totalDisp],
        backgroundColor: ["#FFD700", "#007BFF", "#28A745"]
      }]
    }
  });

  chartStatus = new Chart(ctxStatus, {
    type: "bar",
    data: {
      labels: ["Ativos", "Em manutenção"],
      datasets: [{
        label: "Recursos",
        data: [totalAtivos, totalManut],
        backgroundColor: ["#28A745", "#FF4500"]
      }]
    },
    options: { scales: { y: { beginAtZero: true } } }
  });
}

function renderTable() {
  const tbody = document.getElementById("resourceTable");
  if (!tbody) return;
  tbody.innerHTML = "";
  resources.forEach((res, i) => {
    tbody.innerHTML += `
      <tr>
        <td>${res.nome}</td>
        <td>${res.tipo}</td>
        <td>${res.qtd}</td>
        <td>${res.status}</td>
        <td>
          <button onclick="editResource(${i})">Editar</button>
          <button onclick="removeResource(${i})">Remover</button>
        </td>
      </tr>`;
  });

  updateCards();
  renderCharts(); 
}

