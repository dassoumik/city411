// Global Variables
var dateTime = luxon.DateTime; //Grabbing base time object
var localTime = dateTime.local(); //Get the current local time

// TESTING FOR NOW, remove later
displayWeather();

// Define Functons
function searchButtonClicked() {
    displayWeather();
}

// Display Weather which contains all the weather functions
function displayWeather() {
    // Get current local date
    var currentDate = dateTime.local();
    var currentDateISO = dateTime.local().toISODate();

    // Call Functions
    displayHistoric();


    // Historic Data
    function displayHistoric() {
        // Define the date ranges to use in query
        var oneYearAgo = currentDate.minus({ year: 1 }).toISODate();
        var oneYearAgoWeek = currentDate.plus({ days: 7 }).toISODate();
        var oneYearAgoMonthStart = currentDate.plus({ month: 1 }).startOf('month').toISODate();
        var oneYearAgoMonthEnd = currentDate.plus({ month: 1 }).endOf('month').toISODate();
        var oneYearAgoTwoMonthsStart = currentDate.plus({ month: 2 }).startOf('month').toISODate();
        var oneYearAgoTwoMonthsEnd = currentDate.plus({ month: 2 }).endOf('month').toISODate();

        // Test Variables
        console.log(currentDateISO + "\n" + oneYearAgo + "\n" + oneYearAgoWeek + "\n" + oneYearAgoMonthStart + "\n" + oneYearAgoMonthEnd + "\n" + oneYearAgoTwoMonthsStart + "\n" + oneYearAgoTwoMonthsEnd);



        var queryURL = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/weatherdata/history?aggregateHours=24&combinationMethod=aggregate&startDateTime=2020-01-31T00%3A00%3A00&endDateTime=2020-02-05T00%3A00%3A00&maxStations=-1&maxDistance=-1&contentType=csv&unitGroup=us&locationMode=single&key=Q5Z5S9QT8FD8UJKCGYBURUXX8&dataElements=default&locations=sugar%20hill%20ga"


        $.ajax({
            url: queryURL,
            method: 'GET',
        }).then(function (response) {
            var accessToken = response.access_token;
            console.log(response);
        });




    }

    // Current Data
    function getCurrent() {

    }

    // Forecast Data 
    function getForecast() {

    }


};

// Event listener
$("#searchButtonDashboard").click(searchButtonClicked);
