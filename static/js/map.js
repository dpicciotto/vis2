/*
  General configuration values
*/
var origin_lat = -36
var origin_lon = -38

var tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
var attribution = '<a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'

var box_base = `
<div class="info-box">
  <h2 class="info-title">Proyecto Llaves para la Autonomía. UNICEF y DONCEL</h2>

  <div class="info-text in">
    <p>El proyecto apunta al desarrollo y fortalecimiento de políticas y prácticas institucionales que
       acompañen el egreso de los jóvenes de los Hogares del sistema de protección para la vida
       independiente.</p>

    <h3 class="info-title">El Proyecto en NÚMEROS (2016-2017)</h3>
    <ul>
      <li><i class="fa fa-check" aria-hidden="true"></i>7 provincias (Salta, Santiago del Estero, Misiones, Jujuy, Tucumán, Santa Fe, Buenos Aires)</li>
      <li><i class="fa fa-check" aria-hidden="true"></i>1966 participantes</li>
      <li><i class="fa fa-check" aria-hidden="true"></i>371 adolescentes y jóvenes</li>
      <li><i class="fa fa-check" aria-hidden="true"></i>88 actividades de capacitación realizadas</li>
      <li><i class="fa fa-check" aria-hidden="true"></i>Más de 60 hogares alcanzados</li>
      <li><i class="fa fa-check" aria-hidden="true"></i>3 Casas de pre-egreso en funcionamiento</li>
      <li><i class="fa fa-check" aria-hidden="true"></i>1 Comité de pre-egreso constituido</li>
      <li><i class="fa fa-check" aria-hidden="true"></i>11 adolescentes formados y capacitados</li>
      <li><i class="fa fa-check" aria-hidden="true"></i>3 jóvenes accedieron a un empleo formal</li>
      <li><i class="fa fa-check" aria-hidden="true"></i>Vínculos establecidos con 73 empresas</li>
      <li><i class="fa fa-check" aria-hidden="true"></i>Gestión de gabinetes tecnológicos</li>
      <li><i class="fa fa-check" aria-hidden="true"></i>Adquisición y distribución de 48 equipos de computación para hogares</li>
    </ul>

    <h5>Hace click sobre alguna de las provincias habilitadas para mas informacion</h5>
  </div><!--/info-text -->

  <div id="box-imgs">
  </div><!--/box-imgs -->

</div><!--/info-box -->
`;

/*
  Styles
*/
function getColor(d) {
    return d == "Jujuy"        ? '#e6ab02' :
           d == "Santa Fe"     ? '#66a61e' :
           d == "Misiones"     ? '#e7298a' :
           d == "Tucuman"      ? '#7570b3' :
           d == "Salta"        ? '#d95f02' :
                                 '#1b9e77';
}

function defaultStyle(feature) {
  return {
      color: "#2262CC",
      weight: 3,
      opacity: 0.6,
      fillOpacity: 1,
      fillColor: getColor(feature.properties.name),
      className: 'enableProvince'
  }
}

var disabledStyle = {
    color: "grey",
    weight: 0,
    opacity: 0,
    fillOpacity: 0.1,
    fillColor: "#2262CC",
    className: 'disabledProvince'
}

var highlightStyle = {
    color: '#2262CC',
    weight: 5,
    opacity: 0.6,
    fillOpacity: 0.65,
    fillColor: '#2262CC'
};

// Initialice the map
var map = L.map('map').setView([origin_lat, origin_lon], 5)
// Div info
var info = L.control()

// Add the tile
L.tileLayer(tileUrl, {
    attribution: attribution,
    maxZoom: 18
}).addTo(map)

// Load the provinces
var provincesLayer = new L.GeoJSON.AJAX("./data/provincias.geojson", {
    style: setStyle,
    onEachFeature: onEachFeature
})

// Personal button
L.easyButton('<img class="icon-info" src="static/imgs/110_UNICEF_ICON_REPORTING_CYAN.png">', function(){
  info._div.innerHTML = box_base
}).addTo(map);

/*
  Info div methods
*/
info.onAdd = function ( map ) {
    // create a div with a class "info"
    this._div = L.DomUtil.create( 'div', 'container info' )
    this._div.innerHTML = box_base
    return this._div
}

info.update = function ( e ) {
    // Method that we will use to update the control based on feature properties passed
    var properties = e.target.feature.properties

    if ( properties.isEnabled ) {
      div = document.getElementsByClassName('info-text')[0]
      div.classList.remove('in')
      div.innerHTML = properties.html_texto
      div.className += ' in'

      // add the imgs
      div = document.getElementById('box-imgs')
      div.innerHTML = properties.html_media


      // add the efect
      //box = document.getElementsByClassName('box')[0]
      //box.className += ' in'

      lightGallery(document.getElementById('lightgallery'))
      lightGallery(document.getElementById('video-gallery'))


    }
}

// Add to map
provincesLayer.addTo( map )
info.addTo( map )

/*

 */
function setStyle ( feature ) {
    // Set the style
    if ( feature.properties.isEnabled ) {
	     return defaultStyle(feature)
    }
    else {
	     return disabledStyle
    }
}

function onEachFeature ( feature, layer ) {
    // Set the event over each province
    layer.on({
	mouseover: highlightFeature,
	mouseout: resetHighlight,
	click: info.update
    });
}

function highlightFeature( e ) {
    // When the mouse put over a province, change the style
    var layer = e.target
    var properties = e.target.feature.properties

    if ( properties.isEnabled ) {
	layer.setStyle( highlightStyle )
    }
}

function resetHighlight( e ) {
    // When the mouse go out a provice, reset the style
    provincesLayer.resetStyle( e.target )
}
