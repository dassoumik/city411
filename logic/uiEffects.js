//Define Logic For U.I effects not availible in Framework

    // Enter submits value on form inputs...

    // Menu collapses in hamburger on smaller viewports

// Media Query to Remove Clases ON Viewport Change
    
    
    // This evens out the weather tiles on mobile phones and tablets
        if (matchMedia) {
            console.log("event listner for screen width fired")
            var mobileBreakPoint = window.matchMedia( "(max-width:768px)");
            mobileBreakPoint.addEventListener;
            makeMobile(mobileBreakPoint);
        }

        function makeMobile(mobileBreakPoint) {
            if (mobileBreakPoint.matches) {
                console.log("making for mobile");
                $("#historicLargeTile").removeClass("py-0 mx-1");
                $("#historicLargeTile").addClass("p-0");
            }
            else {
                console.log("making for regular");
                $("#historicLargeTile").addClass("py-0 mx-1");
                $("#historicLargeTile").removeClass("p-0");
            }
        }
