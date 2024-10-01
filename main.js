// Configurar los detalles de tu hoja de Google Sheets
const SHEET_ID = '1NbacMN4_VvXiilcnTBczSlVHugYKrlJ8tzmwLkwn9K4'; // Reemplaza con el ID de tu Google Sheet
const API_KEY = 'AIzaSyCiaxUnd6wLeHZ-pjk7Ftv2u5ugF8DdljQ'; // Reemplaza con tu API Key de Google

// URL de la API de Google Sheets
const SHEETS_API_URL = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/RESPUESTATODOS?key=${API_KEY}`;

// Función para buscar los datos en Google Sheets
function buscarDatos() {
    const documento = document.getElementById('documento').value.toLowerCase().trim();

    // Validación: verificar si el campo de documento está vacío
    if (documento === "") {
        alert("Por favor, ingresa un número de documento para buscar.");
        return; // Detener la ejecución si no se ha ingresado nada
    }

    // Limpiar resultados anteriores
    const resultados = document.getElementById('resultados').getElementsByTagName('tbody')[0];
    resultados.innerHTML = ''; // Limpiar tabla de resultados

    // Realizar la búsqueda en la hoja de Google Sheets
    fetch(SHEETS_API_URL)
        .then(response => response.json())
        .then(data => {
            const rows = data.values; // Contiene todas las filas de la hoja
            let coincidenciasEncontradas = false; // Bandera para verificar si hubo coincidencias

            // Filtrar los resultados basados en la búsqueda
            rows.forEach((row, index) => {
                if (index > 0) { // Saltar la primera fila (encabezados)
                    const documentoData = row[0].toLowerCase();  // Columna 1: Número de Documento
                    const nombreData = row[1].toLowerCase();     // Columna 2: Nombre
                    const apellidoData = row[2].toLowerCase();   // Columna 3: Apellido
                    const correoData = row[3];                   // Columna 4: Correo

                    // Buscar solo por número de documento
                    if (documentoData.includes(documento)) {
                        // Crear una nueva fila en la tabla
                        const newRow = resultados.insertRow();
                        const documentoCell = newRow.insertCell(0);
                        const nombreCell = newRow.insertCell(1);
                        const apellidoCell = newRow.insertCell(2);
                        const correoCell = newRow.insertCell(3);

                        documentoCell.textContent = row[0];
                        nombreCell.textContent = row[1];
                        apellidoCell.textContent = row[2];
                        correoCell.textContent = row[3];

                        // Se encontró al menos una coincidencia
                        coincidenciasEncontradas = true;
                    }
                }
            });

            // Si no se encontraron coincidencias, mostrar mensaje
            if (!coincidenciasEncontradas) {
                const noResultsRow = resultados.insertRow();
                const noResultsCell = noResultsRow.insertCell(0);
                noResultsCell.colSpan = 4; // Hacer que la celda ocupe todas las columnas
                noResultsCell.textContent = "No existen datos coincidentes en la base de datos.";
                noResultsCell.style.textAlign = "center"; // Centrar el mensaje
                noResultsCell.style.color = "red";        // Mostrar el mensaje en color rojo
            }
        })
        .catch(error => {
            console.error('Error al obtener los datos:', error);
        });
}