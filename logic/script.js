// Global Variables
var dateTime = luxon.DateTime; //Base time object
var localTime = dateTime.local(); //Local time

// Define Functons
function searchButtonClicked() {
    // If input has value grab value, else do nothing
    if ($("#searchedCityInput").val() !== "") {
        var input = $("#searchedCityInput").val();

        // clear search box
        $("#searchedCityInput").val("");
        displayWeather(input);
    }
}

// Event listener
$("#searchButton").click(searchButtonClicked);

// Display Weather which contains all the weather functions
function displayWeather(location) {
    // Get current local date
    var currentDate = dateTime.local();
    var currentDateISO = dateTime.local().toISODate();

    // Call All Weather Functions
    displayHistoric();


    // Historic Data
    function displayHistoric() {
        // Define the date ranges to use in query and create correct syntax string for query
        var oneYearAgo = currentDate.minus({ year: 1 })
        var oneYearAgoFormatted = oneYearAgo.c.year + "-" + oneYearAgo.c.month + "-" + oneYearAgo.c.day;

        // a year ago, 5 days 
        var oneYearAgoWeek = currentDate.minus({ year: 1 }).plus({ days: 6 });
        var oneYearAgoWeekFormatted = oneYearAgoWeek.c.year + "-" + oneYearAgoWeek.c.month + "-" + oneYearAgoWeek.c.day;

        // a year ago, start date of next month
        var oneYearAgoMonthStart = currentDate.minus({ year: 1 }).startOf('month')
        var oneYearAgoMonthStartFormatted = oneYearAgoMonthStart.c.year + "-" + oneYearAgoMonthStart.c.month + "-" + oneYearAgoMonthStart.c.day;
        // a year ago, end date of next month
        var oneYearAgoMonthEnd = currentDate.minus({ year: 1 }).endOf('month');
        var oneYearAgoMonthEndFormatted = oneYearAgoMonthEnd.c.year + "-" + oneYearAgoMonthEnd.c.month + "-" + oneYearAgoMonthEnd.c.day;

        // a year ago, start date of next next month
        var oneYearAgoTwoMonthsStart = currentDate.minus({ year: 1 }).plus({ month: 1 }).startOf('month');
        var oneYearAgoTwoMonthsStartFormatted = oneYearAgoTwoMonthsStart.c.year + "-" + oneYearAgoTwoMonthsStart.c.month + "-" + oneYearAgoTwoMonthsStart.c.day;
        // a year ago, end date of next next month
        var oneYearAgoTwoMonthsEnd = currentDate.minus({ year: 1 }).plus({ month: 1 }).endOf('month');
        var oneYearAgoTwoMonthsEndFormatted = oneYearAgoTwoMonthsEnd.c.year + "-" + oneYearAgoTwoMonthsEnd.c.month + "-" + oneYearAgoTwoMonthsEnd.c.day;

        // Test Variables
        // console.log(oneYearAgoFormatted + "\n" + oneYearAgoWeekFormatted + "\n" + oneYearAgoMonthStartFormatted + "\n" + oneYearAgoMonthEndFormatted + "\n" + oneYearAgoTwoMonthsStartFormatted + "\n" + oneYearAgoTwoMonthsEndFormatted);


        getHistoricWeek();
        getHistoricCurrentMonth();

        // Returns JSON object of a year ago, 1 week. 
        // The API KEY in this ajax call should be used for 
        function getHistoricWeek() {
            // Empty the div to make room for JS created HTML
            $("#historic-week-div").empty();

            var queryURL = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/" + location + "/" + oneYearAgoFormatted + "/" + oneYearAgoWeekFormatted + "?unitGroup=us&key=Q5Z5S9QT8FD8UJKCGYBURUXX8&include=obs"
            // Grab Data from JSON - Leave this line commented
            var response = JSON.parse(localStorage.getItem("historic-week"))
            console.log(response);

            // Commenting out AJAX requesting while developing; uncomment logic before pushing to prod
            // $.ajax({
            //     url: queryURL,
            //     method: 'GET',
            // }).then(function (response) {
            //     console.log(response);

            // Save the object in history to prevent from using query credits and running out
            // localStorage.setItem('historic-week', JSON.stringify(response));

            console.log("=========================");
            // City/state
            var address = response.resolvedAddress
            // Array data
            var aDayRange = response.days
            console.log(address);
            console.log(aDayRange);

            // Loop thru each Historic Week day...
            $.each(aDayRange, function (index, item) {

                var historicDay = aDayRange[index].datetime;
                var historicDayEpoch = aDayRange[index].datetimeEpoch;
                var historicDayConditions = aDayRange[index].conditions;
                var historicDayHumidity = aDayRange[index].humidity;
                var historicDayIcon = aDayRange[index].icon;
                var historicDayPrecip = aDayRange[index].precip;
                var historicDaySnow = aDayRange[index].snow;
                var historicDayTempmax = Math.round(aDayRange[index].tempmax);
                var historicDayTempmin = Math.round(aDayRange[index].tempmin);
                var historicDayWindspeed = Math.round(aDayRange[index].windspeed);

                // Create elements with the data
                var dayDiv = $("<div>").attr("id", "historic-day-" + index).attr("class", "tile is-child is-vertical notification is-info p-1");
                var dayTitle = $("<div>").attr("class", "myBold").text(dateTime.fromSeconds(historicDayEpoch).weekdayShort);

                // Create ICON element based on ICON TEXT variable from response
                if (historicDayIcon === "rain") { var dayIcon = $("<i>").attr("class", "fas fa-cloud-showers-heavy my-2 is-size-4"); }
                else if (historicDayIcon === "fog") { var dayIcon = $("<i>").attr("class", "fas fa-smog my-2 is-size-4"); }
                else if (historicDayIcon === "wind") { var dayIcon = $("<i>").attr("class", "fas fa-wind my-2 is-size-4"); }
                else if (historicDayIcon === "cloudy") { var dayIcon = $("<i>").attr("class", "fas fa-cloud my-2 is-size-4"); }
                else if (historicDayIcon === "partly-cloudy-day") { var dayIcon = $("<i>").attr("class", "fas fa-cloud-sun my-2 is-size-4"); }
                else if (historicDayIcon === "partly-cloudy-night") { var dayIcon = $("<i>").attr("class", "fas fa-cloud-moon my-2 is-size-4"); }
                else if (historicDayIcon === "clear-day") { var dayIcon = $("<i>").attr("class", "fas fa-sun my-2 is-size-4"); }
                else if (historicDayIcon === "clear-night") { var dayIcon = $("<i>").attr("class", "fas fa-moon my-2 is-size-4"); }
                else { var dayIcon = $("<i>").attr("class", "fas fa-question my-2 is-size-4"); }

                var dayHighDiv = $("<div>").text("Hi: " + historicDayTempmax + "°F");
                var dayLowDiv = $("<div>").text("Lo: " + historicDayTempmin + "°F");
                var dayIconText = $("<div>").text(historicDayIcon);

                // Append all elements to daydiv then to tile div
                dayDiv.append(dayTitle, dayIcon, dayHighDiv, dayLowDiv)
                $("#historic-week-div").append(dayDiv);

            });


            // }); // Uncomment this for prod
        }


        function getHistoricCurrentMonth() {
            var queryURL = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/" + location + "/" + oneYearAgoMonthStartFormatted + "/" + oneYearAgoMonthEndFormatted + "?unitGroup=us&key=347KV25P3E7B8XKZMTG2ETSNJ&include=obs"
            // Grab Data from JSON - Leave this line commented
            var response = JSON.parse(localStorage.getItem("historic-current-month"));
            console.log(response);

            // Commenting out AJAX requesting while developing; uncomment logic before pushing to prod
            // $.ajax({
            //     url: queryURL,
            //     method: 'GET',
            // }).then(function (response) {
            //     console.log(response);

            // Save the object in history to prevent from using query credits and running out
            // localStorage.setItem('historic-current-month', JSON.stringify(response));
            console.log("=========================");
            // Array data / Outer Loop variables
            var aDayRange = response.days
            console.log(aDayRange);

            // Declare Dynamic Variable
            var totalHi = 0;
            var totalLo = 0;
            var aCond = [];
            var aConditionsConcat = [];
            var aConditionsUsed = [];
            var Obj = {};

            // Loop thru each Historic Week day...
            // Build the strings USED & CONCAT string
            $.each(aDayRange, function (index, item) {
                totalHi = totalHi + parseInt(item.tempmax);
                totalLo = totalLo + parseInt(item.tempmin);

                // Get all current conditions, tally them up
                var aCurrentConditions = aDayRange[index].conditions.split(",");
                // Build Used String
                for (let i = 0; i < aCurrentConditions.length; i++) {
                    var currentCondition = (aCurrentConditions[i].trim(" ")).toLowerCase();
                    if (aConditionsUsed.indexOf(currentCondition) === -1) {
                        aConditionsUsed.push(currentCondition);
                    }

                    // Build Concat String (for latter count)
                    aConditionsConcat.push(currentCondition);
                }
            });

            // Grab file concat String
            let sFinalConcat = aConditionsConcat.join("");

            // Get condtion tallies
            // Loop thru used array, .match to finalstring, write to Obj property & value
            for (let i = 0; i < aConditionsUsed.length; i++) {
                var re = new RegExp(aConditionsUsed[i], "g");
                Obj[aConditionsUsed[i]] = sFinalConcat.match(re).length;
            }
            console.log(Obj);

            // Push object into array and sort descending to grab first 
            var sortable = [];
            for (var condition in Obj) {
                sortable.push([condition, Obj[condition]]);
            }
            sortable.sort(function (a, b) {
                return b[1] - a[1];
            });


            // Final Values to display:
            var mostlyCondition = sortable[0][0];
            var avgHi = Math.round((totalHi / aDayRange.length));
            var avgLo = Math.round((totalLo / aDayRange.length));

            console.log(sortable[0][0]);
            console.log("AvgHi: " + avgHi);
            console.log("AvgLo: " + avgLo);

            // Create elements
            var hcmTitleDiv = $("<div>").attr("class", "is-size-6 myBold").text(oneYearAgo.monthLong);
            var mostlyCondDiv = $("<div>").text("Mostly " + mostlyCondition);
            var avgHiDiv = $("<div>").text("Hi average - " + avgHi);
            var avgLoDiv = $("<div>").text("Lo average - " + avgLo);
            $("#historic-current-month").empty();
            $("#historic-current-month").append(hcmTitleDiv, mostlyCondDiv, avgHiDiv, avgLoDiv)


            // }); // Uncomment this for prod
        }


    } // end displayHistoric()

    // Current Data
    function getCurrentWeather() {

    }

    // Forecast Data 
    function getForecastWeather() {

    }



};



