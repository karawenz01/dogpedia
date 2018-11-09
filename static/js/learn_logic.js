function buildBar(breed) {
  d3.json(`/breed_traits/${breed}`).then((trait) => {
    
    console.log(trait)

    var data = [
      {
        x: ["Energy Level", "Shedding Level", "Apt Adoptability"],
        y: [trait.energy, trait.shedding, trait.apt_friendly],
        type: 'bar'
      }
    ];

    Plotly.newPlot('buildBar', data);

  });
}


function buildPlot(breed) {
  /* data route */
d3.json(`/time_money/${breed}`).then(function(response) {

  console.log(response);

  var time_samples = {
    y: response.time,
    boxpoints: 'all',
    jitter: 0.3,
    pointpos: -1.8,
    type: 'box',
    marker: {
      color: 'rgb(214,12,140)'
    }
  };

  var spending_samples = {
    y: response.money,
    boxpoints: 'all',
    jitter: 0.3,
    pointpos: -1.8,
    type: 'box',
    marker: {
      color: "rgb(0,128,128)"
    }
  };

  var time_data = [time_samples];
  var spending_data = [spending_samples];

  var str1 = "People who have ";
  var str2 = " spend x hrs with their dog(s) per day";
  var str3 = " spend $x on their dog(s) per month"

  var time_layout = {
    title: str1.concat(response.breed,str2),
    xaxis: {
      title: response.breed
    },
    yaxis: {
      title: "Daily spending Hours the user responded"
    }
  };

  var money_layout = {
    title: str1.concat(response.breed,str3),
    xaxis: {
      title: response.breed
    },
    yaxis: {
      title: "Monthly spending the user responded"
    }
  };

  Plotly.newPlot("buildPlotTime", time_data, time_layout);
  Plotly.newPlot("buildPlotMoney", spending_data, money_layout);
});
}


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/breeds").then((breeds) => {
    breeds.forEach((breed) => {
      selector
        .append("option")
        .text(breed)
        .property("value", breed);
      console.log(breed)
    });

    // Use the first breed from the list to build the initial plots
    const firstSample = breeds[0];
    buildBar(firstSample);
    buildPlot(firstSample);
  });
}


function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildBar(newSample);
  buildPlot(newSample);
}


init();