// script.js

// Función para cargar archivos JSON desde la ruta local
function cargarJSON(archivo) {
    return fetch(archivo)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al cargar ${archivo}: ${response.statusText}`);
            }
            return response.json();
        })
        .catch((error) => {
            console.error("Error al cargar el archivo JSON:", error);
            return null;  // Devuelve null si hay un error, para poder manejarlo
        });
}

// Variables para almacenar datos
let conectores = [];
let backshells = [];
let materiales = {};

// Función auxiliar para limpiar nodos de un select
function limpiarSelect(selectElement) {
    while (selectElement.firstChild) {
        selectElement.removeChild(selectElement.firstChild);
    }
}

// Función auxiliar para agregar una opción a un select
function agregarOpcion(selectElement, valor, texto) {
    const option = document.createElement("option");
    option.value = valor;
    option.textContent = texto;
    selectElement.appendChild(option);
}

// Cargar todos los archivos JSON en paralelo
function cargarDatos() {
    Promise.all([
        cargarJSON('conectores.json'),
        cargarJSON('backshells.json'),
        cargarJSON('materiales.json')
    ]).then(([conectoresData, backshellsData, materialesData]) => {
        if (conectoresData && backshellsData && materialesData) {
            conectores = conectoresData;
            backshells = backshellsData;
            materiales = materialesData;
            cargarConectores();  // Cargar los conectores en la UI una vez que los datos estén listos
        } else {
            console.error("Error al cargar los datos necesarios.");
        }
    });
}

// Cargar los conectores en el dropdown
function cargarConectores() {
    const conectorSelect = document.getElementById("conector");
    limpiarSelect(conectorSelect);
    agregarOpcion(conectorSelect, "", "Seleccione un conector");

    conectores.forEach((conector) => {
        const descripcionMaterial = materiales[conector.material] || "Material desconocido";
        agregarOpcion(
            conectorSelect,
            conector.partnumber_raiz,
            `${conector.partnumber_raiz} - Shell Size: ${conector.shell_size}, Material: ${descripcionMaterial}`
        );
    });

    // Si hay conectores disponibles, habilitar el select de conectores
    conectorSelect.disabled = conectores.length === 0;
}

// Cargar los backshells compatibles según el conector seleccionado
function cargarBackshells() {
    const conectorSelect = document.getElementById("conector");
    const backshellSelect = document.getElementById("backshell");
    limpiarSelect(backshellSelect);

    const conectorSeleccionado = conectores.find(
        (c) => c.partnumber_raiz == conectorSelect.value
    );

    if (conectorSeleccionado) {
        // Filtrar los backshells que coincidan con el shell size y el material
        const backshellsCompatibles = backshells.filter(
            (b) =>
                b.shell_size === conectorSeleccionado.shell_size &&
                b.material === conectorSeleccionado.material
        );

        if (backshellsCompatibles.length > 0) {
            backshellsCompatibles.forEach((backshell) => {
                const descripcionMaterial = materiales[backshell.material] || "Material desconocido";
                agregarOpcion(
                    backshellSelect,
                    backshell.partnumber_raiz,
                    `${backshell.partnumber_raiz} - Shell Size: ${backshell.shell_size}, Material: ${descripcionMaterial}`
                );
            });
        } else {
            agregarOpcion(backshellSelect, "", "No hay backshells compatibles");
        }
    }

    backshellSelect.disabled = backshells.length === 0;
}

// Confirmar selección de conector y backshell
function confirmarSeleccion() {
    const conectorSeleccionado = document.getElementById("conector").value;
    const backshellSeleccionado = document.getElementById("backshell").value;

    if (conectorSeleccionado && backshellSeleccionado) {
        console.log("Conector seleccionado:", conectorSeleccionado);
        console.log("Backshell seleccionado:", backshellSeleccionado);

        // Guardar en localStorage si es necesario
        localStorage.setItem("conector", conectorSeleccionado);
        localStorage.setItem("backshell", backshellSeleccionado);

        alert("Selección confirmada.");
    } else {
        alert("Por favor, selecciona un conector y un backshell.");
    }
}

// Eventos para cuando el usuario selecciona un conector
document.getElementById("conector").addEventListener("change", cargarBackshells);
document.getElementById("confirmar").addEventListener("click", confirmarSeleccion);

// Inicializar la carga de datos al cargar la página
window.onload = function () {
    cargarDatos();
};
