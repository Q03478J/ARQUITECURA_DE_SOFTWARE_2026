function login() {
    let user = document.getElementById("user").value;
    let pass = document.getElementById("pass").value;

    if (pass === "123") {
        document.getElementById("login").style.display = "none";
        document.getElementById("panel").style.display = "block";
    } else {
        alert("Contraseña incorrecta");
    }
}

function verSemana(num) {
    document.getElementById("contenido").innerHTML =
        "<h2>Semana " + num + "</h2><p>Aquí irá tu contenido</p>";
}
