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
}

let mapInit = async function() {
    map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/stephenson-heritage/cl2aikyg4000n15nuwwy5u72c',
        center: [-75.765, 45.456],
        zoom: 13.5
    });


    if ('permissions' in navigator) {
        let perm = await navigator.permissions.query({ name: 'geolocation' })
        if (perm.state == "granted") {
            if ('geolocation' in navigator) {
                // geo
                navigator.geolocation.getCurrentPosition(function(position) {
                    let pos = position.coords;
                    //console.log(pos.longitude, pos.latitude);

                    map.setCenter([pos.longitude, pos.latitude]);
                });

                // const locationWatch = navigator.geolocation.watchPosition((position) => {
                //     let pos = position.coords;
                //     map.setCenter([pos.longitude, pos.latitude]);
                // });
                //navigator.geolocation.clearWatch(locationWatch);

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
    map.setCenter([serverGeo.lng, serverGeo.lat]);
}

init();