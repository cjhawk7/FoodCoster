var MOCK_STATUS_UPDATES = {
    "statusUpdates": [
        
            "monthLastUpdate":4,
            "contributors":91,
            "name":"Belgrade, Serbia",
            "prices":[
               {
                  "average_price":5.443478260869566,
                  "item_name":"Meal, Inexpensive Restaurant, Restaurants",
                  "highest_price":7,
                  "item_id":1,
                  "lowest_price":4,
                  "data_points": 50
               }
            ]
    ]  
};

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