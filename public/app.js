



function getNumbeoData(cityName, budgetTotal, timeTotal, callback) {
   
    const settings = {
        url: '/makeRequest/' + cityName,
        dataType: 'json',
        type: 'GET',
        success: callback,
    };
    
    $.ajax(settings);  
}


function displayNumbeoData(data) {

    const location = $('.js-location').val();
    const budget = $('.js-budget').val();
    const time = $('.js-length').val();

    $('.container-results').append(data['average_price'] + ' dollars average per meal in ' + location);
    
    if  (time == 1 && data['average_price'] * 21 <= budget) {
        console.log('You are within your budget!') 
        $('.container-results').append(' You are within your budget!') 
    }
    else {
        console.log('Not enough money!')
        $('.container-results').append(' Not enough money!') 
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



