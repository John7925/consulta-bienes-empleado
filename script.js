function buscarBienes() {
  const empleado = document.getElementById("empleadoInput").value.trim();
  if (!empleado) return alert("Ingresa un número de empleado válido.");

  const url = `https://script.google.com/macros/s/AKfycbXYZ1234567890/exec?empleado=${empleado}`;

  fetch(url)
    .then(res => res.json())
    .then(data => mostrarTabla(data))
    .catch(err => {
      console.error(err);
      document.getElementById("resultados").innerHTML = "<p>Error al consultar los bienes.</p>";
    });
}

function mostrarTabla(data) {
  if (!data || data.length === 0) {
    document.getElementById("resultados").innerHTML = "<p>No se encontraron bienes para este empleado.</p>";
    return;
  }

  let html = "<table><tr><th>CLAVE CLUES</th><th>DESCRIPCIÓN</th><th>MARCA</th><th>MODELO</th><th>SERIE</th><th>PLACAS</th><th>MONTO</th><th>COSTO</th><th>N° INVENTARIO</th><th>OBSERVACIONES</th></tr>";
  data.forEach(item => {
    html += `<tr>
      <td>${item.clues}</td>
      <td>${item.descripcion}</td>
      <td>${item.marca}</td>
      <td>${item.modelo}</td>
      <td>${item.serie}</td>
      <td>${item.placas}</td>
      <td>${item.monto}</td>
      <td>${item.costo}</td>
      <td>${item.inventario}</td>
      <td>${item.observaciones}</td>
    </tr>`;
  });
  html += "</table>";
  document.getElementById("resultados").innerHTML = html;
}

function limpiarPantalla() {
  document.getElementById("empleadoInput").value = "";
  document.getElementById("resultados").innerHTML = "";
}