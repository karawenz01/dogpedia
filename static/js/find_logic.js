// Creating map object
var myMap = L.map('map').setView([37.8, -96], 4);

// adding tile layer
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + API_KEY, {
    id: 'mapbox.streets',
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoon: 18
}).addTo(myMap);

console.log("I am working!")

// Link to GeoJSON
var StatesData

d3.json("/states").then(data => {
    StatesData = L.geoJson(data).addTo(myMap);
    StatesData.addData(geojsonFeature);  
    console.log(data)  
}) 


var geojson;

// Use the pet_stores geojson data
d3.json('/states', function(data) {
    console.log(data);

    // Create a new choropleth layer
    geojson = L.choropleth(data, {

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
        onEachFeature: function(feature, layer) {
            layer.bindPopup(feature.properties.NAME + ": " + feature.properties.BUSINESS);
        }
    }).addTo(myMap);

});

/* Kara and McKenzi Worked
// Survey variable
document.addEventListener('DOMContentLoaded', bindButtons);

function bindButtons(){
    document.getElementById('submitbreed').addEventListener('click', function(event){
        console.log("####")
        event.preventDefault();
        var apt = document.getElementById("apt").value;
        var train = document.getElementById("train").value;
        var quiet = document.getElementById("quiet").value;
        var highEnergy = document.getElementById("high").value;
        var lowEnergy = document.getElementById("low").value;
        var shed = document.getElementById("shed").value;
        var alone = document.getElementById("alone").value;
        var experienced = document.getElementById("experienced").value;
        var inexperienced = document.getElementById("inexperienced").value;

        var dict = []; // create an empty array
                
        dict.push({
            apt_ans: apt,
            train_ans: train,
            quiet_ans: quiet,
            highEnergy_ans: highEnergy,
            lowEnergy_ans: lowEnergy,
            shed_ans: shed,
            alone_ans: alone,
            exp_ans: experienced,
            inexp_ans: inexperienced
        })
                    
        console.log(dict)
    })
} 
*/

// the following code returns a table of breeds matching the form input values
d3.select("#submitbreed").on("click", function () {
    d3.event.preventDefault();
  
    // var apt = d3.select("#apt").property("value");
    // var energy = d3.select("#energy").property("value");
    // var shed = d3.select("#shed").property("value");

    let apt_sel = document.getElementById('apt');
    var apt = apt_sel.options[apt_sel.selectedIndex].value

    let energy_sel = document.getElementById('energy');
    var energy = energy_sel.options[energy_sel.selectedIndex].value

    let shed_sel = document.getElementById('shedd');
    var shed = shed_sel.options[shed_sel.selectedIndex].value
    
    console.log(apt)
    console.log(energy)
    console.log(shed)

    var find_breed_url = `/find_breed?apt=${apt}&energy=${energy}&shed=${shed}`;
    console.log(find_breed_url)
  
    d3.json(find_breed_url).then(results => {

      var apt_friendly = results.apt_friendly;
      var breed = results.breed;
      var energy = results.energy;
      var shedding = results.shedding;

      var num_of_results = results.breed.length;

      var table_div = d3.select("#breed_table");
      table_div.html("");
      var table = table_div.append("table");

      var thead = table.append("thead").append("tr");
      thead.append("th").text("Breed");
      thead.append("th").text("Apt Adaptability");
      thead.append("th").text("Energy Level");
      thead.append("th").text("Shedding Level");

      var tbody = table.append("tbody");
      console.log("there are " + num_of_results + " results")
      for(var i=0; i<num_of_results; i++) {
        var row = tbody.append("tr");
        row.append("td").text(breed[i]);
        row.append("td").text(apt_friendly[i]);
        row.append("td").text(energy[i]);
        row.append("td").text(shedding[i]);
      }
    });
  });

