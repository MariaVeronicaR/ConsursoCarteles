function LogIn(){
    location.href = "/nueva-evaluacion.html";
}

// Se activa el Select 2
$(document).ready(function() {
    $('.selector').select2({        
        width: '100%',
        placeholder: 'Escoja una opcion'
    });
});


// Carga de Informacion al Empezar una Calificacion de Preguntas
var registros = [];
var cartelSeleccionado;
var registroJueces;
var juezSeleccionado;
var cartelenIngles = false;

function LoadRegistros(){
    //se carga la informacion de los carteles
    Papa.parse("preguntas/Registro.csv", {
    //Al activar el header el resultado se puede accesar de maneras mas especificas
    //registros[i]['Clave'] en vez de registros[i][j] 
    header: true,
	download: true,
        complete: function(results) {
            registros = results.data;
            // Se llenan las opciones del Select2 con los codigos de los carteles
            for(i = 0; i < registros.length; i++){
                document.getElementById("codigo-cartel").innerHTML += `<option value="${registros[i]['Clave']}">${registros[i]['Clave']}</option>`;
            }

            // Al seleccionar el codigo del cartel automaticamente sale el titulo y tipo del cartel
            $("#codigo-cartel").change(function(){
                document.getElementById("verificacion").style.display = "block";


                let codigo =  $('#codigo-cartel').select2('data')[0].text;
                // se busca el indice del registro que tenga la clave igual a la clave seleccionada
                let index = registros.findIndex(x => x['Clave'].replace(/ /g,"")===codigo.replace(/ /g,""));
                cartelSeleccionado = registros[index];

                document.getElementById("verificacion-cartel").innerHTML = registros[index]['Titulo del RESUMEN y CARTEL'];

                document.getElementById("tipo-cartel").innerHTML = registros[index]['Tipo de cartel'];
            });
        }
    });

    Papa.parse("preguntas/Jueces.csv", {
        //Al activar el header el resultado se puede accesar de maneras mas especificas
        //registros[i]['Clave'] en vez de registros[i][j] 
        header: true,
        download: true,
            complete: function(results) {
                registroJueces = results.data;
                // Se llenan las opciones del Select2 con los nombres de los jueces
                for(i = 0; i < registroJueces.length; i++){
                    let nombre = registroJueces[i]['Nombre'];
                    let apellidos = registroJueces[i]['Apellidos'];

                    if(nombre != undefined && apellidos != undefined){
                        let val = nombre +" "+ apellidos;

                        // console.log(val);
                        document.getElementById("nombre-evaluador").innerHTML += `<option value="${val}">${apellidos}, ${nombre}</option>`;
                    }
                }
            }
        });
}

var nuevaEvaluacion;
// Se declarana las variables necesarias para sacar resultados
var respuestasForma = [];
var totalForma = 0;
var respuestasPert = [];
var totalPert = 0;
var respuestasContenido = [];
var totalContenido = 0;
var carteles = [];


//Cambios de pagina en el boton de Siguiente
//Nuevo -> Forma
function EmpezarEvaluacion(){
    // se guarda localmente el nombre del evaluador
    let juez =  $('#nombre-evaluador').val();
    localStorage.setItem("juez", JSON.stringify(juez));

    // y el objeto del cartel seleccionado
    localStorage.setItem("cartel", JSON.stringify(cartelSeleccionado));

    nuevaEvaluacion = new Evaluacion(cartelSeleccionado['Clave'], cartelSeleccionado, cartelSeleccionado['Tipo de Cartel'], juez);

    localStorage.setItem("evaluacion", JSON.stringify( nuevaEvaluacion));
    // se hace el cambio de pagina
    location.href = "/criterios-forma.html";
}

//Forma -> Contenido
$("#boton-siguiente-forma").on("click",function(){
    // Se guardan las respuestas del Criterio de Forma
    localStorage.setItem("forma", JSON.stringify(respuestasForma));
    localStorage.setItem("ingles", cartelenIngles);
    location.href = "/criterios-contenido.html";
});

// Contenido -> Pertinencia
$("#boton-siguiente-contenido").on("click",function(){
    // Se guardan las respuestas del Criterio de Contenido
    localStorage.setItem("contenido", JSON.stringify(respuestasContenido));
    location.href = "/criterios-pertinencia.html";
});

