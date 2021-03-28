//  -----------------------------  Variables Section ----------------------------- //
$searchInput = $("#search-input");
$searchButton = $("#search-btn");
$searchItems = $("#search-history-items");
$eventsBtn = $("#events-btn");
$flightsBtn = $("#flights-btn");
$hotelsBtn = $("#hotels-btn");
$resultItems = $("#result-items");
$resultsContainer = $("#results-container");
$resultsHeader = $("#results-header");
$resultsMain = $("#results-main");
$resultsHeaderSearch = $("#results-header-2");

cities = [];
var searchInput,
  searchTerm,
  destinationCity,
  $flightDate,
  origin,
  destination,
  price,
  carrier,
  errorMessage;

//  -----------------------------  Functions ----------------------------- //

//Function to Execute Once "submit" has been clicked on search box// FUNCTION -- CITY SEARCH SUBMIT BUTTON
function getSearchTerm() {
  event.preventDefault();
  searchInput = $searchInput.val();
  // console.log(searchInput);

  // Note: in each function below make you tab's li class active to change tab highlighted
  // getFlights();
  // getEvents()
  // getHotels()
}

// ------  Function to display error messages on the results ------  // FUNCTION -- DISPLAY ERROR MESSAGE

function displayError(message) {
  $messageDiv = $("<div>").addClass("display");
  $messageheader = $("<h2>").addClass("display");
  messageText = "Error: " + message;
  $messageheader.append(messageText);
  $messageDiv.append($messageheader);
  $resultItems.append($messageDiv);
}

//function to target anything with class "display" to be removed//  CLEAR ALL DYNAMIC HTML
function removeAll() {
  $(".display").remove();
}

// ------------------------------------------------ FLIGHTS SECTION ------------------------------------------------ //

//Uses API to get Flights//
function getFlights() {
  //get the date input
  $flightDate = $("#date-input").val();

  //convert date input to YYYY-MM-DD to use in query
  var newFlightDate = moment($flightDate).format("YYYY-MM-DD");

  //check if the search term has a space between the city words
  if (searchInput.includes(" ")) {
    //replace space with %20 for query
    var newCity = searchInput.replace(" ", "%20");

    //set the new searchTerm
    searchTerm = newCity;
  } else {
    return;
  }

  var placeSettings = {
    async: true,
    crossDomain: true,
    url:
      "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/autosuggest/v1.0/US/USD/en-US/?query=" +
      searchTerm,
    method: "GET",
    headers: {
      "x-rapidapi-key": "066dae2798mshc488ff29eea61bdp1db94fjsnb26d76bdd42c",
      "x-rapidapi-host":
        "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
    },
  };

  $.ajax(placeSettings).done(function (response) {
    destinationCity = response.Places[0].PlaceId;

    // Nested Browse Routes Fetch
    var settings = {
      async: true,
      crossDomain: true,
      url:
        "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browseroutes/v1.0/US/USD/en-US/LAXA-sky/" +
        destinationCity +
        "/" +
        newFlightDate,
      method: "GET",
      headers: {
        "x-rapidapi-key": "066dae2798mshc488ff29eea61bdp1db94fjsnb26d76bdd42c",
        "x-rapidapi-host":
          "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
      },
    };

    $.ajax(settings).done(function (response) {
      displayFlights(response);
    });
  });
}

// ------  displays the flight reponse into the results section ------  //
function displayFlights(response) {
  origin = "LAX";
  destination = destinationCity.replace("-sky", "");
  price = response.Routes[0].Price;
  carrier = response.Carriers[0].Name;

  $divContainer = $("<div>").addClass("display");

  //header
  $headerDiv = $("<div>").addClass("display");
  $header = $("<h2>").addClass("display");
  text = "Cheapest Flight From " + origin + " To " + destination;
  $header.append(text);
  $headerDiv.append($header);
  $divContainer.append($headerDiv);

  //price
  $priceDiv = $("<div>").addClass("display");
  $priceheader = $("<h2>").addClass("display");
  priceText = "Price: $" + price;
  $priceheader.append(priceText);
  $priceDiv.append($priceheader);
  $divContainer.append($priceDiv);

  //carrier
  $carrierDiv = $("<div>").addClass("display");
  $carrierheader = $("<h2>").addClass("display");
  carrierText = "Carrier: " + carrier;
  $carrierheader.append(carrierText);
  $carrierDiv.append($carrierheader);
  $divContainer.append($carrierDiv);

  //departure date
  $dateDiv = $("<div>").addClass("display");
  $dateheader = $("<h2>").addClass("display");
  dateText = "Departure Date: " + $flightDate;
  $dateheader.append(dateText);
  $dateDiv.append($dateheader);
  $divContainer.append($dateDiv);

  //append container to results
  $resultItems.append($divContainer);
}

// ------ Function to create date picker for Flights ------ //
function getFlightDate() {
  if (searchInput === undefined) {
    errorMessage = "Please Select A City";
    displayError(errorMessage);
    setTimeout(function () {
      removeAll();
    }, 2000);
  } else {
    //creates div for header
    var div = $("<div>").addClass("display is-full column");

    var dateDiv = $("<div>").addClass("display");

    var dateInput = $("<input>").addClass("display");
    dateInput.attr("id", "date-input");
    dateInput.css("width", "25%");

    //sets the default value to today's date
    var todayDate = moment().format("MM/DD/YYYY");
    dateInput.val(todayDate);
    dateInput.datepicker({
      minDate: 0,
    });

    dateDiv.append(dateInput);
    div.append(dateDiv);

    var $btnDiv = $("<button>").addClass("display");
    $btnDiv.text("Search");

    div.append($btnDiv);

    $headerDiv = $("<div>").addClass("display column");

    text = "Select The Departure Date";
    $header = $("<h2>").addClass("display");
    $header.append(text);
    $headerDiv.append($header);

    div.prepend($headerDiv);
    $resultsHeaderSearch.append(div);

    $btnDiv.on("click", getFlights);
  }
}

// ------------------------------------------------ END OF FLIGHTS SECTION ------------------------------------------------ //
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
$flightsBtn.on("click", getFlightDate);