// Display Events (Ticketmaster Discover API)

// Notes and Info For Ticketmaster Discovery API (Open API- 5000 Calls Pery Day)
// My ticketmaster Key: Tt06tcfEuZlIkXAxhlvZFSuqmv0EOmz0
// ticketmaster Root URL: https://app.ticketmaster.com/discovery/v2/
// NOTE - we could run searches for sports and music, have two side by side tiles under "entertainment parent"
// NOTE - we should add a date filter somehow so it runs maybe like "Today-two weeks" or something

// Get Local Events Function Using Trip Advisor
function getLocalEvents() {
    console.log("getLocalEvents function invoked")

    // Trigger the function with button Click

    // Define a query URL (Needs to be updated by taking keywords for city and date to generate query url- I put examples first using atlanta)

    //Working URL example to click and see response for Atlanta Music
    var getLocalMusicEventsQueryURL = "https://app.ticketmaster.com/discovery/v2/events.json?city=Atlanta&keyword=music&apikey=Tt06tcfEuZlIkXAxhlvZFSuqmv0EOmz0"

    //This URL is using a date filter in their format, specifying dates bewteen the two I did
    var getLocalSportsEventsQueryURL = "https://app.ticketmaster.com/discovery/v2/events.json?city=Atlanta&keyword=sports&localStartDateTime=2021-02-01T14:00:00,2021-02-15T14:00:00&apikey=Tt06tcfEuZlIkXAxhlvZFSuqmv0EOmz0"
    // Above, maybe we just run "today" and next 30 days for the date range at time of search? Could define these with the luxon stuff I guess...

    // Here is the snippet from the docs. I did not modify this at all so its not seetup to work for us yet
    $.ajax({
        type: "GET",
        url: "https://app.ticketmaster.com/discovery/v2/events.json?size=1&apikey=Tt06tcfEuZlIkXAxhlvZFSuqmv0EOmz0",
        async: true,
        dataType: "json",
        success: function (json) {
            console.log(json);
            // Parse the response.
            // Do other things.
        },
        error: function (xhr, status, err) {
            // This time, we do not end up here!
        }
    });
}
