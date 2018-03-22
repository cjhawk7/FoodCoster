

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


function statusUpdates(searchTerm) {
    $.get('/mock_status_updates', function(data) {
        $('.feedback-js-page').text(data);
    });
}

function watchSubmit() {
    $('.js-search-page').submit(event => {
        event.preventDefault();
        const queryTarget = $(event.currentTarget).find('.js-query');
        const query = queryTarget.val();
        statusUpdates(query);
    });
};
$(watchSubmit);

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


