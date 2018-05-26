const postVal = {
    budget: 0,
    location: '',
    time: 1,
    meals: 1
}

const userData = {
    firstName: 'a',
    lastName: 'b',
    username: 'c',
    password: 'd'
}

const loginData = {
    username: 'a',
    password: 'b'
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

function createUser(data, callback) {
    
    const settings = {
        url: '/api/users',
        dataType: 'json',
        type: 'POST',
        data: JSON.stringify(data),
        success: callback,
        contentType: 'application/json'
    };
    
    $.ajax(settings);  
    $('.signup').addClass('hidden');
    $('.login').removeClass('hidden');
}



function loginUser(data, callback) {

    const settings = {
        url: '/api/auth/login',
        dataType: 'json',
        type: 'POST',
        data: JSON.stringify(data),
        success: callback,
        contentType: 'application/json'
    };
    
    $.ajax(settings);  
    console.log($('.historystore').html());
    $('.login').addClass('hidden');
    $('.search').removeClass('hidden');
    $('.historystore').removeAttr('hidden')
    $('.logout').removeAttr('hidden');
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
    
    
    if  (unit === 'Weeks') {

        calcResult = response.data['average_price'] * 7 * time * meals;
        let currencyLocation = response.currency + ' to eat out in ' + location + ' for the duration of your stay.';
        let p = $('.container-results p')
        p.html('It will be roughly ' + round(calcResult, 2)  + currencyLocation);
       

    } else if (unit === 'Days') {

        calcResult = response.data['average_price'] * time * meals;

        $('.container-results p').html('It will be roughly ' + round(calcResult, 2)  + currencyLocation);
    }

    if (calcResult <= budget) {
        
        $('.container-results p').append(' Nice, you are within your budget!'); 

    }
    else {
        
        $('.container-results p').append(' Whoops, might want to increase your budget!') 
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

function userCreated() {
    console.log('new user created');
}

function userLoggedIn() {
    console.log('user logged in');
}

function setupClickHandlers() {
    $('.search').submit(event => {
        console.log('here');
        event.preventDefault();
        postVal.location = $(event.currentTarget).find('#location').val();
        postVal.budget = $(event.currentTarget).find('#budget').val();
        postVal.time = $(event.currentTarget).find('#time').val();
        postVal.meals = $(event.currentTarget).find('#meals').val();
        const unit = $('#unit').val();
        $('.container-results p').text('');
        getNumbeoData(postVal.location, postVal.budget, postVal.time, postVal.meals, displayNumbeoData);
    });

    $('.signup').submit(event => { 
        event.preventDefault();
        userData.firstName = $(event.currentTarget).find('#firstName').val();
        userData.lastName = $(event.currentTarget).find('#lastName').val();
        userData.username = $(event.currentTarget).find('#email').val();
        userData.password = $(event.currentTarget).find('#password').val();
        createUser(userData, userCreated);
    });

    $('.login').submit(event => { 
        event.preventDefault();
        loginData.username = $(event.currentTarget).find('#email-login').val();
        loginData.password = $(event.currentTarget).find('#password-login').val();
        $('.home').removeClass('hidden');   
        loginUser(loginData, userLoggedIn);
        $('.topnav p').append('Welcome, ', $(event.currentTarget).find('#email-login').val());
        if (status === X) {
            alert('oops, sorry');
        }
    });

    $('.save').on('click', function() { 
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
        $('.signup').removeClass('hidden');
        $('.search').addClass('hidden');
        $('.aboutpage').addClass('hidden');
        $('.container-history').addClass('hidden');
        $('.container-results').addClass('hidden');
    });

    $('.logout').on('click', function(){
        $('.login').removeClass('hidden');
        $('.signup').addClass('hidden');
        $('.search').addClass('hidden');
        $('.aboutpage').addClass('hidden');
        $('.container-history').addClass('hidden');
        $('.container-results').addClass('hidden');
        $('.topnav p').text('');
    });

    $('.js-search-btn').on('click', function(){
        $('.container-results').removeClass('hidden');
    });
};

$(function() {
    setupClickHandlers();
})




