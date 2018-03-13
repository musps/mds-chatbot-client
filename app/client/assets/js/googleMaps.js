const calculateAndDisplayRoute = (directionsService, directionsDisplay, pointA, pointB) => {
  directionsService.route({
    'origin': pointA,
    'destination': pointB,
    'travelMode': google.maps.TravelMode.DRIVING
  }, (response, status) => {
    if (status === google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
    }
  });
};

const initMap = (tpl, coords) => {
  const pointA = new google.maps.LatLng(coords.start_latitude, coords.start_longitude);
  const pointB = new google.maps.LatLng(coords.end_latitude, coords.end_longitude);
  const myOptions = {
    'zoom': 7,
    'center': pointA
  };
  const map = new google.maps.Map(tpl, myOptions);
  const directionsService = new google.maps.DirectionsService();
  const directionsDisplay = new google.maps.DirectionsRenderer({'map': map});

  // ---> get route from A to B
  calculateAndDisplayRoute(directionsService, directionsDisplay, pointA, pointB);
};

module.exports = {
  'initMap': initMap,
  'calculateAndDisplayRoute': calculateAndDisplayRoute
};
