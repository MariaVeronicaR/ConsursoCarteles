// ADMINISTRACION DE JUECES
var tablaJueces;
var registroJueces;
$(document).ready(function() {
    tablaJueces = $('#tabla-jueces').DataTable();
 
    $('#tabla-jueces tbody').on( 'click', 'tr', function () {
        if ( $(this).hasClass('selected') ) {
            $(this).removeClass('selected');
        }
        else {
            tablaJueces.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
    } );
 
    $('#eliminarJuez').click( function () {
        tablaJueces.row('.selected').remove().draw( false );
    } );

    Papa.parse("preguntas/Jueces.csv", {
        //Al activar el header el resultado se puede accesar de maneras mas especificas
        //registros[i]['Clave'] en vez de registros[i][j] 
        header: true,
        download: true,
            complete: function(results) {
                registroJueces = results.data;
                // Se llenan las opciones del Select2 con los codigos de los carteles
                // -1 por el encabezado
                for(i = 0; i < registroJueces.length-1; i++){
                    try {
                        tablaJueces.row.add([registroJueces[i]['Nombre'], registroJueces[i]['Apellidos']]).draw();   
                    } catch (error) {
                        console.log("fallo en coleccion de datos")
                    }
                }
            }
    });
});

function AgregaNuevoJuez() {
    let nombre = document.getElementById("JuezNuevoNombre").value;
    let apellido = document.getElementById("JuezNuevoApellido").value;
  
    // console.log(nombre);
  
    $("#AgregaNuevoJuezModal").modal("hide");

    tablaJueces.row.add([nombre, apellido]).draw();  
    // document.getElementById("juecesTBody").innerHTML += nuevoJuez;
}


// ADMINISTRACION DE PREGUNTAS
var tablaPreguntas;
var registroPreguntas;

$(document).ready(function() {
    tablaPreguntas = $('#tabla-preguntas').DataTable();
 
    $('#tabla-preguntas tbody').on( 'click', 'tr', function () {
        if ( $(this).hasClass('selected') ) {
            $(this).removeClass('selected');
        }
        else {
            tablaPreguntas.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
    } );
 
    $('#eliminarPregunta').click( function () {
        tablaPreguntas.row('.selected').remove().draw( false );
    } );

    Papa.parse("preguntas/Rubricas.csv", {
        //Al activar el header el resultado se puede accesar de maneras mas especificas
        //registros[i]['Clave'] en vez de registros[i][j] 
        header: true,
        download: true,
            complete: function(results) {
                registroPreguntas = results.data;
                // Se llenan las opciones del Select2 con los codigos de los carteles
                // -1 por el encabezado TITULO,RUBRICA,CRITERIO,TIPO
                for(i = 0; i < registroPreguntas.length-1; i++){
                    try {
                        tablaPreguntas.row.add([registroPreguntas[i]['TITULO'], registroPreguntas[i]['RUBRICA'],registroPreguntas[i]['CRITERIO'],registroPreguntas[i]['TIPO']]).draw();   
                    } catch (error) {
                        console.log("fallo en coleccion de datos")
                    }
                }
            }
    });
} );

function AgregaNuevaPregunta() {
    let titulo = document.getElementById("PreguntaNuevoTitulo").value;
    let texto = document.getElementById("PreguntaNuevoTexto").value;
    let criterio = document.getElementById("PreguntaNuevoCriterio").value;
    let tipo = document.getElementById("PreguntaNuevoTipo").value;
    
    $("#AgregaNuevaPreguntaModal").modal("hide");

    tablaPreguntas.row.add([titulo, texto, criterio, tipo]).draw();
  
}

// ADMINISTRACION DE PREGUNTAS
var tablaCarteles;
var registroCarteles;
$(document).ready(function() {
    tablaCarteles = $('table#tabla-carteles').DataTable();

    Papa.parse("preguntas/Registro.csv", {
        //Al activar el header el resultado se puede accesar de maneras mas especificas
        //registros[i]['Clave'] en vez de registros[i][j] 
        header: true,
        download: true,
            complete: function(results) {
                registroCarteles = results.data;
                // Se llenan las opciones del Select2 con los codigos de los carteles
                // -1 por el encabezado
                for(i = 0; i < registroCarteles.length-1; i++){
                    tablaCarteles.row.add([registroCarteles[i]['Clave'], registroCarteles[i]['Nombre del PRIMER AUTOR'], registroCarteles[i]['Titulo del RESUMEN y CARTEL'], registroCarteles[i]['Tipo de cartel']]).draw(); 
                }
            }
    });
} );

function EliminarCarteles(){
    tablaCarteles.clear().draw();
}

function AgregarNuevosCarteles() {
    //Se usa el Archivo Registro.csv
    $("#fileinput").parse({
        config: {
            header:true,
            complete: function(results, file) {
                // console.log("This file done:", file, results);
                registroCarteles = results.data;
            }
        },
        complete: function() {
            for(i = 0; i < registroCarteles.length; i++){
                tablaCarteles.row.add([registroCarteles[i]['Clave'], registroCarteles[i]['Nombre del PRIMER AUTOR'], registroCarteles[i]['Titulo del RESUMEN y CARTEL'], registroCarteles[i]['Tipo de cartel']]).draw(); 
            }
            // console.log("All files done!");
        }
    });
}