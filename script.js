function doGet(e) {
  const idEmp = e.parameter.idEmp;
  const esPruebaLocal = e.parameter.esPruebaLocal === true;

  if (!idEmp) {
    const error = { error: "ID EMP no proporcionado" };
    return esPruebaLocal
      ? error
      : ContentService.createTextOutput(JSON.stringify(error))
          .setMimeType(ContentService.MimeType.JSON);
  }

  const hoja = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("GENERAL");
  if (!hoja) {
    const error = { error: "Hoja 'GENERAL' no encontrada" };
    return esPruebaLocal
      ? error
      : ContentService.createTextOutput(JSON.stringify(error))
          .setMimeType(ContentService.MimeType.JSON);
  }

  const datos = hoja.getDataRange().getValues();
  Logger.log("Datos obtenidos:");
  Logger.log(JSON.stringify(datos));

  if (datos.length < 2) {
    const error = { error: "No hay suficientes filas en la hoja" };
    return esPruebaLocal
      ? error
      : ContentService.createTextOutput(JSON.stringify(error))
          .setMimeType(ContentService.MimeType.JSON);
  }

  const coincidencias = [];

  for (let i = 1; i < datos.length; i++) {
    const fila = datos[i];
    const valorCelda = String(fila[16]).trim(); // Columna ID EMP
    Logger.log(`Revisando fila ${i + 1}: '${valorCelda}'`);

    if (valorCelda.includes(idEmp)) {
      coincidencias.push({
        nombre: fila[17],
        idEmp: fila[16],
        rfc: fila[18],
        puesto: fila[19],
        regimen: fila[20],
        area: fila[21],
        adscripcion: fila[22],
        bienes: fila
      });
    }
  }

  if (coincidencias.length === 0) {
    const error = { error: "Empleado no encontrado en ninguna fila" };
    return esPruebaLocal
      ? error
      : ContentService.createTextOutput(JSON.stringify(error))
          .setMimeType(ContentService.MimeType.JSON);
  }

  const respuesta = {
    totalCoincidencias: coincidencias.length,
    resultados: coincidencias
  };

  return esPruebaLocal
    ? respuesta
    : ContentService.createTextOutput(JSON.stringify(respuesta))
        .setMimeType(ContentService.MimeType.JSON);
}

// 🧪 Función de prueba local
function pruebaLocal() {
  const e = { parameter: { idEmp: "865222", esPruebaLocal: true } };
  const salida = doGet(e);

  Logger.log("Resultado de pruebaLocal:");
  if (typeof salida === "object" && typeof salida.getContent === "function") {
    Logger.log(salida.getContent());
  } else {
    Logger.log(JSON.stringify(salida));
  }

  return salida;
}