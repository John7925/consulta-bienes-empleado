// 🔍 FUNCIÓN PRINCIPAL: Consulta datos del empleado y sus bienes
function buscarEmpleado() {
  const idEmp = document.getElementById("idEmpInput").value.trim();
  if (!idEmp) return;

  // 🌐 Consulta al endpoint de Apps Script con el ID del empleado
  fetch(`https://script.google.com/macros/s/AKfycbwH8lup-Vt43Zy8G_RAqBLneoEVdgpuCyTd410VpblmAs_6S8BePXuoZC4nkNe0TLBE/exec?idEmp=${idEmp}`)
    .then(response => response.json())
    .then(data => {
      // 🧾 Llena los campos del resguardante (si están disponibles)
      document.getElementById("nombreResguardante").textContent = data.nombre || "";
      document.getElementById("numeroEmpleado").textContent = data.idEmp || "";
      document.getElementById("rfcEmpleado").textContent = data.rfc || "";
      document.getElementById("puestoEmpleado").textContent = data.puesto || "";
      document.getElementById("regimenContratacion").textContent = data.regimen || "";
      document.getElementById("areaAdscripcion").textContent = data.area || "";
      document.getElementById("unidadAdscripcion").textContent = data.adscripcion || "";

      // 📦 Muestra los bienes inventariables
      mostrarBienesPorResguardante(idEmp, data.bienes || []);
    })
    .catch(error => {
      console.error("Error al consultar el empleado:", error);
    });
}

// 🧹 FUNCIÓN AUXILIAR: Limpia todos los campos visibles
function limpiarCampos() {
  const campos = [
    "nombreResguardante", "numeroEmpleado", "rfcEmpleado",
    "puestoEmpleado", "regimenContratacion",
    "areaAdscripcion", "unidadAdscripcion", "tablaBienes"
  ];
  campos.forEach(id => {
    const elemento = document.getElementById(id);
    if (elemento) elemento.textContent = "";
    if (id === "tablaBienes") elemento.innerHTML = "";
  });
  document.getElementById("idEmpInput").value = "";
}

// 🔄 Muestra los bienes inventariables en la tabla, filtrando por número de empleado
function mostrarBienesPorResguardante(idEmp, bienes) {
  // 🧱 Contenedor donde se insertarán las filas
  const contenedor = document.getElementById("tablaBienes");
  contenedor.innerHTML = ""; // Limpia contenido previo

  // 🔍 Filtra los bienes que pertenecen al empleado (columna Q = índice 16)
  const bienesFiltrados = bienes.filter(fila => {
  const valorCelda = String(fila[16]).trim(); // Columna Q
  return valorCelda === idEmp;
});

  // ⚠️ Si no hay bienes, muestra mensaje institucional
  if (bienesFiltrados.length === 0) {
    contenedor.innerHTML = `
      <div style="padding: 10px; background-color: #fff3cd; border: 1px solid #ffeeba; color: #856404; text-align: center; border-radius: 4px; margin-top: 10px;">
        El trabajador o el servidor público no cuenta con bienes a su resguardo.
      </div>
    `;
    return;
  }

  // 🧮 Recorre cada bien y genera su fila HTML
  bienesFiltrados.forEach((fila, index) => {
    const filaHTML = document.createElement("div");
    filaHTML.className = "fila-bien";

    // 🧩 Inserta cada celda en el orden del formato institucional
    filaHTML.innerHTML = `
      <div class="celda-bien">${index + 1}</div>                          <!-- CON. (contador) -->
      <div class="celda-bien">${fila[3] || ""}</div>                     <!-- CLAVE CAMB. (columna D) -->
      <div class="celda-bien">${fila[4] || ""}</div>                     <!-- DESCRIPCIÓN (columna E) -->
      <div class="celda-bien">${fila[5] || ""}</div>                     <!-- MARCA (columna F) -->
      <div class="celda-bien">${fila[6] || ""}</div>                     <!-- MODELO (columna G) -->
      <div class="celda-bien">${fila[7] || ""}</div>                     <!-- SERIE (columna H) -->
      <div class="celda-bien">${fila[8] || ""}</div>                     <!-- PLACAS (columna I) -->
      <div class="celda-bien">${fila[9] || ""}</div>                     <!-- MOTOR (columna J) -->
      <div class="celda-bien">${formatearCosto(fila[10])}</div>         <!-- COSTO (columna K, formato contabilidad) -->
      <div class="celda-bien">${fila[1] || ""}</div>                     <!-- NÚMERO DE INVENTARIO (columna B) -->
      <div class="celda-bien">${fila[13] || ""}</div>                    <!-- OBSERVACIONES (columna N) -->
    `;

    contenedor.appendChild(filaHTML);
  });
}

// 💰 Convierte el valor numérico en formato moneda con tres decimales
function formatearCosto(valor) {
  const num = parseFloat(valor);
  if (isNaN(num)) return "";
  return `$${num.toFixed(3)}`;
}