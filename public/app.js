



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
    const calcResult = 0;
    const location = $('#location').val();
    const budget = $('#budget').val();
    const time = $('#time').val();
    const unit = $('#unit').val();
    console.log(response);
    
    $('.container-results').append(round(response.data['average_price'], 2)  + response.currency + ' average to eat out in ' + location);
    
    if  (unit === 'Weeks') {
        
      calcResult = response.data['average_price'] * 7 * 3 * time;

    } else if (unit === 'Days') {

        calcResult = response.data['average_price'] * 3 * time;
    }
    if (calcResult <= budget) {
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




