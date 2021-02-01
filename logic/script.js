// Global Variables
// ......

// Define Functons
function searchButtonClicked() {
    displayWeatherHistory();
}

// Display Weather History
function displayWeatherHistory() {

};

// Event listener
$("#searchButtonDashboard").click(searchButtonClicked);

// Display Events (Ticketmaster Discover API)

    // Notes and Info For Ticketmaster Discovery API (Open API- 5000 Calls Pery Day)
        // My ticketmaster Key: Tt06tcfEuZlIkXAxhlvZFSuqmv0EOmz0
        // ticketmaster Root URL: https://app.ticketmaster.com/discovery/v2/
        // NOTE - we could run searches for sports and music, have two side by side tiles under "entertainment parent"
        // NOTE - we should add a date filter somehow so it runs maybe like "Today-two weeks" or something

    // Get Local Events Function Using Trip Advisor
    function getLocalEvents (){
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
            type:"GET",
            url:"https://app.ticketmaster.com/discovery/v2/events.json?size=1&apikey=Tt06tcfEuZlIkXAxhlvZFSuqmv0EOmz0",
            async:true,
            dataType: "json",
            success: function(json) {
                        console.log(json);
                        // Parse the response.
                        // Do other things.
                     },
            error: function(xhr, status, err) {
                        // This time, we do not end up here!
                     }
          });
    }