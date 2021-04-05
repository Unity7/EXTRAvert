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
$searchHistoryDelete = $("#search-history-trash");

cities = [];
var //User should input city name within the USA.
  searchInput,
  //variable used to store formatted version of the user's input
  formattedSearchInput,
  //variable used to store the flight destination ID used in flights api
  destinationCity;

//  -----------------------------  Functions ----------------------------- //

//Function to Execute Once "submit" has been clicked on search box// FUNCTION -- CITY SEARCH SUBMIT BUTTON
function getSearchTerm() {
  event.preventDefault();
  searchInput = $searchInput.val();
  capitalizeSearchInput(searchInput);

  //if search term is not empty and is not in the list of cities then execute
  if ($searchInput.val() != "" && !cities.includes(formattedSearchInput)) {
    cities.push(formattedSearchInput);
    $searchInput.val("");
    setLS();
    clearSearchHistory();
    removeAll();

    //removes flight datepicker if users goes from light to searching for a new city
    //sets events has the is-active and also removes flights as is-active
    removeFlightDate();

    displaySearchHistory(cities);

    // Note: in each function below make you tab's li class active to change tab highlighted
    // getFlights();
    getEvents(searchInput);
    // getHotels()
  } else if ($searchInput.val() === "") {
    message = "Please enter a city into the search";
    displayError(message);
    $searchInput.val("");
    $(".has-background-info-light").removeClass("has-background-info-light");
    setTimeout(function () {
      removeAll();
      removeFlightDate();
    }, 2000);
  } else {
    message = "That city already exists";
    displayError(message);
    $searchInput.val("");
    $(".has-background-info-light").removeClass("has-background-info-light");
    setTimeout(function () {
      removeAll();
      removeFlightDate();
    }, 2000);
  }

  // console.log(searchInput);
}

// ------  Function to display error messages on the results ------  // FUNCTION -- DISPLAY ERROR MESSAGE

function displayError(message) {
  $messageDiv = $("<div>").addClass("display has-background-danger");
  $messageheader = $("<h2>").addClass("display has-text-primary-light");
  messageText = "Error: " + message;
  $messageheader.append(messageText);
  $messageDiv.append($messageheader);
  $resultItems.append($messageDiv);
}

//function to target anything with class "display" to be removed//  CLEAR ALL DYNAMIC HTML
function removeAll() {
  $(".display").remove();
}

//Function to remove the flight date picke
function removeFlightDate() {
  $(".datedisplay").remove();
  $(".is-active").removeClass("is-active");
  $("#events-header").addClass("is-active");
}

//function to display loading screen

function displayLoadingScreen() {
  var message =
    "<div style='text-align: center;'><img src='https://i.gifer.com/4V0b.gif'></img></div>";

  $messageDiv = $("<div>").addClass("display has-background-white");
  $messageheader = $("<h2>").addClass("display has-text-primary-light");
  messageText = "Pending: " + message;
  $messageheader.append(messageText);
  $messageDiv.append($messageheader);
  $resultItems.append($messageDiv);
}

// ------------------------------------------------ FLIGHTS SECTION ------------------------------------------------ //

//Uses API to get Flights//
function getFlights() {
  removeAll();
  displayLoadingScreen();
  //get the date input
  $flightDate = $("#date-input").val();

  var flightCity;
  //convert date input to YYYY-MM-DD to use in query
  var newFlightDate = moment($flightDate).format("YYYY-MM-DD");

  //check if the search term has a space between the city words
  if (searchInput.includes(" ")) {
    //replace space with %20 for query
    var newCity = searchInput.replace(" ", "%20");

    //set the new searchTerm
    flightCity = newCity;
  } else {
    flightCity = searchInput;
  }

  var placeSettings = {
    async: true,
    error: function (error) {
      removeAll();
      var message = "Please try another city " + error;
      displayError(message);
    },
    crossDomain: true,
    url:
      "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/autosuggest/v1.0/US/USD/en-US/?query=" +
      flightCity,
    method: "GET",
    headers: {
      "x-rapidapi-key": "066dae2798mshc488ff29eea61bdp1db94fjsnb26d76bdd42c",
      "x-rapidapi-host":
        "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
    },
  };

  $.ajax(placeSettings).done(function (response) {
    //if the response comes back invalid city display error
    if (response.Places[0] === undefined) {
      message = "Please enter a valid city";
      displayError(message);
      setTimeout(function () {
        removeAll();
      }, 2000);
    } else {
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
          "x-rapidapi-key":
            "066dae2798mshc488ff29eea61bdp1db94fjsnb26d76bdd42c",
          "x-rapidapi-host":
            "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
        },
      };

      $.ajax(settings).done(function (response) {
        if (
          response.Routes[0] === undefined ||
          response.Carriers[0].Name === undefined
        ) {
          message = "Could not find any flights, please try another city";
          displayError(message);
          setTimeout(function () {
            removeAll();
            removeFlightDate();
          }, 2000);
        } else {
          displayLoadingScreen();
          displayFlights(response);
        }
      });
    }
  });
}

