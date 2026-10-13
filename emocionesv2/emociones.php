

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reconocimiento de Emociones</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
  
  <!--etiqueta para los estilos de bootstrap-->
    <!--<link href="./styles/bootstrap.min.css" rel="stylesheet" type="text/css">-->
    <link rel="stylesheet" href="clmtrackr/examples/styles/bootstrap.min.css">
    <!--etiqueta para los estilos css-->
    <link rel="stylesheet" href="css/style.css">
    <!--etiqueta javascrip que deternima si el protocolo es https o es file-->
    <script type="text/javascript" src="js/protocol.js"></script>
    <!--etiqueta javascrip 2-->
    <script type="text/javascript" src="js/archivo.js"></script>
    <!--Importaciones de la libreria, del archivo clmtrackr-->

    <!--<script src="./js/libs/utils.js"></script>-->
    <script src="clmtrackr/examples/js/libs/utils.js"></script>

    <!--<script src="../build/clmtrackr.js"></script>-->
    <script src="clmtrackr/build/clmtrackr.js"></script>

    <!--<script src="../models/model_pca_20_svm.js"></script>-->
    <script src="clmtrackr/models/model_pca_20_svm.js"></script>

    <!--<script src="./js/libs/Stats.js"></script>-->
    <script src="clmtrackr/examples/js/libs/Stats.js"></script>

    <!--<script src="./js/libs/d3.min.js"></script>-->
    <script src="clmtrackr/examples/js/libs/d3.min.js"></script>

    <!--<script src="./js/emotion_classifier.js"></script>-->
    <script src="clmtrackr/examples/js/emotion_classifier.js"></script>

    <!--<script src="./js/emotionmodel.js"></script>-->
    <script src="clmtrackr/examples/js/emotionmodel.js"></script>
    <link href="css/sticky-footer-navbar.css" rel="stylesheet">
 
  </head>
  <?php 

if(session_id()=="")
{
   session_start();
}

if($_POST)
   {
     
         $_SESSION['matricula'] = $_POST['matricula'];
         
      
   }
?>
  <header>
  <!-- Fixed navbar -->
  <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
    <div class="container"></div>
    <a class="navbar-brand" href="http://localhost/emociones/production/chartjs.html">Reconocimiento de Emociones</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarCollapse">
      <ul class="navbar-nav mr-auto">
        
      </ul>
    </div>
  </nav>
  
</header>
<br>
<br>
<br>
  <body background="images/fondo.png"  >  
     <div class="container-fluid " >
       <div class=" container">
          <h3 class="text-center font-weight-bold" >Reconocimiento de Emociones Matricula <?=  $_SESSION['matricula'] ?></h3>
          <p>detección de emociones basada en la salida de parámetros de <em>clmtrackr</em>.</p>
          
          <div id="content">
          <div id="container">
              <!--etiqueta video-->
              <video id="videoel" width="597" height="400" preload="auto" loop playsinline autoplay> </video>
              <!--etiqueta id overlay canvas-->
              <canvas id="overlay" width="597" height="400"></canvas>          
         </div>
                    
                            
          <div id="emotion_container"></div>
                                <div id="emotion_icons">
                                    <img class="emotion_icon" id="icon1" alt="Enfado" src="clmtrackr/examples/media/icon_angry.png">
                                    <img class="emotion_icon" id="icon2" alt="Asco" src="images/icon_disgusted.svg">
                                    <img class="emotion_icon" id="icon3" alt="Miedo" src="images/icon_fear.svg">
                                    <img class="emotion_icon" id="icon4" alt="Tristeza" src="clmtrackr/examples/media/icon_sad.png">
                                    <img class="emotion_icon" id="icon5" alt="Sorpresa" src="clmtrackr/examples/media/icon_surprised.png">
                                    <img class="emotion_icon" id="icon6" alt="Alegría" src="clmtrackr/examples/media/icon_happy.png">
                                </div>
                    
                                <div id='emotion_chart'></div>
                    
                            </div>
                    
                            <div id="controls">
                    
                                <!-- start-button etiqueta-->
                                <!-- el onclick inicializa el rastreador con el video-->
                                <input class="btn btn-primary" type="button" value="cargando video" disabled="disabled" onclick="startVideo()" id="startbutton"></input>
          
                            </div>

               
       </div>
            
          
    
          
    
        
        </div>     
     <script src="js/cuerpo.js?v=7"> </script>
</body>



</html>




