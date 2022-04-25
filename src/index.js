import "./css/styles.css";
import layoutTemplate from "./hbs/layout.hbs";
import mapTemplate from "./hbs/map.hbs";


import module from "./js/module";


const appEl = document.getElementById("app");


const siteInfo = { title: "Sample WebPack+Handlebars Frontend" };
window.document.title = siteInfo.title;

appEl.innerHTML = layoutTemplate(siteInfo);
const contentEl = document.getElementById("content-pane");

contentEl.innerHTML = mapTemplate();


mapboxgl.accessToken = "pk.eyJ1Ijoic3RlcGhlbnNvbi1oZXJpdGFnZSIsImEiOiJjanZ4ejlxazMwYWRlNDhrOHJxN2hlZGl5In0.GvwpDRkNHQKPfS8S2SA4Dg";
let map;


let init = async function() {
    mapInit();

    document.getElementById("showMe").addEventListener("click", () => {
        if (map != null) {
            map.flyTo({ center: map.appSettings.user.position }, );
            map.appSettings.user.marker.togglePopup();
        }
    });
}

let mapInit = async function() {
    map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/stephenson-heritage/cl2aikyg4000n15nuwwy5u72c',
        center: [-75.765, 45.456],
        zoom: 13.5
    });

    map.appSettings = {
        user: {
            position: [0, 0]
        }
    };


    if ('permissions' in navigator) {
        let perm = await navigator.permissions.query({ name: 'geolocation' })
        if (perm.state == "granted") {
            if ('geolocation' in navigator) {
                // geo
                navigator.geolocation.getCurrentPosition(function(position) {
                    let pos = position.coords;
                    //console.log(pos.longitude, pos.latitude);

                    onLocateUser([pos.longitude, pos.latitude]);
                });


            } else {
                // no geo
                serverGeolocate();
            }
        } else {
            serverGeolocate();
        }
    } else {
        serverGeolocate();
    }


}


let serverGeolocate = async function() {
    let serverGeo = await (await fetch("http://localhost:3000/api/location")).json();
    //console.log(serverGeo);
    onLocateUser(
        [serverGeo.longitude, serverGeo.latitude]
    );
}

let onLocateUser = function(location) {
    map.appSettings.user.position = location;
    map.setCenter(location);
    map.appSettings.user.marker = new mapboxgl.Marker({ color: "#aa1acd" })
        .setLngLat(location)
        .setPopup(new mapboxgl.Popup().setHTML("<h1>Hello World!</h1>"))
        .addTo(map);
}

init();