// ------  displays the flight reponse into the results section ------  //
function displayFlights(response) {
  removeAll();
  var origin = "LAX";
  var destination = destinationCity.replace("-sky", "");
  var price = response.Routes[0].Price;
  var carrier = response.Carriers[0].Name;
  var $flightDate = $("#date-input").val();

  var $divContainer = $("<div>").addClass("display card my-1 py-3 px-3");

  //header
  var $headerDiv = $("<div>").addClass("display card my-1 py-3 px-3");
  var $header = $("<h2>").addClass("display");
  var text = "Cheapest Flight From " + origin + " To " + destination;
  $header.append(text);
  $headerDiv.append($header);
  $divContainer.append($headerDiv);

  //price
  var $priceDiv = $("<div>").addClass("display card my-1 py-3 px-3");
  var $priceheader = $("<h2>").addClass("display");
  var priceText = "Price: $" + price;
  $priceheader.append(priceText);
  $priceDiv.append($priceheader);
  $divContainer.append($priceDiv);

  //carrier
  var $carrierDiv = $("<div>").addClass("display card my-1 py-3 px-3");
  var $carrierheader = $("<h2>").addClass("display");
  var carrierText = "Carrier: " + carrier;
  $carrierheader.append(carrierText);
  $carrierDiv.append($carrierheader);
  $divContainer.append($carrierDiv);

  //departure date
  var $dateDiv = $("<div>").addClass("display card my-1 py-3 px-3");
  var $dateheader = $("<h2>").addClass("display");
  var dateText = "Departure Date: " + $flightDate;
  $dateheader.append(dateText);
  $dateDiv.append($dateheader);
  $divContainer.append($dateDiv);

  //append container to results
  $resultItems.append($divContainer);
}

// ------ Function to create date picker for Flights ------ //
function getFlightDate() {
  if (searchInput === undefined || searchInput === "") {
    var errorMessage = "Please Select A City";
    displayError(errorMessage);
    setTimeout(function () {
      removeAll();
    }, 2000);
  } else {
    removeAll();
    $(".is-active").removeClass("is-active");
    $("#flights-header").addClass("is-active");
    //creates div for header
    var div = $("<div>").addClass(
      "datedisplay is-full column has-background-light"
    );

    var dateDiv = $("<div>").addClass("datedisplay has-background-light");

    var dateInput = $("<input>").addClass("datedisplay has-background-light");
    dateInput.attr("id", "date-input");
    dateInput.css("width", "25%");

    //sets the default value to today's date
    var todayDate = moment().add(1, "days").format("MM/DD/YYYY");
    dateInput.val(todayDate);
    dateInput.datepicker({
      minDate: 1,
    });

    dateDiv.append(dateInput);
    div.append(dateDiv);

    var $btnDiv = $("<button>").addClass("datedisplay");
    $btnDiv.text("Search");

    div.append($btnDiv);

    $headerDiv = $("<div>").addClass("datedisplay column has-background-light");

    text = "Select The Departure Date";
    $header = $("<h2>").addClass("datedisplay has-background-light");
    $header.append(text);
    $headerDiv.append($header);

    div.prepend($headerDiv);
    $resultsHeaderSearch.append(div);

    $btnDiv.on("click", getFlights);
  }
}

// ------------------------------------------------ END OF FLIGHTS SECTION ------------------------------------------------ //

// ------------------------------------------------ SEARCH INPUT FORMATTING SECTION ------------------------------------------------ //

function capitalizeSearchInput(string) {
  if (searchInput.includes(" ")) {
    formattedSearchInput = "";
    var words = searchInput.split(" ");
    for (var i = 0; i < words.length; i++) {
      var stringWord = words[i];
      var lowerString = stringWord.slice(1);
      lowerString = lowerString.toLowerCase();
      var newWords = stringWord.charAt(0).toUpperCase() + lowerString;
      formattedSearchInput += newWords;
      formattedSearchInput += " ";
    }
    formattedSearchInput = formattedSearchInput.slice(0, -1);
    return formattedSearchInput;
  } else {
    var lowerString = string.slice(1);
    lowerString = lowerString.toLowerCase();
    formattedSearchInput = string.charAt(0).toUpperCase() + lowerString;
    return formattedSearchInput;
  }
}

// ------------------------------------------------ END OF SEARCH INPUT FORMATTING SECTION ------------------------------------------------ //

// ------------------------------------------------ LOCAL STORAGE SECTION ------------------------------------------------ //

//Function to set Local Storage to the Current Cities Array// ---------- SET LOCAL STORAGE ------
function setLS() {
  localStorage.setItem("cities", cities);
}

