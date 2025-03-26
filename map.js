require([
    "esri/config", "esri/Map", "esri/views/MapView", "esri/layers/FeatureLayer",
    "esri/widgets/BasemapToggle", "esri/widgets/BasemapGallery",
    "esri/widgets/Locate", "esri/widgets/ScaleBar", 
    "esri/widgets/Legend", "esri/widgets/Measurement",
    "esri/widgets/Search","esri/widgets/LayerList"
], function(esriConfig, Map, MapView, FeatureLayer, BasemapToggle, BasemapGallery, Locate, ScaleBar, Legend, Measurement, Search, LayerList) {

    esriConfig.apiKey = "AAPTxy8BH1VEsoebNVZXo8HurJqJHuAOWtOeDglllaI2VkGQJcsxVB5nwix6mkxlBH9hZ-AjnV_E71vEK23PSBKxb0vqgeVYKzwB9ZZxXHc5AI3T5Fkxeoj6pehBtt5Cl9Sy4HanCmXsGji5WoKczKyfznal2gcg_5E7nXLUk7rinUNslNDwpjsrPaH_6fcEnf5PrCSoutI49AX_50Bo1xATTQ4DI330jPPj7s9yTLhtghPTd1o750K3mFbhn8YFGxaBAT1_5EgyghtX";

    const map = new Map({
        basemap: "arcgis-topographic" // Fond de carte initial
    });

    const view = new MapView({
        map: map,
        center: [-7.62, 33.59], // Longitude, latitude
        zoom: 13, // Niveau de zoom
        container: "viewDiv"
    });
 
    
    
   // 📌 Ajout des couches SIG
    const communesLayer = new FeatureLayer({
        url: "https://services5.arcgis.com/WQJqoEEGmeDDlKau/arcgis/rest/services/commune_casa1/FeatureServer",
        title: "Limites des Communes",
        popupTemplate: {
            title: "{NOM_COMMUNE}", // Nom de la commune
            content: "Préfecture : {PREFECTURE} <br> Population 2004 : {TOTAL2004} <br> Population 1994 : {TOTAL1994}"
        }
        
         
    });

      

     

    
    
    
    
    const voirieLayer = new FeatureLayer({
        url: "https://services5.arcgis.com/WQJqoEEGmeDDlKau/arcgis/rest/services/voirie/FeatureServer",
        title: "Voirie",
        popupTemplate: {
            title: "{Nom}", 
            content: "Type de voie : {Type} <br> Longueur : {Longueur} m"
        }
        
    });
    
    /*const populationLayer = new FeatureLayer({
        url: "https://services5.arcgis.com/WQJqoEEGmeDDlKau/arcgis/rest/services/casapop1/FeatureServer",
        title: "Population",
        popupTemplate: {
            title: "Statistiques de {NOM_COMMUNE}",
            content: "Population en 2004 : {TOTAL2004} <br> Population en 1994 : {TOTAL1994} <br> Évolution : {evolution_}"
        }
    });*/

      const reclamationsLayer = new FeatureLayer({
        url: "https://services5.arcgis.com/WQJqoEEGmeDDlKau/arcgis/rest/services/reclamation/FeatureServer",
        title: "Reclamation",
        
    });

    

   

    const populationLayer = new FeatureLayer({
        url: "https://services5.arcgis.com/WQJqoEEGmeDDlKau/arcgis/rest/services/casapop1/FeatureServer",
        title: "Population",
        popupTemplate: {
            title: "Statistiques de {NOM_COMMUNE}",
            content: [{
                type: "media",
                mediaInfos: [{
                    type: "column-chart", 
                    caption: "Évolution de la population",
                    value: {
                        fields: ["TOTAL1994", "TOTAL2004"],
                        normalizeField: null,
                        tooltipField: "",
                    }
                }]
            }, {
                type: "text",
                text: "Population en 2004 : {TOTAL2004} <br> Population en 1994 : {TOTAL1994} <br> Évolution : {evolution_}"
            }]
        }
    });


   
    
    
    
   
    
    const hotelsLayer = new FeatureLayer({
        url: "https://services5.arcgis.com/WQJqoEEGmeDDlKau/arcgis/rest/services/hotels/FeatureServer",
        title: "Hôtels",
        renderer: {
            type: "simple",  // autocasts as new SimpleRenderer() 
            symbol: { 
                type: "simple-marker",  // autocasts as new SimpleMarkerSymbol() 
                size: 6, 
                color: "green", 
                outline: {  // autocasts as new SimpleLineSymbol() 
                    width: 0.5, 
                    color: "white" 
                } 
            }
        },
        popupTemplate: {
            title: "{HOTEL}",
            content: `
                <b>Catégorie:</b> {Etoile} étoiles <br>
                <b>Adresse:</b> {ADRESSE} <br>
                <b>Téléphone 1:</b> {PHONE1} <br>
                <b>Téléphone 2:</b> {PHONE_2} <br>
                <b>Capacité des chambres:</b> {CAP_CHAMBR} chambres <br>
                <b>Capacité en lits:</b> {CAP_LIT} lits <br>
                <b>Capacité de réunion:</b> {cap_reunio} personnes
            `
        }
    
    })
    
 
    
    const grandesSurfacesLayer = new FeatureLayer({
        url: "https://services5.arcgis.com/WQJqoEEGmeDDlKau/arcgis/rest/services/grands_surface/FeatureServer",
        title: "Grandes Surfaces",
        renderer: {
            type: "simple",  // autocasts as new SimpleRenderer() 
            symbol: { 
                type: "simple-marker",  // autocasts as new SimpleMarkerSymbol() 
                size: 6, 
                color: "red", 
                outline: {  // autocasts as new SimpleLineSymbol() 
                    width: 0.5, 
                    color: "white" 
                } 
            }
        },
        popupTemplate: {
            title: "{Nom_Surface}",
            content: "Type : {Type} <br> Superficie : {Superficie} m² <br> Adresse : {Adresse}"
        }
        
    });
    
    map.addMany([communesLayer, voirieLayer,reclamationsLayer, populationLayer, hotelsLayer, grandesSurfacesLayer]);
    
    // Basemap Toggle (bascule entre 2 fonds de carte)
    let basemapToggle = new BasemapToggle({
        view: view,  
        nextBasemap: "hybrid"
    });
    view.ui.add(basemapToggle, {
        position: "bottom-right",
        index: 2
    });

    // Basemap Gallery (liste de fonds de carte)
    let basemapGallery = new BasemapGallery({
        view: view
    });
    view.ui.add(basemapGallery, {
        position: "bottom-left",
        index: 3
    });

    // Liste déroulante pour changer le fond de carte
    let basemapSelect = document.createElement("select");
    basemapSelect.id = "basemapSelect";
    basemapSelect.innerHTML = `
        <option value="arcgis-topographic">Topographique</option>
        <option value="streets">Rues</option>
        <option value="satellite">Satellite</option>
        <option value="hybrid">Satellite + Labels</option>
        <option value="dark-gray">Gris foncé</option>
        <option value="osm">OpenStreetMap</option>
    `;
    
    // Modifier le fond de carte
    basemapSelect.addEventListener("change", function() {
        map.basemap = basemapSelect.value;
    });
    
    view.ui.add(basemapSelect, "top-left");


   

    // Outil de localisation
    let locateWidget = new Locate({
        view: view
    });
    view.ui.add(locateWidget, "top-left");

    // Barre d'échelle
    let scaleBar = new ScaleBar({
        view: view
    });
    view.ui.add(scaleBar, "bottom-right");

  

    /*// 🔍 Widget de recherche
    let searchWidget = new Search({
        view: view
    });
    view.ui.add(searchWidget, {
        position: "top-left", index: 1
    });*/

     // 📋 Liste des couches
     const layerList = new LayerList({
        view: view
    });
    view.ui.add(layerList, "top-right");

       // 🏷️ Légende
       const legend = new Legend({
        view: view
    });
    view.ui.add(legend, {
        position: "bottom-left",
        index: 4
    }); 

  // Widget de recherche
  const searchWidget = new Search({
    view: view,
    sources: [{
        layer: communesLayer, // Couches à rechercher
        searchFields: ["NOM_COMMUNE"], // Champs de recherche
        displayField: "NOM_COMMUNE",
        exactMatch: false,
        outFields: ["NOM_COMMUNE", "PREFECTURE", "TOTAL2004", "TOTAL1994"],
        name: "Recherche de communes"
    },{
        layer: hotelsLayer, // Couches à rechercher
        searchFields: ["Nom_Hotel"],
        displayField: "Nom_Hotel",
        exactMatch: false,
        outFields: ["Nom_Hotel", "Etoile", "Adresse", "Capacite"],
        name: "Recherche d'hôtels"
    }]
});

view.ui.add(searchWidget, {
    position: "top-left", index: 1
});
/*
 // Définition des filtres
 const sqlExpressions = [
    "------ Choisir un filtre -----",
    "--- Par Préfecture ---",
    "PREFECTURE = 'CASABLANCA'",
    "PREFECTURE = 'PROVINCE DE MEDIOUNA'",
    "--- Par Commune/Arrondissement ---",
    "COMMUNE = 'SIDI BERNOUSSI'",
    "COMMUNE = 'MOHAMMEDIA'",
    "--- Par Surface ---",
    "Shape_Area <= 1000000",
    "Shape_Area > 1000000 AND Shape_Area <= 5000000",
    "Shape_Area > 5000000 AND Shape_Area <= 10000000",
    "Shape_Area > 10000000 AND Shape_Area <= 20000000",
    "Shape_Area > 20000000",
    "--- Population 2004 ---",
        "TOTAL2004 <= 50000",
        "TOTAL2004 > 50000 AND TOTAL2004 <= 100000",
        "TOTAL2004 > 100000 AND TOTAL2004 <= 200000",
        "TOTAL2004 > 200000 AND TOTAL2004 <= 500000",
        "TOTAL2004 > 500000",
        "--- Population 1994 ---",
        "TOTAL1994 <= 50000",
        "TOTAL1994 > 50000 AND TOTAL1994 <= 100000",
        "TOTAL1994 > 100000 AND TOTAL1994 <= 200000",
        "TOTAL1994 > 200000 AND TOTAL1994 <= 500000",
        "TOTAL1994 > 500000",
        "--- Évolution 1994-2004 ---",
        "evolution_ > 0 AND evolution_ <= 10000",
        "evolution_ > 10000 AND evolution_ <= 50000",
        "evolution_ > 50000 AND evolution_ <= 100000",
        "evolution_ > 100000"
  ];

  // Création du menu déroulant
  const selectFilter = document.createElement("select");
  selectFilter.style.padding = "5px";
  selectFilter.style.fontSize = "14px";

  sqlExpressions.forEach(function (sql) {
    let option = document.createElement("option");
    option.value = sql.includes("---") ? "" : sql;
    option.innerHTML = sql;
    if (sql.includes("---")) {
      option.disabled = true; // Désactiver les catégories
      option.style.fontWeight = "bold";
    }
    selectFilter.appendChild(option);
  });

  view.ui.add(selectFilter, "top-right");

*/
// Définition des filtres combinés
const sqlExpressions = [
    "------ Choisir un filtre -----",
    "--- Par Préfecture ---",
    "PREFECTURE = 'CASABLANCA'",
    "PREFECTURE = 'PROVINCE DE MEDIOUNA'",
    "--- Par Commune/Arrondissement ---",
    "COMMUNE = 'SIDI BERNOUSSI'",
    "COMMUNE = 'MOHAMMEDIA'",
    "--- Par Surface ---",
    "Shape_Area <= 1000000",
    "Shape_Area > 1000000 AND Shape_Area <= 5000000",
    "Shape_Area > 5000000 AND Shape_Area <= 10000000",
    "Shape_Area > 10000000 AND Shape_Area <= 20000000",
    "Shape_Area > 20000000",
    "--- Population 2004 ---",
    "TOTAL2004 <= 50000",
    "TOTAL2004 > 50000 AND TOTAL2004 <= 100000",
    "TOTAL2004 > 100000 AND TOTAL2004 <= 200000",
    "TOTAL2004 > 200000 AND TOTAL2004 <= 500000",
    "TOTAL2004 > 500000",
    "--- Population 1994 ---",
    "TOTAL1994 <= 50000",
    "TOTAL1994 > 50000 AND TOTAL1994 <= 100000",
    "TOTAL1994 > 100000 AND TOTAL1994 <= 200000",
    "TOTAL1994 > 200000 AND TOTAL1994 <= 500000",
    "TOTAL1994 > 500000",
    "--- Évolution 1994-2004 ---",
    "evolution_ > 0 AND evolution_ <= 10000",
    "evolution_ > 10000 AND evolution_ <= 50000",
    "evolution_ > 50000 AND evolution_ <= 100000",
    "evolution_ > 100000"
];

// Création du menu déroulant
const selectFilter = document.createElement("select");
selectFilter.style.padding = "5px";
selectFilter.style.fontSize = "14px";

sqlExpressions.forEach(function (sql) {
    let option = document.createElement("option");
    option.value = sql.includes("---") ? "" : sql;
    option.innerHTML = sql;
    if (sql.includes("---")) {
        option.disabled = true; // Désactiver les catégories
        option.style.fontWeight = "bold";
    }
    selectFilter.appendChild(option);
});

// Ajout du menu à l'interface
view.ui.add(selectFilter, "top-right");

// Fonction d'application du filtre
function setFeatureLayerFilter(expression) {
    populationLayer.definitionExpression = expression || ""; // Appliquer ou réinitialiser le filtre
}

// Écouteur d'événement pour appliquer le filtre
selectFilter.addEventListener("change", function (event) {
    setFeatureLayerFilter(event.target.value);
});



/*

  // Filtrage des hôtels en fonction de l'étoile sélectionnée
hotelSelect.addEventListener("change", function(event) {
    let starRating = event.target.value;
    if (starRating) {
        hotelsLayer.definitionExpression = `Etoile = ${starRating}`;
    } else {
        hotelsLayer.definitionExpression = ""; // Réinitialiser le filtre
    }
});

  // Fonction d'application du filtre
  function setFeatureLayerFilter(expression) {
    communesLayer.definitionExpression = expression || ""; // Appliquer ou réinitialiser le filtre
    populationLayer.definitionExpression = expression || "";
  }

  // Écouteur d'événement pour appliquer le filtre
  selectFilter.addEventListener("change", function (event) {
    setFeatureLayerFilter(event.target.value);
  });

// Create a select dropdown for hotel star rating
const hotelSelect = document.createElement("select");
hotelSelect.style.position = "absolute";
hotelSelect.style.top = "10px";
hotelSelect.style.right = "10px";
hotelSelect.style.padding = "5px";
hotelSelect.innerHTML = `
    <option value="">-- Sélectionnez une catégorie d'hôtel --</option>
    <option value="1">1 étoile</option>
    <option value="2">2 étoiles</option>
    <option value="3">3 étoiles</option>
    <option value="4">4 étoiles</option>
    <option value="5">5 étoiles</option>
`;


// Create a select dropdown for grandes surfaces type
const grandesSurfacesSelect = document.createElement("select");
grandesSurfacesSelect.style.position = "absolute";
grandesSurfacesSelect.style.top = "50px"; // Adjusted position to not overlap the hotel select
grandesSurfacesSelect.style.right = "10px";
grandesSurfacesSelect.style.padding = "5px";
grandesSurfacesSelect.innerHTML = `
    <option value="">-- Sélectionnez un type de grande surface --</option>
    <option value="Marjane">Marjane</option>
    <option value="Metro">Metro</option>
    <option value="Acima">Acima</option>
    <option value="Label Vie">Label Vie</option>
    <option value="Twin Center">Twin Center</option>
`;

document.body.appendChild(hotelSelect);
document.body.appendChild(grandesSurfacesSelect);

// Apply filter for hotels based on category (Etoile)
hotelSelect.addEventListener("change", function (event) {
    const starRating = event.target.value;
    let whereClause = starRating ? `Etoile = ${starRating}` : "";

    hotelsLayer.definitionExpression = whereClause;
});*/

// Create a select dropdown for hotel star rating
const hotelSelect = document.createElement("select");
hotelSelect.style.position = "absolute";
hotelSelect.style.top = "10px";
hotelSelect.style.right = "10px";
hotelSelect.style.padding = "5px";
hotelSelect.innerHTML = `
    <option value="">-- Sélectionnez une catégorie d'hôtel --</option>
    <option value="1">1 étoile</option>
    <option value="2">2 étoiles</option>
    <option value="3">3 étoiles</option>
    <option value="4">4 étoiles</option>
    <option value="5">5 étoiles</option>
`;

// Create a select dropdown for grandes surfaces type
const grandesSurfacesSelect = document.createElement("select");
grandesSurfacesSelect.style.position = "absolute";
grandesSurfacesSelect.style.top = "50px"; // Adjusted position to not overlap the hotel select
grandesSurfacesSelect.style.right = "10px";
grandesSurfacesSelect.style.padding = "5px";
grandesSurfacesSelect.innerHTML = `
    <option value="">-- Sélectionnez un type de grande surface --</option>
    <option value="Marjane">Marjane</option>
    <option value="Metro">Metro</option>
    <option value="Acima">Acima</option>
    <option value="Label Vie">Label Vie</option>
    <option value="Twin Center">Twin Center</option>
`;

document.body.appendChild(hotelSelect);
document.body.appendChild(grandesSurfacesSelect);

// Apply filter for hotels based on category (Etoile)
hotelSelect.addEventListener("change", function (event) {
    const starRating = event.target.value;
    let whereClause = starRating ? `Etoile = ${starRating}` : "";

    hotelsLayer.definitionExpression = whereClause;
});

// Apply filter for grandes surfaces based on type
grandesSurfacesSelect.addEventListener("change", function (event) {
    const surfaceType = event.target.value;
    let whereClause = surfaceType ? `Type = '${surfaceType}'` : "";

    grandesSurfacesLayer.definitionExpression = whereClause;
});

// Popup configuration
const popupTemplate = {
    title: "{HOTEL}",
    content: "{ADRESSE}"
};

hotelsLayer.popupTemplate = popupTemplate;
grandesSurfacesLayer.popupTemplate = popupTemplate;

/*
// Apply filter for grandes surfaces based on type
grandesSurfacesSelect.addEventListener("change", function (event) {
    const surfaceType = event.target.value;
    let whereClause = surfaceType ? `Type = '${surfaceType}'` : "";

    grandesSurfacesLayer.definitionExpression = whereClause;
});

// Popup configuration
const popupTemplate = {
    title: "{HOTEL}",
    content: "{ADRESSE}"
};

hotelsLayer.popupTemplate = popupTemplate;
grandesSurfacesLayer.popupTemplate = popupTemplate;
*/
// Création du menu déroulant (Select)
const select = document.createElement("select");
select.style.position = "absolute";
select.style.top = "10px";
select.style.right = "10px";
select.style.padding = "5px";

sqlQueries.forEach(query => {
    let option = document.createElement("option");
    option.value = query;
    option.innerHTML = query;
    select.appendChild(option);
});

document.body.appendChild(select);

// Fonction pour exécuter la requête SQL
function queryFeatureLayer(extent) {
    const parcelQuery = {
        where: whereClause,  // Défini par le select
        geometry: extent,     // Restreint à l'étendue visible de la carte
        outFields: ["PREFECTURE", "COMMUNE_AR", "PLAN_AMENA", "Shape_Area"],
       
        returnGeometry: true
    };

    featureLayer.queryFeatures(parcelQuery)
        .then((results) => {
            displayResults(results);
        })
        .catch((error) => {
            console.log(error);
        });
}

// Fonction pour afficher les résultats
function displayResults(results) {
    // Style des polygones
    const symbol = {
        type: "simple-fill",
        color: [226, 135, 67],
        outline: { color: "black", width: 1 }
    };

    const popupTemplate = {
        title: "Commune {COMMUNE_AR}",
        content: "Préfecture : {PREFECTURE} <br> Plan d'Aménagement : {PLAN_AMENA} <br> Surface : {Shape_Area}"
    };

    // Appliquer le style et la popup aux entités retournées
    results.features.map((feature) => {
        feature.symbol = symbol;
        feature.popupTemplate = popupTemplate;
        return feature;
    });

    // Nettoyage avant d'afficher les nouveaux résultats
    view.popup.close();
    view.graphics.removeAll();
    view.graphics.addMany(results.features);
}

// Écouteur d'événements pour changer le filtre
select.addEventListener('change', (event) => {
    whereClause = event.target.value;
    queryFeatureLayer(view.extent);
});

});


   
    
      
   
    
    






