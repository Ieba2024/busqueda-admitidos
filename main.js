const apiKey = "AIzaSyCiaxUnd6wLeHZ-pjk7Ftv2u5ugF8DdljQ";
const sheetId = "1FUGinzroMvMi5CRA5rU-iuF4nBz9eVKUV3xG-yGjL3E";
const baseUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values`;

// Función para buscar el número de documento en Google Sheets
function buscar() {
    const documentNumber = document.getElementById("document").value.trim();
    
    if (!documentNumber) {
        alert("Por favor, ingresa un número de documento.");
        return;
    }
    
    const url = `${baseUrl}/RESPUESTATODOS!A2:AI?key=${apiKey}`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const rows = data.values;
            let found = false;
            let resultHTML = "";
            
            if (!rows || rows.length === 0) {
                document.getElementById("result").innerHTML = `<p class="error">No hay datos disponibles.</p>`;
                return;
            }

            console.log(rows); // Verifica las filas completas
            
            for (let i = 0; i < rows.length; i++) {
                if (!rows[i] || rows[i].length === 0) continue;
                
                const numeroDocumento = rows[i][4] || "Sin información"; // Columna E
                const nombres = rows[i][8] || "Sin información"; // Columna I
                const apellidos = rows[i][7] || "Sin información"; // Columna H
                const grado = rows[i][15] || "Sin información"; // Columna P
                const estado = rows[i][23] || "Sin información"; // Columna X
                const observaciones = rows[i][20] || "Sin información"; // Columna U
                const listado = rows[i][24] || "Sin información"; // Columna Y
                const fechamatricula = rows[i][25] || "Sin información"; // Columna Z
                const requisitos = rows[i][26] || "Sin información"; // Columna AA
                
                console.log(`Fila ${i}: Fecha de matrícula: ${fechamatricula}`);
                
                if (numeroDocumento === documentNumber) {
                    found = true;

                    // Verificar qué columna (AG, AH o AI) usar para mostrar requisitos
                    let requisitosAdicionales = [];
                    if (requisitos === "1") {
                        requisitosAdicionales = rows.slice(1, 10).map(row => row[32] || "Sin información"); // Columna AG
                    } else if (requisitos === "2") {
                        requisitosAdicionales = rows.slice(1, 11).map(row => row[33] || "Sin información"); // Columna AH
                    } else if (requisitos === "3") {
                        requisitosAdicionales = rows.slice(1, 9).map(row => row[34] || "Sin información"); // Columna AI
                    }

                    const requisitosHTML = requisitosAdicionales
                        .map(item => `<li>${item}</li>`)
                        .join("");

                    resultHTML = `
                        <p><strong>Número de documento:</strong> ${numeroDocumento}</p>
                        <div class="result-row">
                            <div><strong>Nombres:</strong> ${nombres}</div>
                            <div><strong>Apellidos:</strong> ${apellidos}</div>
                        </div>
                        <p><strong>Grado:</strong> ${grado}</p>
                        <p><strong>Estado de la solicitud:</strong> ${estado}</p>
                        <p><strong>Observaciones:</strong> ${observaciones}</p>
                        <p><strong>Fecha para Matrícula:</strong> ${fechamatricula}</p>
                        <p><strong>Requisitos:</strong></p>
                        <ul>${requisitosHTML}</ul>
                    `;
                    break;
                }
            }
            
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
