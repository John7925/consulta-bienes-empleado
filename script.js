async function buscarBienes() {
  const empleado = document.getElementById("empleadoInput").value.trim();
  if (!empleado) {
    alert("Por favor ingrese un número de empleado.");
    return;
  }

  const response = await fetch(`https://script.google.com/macros/s/AKfycbwpupWLNCG_T3pHxBmr-FzATfEUkit4uWKhnhIw0M_FChufjp4-MVjtFryXCBJhB9yj/exec?empleado=${empleado}`);
  const data = await response.json();

  const resultDiv = document.getElementById("result");
  if (data.length === 0) {
    resultDiv.innerHTML = "<p>No se encontraron bienes para este empleado.</p>";
  } else {
    let html = "";
    data.forEach((bien, index) => {
      html += `<div><strong>Bien ${index + 1}</strong><br>`;
      for (const [clave, valor] of Object.entries(bien)) {
        html += `<strong>${clave}:</strong> ${valor}<br>`;
      }
      html += "<hr></div>";
    });
    resultDiv.innerHTML = html;
  }
}

function limpiarPantalla() {
  document.getElementById("result").innerHTML = "";
  document.getElementById("empleadoInput").value = "";
}