// map object
var map = L.map('map').setView([37.8, -96], 4);


// tile layer
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + API_KEY, {
  id: 'mapbox.light',
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoon: 18
}).addTo(map);


var geojson;


// use the pet_stores GeoJSON data
d3.json('/states').then(data => {
  console.log(data);

  L.geoJSON(data).addTo(map);

  // Create a new choropleth layer
  L.choropleth(data, {

    // Define what property in the features to use
    valueProperty: "BUSINESS",

    // Set color scale
    scale: ["#ffffb2", "#b10026"],

    // Number of breaks in step range
    steps: 100,

    // q for quartile, e for equidistant, k for k-means
    // mode: "q",
    style: {
      // Border color
      color: "#fff",
      weight: 1,
      fillOpacity: 0.8
    },

    // Binding a pop-up to each layer
    onEachFeature: function (feature, layer) {
      layer.bindPopup(feature.properties.NAME + ": " + feature.properties.BUSINESS);
    }
  }).addTo(myMap);
});


// the following code returns a table of breeds matching the form input values
d3.select("#submitbreed").on("click", function () {
  d3.event.preventDefault();

  var apt = d3.select("input[name='apt']:checked").property("value");
  var energy = d3.select("input[name='energy']:checked").property("value");
  var shed = d3.select("input[name='shed']:checked").property("value");

  var find_breed_url = `/find_breed?apt=${apt}&energy=${energy}&shed=${shed}`;

  d3.json(find_breed_url).then(results => {
    var table_div = d3.select("#breed_table");
    table_div.html("");
    var table = table_div.append("table");

    var thead = table.append("thead").append("tr");
    thead.append("th").text("Breed");
    thead.append("th").text("Apt Friendly");
    thead.append("th").text("Energy");
    thead.append("th").text("Shedding");

    var tbody = table.append("tbody");

    results.forEach(breed => {
      var row = tbody.append("tr");
      row.append("td").text(breed["breed"]);
      row.append("td").text(breed["apt_friendly"]);
      row.append("td").text(breed["energy"]);
      row.append("td").text(breed["shedding"]);
    });
  });
});
