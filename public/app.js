



function getNumbeoData(cityName, budgetTotal, timeTotal, callback) {
   
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
        // let currencyLocation = response.currency + ' to eat out in ' + location + ' for the duration of your stay.';
        // let a = $('<p></p>');
        a.text('It will be roughly ' + round(calcResult, 2)  + currencyLocation);
        $('.container-results p').html(a); 


    } else if (unit === 'Days') {

        calcResult = response.data['average_price'] * time * meals;
        // p is coming from index.html
        //need to remove to prevent duplicate calcResult string below
        $('.container-results p').append(' It will be roughly ' + round(calcResult, 2)  +   currencyLocation)
    }
    if (calcResult <= budget) {
        // console.log('You are within your budget!') 
        $('.container-results p').append( ' Nice, you are within your budget!'); 

    }
    else {
        console.log('Not enough money!')
        $('.container-results p').append(' Whoops, might want to increase your budget!') 
    }

}



function getAndDisplayNumbeoData() {
    $('.search').submit(event => {
        event.preventDefault();
        const location = $(event.currentTarget).find('#location').val();
        const budget = $(event.currentTarget).find('#budget').val();
        const time = $(event.currentTarget).find('#time').val();
        const meals = $(event.currentTarget).find('#meals').val();
        $('.container-results p').text('');
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

$('.savedelete').on('click', function(){
    $('.container-results').addClass('hidden');
});




