// 🛑 ADMIN FIJO
const admin = {
    user: "admin",
    pass: "123"
};

// 📦 Obtener usuarios guardados
function getUsuarios() {
    return JSON.parse(localStorage.getItem("usuarios")) || [];
}

// 💾 Guardar usuarios
function setUsuarios(users) {
    localStorage.setItem("usuarios", JSON.stringify(users));
}

// 🔐 LOGIN
function login() {
    let user = document.getElementById("loginUser").value;
    let pass = document.getElementById("loginPass").value;

    // ADMIN
    if (user === admin.user && pass === admin.pass) {
        mostrarPanel("ADMIN");
        return;
    }

    // USUARIOS
    let usuarios = getUsuarios();
    let encontrado = usuarios.find(u => u.user === user && u.pass === pass);

    if (encontrado) {
        mostrarPanel("USUARIO");
    } else {
        alert("Datos incorrectos");
    }
}

// 📝 REGISTRO
function registrar() {
    let user = document.getElementById("regUser").value;
    let pass = document.getElementById("regPass").value;

    let usuarios = getUsuarios();

    // evitar duplicados
    if (usuarios.find(u => u.user === user)) {
        alert("Usuario ya existe");
        return;
    }

    usuarios.push({ user, pass });
    setUsuarios(usuarios);

    alert("Usuario registrado");
    document.getElementById("registro").style.display = "none";
}

// 👁️ INVITADO
function modoInvitado() {
    mostrarPanel("INVITADO");
}

// 🎯 PANEL
function mostrarPanel(tipo) {
    document.getElementById("login").style.display = "none";
    document.getElementById("registro").style.display = "none";

    document.getElementById("contenido").innerHTML =
        "<h2>Bienvenido " + tipo + "</h2>";
}

// 🔄 CAMBIOS DE VISTA
function mostrarLogin() {
    document.getElementById("login").style.display = "block";
    document.getElementById("registro").style.display = "none";
}

function mostrarRegistro() {
    document.getElementById("login").style.display = "none";
    document.getElementById("registro").style.display = "block";
}

// 📚 SEMANAS
function verSemana(num) {
    document.getElementById("contenido").innerHTML =
        "<h2>Semana " + num + "</h2><p>Contenido aquí</p>";
}