// Pertinencia -> Finalizar Evaluacion
$("#boton-finalizar-evaluacion").on("click",function(){
    // Se guardan las respuestas del Criterio de Pertinencia
    localStorage.setItem("pertinencia", JSON.stringify(respuestasPert));
    localStorage.setItem("calidad", JSON.stringify(lastQ));
    location.href = "/final-evaluacion.html";
});


// Se cargan las preguntas para generar las evaluaciones
function LoadPreguntasForma(x){
    // if(x == 'forma'){
    //    csvFile =  "preguntas/QuestionarioForma.csv";
    // }else if(x == 'contenido'){
    //     csvFile = "preguntas/QuestionarioContenido.csv";
    // }else if(x == 'pertinencia'){
    //     csvFile = "preguntas/QuestionarioPertinencia.csv";
    // }

    var preguntas = [];
    csvFile =  "preguntas/Rubricas.csv";
    Papa.parse( csvFile, {
    header: true,    
	download: true,
        complete: function(results) {
            preguntas = results.data;
            // console.log(preguntas);
            let cartel = JSON.parse(localStorage.getItem('cartel'));
            let tipo = cartel['Tipo de cartel'];
            for(i = 0; i< results.data.length; i++){
                if(preguntas[i]['TIPO'] == tipo && x == preguntas[i]['CRITERIO'].toLowerCase()){
                    console.log(i);
                    NuevaPregunta(preguntas[i]['TITULO'], preguntas[i]['RUBRICA'],i, x);
                    if(x == 'forma'){
                        respuestasForma.push({'titulo': preguntas[i]['TITULO'], 'valor': 0});
                    }else if(x == 'contenido'){
                        respuestasContenido.push({'titulo': preguntas[i]['TITULO'], 'valor': 0});
                    }else if(x == 'pertinencia'){
                        respuestasPert.push({'titulo': preguntas[i]['TITULO'], 'valor': 0});
                    }  
                }
                // if(results.data[i][0]!= undefined && results.data[i][0]!=""){
                //     // console.log(results.data[i][0]);
                //     NuevaPregunta(results.data[i][0],results.data[i][1],i, x);
                //     if(x == 'forma'){
                //         respuestasForma.push({'titulo': results.data[i][0], 'valor': 0});
                //     }else if(x == 'contenido'){
                //         respuestasContenido.push({'titulo': results.data[i][0], 'valor': 0});
                //     }else if(x == 'pertinencia'){
                //         respuestasPert.push({'titulo': results.data[i][0], 'valor': 0});
                //     }                    
                // }                
            }

            // console.log(respuestasPert);
        }
    });    
}

