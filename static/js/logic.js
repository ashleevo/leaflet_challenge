let earthquakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

//base layer to generate map
let baseLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});


let myMap = L.map("map", {
    center: [37.807246697771554, -122.43170695660642],
    zoom: 6,
    layers: [baseLayer]
});

//adding legend
var legend = L.control({position: 'bottomright'});

//creating markers information for each earthquake incidence
function getMarkers(){

    d3.json(`${earthquakeURL}`).then(function (data) {
        renderMarkers(data); 
    }).catch((e) => {
        console.log(e)
    });
}

//rendering the markers for each incidence so each circle will be proprotionate to the size of the magnitude
function renderMarkers(data){
    points = data.features
    console.log(points)
    for (i=0; i < points.length; i++) {
        let lon = points[i].geometry.coordinates[0];
        let lat = points[i].geometry.coordinates[1];
        let depth = points[i].geometry.coordinates[2];
        let magnitude = points[i].properties.mag;
        let circle = L.circle([lat, lon], {
            weight:1,
            color: 'black',
            fillOpacity:1,
            fillColor: getColor(depth),
            radius: points[i].properties.mag*10000
        });
//adding a pop up message to each marker for users to click and explore more specific information
        circle.bindPopup(`Latitude: ${lat}<br>Longitude: ${lon}<br>Depth: ${depth} km<br>Magnitude: ${magnitude}`).addTo(myMap);
    }
}


//legend formatting
legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
        grades = [-10, 10, 30, 50, 70, 90], 
        labels = [];
    // legend colors
    for (var i = 0; i < grades.length; i++) {
        var from = grades[i];
        var to = grades[i + 1];
        labels.push(
            '<i style="background:' + getColor(from) + '"></i> ' + 
            from + (to ? '&ndash;' + to : '+'));
    }
    div.innerHTML = labels.join('<br>');
    return div;
};

function getColor(d) {
    return d >= 90 ? '#ff0000' :
           d >= 70 ? '#ff4800':
           d >= 50 ? '#ffae00' :
           d >= 30 ? '#ffbb00' :
           d >= 10 ? '#fffb00' :
                    '#5eff00' ; 
}


getMarkers();
legend.addTo(myMap);