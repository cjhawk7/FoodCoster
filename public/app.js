



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
    $('.container-results').append(data['average_price']);
    
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

function displayBudget() {

}



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