// Funcion para poner preguntas en el formulario
function NuevaPregunta(titulo, txt, id, x){
    var titulos = [];
    titulos.push(titulo);

    if(titulo == 'CARTEL EN INGLÉS' || titulo == 'GRAMATICA'){
        document.getElementById(`container-preguntas-${x}`).innerHTML +=
        `<div class="pregunta${id}-${x} pregunta-${x}">
            <h3 id="titulo-pregunta${id}" class="box-title titulos-${x}">${titulo}</h3>
            <span class="texto-${x}">${txt}</span>
            <div class="pregunta${id} row opciones-${x}">
                <div class="col">
                    <button id="pregunta${id}-opcion0" style="width: 100%; margin-bottom:10px;" type="button" class="opciones opcion0 btn btn-secondary">No</button>
                </div>
                <div class="col">
                    <button id="pregunta${id}-opcion5" style="width: 100%; margin-bottom:10px;" type="button" class="opciones opcion1 btn btn-secondary">Si</button>
                </div>
                <input class="valores-${x}" id="pregunta${id}-valor" type="hidden" value="0">
            </div>
        </div>`;
    }else{
        // console.log(id);
        let b1, b2, b3, b4 = "";
        let lastdiv = ""
        // let w = "";
        //las todas las preguntas dentro de pertinencia tienen diferentes posibles respuestas
        if(x == "pertinencia"){
            switch (titulo.substring(0,3)) {
                case "INT":
                    b1 = "0 Nada Interesante";
                    b2 = "1 Poco";
                    b3 = "2 Medianamente"
                    b4 = "3 Muy Interesante"
                    break;
                case "REL":
                    b1 = "0 Nada Relevante";
                    b2 = "1 Poco";
                    b3 = "2 Medianamente"
                    b4 = "3 Muy Relevante"
                    break;

                case "CAL":
                    b1 = "0 Pobre";
                    b2 = "1 Aceptable";
                    b3 = "2 Buena"
                    b4 = "3 Sobresaliente"
                    break;
            
                default:
                    b1 = "0 Pobre";
                    b2 = "1 Aceptable";
                    b3 = "2 Buena"
                    b4 = "3 Sobresaliente"
                    break;
            }
            // w = "100%";
            console.log(b1)
            console.log(b2)
            console.log(b3)
            console.log(b4)
            // ultima posible respuesta
            // pertinencia es el unico criterio con mas de tres posibles respuestas
            lastdiv = 
            `<div class="col">
                <button id="pregunta${id}-opcion3" style="width: 100%; margin-bottom:10px;" type="button" class="opciones opcion3 btn btn-secondary">${b4}</button>
            </div>`;
        }else{
            // w = "100%";
            b1 = "0 No Cumple";
            b2 = "1 Cumple Parcialmente";
            b3 = "2 Cumple Totalmente"
        }

        document.getElementById(`container-preguntas-${x}`).innerHTML +=
        `<div class="pregunta${id}-${x} pregunta-${x}">
            <h3 id="titulo-pregunta${id}" class="box-title titulos-${x}">${titulo}</h3>
            <span class="texto-${x}">${txt}</span>
            <div class="pregunta${id} row opciones-${x}">
                <div class="col">
                    <button id="pregunta${id}-opcion0" style="width: 100%; margin-bottom:10px;" type="button" class="opciones opcion0 btn btn-secondary">${b1}</button>
                </div>
                <div class="col">
                    <button id="pregunta${id}-opcion1" style="width: 100%; margin-bottom:10px;" type="button" class="opciones opcion1 btn btn-secondary">${b2}</button>
                </div>
                <div class="col">
                    <button id="pregunta${id}-opcion2" style="width: 100%; margin-bottom:10px;" type="button" class="opciones opcion2 btn btn-secondary">${b3}</button>
                </div>
                ${lastdiv}
                <input class="valores-${x}" id="pregunta${id}-valor" type="hidden" value="0">
            </div>
        </div>`;
    }
     
}   

// FUNCIONALIDAD DE FORMA
// Listener al clickear una respuesta dentro de Forma
$("#container-preguntas-forma").on("click",".opciones",function(){
    var id = $(this).attr("id");
    var datos = id.split("-");
    var pregunta = datos[0];
    var opcion = datos[1];
    var num = opcion.split("opcion")[1];

    var titulo = $(`#titulo-${pregunta}`).get()[0].outerText;
    console.log(titulo);
    let index = respuestasForma.findIndex(x => x.titulo.replace(/ /g,"")===titulo.replace(/ /g,""));

    // console.log(num);
    // alert(pregunta);
    var x = $(`.${pregunta} .opciones`);
    console.log(x);
    if(titulo == 'CARTEL EN INGLÉS' || titulo == 'GRAMATICA'){
        for(i = 0; i<2; i++){
            let element = document.getElementById(x[i].id);
            if(id == x[i].id){
                element.classList.remove("btn-secondary");
                element.classList.add("btn-warning");
            }else{
                element.classList.remove("btn-warning");
                element.classList.add("btn-secondary");
            }
        }
    }else{
        for(i = 0; i<3; i++){
            let element = document.getElementById(x[i].id);
            if(id == x[i].id){
                element.classList.remove("btn-secondary");
                element.classList.add("btn-warning");
            }else{
                element.classList.remove("btn-warning");
                element.classList.add("btn-secondary");
            }
        }
    }

    if(titulo == 'CARTEL EN INGLÉS' && parseInt(num) == 5){
        cartelenIngles = true;
    }else if(titulo == 'CARTEL EN INGLÉS' && parseInt(num) == 0){
        cartelenIngles =false;
    }else{
        respuestasForma[index].valor = parseInt( num);
        // console.log(respuestasForma);

        document.getElementById(`${pregunta}-valor`).value = num;
        var total = respuestasForma.map(p => p.valor).reduce((prev, next) => prev + next);

        document.getElementById("puntos-forma").textContent = total;
    }
    // console.log(total);
});


