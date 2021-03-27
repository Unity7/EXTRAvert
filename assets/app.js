//  -----------------------------  Variables Section ----------------------------- //
$searchInput = $("#search-input");
$searchButton = $("#search-btn");
$searchItems = $("#search-history-items");
$eventsBtn = $("#events-btn");
$flightsBtn = $("#flights-btn");
$hotelsBtn = $("#hotels-btn");
$resultItems = $("#result-items");

cities = [];
var searchInput, searchTerm;

//  -----------------------------  Functions ----------------------------- //

//Function to Execute Once "submit" has been clicked on search box//
function getSearchTerm() {
  event.preventDefault();
  searchInput = $searchInput.val();
  console.log(searchInput);

  // getFlights()
  // getEvents()
  // getHotels()
}

//Uses API to get Flights//
function getFlights() {
  //fetch Data
  console.log("Getting Flights");

  //display Data
  // displayResults(data);
}

//Uses API to get Events//
function getEvents() {
  console.log("Getting Events");

  //display Data
  // displayResults(data);
}

//Uses API to get Hotels//
function getHotels() {
  console.log("Getting Hotels");

  //display Data
  // displayResults(data);
}

function displayResults(data) {
  console.log("Displaying Results");
}
//  -----------------------------  Event Listeners ----------------------------- //
$searchButton.on("click", getSearchTerm);
