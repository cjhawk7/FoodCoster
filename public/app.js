const postVal = {
    budget: 0,
    location: '',
    time: 1,
    meals: 1,
    info: ''
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

let authToken;

let info;

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
    $('.search').removeAttr('hidden');
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
        p.html(' It will be roughly ' + round(calcResult, 2)  + currencyLocation);
       

    } else if (unit === 'Days') {

        calcResult = response.data['average_price'] * time * meals;

        $('.container-results p').html(' It will be roughly ' + round(calcResult, 2)  + currencyLocation);
    }

    if (calcResult <= budget) {
        
        $('.container-results p').append(' Nice, you are within your budget!'); 

    }
    else {
        
        $('.container-results p').append(' Whoops, might want to increase your budget!') 
    }

    let m = ' It will be roughly ' + round(calcResult, 2)  + currencyLocation;

    info = m;

    console.log(info);
}

// getting 500 when sending after adding info property
function sendSearchData(post, callback) {
    
    const settings = {
        headers: {'Authorization': `Bearer ${authToken.authToken}`},
        url: '/searchData',
        dataType: 'json',
        type: 'POST',
        data: JSON.stringify(post),
        success: callback,
        contentType: 'application/json'
    };
    
    $.ajax(settings);  
}

function getSearchData(callback) {
    
    const settings = {
        headers: {'Authorization': `Bearer ${authToken.authToken}`},
        url: '/searchData',
        dataType: 'json',
        type: 'GET',
        success: callback,
        contentType: 'application/json'
    };
    
    $.ajax(settings);  
}

function deleteSearchData(callback) {
    
    const settings = {
        headers: {'Authorization': `Bearer ${authToken.authToken}`},
        url: '/searchData:/id',
        dataType: 'json',
        type: 'DELETE',
        success: callback,
        contentType: 'application/json'
    };
    
    $.ajax(settings);  
}


function displaySearchData (data) {
    let p = $('.container-history p')
    let renderingPosts = data.posts.map((post) => ({
        location: post.location,
        budget: post.budget, 
        meals_a_day: post.meals,
        length_of_stay: post.time,
        result: post.info
    }));
    console.log(renderingPosts);

    
        let html = '';
        var array = renderingPosts;
            if (array) {
                $.each(array, function (i) {
                    //beginning of search object
                    

                    html += ('<div class = "searchwrap"><ul><div class ="wrapper"><button class = "historyremove"><span class ="button-label">remove</span></button></div>')
                    $.each(array[i], function (key, value) {

                        html += ('<li>' + key + ': ' + value + '</li>');
                    });
                    html += ('</ul></div>')
                        html += '<br></br>';
                        
                        $('.container-history p').html(html);
                });
            }

}

function successFunction() {
    console.log('success');
}

function userCreated() {
    console.log('new user created');
}

function userLoggedIn(data) {
    authToken = data;
    console.log(data);

    console.log('user logged in');
}

function deleteData(data) {

     console.log(data);
}

function setupClickHandlers() {
    $('.search').submit(event => {
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
        $('.historystore').removeClass('hidden');
    });

    $('.save').on('click', function() { 
        postVal.info = info;
        
        sendSearchData(postVal, successFunction);
    });

    $('.historyremove').on('click', function() { 
       console.log('delete');
        deleteSearchData(deleteData);
        
    });


    $('.historystore').on('click', function(){
        $('.signup').addClass('hidden');    
        $('.login').addClass('hidden');
        $('.aboutpage').addClass('hidden');
        $('.container-history').removeClass('hidden');   
        $('.search').addClass('hidden');
        $('.searchnav').removeAttr('hidden');
        getSearchData(displaySearchData);
    });
    
    $('.home').on('click', function(){
        $('.signup').removeClass('hidden');
        $('.login').addClass('hidden');
        $('.aboutpage').removeClass('hidden');  
        $('.search').addClass('hidden');
        $('.container-history').addClass('hidden');
        $('.searchnav').removeAttr('hidden');
    });

    // $('.register').on('click', function(){
    //     $('.login').addClass('hidden');
    //     $('.signup').removeClass('hidden');
    //     $('.search').addClass('hidden');
    //     $('.aboutpage').addClass('hidden');
    //     $('.container-history').addClass('hidden');
    //     $('.container-results').addClass('hidden');
    // });

    $('.signin').on('click', function(){
        $('.login').removeClass('hidden');
        $('.signup').addClass('hidden');
        $('.search').addClass('hidden');
        $('.aboutpage').addClass('hidden');
        $('.container-history').addClass('hidden');
        $('.container-results').addClass('hidden');
    });


    $('.logout').on('click', function(){
        $('.signup').addClass('hidden');
        $('.search').addClass('hidden');
        $('.aboutpage').addClass('hidden');
        $('.container-history').addClass('hidden');
        $('.container-results').addClass('hidden');
        $('.historystore').addClass('hidden');
        $('.topnav p').text('');
        $('.searchnav').attr('hidden', 'true');
        $('.logout').addClass('hidden');
        $('.login').removeClass('hidden');
        authToken = undefined;
    });

    $('.searchnav').on('click', function(){
        $('.login').addClass('hidden');
        $('.signup').addClass('hidden');
        $('.search').removeClass('hidden');
        $('.aboutpage').addClass('hidden');
        $('.container-history').addClass('hidden');
        $('.container-results').addClass('hidden');
        $('.searchnav').attr('hidden', 'true');
    });

    $('.js-search-btn').on('click', function(){
        $('.container-results').removeClass('hidden');
    });
};

$(function() {
    setupClickHandlers();
})




