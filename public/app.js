let postVal = {
    budget: 0,
    location: '',
    time: 1,
    meals: 1
}

function getNumbeoData(cityName, budgetTotal, timeTotal, mealsTotal, callback) {
   
    const settings = {
        url: '/makeRequest/' + cityName,
        dataType: 'json',
        type: 'GET',
        success: callback,
    };
    
    $.ajax(settings);  
}



function round(number, precision) {
    var shift = function (number, precision, reverseShift) {
      if (reverseShift) {
        precision = -precision;
      }  
      var numArray = ("" + number).split("e");
      return +(numArray[0] + "e" + (numArray[1] ? (+numArray[1] + precision) : precision));
    };
    return shift(Math.round(shift(number, precision, false)), precision, true);
}

function displayNumbeoData(response) {
    let calcResult = 0;
    const location = $('#location').val();
    const budget = $('#budget').val();
    const time = $('#time').val();
    const unit = $('#unit').val();
    const meals = $('#meals').val();
    let currencyLocation = response.currency + ' to eat out in ' + location + ' for the duration of your stay.'
    let a = $('<p></p>');
    
    if  (unit === 'Weeks') {

        calcResult = response.data['average_price'] * 7 * time * meals;
        let currencyLocation = response.currency + ' to eat out in ' + location + ' for the duration of your stay.';
        let a = $('<p></p>');
        a.text('It will be roughly ' + round(calcResult, 2)  + currencyLocation);
        $('.container-results').html(a); 


    } else if (unit === 'Days') {

        calcResult = response.data['average_price'] * time * meals;
        // p is coming from index.html
        // need to remove to prevent duplicate calcResult string below
        // buttons being pushed off results div
        a.text('It will be roughly ' + round(calcResult, 2)  + currencyLocation);
        $('.container-results').html(a);
    }
    if (calcResult <= budget) {
        
        $('.container-results p').append(' Nice, you are within your budget!'); 

    }
    else {
        
        $('.container-results').append(' Whoops, might want to increase your budget!') 
    }
}

function sendSearchData(post, callback) {
    
    const settings = {
        url: '/searchData',
        dataType: 'json',
        type: 'POST',
        data: JSON.stringify(post),
        success: callback,
        contentType: 'application/json'
    };
    
    $.ajax(settings);  
}
function successFunction() {
    console.log('success');
}

function setupClickHandlers() {
    $('.search').submit(event => {
        event.preventDefault();
        postVal.location = $(event.currentTarget).find('#location').val();
        postVal.budget = $(event.currentTarget).find('#budget').val();
        postVal.time = $(event.currentTarget).find('#time').val();
        postVal.meals = $(event.currentTarget).find('#meals').val();
        const unit = $('#unit').val();
        $('.container-results').text('');
        // $('.container-history').text('');
        getNumbeoData(postVal.location, postVal.budget, postVal.time, postVal.meals, displayNumbeoData);
    });

    $('.save').on('click', function() { 
        // $('.container-history').removeClass('hidden');
        $('.container-history').append(' Location: ' + postVal.location + ' Budget: $' + postVal.budget + ' Meals: ' + postVal.meals  + ' Time: ' + postVal.time, $('.container-results p').html());
        console.log('hi');
        sendSearchData(postVal, successFunction);
    });

    $('.historystore').on('click', function(){
        $('.signup').addClass('hidden');    
        $('.login').addClass('hidden');
        $('.aboutpage').addClass('hidden');
        $('.container-history').removeClass('hidden');   
        $('.search').addClass('hidden');
    });
    
    $('.about').on('click', function(){
        $('.signup').addClass('hidden');
        $('.login').addClass('hidden');
        $('.aboutpage').removeClass('hidden');  
        $('.search').addClass('hidden');
        $('.container-history').addClass('hidden');
    });

    $('.home').on('click', function(){
        $('.login').addClass('hidden');
        $('.signup').addClass('hidden');
        $('.search').removeClass('hidden');
        $('.aboutpage').addClass('hidden');
        $('.container-history').addClass('hidden');
        $('.container-results').addClass('hidden');
    });

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
    
};

$(function() {
    setupClickHandlers();
})




