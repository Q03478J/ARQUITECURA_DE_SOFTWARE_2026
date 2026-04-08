// ADMIN
const admin = {
    user: "admin",
    pass: "123"
};

// LOGIN
function login() {
    let user = document.getElementById("user").value;
    let pass = document.getElementById("pass").value;

    if (user === admin.user && pass === admin.pass) {
        entrarSistema("ADMIN");
    } else {
        alert("Usuario no válido (aún sin DB)");
    }
}

// INVITADO
function modoInvitado() {
    entrarSistema("INVITADO");
}

// ENTRAR
function entrarSistema(tipo) {
    document.getElementById("pantallaLogin").style.display = "none";
    document.getElementById("registro").style.display = "none";
    document.getElementById("panel").style.display = "block";

    document.getElementById("contenido").innerHTML =
        "<h2>Bienvenido " + tipo + "</h2>";
}

// MOSTRAR REGISTRO
function mostrarRegistro() {
    document.getElementById("pantallaLogin").style.display = "none";
    document.getElementById("registro").style.display = "block";
}

// REGISTRO (TEMPORAL)
function registrar() {
    alert("Registro listo (falta conectar base de datos)");
}

// CONTENIDO
function inicio() {
    document.getElementById("contenido").innerHTML =
        "<h2>Inicio</h2>";
}

function verSemana(n) {
    document.getElementById("contenido").innerHTML =
        "<h2>Semana " + n + "</h2>";
}
