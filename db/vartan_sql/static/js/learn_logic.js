function buildBar(breed) {
  d3.json(`/breed_traits/${breed}`).then(trait => {
    var data = [{
      x: ["Energy Level", "Shedding Level", "Apt Friendliness"],
      y: [trait.energy, trait.shedding, trait.apt_friendly],
      type: 'bar'
    }];

    var layout = {
      yaxis: { range: [0, 5] }
    };

    Plotly.newPlot('buildBar', data, layout);
  });
}


function buildPlot(breed) {
  d3.json(`/time_money/${breed}`).then(response => {
    var times = [];
    response.forEach(breed => {
      times.push(breed.time);
    });

    var spending = [];
    response.forEach(breed => {
      spending.push(breed.money);
    });

    var time_data = [{
      y: times,
      boxpoints: 'all',
      jitter: 0.3,
      pointpos: -1.8,
      type: 'box',
      marker: { color: 'rgb(214,12,140)' }
    }];

    var spending_data = [{
      y: spending,
      boxpoints: 'all',
      jitter: 0.3,
      pointpos: -1.8,
      type: 'box',
      marker: { color: "rgb(0,128,128)" }
    }];

    var str1 = "People who have ";
    var str2 = " spend x hrs with their dog(s) per day";
    var str3 = " spend $x on their dog(s) per month"

    var time_layout = {
      title: str1.concat(breed, str2),
      xaxis: { title: breed },
      yaxis: { title: "Daily Spending in Hours" }
    };

    var money_layout = {
      title: str1.concat(breed, str3),
      xaxis: { title: breed },
      yaxis: { title: "Monthly Spending in Dollars" }
    };

    Plotly.newPlot("buildPlotTime", time_data, time_layout);
    Plotly.newPlot("buildPlotMoney", spending_data, money_layout);
  });
}


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/breeds").then(breeds => {
    breeds.forEach(breed => {
      selector
        .append("option")
        .text(breed["breed"])
        .property("value", breed["breed"]);
    });

    // Use the first breed from the list to build the initial plots
    const firstSample = breeds[0]["breed"];
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
