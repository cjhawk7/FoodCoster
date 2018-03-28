let MOCK_STATUS_UPDATES = {
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

function watchSubmit() {
    $('.js-search-page').submit(event => {
        event.preventDefault();
        const queryTarget = $(event.currentTarget).find('.js-query');
        const query = queryTarget.val();
        getRecentStatusUpdates(displayStatusUpdates);
    });
};
$(watchSubmit);

function getRecentStatusUpdates(callbackFn) {
    // const settings = {
    //     url: `mock_status_updates`,
    //     dataType: 'json',
    //     type: 'GET',
    //     success: callback,
    // }
    // $.ajax(settings);  
    setTimeout(function(){ callbackFn(MOCK_STATUS_UPDATES)}, 100);
}

// this function stays the same when we connect
// to real API later
function displayStatusUpdates(data) {
    for (index in data.statusUpdates) {
       $('.container-results').append(
        '<p>' + data.statusUpdates[index].name + data.statusUpdates[index].prices.map(function(item) {
            return item.average_price;
        
        }).join(', ') + '</p>');
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


$('.js-signup-btn').on('click', function(){
    $('.signup').addClass('hidden');
    $('.login').removeClass('hidden');
});

$('.js-login-btn').on('click', function(){
    $('.login').addClass('hidden');
    $('.search').removeClass('hidden');
});

$('.js-search-btn').on('click', function(){
    $('.search').addClass('hidden');
    $('.feedback').removeClass('hidden');
}); 

$('.js-return-btn').on('click', function(){
    $('.feedback').addClass('hidden');
    $('.search').removeClass('hidden');
}); 