// FUNCIONALIDAD DE CONTENIDO
// Listener al clickear una respuesta dentro de Contenido
$("#container-preguntas-contenido").on("click",".opciones",function(){
    var id = $(this).attr("id");
    var datos = id.split("-");
    var pregunta = datos[0];
    var opcion = datos[1];
    var num = opcion.split("opcion")[1];
    var titulo = $(`#titulo-${pregunta}`).get()[0].outerText;
    // console.log(titulo);
    let index = respuestasContenido.findIndex(x => x.titulo.replace(/ /g,"")===titulo.replace(/ /g,""));
    // console.log(index);
    // console.log(respuestasContenido[index].titulo.replace(/ /g,""));
    // console.log(num);
    // alert(pregunta);
    var x = $(`.${pregunta} .opciones`);
    for(i = 0; i<3; i++){
        let element = document.getElementById(x[i].id);
        if(id == x[i].id){
            element.classList.remove("btn-secondary");
            element.classList.add("btn-warning");
        }else{
            element.classList.remove("btn-warning");
            element.classList.add("btn-secondary");
        }
    }

    respuestasContenido[index].valor = parseInt( num);
    // console.log(respuestasContenido);
    document.getElementById(`${pregunta}-valor`).value = num;

    var total = respuestasContenido.map(p => p.valor).reduce((prev, next) => prev + next);

    document.getElementById("puntos-contenido").textContent = total;
    // console.log(total);
});

// FUNCIONALIDAD DE PERTINENCIA
// Listener al clickear una respuesta dentro de Pertinencia
$("#container-preguntas-pertinencia").on("click",".opciones",function(){
    var id = $(this).attr("id");
    var datos = id.split("-");
    var pregunta = datos[0];
    var opcion = datos[1];
    var num = opcion.split("opcion")[1];
    var titulo = $(`#titulo-${pregunta}`).get()[0].outerText;
    let index = respuestasPert.findIndex(x => x.titulo.replace(/ /g,"")===titulo.replace(/ /g,""));
    // console.log(titulo);
    var x = $(`.${pregunta} .opciones`);
    for(i = 0; i<4; i++){
        let element = document.getElementById(x[i].id);
        if(id == x[i].id){
            element.classList.remove("btn-secondary");
            element.classList.add("btn-warning");
        }else{
            element.classList.remove("btn-warning");
            element.classList.add("btn-secondary");
        }
    }
    // console.log(respuestasPert[index]);
    respuestasPert[index].valor = parseInt( num);
    // console.log(respuestasPert) 
    document.getElementById(`${pregunta}-valor`).value = num;

    // console.log(valores);
    var total = respuestasPert.map(p => p.valor).reduce((prev, next) => prev + next);

    document.getElementById("puntos-pertinencia").textContent = total;
    // console.log(total);
});


// Listener al clickear una respuesta dentro de Modal antes de terminar evaluacion
var lastQ;
$("#preguntafinal").on("click",".opciones",function(){
    var id = $(this).attr("id");
    lastQ = $(this).text();
    var datos = id.split("-");
    //  var pregunta = datos[0];
    var opcion = datos[1];
    var num = opcion.split("opcion")[1];
    // console.log(num);
    // alert(pregunta);
    var x = $(`.opciones-final .opciones`);
    for(i = 0; i<3; i++){
        let element = document.getElementById(x[i].id);
        if(id == x[i].id){
            element.classList.remove("btn-secondary");
            element.classList.add("btn-warning");
        }else{
            element.classList.remove("btn-warning");
            element.classList.add("btn-secondary");
        }
    }
    document.getElementById(`preguntafinal-valor`).value = num;
    // console.log(total);
});


// FUNCION PARA GENERAR RESULTADOS POR CRITERIOS
var totales = [];
function CrearLayoutResultados(nombre, datos){
    let total = 0;
    let layout =
    `<h3 class="box-title">${nombre}</h3>
    <div class="table-responsive col-md-12" >                            
        <table class="table" style="table-layout: fixed;
        overflow-wrap: break-word; align-content: center;">
            <thead>
            <tr>
                <th style="width: 70%" scope="col">Pregunta</th>
                <th scope="col">Valor</th>
            </tr>
            </thead>
            <tbody>`;

    datos.forEach(element => {
        if(element.titulo == 'CARTEL EN INGLÉS'){
            let cond = "";
            if(JSON.parse(localStorage.getItem("ingles"))){
                cond = "SI";
            }else{
                cond = "NO";
            }
            layout += `<tr><td>${element.titulo}</td><td>${cond}</td></tr>`
        }else{
            layout += `<tr><td>${element.titulo}</td><td>${element.valor}</td></tr>`;
            total += element.valor;
        }   
    }); 

    layout +=        
            `</tbody>
        </table>
    </div>
    <span style= "margin-bottom: 30px;"><h2 style = "display: inline-block; margin-right: 20px;">Total ${nombre}:</h2>  <h2 style = "display: inline-block;"> ${total}</h2></span>`;

    document.getElementById('container-final').innerHTML += layout;

    totales.push(total);
}

