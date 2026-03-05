// Mensaje cuando la página termina de cargar
document.addEventListener("DOMContentLoaded", function () {

    console.log("Aplicación PWA cargada correctamente");

    mostrarMensajeBienvenida();

});


// Función de bienvenida
function mostrarMensajeBienvenida() {

    const mensaje = "Bienvenido a la PWA de Fabian Terrazas";

    console.log(mensaje);

}


// Función para mostrar información de la aplicación
function mostrarInfoApp() {

    alert("Esta es una Aplicación Web Progresiva (PWA) creada para la práctica de Manifest.json.");

}


// Ejemplo de botón dinámico
function crearBoton() {

    const boton = document.createElement("button");

    boton.textContent = "Mostrar información de la app";

    boton.onclick = mostrarInfoApp;

    document.body.appendChild(boton);

}


// Crear botón automáticamente al cargar la página
window.onload = function () {

    crearBoton();

};