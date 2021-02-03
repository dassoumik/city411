// Global Variables
var dateTime = luxon.DateTime; //Base time object
var localTime = dateTime.local(); //Local time
var lat;
var lon;
var cityOfficial;

// Define Functons
function searchButtonClicked(e) {
    e.preventDefault();
    // If input has value grab value, else do nothing
    if ($("#searchedCityInput").val() !== "") {
        var input = $("#searchedCityInput").val();

        // clear search box
        $("#searchedCityInput").val("");

        // Call functions here
        callFunctions(input);
    }
}

// Search Button Welcome Screen
function searchButtonWelcomeClicked() {
    // Clear search box
    $("#searchedCityInputWelcome").val(" ");

    // Go to data page
    window.location.href = "./pages/city411dashboard.html";
}

// Call all functions here
function callFunctions(input) {
    // Call functions here
    displayWeather(input);
}

// Display Weather which contains all the weather functions
function displayWeather(location) {
    // Get current local date
    var currentDate = dateTime.local();
    var currentDateISO = dateTime.local().toISODate();


    // Call All Weather Functions
    displayCurrentWeather();
    // displayHistoricWeather();


    // Current Data
    function displayCurrentWeather() {
        var units = "&units=imperial"
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + location + units + "&appid=653447e5538dcc45b8534eb1e5c601c3";

        // Clear contents of searchbox
        $("#search-value").val();

        $.ajax({
            url: queryURL,
            method: "GET",
            error: function (err) {
                console.log("getCurrentWeather(): AJAX Error");
            }
        }).then(function (response) {
            // Grab location then call other functions based on location
            lon = response.coord.lon; // for UV
            lat = response.coord.lat; //for UV

            // Call APIs that use lat/lon
            displayForecastWeather(lat, lon);
            displayLocalEvents(lat, lon);

            console.log(response);

            // Grab the local Data
            var cityOfficial = response.name;
            console.log(cityOfficial);
            var tempCurrent = Math.round(response.main.temp);
            var tempHi = Math.round(response.main.temp_max);
            var tempLo = Math.round(response.main.temp_min);
            var currentHumidity = response.main.humidity;
            var currentWindSpeed = Math.round(response.wind.speed);
            var descript = response.weather[0].description;

            var iconID = response.weather[0].icon;
            var iconURL = "https://openweathermap.org/img/w/" + iconID + ".png";

            // Update elements on page
            $("#current-temp").text(" " + tempCurrent + " ");
            $("#current-wind").text(" " + currentWindSpeed)
            $("#current-humidity").text(" " + currentHumidity)



        });
    }

    function displayForecastWeather(x, y) {
        // Example URL: api.openweathermap.org/data/2.5/forecast?q={city name}&appid={API key}
        var units = "&units=imperial"
        var queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + x + "&lon=" + y + "&exclude=current,minutely,hourly,alerts" + units + "&appid=653447e5538dcc45b8534eb1e5c601c3";

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            $("#weather-forecast-div").empty();

            // Grab data
            aDaily = response.daily

            for (let i = 1; i < aDaily.length; i++) {

                // Grab Data
                var item = aDaily[i];
                var dayShort = dateTime.fromSeconds(item.dt).weekdayShort;
                var iconURL = "https://openweathermap.org/img/w/" + item.weather[0].icon + ".png";
                var hi = Math.round(item.temp.max);
                var lo = Math.round(item.temp.min);
                var wind = Math.round(item.wind_speed)
                var rainPop = Math.round(item.pop)

                // Create Forecast Elements
                var divDate = $("<div>").text(dayShort);
                var divImg = $("<img>").attr("src", iconURL).attr("alt", "weather icon").attr({ width: "100px", height: "100px" });;

                var iUp = $("<i>").attr("class", "fas fa-angle-up").css("color", "red")
                var divHi = $("<div>").text(" " + Math.round(hi) + " °F").prepend(iUp);

                var iDown = $("<i>").attr("class", "fas fa-angle-down").css("color", "blue")
                var divLo = $("<div>").text(" " + Math.round(lo) + " °F").prepend(iDown);;

                var iWind = $("<i>").attr("class", "fas fa-wind")
                var divWind = $("<div>").text(" " + wind + "").prepend(iWind)

                // Append elements to button

                var foreCastDayDiv = $("<div>").attr("class", "tile is-child is-vertical notification is-info p-1").append(divDate, divImg, divHi, divLo, divWind);
                $("#weather-forecast-div").append(foreCastDayDiv);


            }
        });
    }

    // Historic Data
    function displayHistoricWeather() {
        // Define the date ranges to use in query and create correct syntax string for query
        var oneYearAgo = currentDate.minus({ year: 1 })
        var oneYearAgoFormatted = oneYearAgo.c.year + "-" + oneYearAgo.c.month + "-" + oneYearAgo.c.day;

        // a year ago, 5 days 
        var oneYearAgoWeek = currentDate.minus({ year: 1 }).plus({ days: 6 });
        var oneYearAgoWeekFormatted = oneYearAgoWeek.c.year + "-" + oneYearAgoWeek.c.month + "-" + oneYearAgoWeek.c.day;

        // a year ago, start date of current month
        var oneYearAgoMonthStart = currentDate.minus({ year: 1 }).startOf('month')
        var oneYearAgoMonthStartFormatted = oneYearAgoMonthStart.c.year + "-" + oneYearAgoMonthStart.c.month + "-" + oneYearAgoMonthStart.c.day;
        // a year ago, end date of current month
        var oneYearAgoMonthEnd = currentDate.minus({ year: 1 }).endOf('month');
        var oneYearAgoMonthEndFormatted = oneYearAgoMonthEnd.c.year + "-" + oneYearAgoMonthEnd.c.month + "-" + oneYearAgoMonthEnd.c.day;

        // a year ago, start date of next  month
        var oneYearAgoTwoMonthsStart = currentDate.minus({ year: 1 }).plus({ month: 1 }).startOf('month');
        var oneYearAgoTwoMonthsStartFormatted = oneYearAgoTwoMonthsStart.c.year + "-" + oneYearAgoTwoMonthsStart.c.month + "-" + oneYearAgoTwoMonthsStart.c.day;
        // a year ago, end date of next  month
        var oneYearAgoTwoMonthsEnd = currentDate.minus({ year: 1 }).plus({ month: 1 }).endOf('month');
        var oneYearAgoTwoMonthsEndFormatted = oneYearAgoTwoMonthsEnd.c.year + "-" + oneYearAgoTwoMonthsEnd.c.month + "-" + oneYearAgoTwoMonthsEnd.c.day;

        // a year ago, start date of next next month
        var oneYearAgoThreeMonthsStart = currentDate.minus({ year: 1 }).plus({ month: 2 }).startOf('month');
        var oneYearAgoThreeMonthsStartFormatted = oneYearAgoThreeMonthsStart.c.year + "-" + oneYearAgoThreeMonthsStart.c.month + "-" + oneYearAgoThreeMonthsStart.c.day;
        // a year ago, end date of next next month
        var oneYearAgoThreeMonthsEnd = currentDate.minus({ year: 1 }).plus({ month: 2 }).endOf('month');
        var oneYearAgoThreeMonthsEndFormatted = oneYearAgoThreeMonthsEnd.c.year + "-" + oneYearAgoThreeMonthsEnd.c.month + "-" + oneYearAgoThreeMonthsEnd.c.day;

        getHistoricWeek("Q5Z5S9QT8FD8UJKCGYBURUXX8");
        getHistoricCurrentMonth("current", "347KV25P3E7B8XKZMTG2ETSNJ", oneYearAgoMonthStartFormatted, oneYearAgoMonthEndFormatted);
        getHistoricCurrentMonth("next", "EZAX7WB9Q7WQZZ6582Q64AVZH", oneYearAgoTwoMonthsStartFormatted, oneYearAgoTwoMonthsEndFormatted);
        getHistoricCurrentMonth("nextnext", "G5RN7UPN529E5629TUL8M9DBW", oneYearAgoThreeMonthsStartFormatted, oneYearAgoThreeMonthsEndFormatted);

        // Returns JSON object of a year ago, 1 week. 
        function getHistoricWeek(key) {
            // Empty the div to make room for JS created HTML
            $("#historic-week-div").empty();

            var queryURL = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/" + location + "/" + oneYearAgoFormatted + "/" + oneYearAgoWeekFormatted + "?unitGroup=us&key=" + key + "&include=obs"
            // var response = JSON.parse(localStorage.getItem("historic-week")) // [TESTING] Uncoming this line for testing 

            $.ajax({
                url: queryURL,
                method: 'GET',
            }).then(function (response) {
                // localStorage.setItem('historic-week', JSON.stringify(response)); // [TESTING] Uncomment this line for testing

                // City/state
                var address = response.resolvedAddress

                // Array data
                var aDayRange = response.days

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
                    var dayDiv = $("<div>").attr("id", "historic-day-" + index).attr("class", "tile is-child is-vertical p-1");
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


            }); //[TESTING] Comment this line for testing
        }


        function getHistoricCurrentMonth(month, key, start, end) {
            var queryURL = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/" + location + "/" + start + "/" + end + "?unitGroup=us&key=" + key + "&include=obs"
            // Grab Data from JSON - Leave this line commented

            // var response = JSON.parse(localStorage.getItem(month)); [TESTING] Uncomment for testing

            // [TESTING] Comment .AJAX -> .THEN for testing
            $.ajax({
                url: queryURL,
                method: 'GET',
            }).then(function (response) {

                // localStorage.setItem(month, JSON.stringify(response)); // [TESTING] Uncomment for testing

                // Array data / Outer Loop variables
                var aDayRange = response.days

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

                // Clear previous Month Elements:
                $("#" + month).empty();

                // Create elements
                if (month === "current") {
                    var hcmTitleDiv = $("<div>").attr("class", "is-size-6 myBold").text(oneYearAgo.monthLong);
                }
                else if (month === "next") { var hcmTitleDiv = $("<div>").attr("class", "is-size-6 myBold").text(oneYearAgoTwoMonthsStart.monthLong); }
                else if (month === "nextnext") { var hcmTitleDiv = $("<div>").attr("class", "is-size-6 myBold").text(oneYearAgo.monthLong); }
                var mostlyCondDiv = $("<div>").text("Mostly " + mostlyCondition);
                var avgHiDiv = $("<div>").text("Hi average - " + avgHi);
                var avgLoDiv = $("<div>").text("Lo average - " + avgLo);

                // Append the above elements
                $("#" + month).append(hcmTitleDiv, mostlyCondDiv, avgHiDiv, avgLoDiv)


            }); // Uncomment this for prod
        }


    }



};

// Get Local Events Function Using Trip Advisor
function displayLocalEvents(x, y) {

    // Display Events (Ticketmaster Discover API)

    // Notes and Info For Ticketmaster Discovery API (Open API- 5000 Calls Pery Day)
    // My ticketmaster Key: Tt06tcfEuZlIkXAxhlvZFSuqmv0EOmz0
    // ticketmaster Root URL: https://app.ticketmaster.com/discovery/v2/
    // NOTE - we could run searches for sports and music, have two side by side tiles under "entertainment parent"
    // NOTE - we should add a date filter somehow so it runs maybe like "Today-two weeks" or something

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
        url: "https://app.ticketmaster.com/discovery/v2/events?apikey=jLvBx02oVnKLrr40UQT6vTZePCKNUlqk&latlong=" + x + "," + y + "&locale=*",
        async: true,
        dataType: "json",
        success: function (response) {
            // Parse the response.
            console.log(response);
            // Do other things.
        },
        error: function (xhr, status, err) {
            // This time, we do not end up here!
        }
    });
}

// Event listener
$("#searchButton").click(searchButtonClicked);
$("#searchedCityButtonWelcome").click(searchButtonWelcomeClicked);

