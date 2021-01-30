// Global Variables
var dateTime = luxon.DateTime; //Grabbing base time object
var localTime = dateTime.local(); //Get the current local time

// Define Functons
function searchButtonClicked() {
    // If input has value grab value, else do nothing
    if ($("#searchedCityInput").val() !== "") {
        var input = $("#searchedCityInput").val()
        displayWeather(input);
    }
}

// Display Weather which contains all the weather functions
function displayWeather(location) {
    // Get current local date
    var currentDate = dateTime.local();
    var currentDateISO = dateTime.local().toISODate();

    // Call Functions
    displayHistoric();


    // Historic Data
    function displayHistoric() {
        // Define the date ranges to use in query and create correct syntax string for query
        var oneYearAgo = currentDate.minus({ year: 1 })
        var oneYearAgoFormatted = oneYearAgo.c.year + "-" + oneYearAgo.c.month + "-" + oneYearAgo.c.day;

        // a year ago, 7 days ahead 
        var oneYearAgoWeek = currentDate.minus({ year: 1 }).plus({ days: 7 });
        var oneYearAgoWeekFormatted = oneYearAgoWeek.c.year + "-" + oneYearAgoWeek.c.month + "-" + oneYearAgoWeek.c.day;

        // a year ago, start date of next month
        var oneYearAgoMonthStart = currentDate.minus({ year: 1 }).plus({ month: 1 }).startOf('month')
        var oneYearAgoMonthStartFormatted = oneYearAgoMonthStart.c.year + "-" + oneYearAgoMonthStart.c.month + "-" + oneYearAgoMonthStart.c.day;
        // a year ago, end date of next month
        var oneYearAgoMonthEnd = currentDate.minus({ year: 1 }).plus({ month: 1 }).endOf('month');
        var oneYearAgoMonthEndFormatted = oneYearAgoMonthEnd.c.year + "-" + oneYearAgoMonthEnd.c.month + "-" + oneYearAgoMonthEnd.c.day;

        // a year ago, start date of next next month
        var oneYearAgoTwoMonthsStart = currentDate.minus({ year: 1 }).plus({ month: 2 }).startOf('month');
        var oneYearAgoTwoMonthsStartFormatted = oneYearAgoTwoMonthsStart.c.year + "-" + oneYearAgoTwoMonthsStart.c.month + "-" + oneYearAgoTwoMonthsStart.c.day;
        // a year ago, end date of next next month
        var oneYearAgoTwoMonthsEnd = currentDate.minus({ year: 1 }).plus({ month: 2 }).endOf('month');
        var oneYearAgoTwoMonthsEndFormatted = oneYearAgoTwoMonthsEnd.c.year + "-" + oneYearAgoTwoMonthsEnd.c.month + "-" + oneYearAgoTwoMonthsEnd.c.day;

        // Test Variables
        console.log(oneYearAgoFormatted + "\n" + oneYearAgoWeekFormatted + "\n" + oneYearAgoMonthStartFormatted + "\n" + oneYearAgoMonthEndFormatted + "\n" + oneYearAgoTwoMonthsStartFormatted + "\n" + oneYearAgoTwoMonthsEndFormatted);


        getHistoricWeek();
        // getHistoricOneMonth();



        // Returns JSON object of a year ago, 1 week. 
        // The API KEY in this ajax call should be used for 
        function getHistoricWeek() {
            var queryURL = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/" + location + "/" + oneYearAgoFormatted + "/" + oneYearAgoWeekFormatted + "?unitGroup=us&key=Q5Z5S9QT8FD8UJKCGYBURUXX8&include=obs"
            var response = JSON.parse(localStorage.getItem("historic-week"))
            console.log(response);


            // Commenting out AJAX requesting while developing; uncomment logic before pushing to prod
            // $.ajax({
            //     url: queryURL,
            //     method: 'GET',
            // }).then(function (response) {
            //     console.log(response);

            //     // Save the object in history to prevent from using query credits and running out
            //     // localStorage.setItem('historic-week', JSON.stringify(response));

            // Grab Data from JSON - Leave this line commented
            
            





            // });
        }


        function getHistoricOneMonth() {

        }


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