// FUNCION PARA GENERAR GRAFICA DE RESULTADOS
function CrearGrafica(datos){
    var ctx = document.getElementById('GraficaFinal');
    var myChart = new Chart(ctx, {
        type: 'horizontalBar',
        data: {
            labels: ['Forma', 'Contenido', 'Pertinencia'],
            datasets: [{
                label:'Puntos',
                data: datos,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(75, 192, 192, 1)',
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                xAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            title: {
                display: true,
                text: 'Total de Puntos Acumulados'
            },legend: {
                display: false
            }
        }
    });
}

var eval;
// FUNCION PARA DESPLEGUAR LOS RESULTADOS FINALES
function DesplegarResultados(){
    let cartel = JSON.parse(localStorage.getItem("cartel"));

    let juez = JSON.parse(localStorage.getItem("juez"));

    let info = `<h3 class="box-title">Informacion General</h3>
    <div class="table-responsive col-md-12" >                            
        <table class="table" style="table-layout: fixed;
        overflow-wrap: break-word; align-content: center;">
            <thead>
                <th scope="col"></th>
                <th style="width: 70%" scope="col"></th>
            </thead>
            <tbody>
                <tr>
                    <td>Codigo</td>
                    <td>${cartel['Clave']}</td>
                </tr>
                <tr>
                    <td>Titulo</td>
                    <td>${cartel['Titulo del RESUMEN y CARTEL']}</td>
                </tr>
                <tr>
                    <td>Juez</td>
                    <td>${juez}</td>
                </tr>
                <tr>
                    <td>Primer Autor</td>
                    <td>${cartel['Nombre del PRIMER AUTOR']}</td>
                </tr>
                <tr>
                    <td>Email del Primer Autor</td>
                    <td>${cartel['Email del PRIMER AUTOR']}</td>
                </tr>
                <tr>
                    <td>Categoría</td>
                    <td>${cartel['Categoría']}</td>
                </tr>
                <tr>
                    <td>Resumen</td>
                    <td>${cartel['TEXTO DEL RESUMEN']}</td>
                </tr>
                <tr>
                    <td>Tipo de Cartel</td>
                    <td>${cartel['Tipo de cartel']}</td>
                </tr>
            </tbody>
            </table>
        </div>`;
    
    document.getElementById('container-final').innerHTML += info;

    let ing = JSON.parse(localStorage.getItem("ingles"));

    eval = new Evaluacion(cartel['Clave'], cartel, juez, ing);
    console.log(eval);
    //Se llaman los Resultados de Forma
    let forma = JSON.parse(localStorage.getItem('forma'));
    CrearLayoutResultados("Criterios de Forma", forma);

    //Se llaman los Resultados de Contenido
    let contenido = JSON.parse(localStorage.getItem('contenido'));
    CrearLayoutResultados("Criterios de Contenido", contenido);

    //Se llaman los Resultados de Pertinencia
    let pertinencia = JSON.parse(localStorage.getItem('pertinencia'));
    CrearLayoutResultados("Criterios de Pertinencia", pertinencia);

    let calidad = JSON.parse(localStorage.getItem("calidad"));
    eval.setResultados(forma, contenido, pertinencia, calidad);

    JSON.stringify(eval);

    info = `<span style= "margin-bottom: 30px;"><h4 style = "display: inline-block; margin-right: 20px;">Calidad de Supervicion:</h4>  <h4 style = "display: inline-block;"> ${calidad}</h4></span>`;

    document.getElementById('container-final').innerHTML += info;

    let grafica = `<div style="width:50%; margin-left:20%;"><canvas id="GraficaFinal" width="100" height="100"></canvas></div>`;

    document.getElementById('container-final').innerHTML += grafica;


    // console.log(totales);
    CrearGrafica(totales);
}