//Function to get Local Storage and set to Cities Array// ---------- GET LOCAL STORAGE ------
function getLS() {
  if (
    localStorage.getItem("cities") === null ||
    localStorage.getItem("cities") === ""
  ) {
    cities = [];
  } else {
    var ls = localStorage.getItem("cities");
    newLS = ls.split(",");
    cities = newLS;
  }
}

//function to display the search history of cities entered into input// ---- DISPLAY THE HISTORICAL SEARCHES ----
function displaySearchHistory(city) {
  for (var i = 0; i < cities.length; i++) {
    $city = $("<div>").addClass("card my-1 py-3 px-3 lsDisplay");
    $city.html(cities[i]);
    $searchItems.append($city);
  }
}

//function to clear city search history// ** FUNCTION ** CLEAR HISTORICAL SEARCHES so new list can be displayed
function clearSearchHistory() {
  $(".lsDisplay").remove();
}

//function to delete local storage and clear search history
function deleteSearchHistory() {
  clearSearchHistory();
  cities = [];
  setLS();
}

// ------------------------------------------------ END OF LOCAL STORAGE SECTION ------------------------------------------------ //

// ------------------------------------------------ EVENTS SECTION ------------------------------------------------ //
// function to get events with the ticketmaster API
function getEvents() {
  // make tab highlight the events tab
  $("#flights-header").removeClass("is-active");
  $("#hotels-header").removeClass("is-active");
  $("#events-header").addClass("is-active");
  removeAll();
  removeFlightDate();
  //   get events my by city in asc order from date
  fetch(
    "https://app.ticketmaster.com/discovery/v2/events.json?apikey=5UPSIDMJWuJXOmCp87P78yjbhoxplVMG&startDateTime=2021-03-01T14:00:00Z&city=" +
      searchInput +
      "&sort=date,asc"
  ).then((response) =>
    response
      .json()
      .then((data) => {
        let eventsArr = data._embedded.events;
        displayLoadingScreen();
        displayEvents(eventsArr);
      })
      .catch((error) => {
        message = "Could not find any events";
        displayError(message);
        setTimeout(function () {
          removeAll();
        }, 2000);
      })
  );
}

// function to display results
function displayEvents(eventsArr) {
  removeAll();
  let html = "";
  // loop over the array of events and display the first 15 results
  for (let i = 0; i < 15; i++) {
    let eventEl = eventsArr[i];
    let eventName = eventEl.name;
    let eventDesciption = eventEl.info;
    if (eventDesciption == undefined) {
      eventDesciption = `Click the book now link for details.`;
    }
    // TODO: condition for if there is no value
    let eventDate = eventEl.dates.start.localDate;
    let eventStatus = eventEl.dates.status.code;
    let bookLink = eventEl.url;
    let eventImg = eventEl.images[0].url;
    html += `<div class="card has-background-light">
          <div class="card-content event-card cardItems">
            <div class="event-image-container">
              <img class="event-image"src="${eventImg}" alt="Placeholder image">
            </div>
            <div class="event-content">
              <h3 class="event-title title is-5 has-text-centered">${eventName}</h3>
              <p class="event-desc">${eventDesciption}</p>
              <p class="event-date">${eventDate}</p>
              <p class="event-status"><b>Event Status</b>: ${eventStatus}</p>
            </div>
            <button id="book-btn" class="button mr-5 linkColor"><a href="${bookLink}" target="_blank">Book Now</a></button>
          </div>
        </div>`;
  }
  html = `<div class="display display-events">${html}</div>`;
  $resultItems.append(html);
}

// ------------------------------------------------ END EVENTS SECTION ------------------------------------------------ //

function getEventsByHistory(e) {
  removeAll();
  //get the text content and set it to the search Input
  searchInput = e.target.textContent;

  //remove any active search history items
  $(".has-background-info-light").removeClass("has-background-info-light");

  //set the current clicked item to be active
  $(e.target).addClass("has-background-info-light");

  //function to execute search by Event
  getEvents(searchInput);
}

//Uses API to get Hotels//
function getHotels() {
  removeAll();
  removeFlightDate();
  var message = "Service Temporary Unavailable";
  displayError(message);
  setTimeout(function () {
    removeAll();
    removeFlightDate();
  }, 2000);

  //display Data
  // displayResults(data);
}

function displayResults(data) {
  console.log("Displaying Results");
}

//  -----------------------------  Event Listeners ----------------------------- //

$searchButton.on("click", getSearchTerm);
$flightsBtn.on("click", getFlightDate);
$eventsBtn.on("click", getEvents);
$searchHistoryDelete.on("click", deleteSearchHistory);
$searchItems.on("click", getEventsByHistory);
$hotelsBtn.on("click", getHotels);

//On page load functions to be called
clearSearchHistory();
getLS();
displaySearchHistory(cities);
