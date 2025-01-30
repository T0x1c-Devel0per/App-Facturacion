/**
 * Inicialización de Popovers de Bootstrap
 * Se seleccionan todos los elementos que tienen el atributo 'data-bs-toggle="popover"'
 * y se les aplica la funcionalidad de Popover utilizando Bootstrap.
 */
const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
const popoverList = [...popoverTriggerList].map(
  (popoverTriggerEl) => new bootstrap.Popover(popoverTriggerEl)
);

/**
 * Configuración de Firebase
 * Se establecen las credenciales necesarias para conectar con Firebase.
 */
const firebaseConfig = {
  apiKey: "AIzaSyAxeBcRPOUXoQmMAT02FQKKS-S8szRlTZE",
  authDomain: "app-facturacion-59e18.firebaseapp.com",
  projectId: "app-facturacion-59e18",
  storageBucket: "app-facturacion-59e18.firebasestorage.app",
  messagingSenderId: "844855476933",
  appId: "1:844855476933:web:3882ad86b882908c20a6ac",
};

// Inicialización de Firebase con la configuración especificada
firebase.initializeApp(firebaseConfig);

// Referencia a Firestore para almacenar y recuperar datos
var db = firebase.firestore();

/**
 * Obtención de referencias a elementos del DOM
 * Se capturan los formularios y otros elementos del HTML necesarios para la funcionalidad.
 */
var form = document.getElementById("mainForm");
var form2 = document.getElementById("form2-tbody");
var originalData = []; // Variable para almacenar datos originales (sin uso en este fragmento)

/**
 * Función para guardar datos en Firebase
 * Esta función se ejecuta al enviar el formulario y almacena los datos en Firestore.
 */
