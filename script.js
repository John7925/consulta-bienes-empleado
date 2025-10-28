function buscarEmpleado() {
  const idEmp = document.getElementById("idEmpInput").value.trim();
  if (!idEmp) return;

  fetch(`https://script.google.com/macros/s/AKfycbwsMbvilW2S_iy7G_jtx_9p_LxRkEJkPS2CQ79BtMlP8CoYx9gJsxr9c7LDpUkec0E/exec?idEmp=${idEmp}`)
    .then(response => response.json())
    .then(data => {
      document.getElementById("nombreResguardante").textContent = data.nombre || "";
      document.getElementById("numeroEmpleado").textContent = data.idEmp || "";
      document.getElementById("rfcEmpleado").textContent = data.rfc || "";
      document.getElementById("puestoEmpleado").textContent = data.puesto || "";
      document.getElementById("regimenContratacion").textContent = data.regimen || "";
      document.getElementById("areaAdscripcion").textContent = data.area || "";
      document.getElementById("unidadAdscripcion").textContent = data.adscripcion || "";

      // Extrae solo las filas de bienes
      const bienes = (data.resultados || []).map(r => r.bienes);
      mostrarBienesPorResguardante(bienes);
    })
    .catch(error => {
      console.error("Error al consultar el empleado:", error);
    });
}

function mostrarBienesPorResguardante(bienes) {
  const contenedor = document.getElementById("tablaBienes");
  contenedor.innerHTML = "";

  if (bienes.length === 0) {
    contenedor.innerHTML = `
      <div style="padding: 10px; background-color: #fff3cd; border: 1px solid #ffeeba; color: #856404; text-align: center; border-radius: 4px; margin-top: 10px;">
        El trabajador o el servidor público no cuenta con bienes a su resguardo.
      </div>
    `;
    return;
  }

  bienes.forEach((fila, index) => {
    const filaHTML = document.createElement("div");
    filaHTML.className = "fila-bien";

    filaHTML.innerHTML = `
      <div class="celda-bien">${index + 1}</div>
      <div class="celda-bien">${fila[3] || ""}</div>
      <div class="celda-bien">${fila[4] || ""}</div>
      <div class="celda-bien">${fila[5] || ""}</div>
      <div class="celda-bien">${fila[6] || ""}</div>
      <div class="celda-bien">${fila[7] || ""}</div>
      <div class="celda-bien">${fila[8] || ""}</div>
      <div class="celda-bien">${fila[9] || ""}</div>
      <div class="celda-bien costo">${formatearCosto(fila[10])}</div>
      <div class="celda-bien">${fila[1] || ""}</div>
      <div class="celda-bien">${fila[13] || ""}</div>
    `;

    contenedor.appendChild(filaHTML);
  });
}

function formatearCosto(valor) {
  const num = parseFloat(valor);
  if (isNaN(num)) return "";
  return `$${num.toFixed(3)}`;
}