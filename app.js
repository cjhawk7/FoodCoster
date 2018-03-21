var MOCK_STATUS_UPDATES = {
    "statusUpdates": [
        {
            "name":"Belgrade, Serbia",
        
            "prices":[
               {
                  "average_price":5.443478260869566,
               }
            ]
        }
    ]  
};

// $('.signup-btn').on('click', function(){
//     $('.signup-page').addClass("hidden");
//     $('.login-page').removeClass("hidden");
// });


function statusUpdates() {
    $.get('/MOCK_STATUS_UPDATES', function(data) {

    });
}

function getRecentStatusUpdates(callbackFn) {
    setTimeout(function(){ callbackFn(MOCK_STATUS_UPDATES)}, 100);
}

// this function stays the same when we connect
// to real API later
function displayStatusUpdates(data) {
    for (index in data.statusUpdates) {
       $('body').append(
        '<p>' + data.statusUpdates[index].text + '</p>');
    }
}

// this function can stay the same even when we
// are connecting to real API
function getAndDisplayStatusUpdates() {
    getRecentStatusUpdates(displayStatusUpdates);
}

$(function() {
    getAndDisplayStatusUpdates();
})

