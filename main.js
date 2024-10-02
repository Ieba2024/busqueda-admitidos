const apiKey = "AIzaSyCiaxUnd6wLeHZ-pjk7Ftv2u5ugF8DdljQ";
const sheetId = "1FUGinzroMvMi5CRA5rU-iuF4nBz9eVKUV3xG-yGjL3E";
const baseUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values`;

// Función para buscar el número de documento en Google Sheets
function buscar() {
    const documentNumber = document.getElementById("document").value.trim();
    
    // Verificar si el campo de búsqueda está vacío
    if (!documentNumber) {
        alert("Por favor, ingresa un número de documento.");
        return;
    }
    
    // Cambiamos "Sheet1" por el nombre de la hoja correcta "RESPUESTATODOS"
    const url = `${baseUrl}/RESPUESTATODOS!A2:X?key=${apiKey}`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const rows = data.values;
            let found = false;
            let resultHTML = "";

            // Iterar sobre las filas para buscar el documento
            for (let i = 0; i < rows.length; i++) {
                const numeroDocumento = rows[i][4]; // Columna E
                const nombres = rows[i][8]; // Columna I
                const apellidos = rows[i][7]; // Columna H
                const grado = rows[i][15]; // Columna P
                const estado = rows[i][23]; // Columna X

                // Verificar si el documento coincide
                if (numeroDocumento === documentNumber) {
                    found = true;
                    resultHTML = `
                        <p><strong>Número de documento:</strong> ${numeroDocumento}</p>
                        <p><strong>Nombres:</strong> ${nombres}</p>
                        <p><strong>Apellidos:</strong> ${apellidos}</p>
                        <p><strong>Grado:</strong> ${grado}</p>
                        <p><strong>Estado de la solicitud:</strong> ${estado}</p>
                    `;
                    break;
                }
            }

            // Si el documento no se encuentra
            if (!found) {
                resultHTML = `<p class="error">No se encontró ningún registro con el número de documento ingresado.</p>`;
            }

            document.getElementById("result").innerHTML = resultHTML;
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById("result").innerHTML = `<p class="error">Ocurrió un error al buscar los datos. Inténtalo de nuevo más tarde.</p>`;
        });
}
