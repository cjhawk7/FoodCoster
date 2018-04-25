



function getNumbeoData(cityName, budgetTotal, timeTotal, callback) {
   
    const settings = {
        url: '/makeRequest/' + cityName,
        dataType: 'json',
        type: 'GET',
        success: callback,
    };
    
    $.ajax(settings);  
}


function displayNumbeoData(response) {

    const location = $('.js-location').val();
    const budget = $('.js-budget').val();
    const time = $('.js-length').val();

    console.log(response);
    $('.container-results').append(response.data['average_price'] + response.currency + ' average to eat out in ' + location);
    if  (time == 1 && response.data['average_price'] * 21 <= budget) {
        console.log('You are within your budget!') 
        $('.container-results').append('You are within your budget!') 
    }
    else {
        console.log('Not enough money!')
        $('.container-results').append(' Sorry, not enough money!') 
    }

}



function getAndDisplayNumbeoData() {
    $('.search').submit(event => {
        event.preventDefault();
        const location = $(event.currentTarget).find('.js-location').val();
        const budget = $(event.currentTarget).find('.js-budget').val();
        const time = $(event.currentTarget).find('.js-length').val();

        console.log(location);
        console.log(budget);
        getNumbeoData(location, budget, time, displayNumbeoData);
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

$('.js-search-btn').on('click', function(){
    $('.container-results').removeClass('hidden');
});




