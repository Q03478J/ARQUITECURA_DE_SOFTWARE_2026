function mostrarInicio() {
    document.getElementById("contenido").innerHTML =
        "<h1>Bienvenido</h1><p>Este es el curso de Arquitectura de Software</p>";
}

function verSemana(num) {
    document.getElementById("contenido").innerHTML =
        "<h2>Semana " + num + "</h2><p>Aquí irá tu contenido de la semana</p>";
}

function mostrarLogin() {
    document.getElementById("login").style.display = "block";
}

function login() {
    let pass = document.getElementById("pass").value;

    if (pass === "123") {
        alert("Bienvenido");
        document.getElementById("login").style.display = "none";
    } else {
        alert("Contraseña incorrecta");
    }
}
