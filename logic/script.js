$(document).ready(function () {
    // Global Variables
    var dateTime = luxon.DateTime; //Base time object
    var localTime = dateTime.local(); //Local time
    var city;
    var state;
    var lat;
    var lon;
    var i = 0;
    var address;
    var phoneNumbers;
    var searchClicked;
    var timeInterval;
    var latitude;
    var longitude;
    var apiZomato = "af93c63cd1563820706beeacaa127e33";
    var aFavorites = [];


    // Define Functons
    function searchButtonClicked(e) {
        e.preventDefault();
        // If input has value grab value, else do nothing
        if ($("#searchedCityInput").val() !== "") {
            var input = $("#searchedCityInput").val();
            clearInterval(timeInterval);
            searchClicked = true;

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
        getLatLon(input);
    }

    // Get the GEOCity info of the city searched
    function getLatLon(search_input) {
        const settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://wft-geo-db.p.rapidapi.com/v1/geo/cities?limit=4&countryIds=US&namePrefix=" + search_input,
            "method": "GET",
            "headers": {
                "x-rapidapi-key": "7b75ab40bfmsh25f0646a556efbfp1ff8a3jsn2e13b2c6e160",
                "x-rapidapi-host": "wft-geo-db.p.rapidapi.com"
            }
        };

        $.ajax(settings).done(function (response) {
            console.log(response);
            // If the search returns city data... then call the API's else alert the user
            if (response.data.length > 0) {
                // Show/Hide Appropriate containers
                $("#container-welcome").attr("class", "hero is-fullheight-with-navbar is-hidden")
                $("#container-tiles").attr("class", "tile is-ancestor mt-2 mx-1")

                // Set City Info
                city = response.data[0].city
                state = response.data[0].regionCode
                latitude = response.data[0].latitude;
                longitude = response.data[0].longitude;

                // Display City & State
                $("#currentCityName").text(city + ", " + state);
                // Grab lat/lon coords of search

                // Run Functions with City Info from GEO City
                displayFoodDataRated(latitude, longitude);
                // displayFoodDataByCost(latitude, longitude);
                displayWeather(city);
                displayLocalEvents("music", city);
                displayLocalEvents("sport", city);
            } else {
                alert("City could not be found! Please try again...");
            }






        });
    }

    // Initiate API call to zomato
    function displayFoodDataRated(latitude, longitude) {

        var urlZomato = "https://developers.zomato.com/api/v2.1/search?cuisines=1,5,25,27,40,100,161,227" + "&lon=" + longitude + "&lat=" + latitude + "&count=20&sort=rating";

        $.ajax({
            method: "GET",
            crossDomain: true,
            url: urlZomato,
            dataType: "json",
            async: true,
            headers: {
                "user-key": apiZomato
            },
            success: function (data) {
                parseZomatoData(data);
            },
            error: function () {
                infoContent = "<div>Sorry, data is not coming through. Refresh and try again.</div>";
                $(".food").empty();
                $(".food").append(infoContent);
            }
        });//end of $.ajax call
    }

    // Display Rated Food Data
    function parseZomatoData(data) {
        if (searchClicked) {
            i = 0;
            searchClicked = false;
            $(".card-select .caption-name").text("");
            $(".card-select .caption-cuisines").text("");
            $(".card-select .caption-avg-cost").text("");
            $(".card-select .caption-locality").text("");
            $(".card-select .food-image").attr("src", "https://via.placeholder.com/200");
        }
        if (data.restaurants[i].restaurant.thumb == "") {
            $(".card-select .food-image").attr("src", "https://via.placeholder.com/200");
        } else {
            $(".card-select .food-image").attr("src", data.restaurants[i].restaurant.thumb);
        }
        $(".card-select .caption-name").text(data.restaurants[i].restaurant.name);
        $(".card-select .caption-cuisines").text(data.restaurants[i].restaurant.cuisines);
        $(".card-select .caption-avg-cost").text("$ " + data.restaurants[i].restaurant.average_cost_for_two + " (2 persons)");
        $(".card-select .caption-locality").text(data.restaurants[i].restaurant.location.locality);
        address = data.restaurants[i].restaurant.location.address;
        phoneNumbers = data.restaurants[i].restaurant.phone_numbers;
        timeInterval = setInterval(function () {
            if (i < 20) {
                i++;
            }
            if (i > 19) {
                i = i - i;
            }
            if (data.restaurants[i].restaurant.thumb == "") {
                $(".card-select .food-image").attr("src", "https://via.placeholder.com/200");
            } else {
                $(".card-select .food-image").attr("src", data.restaurants[i].restaurant.thumb);
            }
            $(".card-select .caption-name").text(data.restaurants[i].restaurant.name);
            $(".card-select .caption-cuisines").text(data.restaurants[i].restaurant.cuisines);
            $(".card-select .caption-avg-cost").text("$ " + data.restaurants[i].restaurant.average_cost_for_two + " (2 persons)");
            $(".card-select .caption-locality").text(data.restaurants[i].restaurant.location.locality);
            address = data.restaurants[i].restaurant.location.address;
            phoneNumbers = data.restaurants[i].restaurant.phone_numbers;
        }, 5000);
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

                // Grab the local Data
                var cityOfficial = response.name;

                var tempCurrent = Math.round(response.main.temp);
                var tempHi = Math.round(response.main.temp_max);
                var tempLo = Math.round(response.main.temp_min);
                var currentHumidity = response.main.humidity;
                var currentWindSpeed = Math.round(response.wind.speed);
                var descript = response.weather[0].description;


                var iconId = response.weather[0].icon;
                var fontAwesomeId = getWeatherIcon(iconId, descript);


                // Update elements on page
                $("#current-icon").attr("class", fontAwesomeId + " mt-2");
                $("#current-temp").text(" " + tempCurrent + " ");
                $("#current-wind").text(" " + currentWindSpeed);
                $("#current-humidity").text(" " + currentHumidity);

            });
        }
        // display Forecast
        function displayForecastWeather(x, y) {
            // Example URL: api.openweathermap.org/data/2.5/forecast?q={city name}&appid={API key}
            var units = "&units=imperial"
            var queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + x + "&lon=" + y + "&exclude=current,minutely,hourly,alerts" + units + "&appid=653447e5538dcc45b8534eb1e5c601c3";

            $.ajax({
                url: queryURL,
                method: "GET"
            }).then(function (response) {
                $("#weather-forecast").empty();

                // Grab data
                aDaily = response.daily;

                for (let i = 1; i < 6; i++) {

                    // Grab Data
                    var item = aDaily[i];
                    var dayShort = dateTime.fromSeconds(item.dt).weekdayShort;

                    var hi = Math.round(item.temp.max);
                    var lo = Math.round(item.temp.min);
                    var wind = Math.round(item.wind_speed);
                    var rainPop = Math.round(item.pop);
                    var iconId = item.weather[0].icon;
                    var descript = item.weather[0].description;

                    var fontAwesomeId = getWeatherIcon(iconId, descript);
                    var iFACond = $("<i>").attr("class", fontAwesomeId + " my-2 is-size-2");

                    // Create Forecast Elements
                    var divDay = $("<div>").attr("class", "tile is-child is-vertical p-1")
                    var divDate = $("<div>").attr("class", "myBold").text(dayShort);



                    var divHiLo = $("<div>").attr("class", "mb-1").text(" | ");
                    var iUp = $("<i>").attr("class", "fas fa-arrow-up");
                    var sUp = $("<span>").text(" " + hi);

                    var iDn = $("<i>").attr("class", "fas fa-arrow-down");
                    var sDn = $("<span>").text(" " + lo);

                    var iWd = $("<i>").attr("class", "fas fa-wind");
                    var sWd = $("<span>").text(" " + wind + " MPH");

                    // Append all the things
                    divHiLo.prepend(sUp).prepend(iUp).append(iDn).append(sDn);
                    divDay.append(divDate, iFACond, divHiLo, iWd, sWd);

                    $("#weather-forecast").append(divDay);


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
                    else if (month === "nextnext") { var hcmTitleDiv = $("<div>").attr("class", "is-size-6 myBold").text(oneYearAgoThreeMonthsStart.monthLong); }
                    var mostlyCondDiv = $("<div>").text("Mostly " + mostlyCondition);
                    var avgHiDiv = $("<div>").text("Hi average - " + avgHi);
                    var avgLoDiv = $("<div>").text("Lo average - " + avgLo);

                    // Append the above elements
                    $("#" + month).append(hcmTitleDiv, mostlyCondDiv, avgHiDiv, avgLoDiv)


                }); // Uncomment this for prod
            }


        }
        // Takes in the ICON ID String and returns the appropriate font-awesome icon to match
        function getWeatherIcon(id, cond) {
            // If the icon is for daytime, return day icon, else return night icon

            // Clear sky
            if (id === "01d") { return "fas fa-sun"; }
            if (id === "01n") { return "fas fa-moon"; }

            // few clouds
            if (id === "02d") { return "fas fa-cloud-sun"; }
            if (id === "02n") { return "fas fa-cloud-moon"; }

            // scattered clouds & broken clouds
            if (id.match(/03/) || id.match(/04/)) { return "fas fa-cloud"; }

            // shower rain
            if (id.match(/09/)) { return "fas fa-cloud-showers-heavy"; }

            // Rain
            if (id.match(/10d/)) { return "fas fa-cloud-sun-rain"; }
            if (id.match(/10n/)) { return "fas fa-cloud-moon-rain"; }

            // Thunderstorm
            if (id.match(/11/)) { return "fas fa-bolt"; }

            // Snow
            if (id.match(/50/)) { return "fas fa-snowflake"; }

            // Other
            if (id.match(/50/)) {
                switch (cond) {
                    case "mist":
                        return "fas fa-smog";
                    case "fog":
                        return "fas fa-smog";
                    default:
                        return "fas fa-smog";
                }
            }
        }
    }

    // Get Local Events 2 weeks; per type (music/sport)
    function displayLocalEvents(type, city) {

        var startDate = localTime.toISODate();
        var startTime = localTime.toISO().split("T")[1].split(".")[0];
        var endDate = localTime.plus({ week: 2 }).toISODate();
        var endTime = "23:59:59"
        var query = "https://app.ticketmaster.com/discovery/v2/events?apikey=3XcemfxRjBsVA2szubVBECOW6GJHcyol&keyword=" + type + "&locale=*&startDateTime=" + startDate + "T" + startTime + "Z&endDateTime=" + endDate + "T" + endTime + "Z&city=" + city

        $.ajax({
            type: "GET",
            url: query,
            async: true,
            dataType: "json",
            success: function (response) {

                // Get list of events
                aEvents = response._embedded


                // If there are events then do something.. else show message there are no upcoming events in the next 2 weeks
                if (aEvents) {

                    var totalEvents = response.page.totalElements;
                    var eventContainer = $("#" + type + "-div");
                    $(eventContainer).empty();

                    // Setup the parent music container
                    var divTitle = $("<div>").attr("class", "myBold has-text-centered").text(type.charAt(0).toUpperCase() + type.slice(1));
                    var hr = $("<hr>").attr("class", "my-2");

                    // Append the Setup elements
                    $(eventContainer).append(divTitle, hr);

                    // Loop thru the events > create elements > append to approprite divs
                    for (let i = 0; (i < totalEvents && i < 5); i++) {

                        var thisEvent = aEvents.events[i];

                        // Grab data
                        var name = thisEvent.name;

                        // Create the elements
                        var divEvent = $("<div>").attr("class", "myBold is-size-6 py-1");
                        var iPin = $("<i>").attr("class", "has-text-grey is-rounded fas fa-thumbtack btnPin");
                        var urlEvent = thisEvent.url;
                        var linkEvent = $("<a>").text(" " + name.slice(0, 60) + "...").attr({ href: urlEvent, target: "_blank", syle: "text-decoration: none;" });

                        // Append the event elements
                        divEvent.append(iPin, linkEvent);
                        $(eventContainer).append(divEvent);
                    }
                } else {
                    console.log("No events listed at this time...");
                }

            },
            error: function (xhr, status, err) {
                // This time, we do not end up here!
            }
        });
    }

    // Event listener
    $("#searchButton").click(searchButtonClicked);
    $("#searchedCityButtonWelcome").click(searchButtonWelcomeClicked);
    $("#favorite-button").click(saveFavorites);





    displayFavorites();

    function displayFavorites() {
        // If localstorage exists & has data.. do something.. else nothing..
        if (localStorage.getItem("favorites")) {
            console.log("Has Storage");

            // Empty contents to rebuild list
            listFavorites.empty();

            // Handle for the list element
            var listFavorites = $("#favorites-list");

            aFavorites = JSON.parse(localStorage.getItem("favorites"));

            // Loop thru the array and append
            aFavorites.forEach(function (i) {
                var linkCity = $("<a>").attr("class", "navbar-item").text(i)
                listFavorites.append(linkCity);
            });
        } else {
            console.log("No storage");
        }
    }


    function saveFavorites(e) {
        e.preventDefault();

        // Grab the text from current City Div
        var city = $("#currentCityName").text();

        // If text is not blank then proceed to favorite logic... else do not
        if (city !== "") {
            console.log("City Text has a value");

            // Save to local storage
            if (aFavorites.indexOf(city) === -1) {
                // Set favorite to Array
                aFavorites.push(city);
                localStorage.setItem("favorites", JSON.stringify(aFavorites));
            }

            displayFavorites();

        } else {
            console.log("RAAR");
        }

    }


});