function guardar() {
  event.preventDefault(); // Previene el envío del formulario para manejarlo manualmente

  // Obtención de los valores de los campos del formulario
  var cedula = form.querySelector("#Cedula").value;
  var nombre = form.querySelector("#Nombre").value;
  var total = form.querySelector("#Total").value;
  var abono = form.querySelector("#Abono").value;
  var saldo = form.querySelector("#Saldo").value;
  var fechaRegistro = form.querySelector("#FechaRegistro").value;
  var fechaEntrega = form.querySelector("#FechaEntrega").value;
  var telefono = form.querySelector("#Telefono").value;
  var direccion = form.querySelector("#Direccion").value;
  var articulo = form.querySelector("#Articulo").value;
  var marca = form.querySelector("#Marca").value;
  var modelo = form.querySelector("#Modelo").value;
  var caracteristicas = form.querySelector("#Caracteristicas").value;
  var detalleServicio = form.querySelector("#DetalleServicio").value;
  var observaciones = form.querySelector("#Observaciones").value;

  // Configuración de la alerta de confirmación con SweetAlert2
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });

  // Mostrar la alerta de confirmación
  swalWithBootstrapButtons
    .fire({
      title: "Alerta",
      text: "¿Está seguro de guardar este usuario?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, Guardar!",
      cancelButtonText: "No, Cancelar!",
      reverseButtons: true,
    })
    .then((result) => {
      if (result.isConfirmed) {
        // Si el usuario confirma, se guarda en Firestore
        swalWithBootstrapButtons.fire("Guardado!", "Usuario Guardado.", "success");
        db.collection("clientes")
          .add({
            FechaRegistro: fechaRegistro,
            FechaEntrega: fechaEntrega,
            Nombre: nombre,
            Total: total,
            Abono: abono,
            Saldo: saldo,
            Cedula: cedula,
            Telefono: telefono,
            Direccion: direccion,
            Articulo: articulo,
            Marca: marca,
            Modelo: modelo,
            Caracteristicas: caracteristicas,
            DetalleServicio: detalleServicio,
            Observaciones: observaciones,
          })
          .then(function () {
            // Reinicio de los campos del formulario tras el guardado exitoso
            var fechaRegistroInput = document.getElementById("FechaRegistro");
            var fechaHoraActual = new Date().toISOString().slice(0, 10);
            form.querySelector("#Cedula").value = "";
            form.querySelector("#Nombre").value = "";
            form.querySelector("#Total").value = "";
            form.querySelector("#Abono").value = "";
            form.querySelector("#Saldo").value = "";
            form.querySelector("#Telefono").value = "";
            form.querySelector("#Direccion").value = "";
            form.querySelector("#Articulo").value = "";
            form.querySelector("#Marca").value = "";
            form.querySelector("#Modelo").value = "";
            form.querySelector("#Caracteristicas").value = "";
            form.querySelector("#DetalleServicio").value = "";
            form.querySelector("#Observaciones").value = "";
            fechaRegistroInput.value = fechaHoraActual;
          })
          .catch(function (error) {
            console.error("Error al agregar datos:", error);
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Si el usuario cancela la acción
        swalWithBootstrapButtons.fire(
          "Cancelado",
          "La solicitud se ha cancelado",
          "error"
        );
      }
    });
}


////////////////////////////////////////////// FUNCIONALIDAD PARA EDITAR LOS DATOS //////////////////////////////////////////////

/**
 * Función para editar los datos de un cliente en Firestore.
 * @param {string} id - El ID del documento que se desea editar en la colección "clientes".
 */
function editData(id) {
  // Referencias a los botones de guardar y editar en el DOM
  var btnSave = document.getElementById("btn-save");
  var btnEdit = document.getElementById("btn-edit");

  // Ocultar el botón de guardar y mostrar el botón de editar
  btnSave.style.display = "none";
  btnEdit.style.display = "initial";

  // Mostrar un cuadro de diálogo de confirmación usando SweetAlert2
  Swal.fire({
    title: "Alerta",
    text: "¿Desea editar este usuario?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    cancelButtonText: "No, Cancelar!",
    confirmButtonText: "Si, Editar",
  }).then((result) => {
    // Si el usuario confirma la edición
    if (result.isConfirmed) {
      // Obtener una referencia al documento específico en Firestore
      var clienteRef = db.collection("clientes").doc(id);

      // Realizar una consulta para obtener los datos existentes del documento
      clienteRef
        .get()
        .then(function (doc) {
          // Verificar si el documento existe
          if (doc.exists) {
            // Obtener los datos del documento
            var data = doc.data();

            // Rellenar los campos del formulario con los datos existentes
            document.getElementById("Cedula").value = data.Cedula;
            document.getElementById("Nombre").value = data.Nombre;
            document.getElementById("Total").value = data.Total;
            document.getElementById("Abono").value = data.Abono;
            document.getElementById("Saldo").value = data.Saldo;
            document.getElementById("FechaRegistro").value = data.FechaRegistro;
            document.getElementById("FechaEntrega").value = data.FechaEntrega;
            document.getElementById("Telefono").value = data.Telefono;
            document.getElementById("Direccion").value = data.Direccion;
            document.getElementById("Articulo").value = data.Articulo;
            document.getElementById("Marca").value = data.Marca;
            document.getElementById("Modelo").value = data.Modelo;
            document.getElementById("Caracteristicas").value = data.Caracteristicas;
            document.getElementById("DetalleServicio").value = data.DetalleServicio;
            document.getElementById("Observaciones").value = data.Observaciones;

            // Asignar una función al botón de editar para guardar los cambios
            btnEdit.onclick = function () {
              // Obtener los valores actualizados de los campos del formulario
              var cedula = document.getElementById("Cedula").value;
              var nombre = document.getElementById("Nombre").value;
              var total = document.getElementById("Total").value;
              var abono = document.getElementById("Abono").value;
              var saldo = document.getElementById("Saldo").value;
              var fechaRegistro = document.getElementById("FechaRegistro").value;
              var fechaEntrega = document.getElementById("FechaEntrega").value;
              var telefono = document.getElementById("Telefono").value;
              var direccion = document.getElementById("Direccion").value;
              var articulo = document.getElementById("Articulo").value;
              var marca = document.getElementById("Marca").value;
              var modelo = document.getElementById("Modelo").value;
              var caracteristicas = document.getElementById("Caracteristicas").value;
              var detalleServicio = document.getElementById("DetalleServicio").value;
              var observaciones = document.getElementById("Observaciones").value;

              // Actualizar el documento en Firestore con los nuevos valores
              clienteRef
                .update({
                  Cedula: cedula,
                  Nombre: nombre,
                  Total: total,
                  Abono: abono,
                  Saldo: saldo,
                  FechaRegistro: fechaRegistro,
                  FechaEntrega: fechaEntrega,
                  Telefono: telefono,
                  Direccion: direccion,
                  Articulo: articulo,
                  Marca: marca,
                  Modelo: modelo,
                  Caracteristicas: caracteristicas,
                  DetalleServicio: detalleServicio,
                  Observaciones: observaciones,
                })
                .then(() => {
                  // Restablecer algunos campos del formulario después de la actualización
                  var fechaRegistroInput = document.getElementById("FechaRegistro");
                  var fechaHoraActual = new Date().toISOString().slice(0, 10); // Obtener la fecha actual

                  // Limpiar los campos del formulario
                  document.getElementById("Cedula").value = "";
                  document.getElementById("Nombre").value = "";
                  document.getElementById("Total").value = "";
                  document.getElementById("Abono").value = "";
                  document.getElementById("Saldo").value = "";
                  document.getElementById("Telefono").value = "";
                  document.getElementById("Direccion").value = "";
                  document.getElementById("Articulo").value = "";
                  document.getElementById("Marca").value = "";
                  document.getElementById("Modelo").value = "";
                  document.getElementById("Caracteristicas").value = "";
                  document.getElementById("DetalleServicio").value = "";
                  document.getElementById("Observaciones").value = "";

                  // Establecer la fecha de registro a la fecha actual
                  fechaRegistroInput.value = fechaHoraActual;
                })
                .catch((error) => {
                  // Manejar errores durante la actualización
                  console.error("Error al actualizar el documento: ", error);
                });

              // Restablecer la visibilidad de los botones
              btnSave.style.display = "initial";
              btnEdit.style.display = "none";
            };
          } else {
            // Si el documento no existe, mostrar un mensaje en la consola
            console.log("El documento no existe");
          }
        })
        .catch(function (error) {
          // Manejar errores durante la obtención del documento
          console.log("Error al obtener el documento:", error);
        });
    }
  });
}



////////////////////////////////////////////// LISTAR DATOS EN LA TABLA //////////////////////////////////////////////

/**
 * Escucha cambios en la colección "clientes" de Firestore y actualiza la tabla en tiempo real.
 */
db.collection("clientes").onSnapshot((querySnapshot) => {
  let originalData = []; // Array para almacenar los datos originales

  // Recorrer cada documento en la colección "clientes"
  querySnapshot.forEach((doc) => {
    // Agregar los datos del documento al array originalData
    originalData.push({
      id: doc.id, // ID del documento
      Cedula: doc.data().Cedula,
      Nombre: doc.data().Nombre,
      Total: doc.data().Total,
      Abono: doc.data().Abono,
      Saldo: doc.data().Saldo,
      FechaRegistro: doc.data().FechaRegistro,
      FechaEntrega: doc.data().FechaEntrega,
      Telefono: doc.data().Telefono,
      Direccion: doc.data().Direccion,
      Articulo: doc.data().Articulo,
      Marca: doc.data().Marca,
      Modelo: doc.data().Modelo,
      Caracteristicas: doc.data().Caracteristicas,
      DetalleServicio: doc.data().DetalleServicio,
      Observaciones: doc.data().Observaciones,
    });
  });

  // Ordenar los datos por FechaRegistro (de más reciente a más antiguo)
  originalData.sort(
    (a, b) => new Date(b.FechaRegistro) - new Date(a.FechaRegistro)
  );

  // Referencia a la tabla DataTable
  let table = $("#Billing-table").DataTable();

  // Limpiar la tabla antes de agregar nuevos datos
  table.clear();

  // Agregar los datos ordenados a la tabla
  originalData.forEach((registro) => {
    table.row.add([
      // Botón para eliminar el registro
      `<button type="button" class="btn btn-danger" onclick="deleteData('${registro.id}')">Eliminar</button>`,
      // Botón para editar el registro
      `<button type="button" class="btn btn-warning" onclick="editData('${registro.id}', '${registro.Nombre}', '${registro.Total}', '${registro.Abono}', '${registro.Saldo}', '${registro.Cedula}', '${registro.Telefono}', '${registro.Direccion}', '${registro.Articulo}', '${registro.Marca}', '${registro.Modelo}', '${registro.FechaRegistro}', '${registro.FechaEntrega}', '${registro.Caracteristicas}', '${registro.DetalleServicio}', '${registro.Observaciones}')">Editar</button>`,
      // Resto de los datos del registro
      registro.Cedula,
      registro.Nombre,
      registro.Total,
      registro.Abono,
      registro.Saldo,
      registro.FechaRegistro,
      registro.FechaEntrega,
      registro.Telefono,
      registro.Direccion,
      registro.Articulo,
      registro.Marca,
      registro.Modelo,
      registro.Caracteristicas,
      registro.DetalleServicio,
      registro.Observaciones,
    ]);
  });

  // Dibujar la tabla con los nuevos datos
  table.draw();
});

////////////////////////////////////////////// FUNCIONES PARA REALIZAR LA BÚSQUEDA //////////////////////////////////////////////

/**
 * Función para eliminar acentos de un texto.
 * @param {string} text - Texto del cual se eliminarán los acentos.
 * @returns {string} - Texto sin acentos.
 */
function removeAccents(text) {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

////////////////////////////////////////////// FUNCIÓN PARA BORRAR DATOS //////////////////////////////////////////////

/**
 * Función para eliminar un documento de la colección "clientes" en Firestore.
 * @param {string} id - ID del documento que se desea eliminar.
 */
function deleteData(id) {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });

  // Mostrar un cuadro de diálogo de confirmación
  swalWithBootstrapButtons
    .fire({
      title: "Alerta",
      text: "¿Está seguro de eliminar este usuario?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, Eliminar",
      cancelButtonText: "No, Cancelar",
      reverseButtons: true,
    })
    .then((result) => {
      if (result.isConfirmed) {
        // Si el usuario confirma, eliminar el documento
        swalWithBootstrapButtons.fire(
          "Eliminado",
          "Usuario Eliminado",
          "success"
        );
        db.collection("clientes")
          .doc(id)
          .delete()
          .then(function () {
            console.log("Datos Eliminados");
          })
          .catch(function (error) {
            console.log("Error", error);
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Si el usuario cancela, mostrar un mensaje de cancelación
        swalWithBootstrapButtons.fire(
          "Cancelado",
          "La solicitud se ha cancelado",
          "error"
        );
      }
    });
}

////////////////////////////////////////////// ESTABLECER FECHA DE REGISTRO //////////////////////////////////////////////

/**
 * Establece la fecha de registro con la fecha actual al cargar la página.
 */
document.addEventListener("DOMContentLoaded", function () {
  var fechaRegistroInput = document.getElementById("FechaRegistro"); // Referencia al input de fecha
  var fechaHoraActual = new Date().toISOString().slice(0, 10); // Obtener la fecha actual
  fechaRegistroInput.value = fechaHoraActual; // Asignar la fecha actual al input
});

////////////////////////////////////////////// ANIMACIÓN DE CARGA //////////////////////////////////////////////

/**
 * Muestra una animación de carga al cargar la página y la oculta después de 1 segundo.
 */
document.addEventListener("DOMContentLoaded", function () {
  const loadingOverlay = document.querySelector(".loading-overlay"); // Referencia al overlay de carga
  loadingOverlay.style.display = "flex"; // Mostrar la animación de carga
  setTimeout(function () {
    loadingOverlay.style.display = "none"; // Ocultar la animación después de 1 segundo
  }, 1000);
});

////////////////////////////////////////////// FILTRAR USUARIOS POR SALDO PENDIENTE //////////////////////////////////////////////

/**
 * Filtra los usuarios en la tabla para mostrar solo aquellos con saldo pendiente.
 */
document.addEventListener("DOMContentLoaded", function () {
  var dataTableBody = document.getElementById("data-table-body"); // Referencia al cuerpo de la tabla
  var dataTableBody = document.getElementById("form2-tbody"); // Referencia alternativa al cuerpo de la tabla

  function filtrarSaldoPendiente() {
    var rows = dataTableBody.getElementsByTagName("tr"); // Obtener todas las filas de la tabla
    for (var i = 0; i < rows.length; i++) {
      var saldoCell = rows[i].cells[6]; // Celda que contiene el saldo
      var saldoNumerico = parseFloat(saldoCell.textContent.replace("$", "")); // Convertir el saldo a número
      if (saldoNumerico === 0) {
        rows[i].style.display = "none"; // Ocultar filas con saldo cero
      } else {
        rows[i].style.display = ""; // Mostrar filas con saldo pendiente
      }
    }
  }
});

////////////////////////////////////////////// FUNCIONALIDAD PARA CÁLCULOS MONETARIOS //////////////////////////////////////////////

/**
 * Funcionalidad para calcular y formatear valores monetarios en los inputs.
 */
$(document).ready(function () {
  var moneyInputs = $(".money-input"); // Inputs de dinero
  var moneyInputs2 = $(".money-input1"); // Inputs de dinero adicionales
  var totalInputs = $(".total-input"); // Inputs de total

  // Recalcular el total cuando se modifica un input de dinero
  moneyInputs.on("blur", function () {
    recalculateTotal();
  });

  moneyInputs2.on("blur", function () {
    recalculateTotal();
  });

  // Función para recalcular el total
  function recalculateTotal() {
    var value1 = getValueFromInput(moneyInputs); // Obtener valor del primer input
    var value2 = getValueFromInput(moneyInputs2); // Obtener valor del segundo input
    var total = value1 - value2; // Calcular el total
    moneyInputs.val(formatAsCurrency(value1)); // Formatear y asignar el valor al primer input
    moneyInputs2.val(formatAsCurrency(value2)); // Formatear y asignar el valor al segundo input
    totalInputs.val(formatAsCurrency(total)); // Formatear y asignar el total
  }

  // Formatear el total cuando se modifica
  totalInputs.on("blur", function () {
    var value = getValueFromInput(totalInputs); // Obtener valor del total
    totalInputs.val(formatAsCurrency(value)); // Formatear y asignar el valor
  });

  // Función para obtener el valor numérico de un input
  function getValueFromInput(inputElement) {
    var sanitizedValue = inputElement.val().replace(/[^0-9.]/g, ""); // Eliminar caracteres no numéricos
    return parseFloat(sanitizedValue) || 0; // Convertir a número o devolver 0
  }

  // Función para formatear un valor como moneda
  function formatAsCurrency(value) {
    var formattedValue = value.toLocaleString("en-US"); // Formatear con separadores de miles
    formattedValue = formattedValue.replace(/\.00$/, ""); // Eliminar decimales innecesarios
    return "$ " + formattedValue; // Agregar símbolo de moneda
  }
});

////////////////////////////////////////////// FORMATEAR CÉDULA //////////////////////////////////////////////

/**
 * Funcionalidad para formatear el input de cédula.
 */
$(document).ready(function () {
  var moneyInputs = $(".cc-input"); // Inputs de cédula
  moneyInputs.on("blur", function () {
    var sanitizedValue = $(this).val().replace(/[^0-9.]/g, ""); // Eliminar caracteres no numéricos
    var numericValue = parseFloat(sanitizedValue); // Convertir a número
    if (isNaN(numericValue)) {
      $(this).val("0"); // Asignar 0 si no es un número válido
    } else {
      var formattedValue = numericValue.toLocaleString("en-US"); // Formatear con separadores de miles
      $(this).val(formattedValue); // Asignar el valor formateado
    }
  });
});



/////////////// Implementación de la librería DataTables //////////////////////

/**
 * Función que se ejecuta cuando el documento está listo (DOM completamente cargado).
 * Se encarga de agregar datos de ejemplo a una tabla y luego inicializar DataTables.
 */
$(document).ready(function () {
  // Datos de ejemplo para simular registros de clientes
  var registros = [];

  // Referencia al cuerpo de la tabla en el DOM
  var tbody = $("#form2-tbody");

  // Recorrer el array de registros y agregar cada uno a la tabla
  registros.forEach(function (registro) {
    // Crear una fila (tr) para cada registro
    var row = "<tr>";
    row += "<td>" + registro.id + "</td>"; // Columna para el ID
    row += "<td>" + "Editar" + "</td>"; // Columna para el botón "Editar" (puede ser un botón real)
    row += "<td>" + registro.id + "</td>"; // Columna adicional para el ID (puede ser redundante)
    row += "<td>" + registro.nombre + "</td>"; // Columna para el nombre
    row += "<td>" + registro.total + "</td>"; // Columna para el total
    row += "<td>" + registro.abono + "</td>"; // Columna para el abono
    row += "<td>" + registro.saldo + "</td>"; // Columna para el saldo
    row += "<td>" + registro.fecha_registro + "</td>"; // Columna para la fecha de registro
    row += "<td>" + registro.fecha_entrega + "</td>"; // Columna para la fecha de entrega
    row += "<td>" + registro.telefono + "</td>"; // Columna para el teléfono
    row += "<td>" + registro.direccion + "</td>"; // Columna para la dirección
    row += "<td>" + registro.articulo + "</td>"; // Columna para el artículo
    row += "<td>" + registro.marca + "</td>"; // Columna para la marca
    row += "<td>" + registro.modelo + "</td>"; // Columna para el modelo
    row += "<td>" + registro.caracteristicas + "</td>"; // Columna para las características
    row += "<td>" + registro.detalle_servicio + "</td>"; // Columna para el detalle del servicio
    row += "<td>" + registro.observaciones + "</td>"; // Columna para las observaciones
    row += "</tr>";

    // Agregar la fila al cuerpo de la tabla
    tbody.append(row);
  });

  // Inicializar DataTables en la tabla después de agregar los registros
  $("#Billing-table").DataTable({
    paging: true, // Habilitar paginación
    lengthChange: false, // Deshabilitar el cambio de longitud de página
    pageLength: 15, // Mostrar 15 registros por página
    searching: true, // Habilitar la búsqueda
    ordering: true, // Habilitar la ordenación
    info: true, // Mostrar información de paginación
    columnDefs: [
      { orderable: false, targets: [0, 1] }, // Deshabilitar la ordenación en las columnas 0 (ID) y 1 (Editar)
    ],
    language: {
      lengthMenu: "Mostrar _MENU_ registros por página", // Texto para el menú de longitud
      zeroRecords: "No se encontraron registros", // Mensaje cuando no hay registros
      info: "Mostrando _START_ a _END_ de _TOTAL_ registros", // Información de paginación
      infoEmpty: "No hay registros disponibles", // Mensaje cuando no hay registros
      infoFiltered: "(filtrado de _MAX_ registros totales)", // Mensaje de registros filtrados
      search: "Buscar:", // Texto para el campo de búsqueda
      paginate: {
        first: "Primero", // Texto para el botón "Primero"
        last: "Último", // Texto para el botón "Último"
        next: "Siguiente", // Texto para el botón "Siguiente"
        previous: "Anterior", // Texto para el botón "Anterior"
      },
    },
  });
});