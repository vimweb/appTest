// Función para cargar los conectores desde el archivo JSON
async function loadConnectors() {
    try {
        const response = await fetch('conectores.json');
        const connectors = await response.json();
        return connectors;
    } catch (error) {
        console.error("Error loading connectors:", error);
        return [];
    }
}

// Función para cargar backshells desde el archivo JSON
async function loadBackshells() {
    try {
        const response = await fetch('backshells.json');
        const backshells = await response.json();
        return backshells;
    } catch (error) {
        console.error("Error loading backshells:", error);
        return [];
    }
}

// Función para asignar backshells a un conector seleccionado
function assignBackshells(connectors, backshells) {
    const selectedPartNumber = document.getElementById("connectorSelect").value;

    // Filtrar conectores para encontrar el seleccionado
    const selectedConnectors = connectors.filter(connector => connector.partnumber === selectedPartNumber);
    
    // Limpiar la lista de backshells
    const backshellSelect = document.getElementById("backshellSelect");
    backshellSelect.innerHTML = ""; // Limpiar opciones anteriores

    // Asignar backshells según los conectores seleccionados
    selectedConnectors.forEach(connector => {
        const compatibleBackshells = backshells.filter(backshell =>
            backshell.shell_size === connector.shell_size && backshell.material === connector.material
        );

        compatibleBackshells.forEach(backshell => {
            const option = document.createElement("option");
            option.value = backshell.partnumber;
            option.textContent = `${backshell.partnumber} (Shell Size: ${backshell.shell_size})`;
            backshellSelect.appendChild(option);
        });
    });

    if (backshellSelect.options.length === 0) {
        const option = document.createElement("option");
        option.textContent = "No compatible backshells found";
        backshellSelect.appendChild(option);
    }
}

// Función para inicializar la aplicación
async function init() {
    const connectors = await loadConnectors();
    const backshells = await loadBackshells();

    // Poblar el selector de conectores
    const connectorSelect = document.getElementById("connectorSelect");
    connectors.forEach(connector => {
        const option = document.createElement("option");
        option.value = connector.partnumber;
        option.textContent = `${connector.partnumber} (Shell Size: ${connector.shell_size}, Material: ${connector.material})`;
        connectorSelect.appendChild(option);
    });

    // Asignar evento para cuando el usuario seleccione un conector
    connectorSelect.addEventListener("change", () => assignBackshells(connectors, backshells));
}

// Ejecutar la función de inicialización al cargar la página
window.onload = init;
