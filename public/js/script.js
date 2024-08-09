const socket = io();
if (navigator.geolocation) {
    navigator.geolocation.watchPosition((position) => {
        const { latitude, longitude } = position.coords
        socket.emit('send-location', { latitude: latitude, longitude: longitude });
    }, (error) => {
        console.error(error)
    },
        {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 5000
        });
}
else {
    alert("Geolocation is not supported by this browser.");
}

let map = L.map("map").setView([0, 0], 10);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attributation: "Indal Singh"
}).addTo(map)

const markers = {}

socket.on("recived-location", (data) => {
    const { id, latitude, longitude } = data;
    map.setView([latitude, longitude], 16);
    if (!markers[id]) {
        const marker = L.marker([latitude, longitude]).addTo(map);
        markers[id] = marker
    }
    else {
        markers[id].setLatLng([latitude, longitude])
    }

})

socket.on("user-desconnected",(id)=>{
    if(markers[id])
    {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
    console.log("user disconnected")

})