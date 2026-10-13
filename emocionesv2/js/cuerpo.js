   // hacemos referencia a la etiqueta video
   var vid = document.getElementById('videoel');
   console.log('vid ', vid);

   // alamcenamos el valor del acho de la etiqueta video
   var vid_width = vid.width;

   // almacenamos el valor del alto de la etiqueta video
   var vid_height = vid.height;

   // achemos referencia a la etiqueta overlay
   var overlay = document.getElementById('overlay');

   // del overlay que hace referencia al canvas
   // creamos un contexto en 2d
   var overlayCC = overlay.getContext('2d');

   /********** check and set up video/webcam **********/

   // funcion de que se llama desde el canplay
   function enablestart() {
       // hacemos referencia del startbutton del input
       var startbutton = document.getElementById('startbutton');

       // tendra como valor el dato start
       startbutton.value = "inicio";

       // volvemos activo el boton del video
       startbutton.disabled = null;

   }

   // funcion para ajustar la proporcion del video
   function adjustVideoProportions() {

       // resize overlay and video if proportions are different

       // keep same height, just change width

       // dividimos el alto y ancho de la etiqueta video
       // para redimencionar el video
       var proportion = vid.videoWidth / vid.videoHeight;

       // multiplicamos la variable vid_height con proporcion y 
       // la redondiamos a un valor entero
       // el valor lo añadimos rescribiendo la variable vid_width
       vid_width = Math.round(vid_height * proportion);

       // la variable width la alacenamos en video.width
       vid.width = vid_width;

       // lo mismo lo acemos para la variable overlay.width
       overlay.width = vid_width;
   }



   function gumSuccess(stream) {

       // add camera stream if getUserMedia succeeded


       // validamos si la variable vid es un objeto media 
       if ("srcObject" in vid) {

           // si es verdadero a vid.srcObject lo inicializamos
           // con el parametro stream
           vid.srcObject = stream;

       } else {
           // si es falso a vid.src le decimos que se 
           // le añadira la creacion de una url
           // con el objeto que le pasemos 
           vid.src = (window.URL && window.URL.createObjectURL(stream));
       }

       // autilizamos una arrow function
       // para guardar los metadatos del video
       vid.onloadedmetadata = () => {

           // ejecutamos la juncion de ajustar la proporcion
           // del tamaño de la etiqueta video
           adjustVideoProportions();

           // se ejecuta el video
           vid.play();

       }

       // utilizamos una arrow function 
       // cunado la ventala cambia de tamaño
       vid.onresize = () => {

           // llamamos a la funcion para ajustar el tamaño
           adjustVideoProportions();

           // si la variable booleana es verdadera
           if (trackingStarted) {
               // la instanica de la libreria detendra el rastreador de la ejecucion   
               ctrack.stop();
               // la instancia de la libreria  resablecera  y reiniciara su ejecucion
               ctrack.reset();
               // la instancia de la libreria inicia la ejecucion del rastreador
               // con el elemento del video.
               ctrack.start(vid);

           }

       }

   }

   // funcion para dectar problemas cuando al pedir permiso de usar la webcam
   // le damos en bloquear
   function gumFail() {

       alert("Hubo un problema al intentar recuperar el video de su cámara web. Si tiene una cámara web, asegúrese de aceptar cuando el navegador le solicite acceso a su cámara web.");

   }

   // hacemos referencia al navegador en la cual pedimos permiso al usuario
   // si podemos utilizar la webcam ( dispositivo multimedia) con los prefijos del navegador
   navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

   // para la deteccion de la url
   window.URL = window.URL || window.webkitURL || window.msURL || window.mozURL;

   // check for camerasupport

   // nos devuelve un mediaDevice para tener acceso a la camara con permisos otrogados por el usuario
   if (navigator.mediaDevices) {

       // solicitamos al usuario permisos para utilizar la camara
       // si lo permite nos da una promesa en este caso el then
       // si no utilizamos el catch para capturar algun error
       navigator.mediaDevices.getUserMedia({
           video: true
       }).then(resp => {
           // si otorga permisos llamamos a la funcion
           // gumSuccess y le pasamos la respuesta cuando damos permietir
           console.log(resp);
           gumSuccess(resp);

       }).catch(err => {
           // sino cuando se capture el error hablamos a la funcion
           // de alerta la cual se ejecuta cuando no damos permitir
           console.log(err);
           gumFail();
       });

       // sino el navigatos.getUserMedia nos concede los permisos
   } else if (navigator.getUserMedia) {
       // nos pide las restricciones
       // una funcion si todo se ejecuta correctamente, cuando nos dan el permiso gumSucces
       // y una fucion si todo se ejecuta mal o no nos dan permisos gumFail
       navigator.getUserMedia({
           video: true
       }, gumSuccess, gumFail);

   } else {
       // en dado caso que no suceda nada manda una alerta, por si el navegador no soporta los permisos
       alert("This demo depends on getUserMedia, which your browser does not seem to support. :(");

   }


   // añadimos un evento canplay al vid, con la funcion enablestart que esta arriba
   // la cual se ejecutara en la face de burbujeo 
   vid.addEventListener('canplay', enablestart, false);



   /*********** setup of emotion detection *************/



   // set eigenvector 9 and 11 to not be regularized. This is to better detect motion of the eyebrows
   // creamos el modelo 
   pModel.shapeModel.nonRegularizedVectors.push(9);
   pModel.shapeModel.nonRegularizedVectors.push(11);

   // se crea una constante con la instancia de  la libreria cml
   const ctrack = new clm.tracker({
       useWebGL: true // inicializamo en verdadero el userWebGL para utilizarlo
   });

   // inicializamo y le pasamos un modelo para el seguimiento
   ctrack.init(pModel);

   // inicializamos una variable de tipo booleano como falsa
   let trackingStarted = false;



   function startVideo() {

       // start video
       // se reproduce el video
       vid.play();

       // start tracking
       // se inicializa el rastreador y pasamos la referencia de la etiqueta video
       ctrack.start(vid);
       // inicializamos como verdadero la varible booleana
       trackingStarted = true;

       // start loop to draw face
       // llamamos a la funcion loop
       drawLoop();

   }

   let arrayEmociones = []; // array para almacenar los datos de las emociones
   // funcion que esta a la escucha para los valores de las emociones
   // tambien refresca el canvas
   function drawLoop() {

       requestAnimFrame(drawLoop);

       // limpiamos los pixeles del canvas
       overlayCC.clearRect(0, 0, vid_width, vid_height);

       //psrElement.innerHTML = "score :" + ctrack.getScore().toFixed(4);

       // obtenemos los puntos del modelo si lo hay 
       if (ctrack.getCurrentPosition()) {
           // dibuja la cara en el lienzo y le pasamos el tamañod del lienzo 400 en este caso
           ctrack.draw(overlay);

       }

       // cremaos una variable para almacenar la matriz de los parametros del modelo
       let cp = ctrack.getCurrentParameters();

       // almacenamos en una varable er y pasamos el arreglo cp al a ec.meanPredict de las emociones
       // que contiene un array de objetos el cual almacena el valor del arreglo y el nombre la emocion
       let er = ec.meanPredict(cp);
       console.log('emotionData con valores: ', er);
       if (er !== false) { // para que si hay valores falsos no lo añada al array
           arrayEmociones.push(er); // incertamos los valores al array
           console.log(arrayEmociones); // imprimimos para ver que todo este bien
       }
       // metodo para la creacion del json e insertar los datos
       // utilizamos fetch para envar los datos al archivo post.php
       if(arrayEmociones.length>0){

           fetch('post.php', {
               method: 'POST', // mandamos los datos por el metodo post
               body: JSON.stringify(arrayEmociones) // y los datos del arreglo convertido en formato json
            }); // no utilizamos las promesas del fetch ya que nos basta con que envie los datos
        }

       // si continene valores entra al if
       if (er) {
           // funcion para la actualizacion de los datos y actializacion de la grafica
           updateData(er);

           let i = 0; // variable contador
           for (let e of er) { // recorremos el arreglo de ojetos
               const icon = document.getElementById('icon' + (i + 1));
               if (icon) {
                   icon.style.visibility = e.value > 0.4 ? 'visible' : 'hidden';
               }
               // incrementamos el contador en uno
               i++;
           }

       }

   }

   const emotionLabels = {
       angry: "enfado",
       disgusted: "asco",
       fear: "miedo",
       sad: "tristeza",
       surprised: "sorpresa",
       happy: "alegría"
   };

   function emotionLabel(name) {
       return emotionLabels[name] || name;
   }

   // creamos una constante con la instancia de la clase emotionClassifer
   const ec = new emotionClassifier();

   ec.init(emotionModel);

   let emotionData = ec.getBlank();
   console.log('emotionData ', emotionData);

   /************ d3 code for barchart *****************/

   // se creo un objeto margin
   // el acho se le asigna los 400px menos el margin derecho del objeto 
   // menos el margin isquierdo del objeto
   const hostWidth = document.getElementById('emotion_chart').clientWidth || 640;

   const margin = {
           top: 20,
           right: 8,
           bottom: 28,
           left: 8
       },

       width = Math.max(320, hostWidth) - margin.left - margin.right,

       height = 100 - margin.top - margin.bottom;


   // variable para la barra de emociones
   // teniendo un ancho de 30px
   let barWidth = 30;

   // el formato que que seran de los datos
   let formatPercent = d3.format(".0%");

   // variable que contiene la escala en linea 
   // contruimos el rango y el mapeo que tendra x
   let x = d3.scale.linear()
       .domain([0, ec.getEmotions().length])
       .range([margin.left, width + margin.left]);

   // variable que contiene la escala
   // constriyendo el mapeo  el rango que tendra y
   let y = d3.scale.linear()
       .domain([0, 1])
       .range([0, height]);


   var svg = d3.select("#emotion_chart") // seleccionamos el id emotion chart que esta en una etiqueta div
       .append("svg") // agrega un nodo de etiqueta de tipo svg
       .attr("width", width + margin.left + margin.right) // este tendra un ancho este suma el ancho + el margen derecho e izquierdo del objeto
       .attr("height", height + margin.top + margin.bottom) // el alto se sumara con el top del objeto margin y el botton del mismo objeto


   svg.selectAll("rect") // seleccionamos el rect
       .data(emotionData) // le pasamos el arreglo de objetos de emociones
       .enter() // especificamos los elemento que hay que aregarse
       .append("svg:rect") // agrega los elementos al nodo
       .attr("x", function(datum, index) { // hacemos referencia al atributo x
           console.log('attr x: ', x(index));
           console.log('x: ', x);
           return x(index); // el cual retornara los valores de una funcion x pasandole los valores del index 0 al 3
       })
       .attr("y", function(datum) { // hacemos referencia al atributo y
           return height - y(datum.value); // retornamos el alto menos la funcion y pasandole los valores del arreglo
       })
       .attr("height", function(datum) { // hacems referencia al atribulo altura
           return y(datum.value); // retornamos la funcion y pasandole los valores del arreglo
       })
       .attr("width", barWidth) // hacemos referencia al atributo ancho que sera de 30
       .attr("fill", "#2d578b"); // el color que sera de color azul marino



   svg.selectAll("text.labels") // seleccionamos el text.label
       .data(emotionData) // le pasamos el arreglo de emociones
       .enter() // especificamos los elementos que se agregaran
       .append("svg:text") // agrega un svg text
       .attr("x", function(datum, index) { // hacemos referencia a que el atributo x 
           return x(index) + barWidth; // retornara los valores de la funcion x que le pasamos index 0-3
           // mas el acho de la variable barWidth que es de 30
       })
       .attr("y", function(datum) {
           return Math.max(12, height - y(datum.value) - 4);
       })
       .attr("dx", -barWidth / 2)
       .attr("dy", "0")
       .attr("text-anchor", "middle")
       .text(function(datum) {
           return datum.value;
       })
       .attr("fill", "#1a1a1a")
       .attr("class", "labels"); // contendra la clase labels


   svg.selectAll("text.yAxis") // hacemos seleccion 
       .data(emotionData) // pasamos el arreglo
       .enter() // añadimos el arreglo
       .append("svg:text") // agregamos un nodo
       .attr("x", function(datum, index) { // hacemos referencia al atributo x
           return x(index) + barWidth; // retornamos la funcion x pasandole el index 0-3 + 30
       })
       .attr("y", height) // hacemos referencia al atributo y con el valor de altura
       .attr("dx", -barWidth / 2) // hacemos referencia a dx que tendra el valor de -15
       .attr("text-anchor", "middle") // el texto sera de tipo middle
       .attr("style", "font-size: 12") // el tamaño de las letras sera de 12px
       .text(function(datum) {
           return emotionLabel(datum.emotion);
       })
       .attr("transform", "translate(0, 18)") // tendra un movimiento de 18px
       .attr("class", "yAxis"); // se añaidra la clase yAxis


   // funcion que llamamos en el drawloop
   // que actualiza la barra de los datos de las emociones
   function updateData(data) {

       // update

       var rects = svg.selectAll("rect") // seleccionamos el rect
           .data(data) // pasamos los nuevos datos del arreglo
           .attr("y", function(datum) { // hacemos referencia al atributo y 
               return height - y(datum.value); // retornamos la altura menos la funcion y con los valores del arreglo
           })
           .attr("height", function(datum) { // hacemos referencia a la altura
               return y(datum.value); // retornamos la funcion y con los valores del arreglo
           });

       var texts = svg.selectAll("text.labels") // seleccionamos el texto
           .data(data) // pasamos el arreglo
           .attr("y", function(datum) {
               return Math.max(12, height - y(datum.value) - 4);
           })
           .text(function(datum) { // hacemos referencia al texto
               return datum.value.toFixed(1); // retornamos los valores de arreglo con fijacion de 1
           });


       // enter
       rects.enter().append("svg:rect"); // añade y agrega un nodo rectangulo

       texts.enter().append("svg:text"); // añade y agrega un nodo del texto

       // exit
       rects.exit().remove(); // eliminamos los nodos del rectangulo anteriores

       texts.exit().remove(); // eliminamos los nodos de texto anteriores

   }

   /******** stats ********/


   // creamos una instancia de la clase State
   stats = new Stats();

   // decimos que el elemento tendra una posiscion absoluta
   stats.domElement.style.position = 'absolute';
   // y tendra un top de 0px
   stats.domElement.style.top = '0px';

   // hacemos referencia al container y añade un nodo hijo
   // de stats element
   document.getElementById('container').appendChild(stats.domElement);



   // update stats on every iteration
   // añadimos un evento de seguimiento exitoso
   document.addEventListener('clmtrackrIteration', function(event) {

       stats.update(); // el stats de actualizara

   }, false);