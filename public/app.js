



function getNumbeoData(searchTerm, callback) {
   
    const settings = {
        url: '/makeRequest',
        dataType: 'json',
        type: 'GET',
        success: callback,
    };
    
    $.ajax(settings);  
}


function displayNumbeoData(data) {
    $('.container-results').append(data.prices[0].average_price);
}


function getAndDisplayNumbeoData() {
    $('.search').submit(event => {
        event.preventDefault();
        const queryTarget = $(event.currentTarget).find('.js-query-search'[1]);
        const query = queryTarget.val();
        console.log('hi', queryTarget.val());
        getNumbeoData(query, displayNumbeoData);
    });
};


$(function() {
    getAndDisplayNumbeoData();
})


$('.js-signup-btn').on('click', function(){
    $('.signup').addClass('hidden');
    $('.login').removeClass('hidden');
});

$('.js-login-btn').on('click', function(){
    $('.login').addClass('hidden');
    $('.search').removeClass('hidden');
});



