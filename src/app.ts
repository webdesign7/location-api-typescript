import axios from 'axios'

const form = document.querySelector('form')!;
const addressInput = document.getElementById('address')! as HTMLInputElement;

const GOOGLEA_API_KEY = 'AIzaSyChcy9ffqBM0rzT5TzwW6BVxXG0pbD72fs';

declare var google: any

type GoogleGeocodeResponse = {
    results:{geometry:{location: {lat:number, lng:number}}}[];
    status: 'OK' | 'ZERO_RESULTS';
};

function searchAddressHandler(event: Event) {
    event.preventDefault();
    const address = addressInput.value;
    console.log(address);

    const google_url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(address)}&key=${GOOGLEA_API_KEY}
`;
    axios.get<GoogleGeocodeResponse>(google_url)
    .then(async response => {
        if (response.data.status !== 'OK') {
            throw new Error('The request did not succeede');
        }
        
        console.log(response.data.results[0].geometry.location.lat);


        // Request needed libraries.
        //@ts-ignore
        const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
        const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");


        // The map, centered at Uluru
        const map = new Map(
            document.getElementById('map') as HTMLElement,
            {
            zoom: 4,
            center: response.data.results[0].geometry.location,
            mapId: 'map',
            }
        );

        // The marker, positioned at Uluru
        new AdvancedMarkerElement({
            map: map,
            position: response.data.results[0].geometry.location,
            title: 'Uluru'
        });


    }).catch(error => {
        alert(error.message);
        console.log(error);
    });
}

form.addEventListener('submit', searchAddressHandler);