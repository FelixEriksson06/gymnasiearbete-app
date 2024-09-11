function initMap() {
    // Default location (center of the world)
    const defaultLocation = { lat: 0, lng: 0 };
  
    // Create a new map centered at the default location
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 3,
      center: defaultLocation,
    });
  
    // Create the Places service object
    const service = new google.maps.places.PlacesService(map);
  
    // Check if the browser supports geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
  
          // Update map center to user's location
          map.setCenter(userLocation);
          map.setZoom(11);
  
          // Search for specific places (e.g., McDonald's) nearby
          const request = {
            location: userLocation,
            radius: "10000", // Search within 5 km radius
            keyword: "McDonald's Max mcdonalds ", // Search for McDonald's
          };
  
          // Perform nearby search
          service.nearbySearch(request, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
              // Loop through the results and create markers
              results.forEach((place) => {
                createMarker(place, map);
              });
            } else {
              alert("No McDonald's found nearby");
            }
          });
        },
        () => {
          handleLocationError(true, map.getCenter());
        }
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, map.getCenter());
    }
  }

  // Create a marker for a place
function createMarker(place, map) {
    if (!place.geometry || !place.geometry.location) return;
  
    const marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location,
      title: place.name,
    });
  
    const infoWindow = new google.maps.InfoWindow({
      content: `<h3>${place.name}</h3><p>${place.vicinity}</p>`,
    });
  
    // Show info window on click
    marker.addListener("click", () => {
      infoWindow.open(map, marker);
    });
  }
  
  // Handle errors with geolocation
  function handleLocationError(browserHasGeolocation, pos) {
    const errorMsg = browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation.";
  
    const infoWindow = new google.maps.InfoWindow({
      content: errorMsg,
      position: pos,
    });
  
    infoWindow.open(map);
  }