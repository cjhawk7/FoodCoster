const postVal = {
    budget: 0,
    location: '',
    time: 1,
    meals: 1,
    info: '',
    unit: ''
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

const reset = {
    username: 'a',
    oldpassword: 'b',
    newpassword: 'c'
}

let authToken;

let info;

let unit;

function getNumbeoData(cityName, budgetTotal, timeTotal, mealsTotal, callback) {
   
    const settings = {
        url: '/makeRequest/' + cityName,
        dataType: 'json',
        type: 'GET',
        success: callback,
    };
    
    $.ajax(settings);  
}

function createUser(data, callback, err) {
    
    const settings = {
        url: '/api/users',
        dataType: 'json',
        type: 'POST',
        data: JSON.stringify(data),
        success: callback,
        error: err,
        contentType: 'application/json'
    };
    
    $.ajax(settings);  
    $('.signup').addClass('hidden');
    $('.login').removeClass('hidden');
}

function loginUser(data, callback, err) {

    const settings = {
        url: '/api/auth/login',
        dataType: 'json',
        type: 'POST',
        data: JSON.stringify(data),
        success: callback,
        error: err,
        contentType: 'application/json'
    };
    
    $.ajax(settings);  
    console.log($('.historystore').html());
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
    unit = $('#unit').val();
    const meals = $('#meals').val();

    $('.container-results').removeClass('hidden');
    
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
}


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

function deleteSearchData(id, callback) {
    
    const settings = {
        headers: {'Authorization': `Bearer ${authToken.authToken}`},
        url: '/searchData/' + id,
        dataType: 'json',
        type: 'DELETE',
        success: callback,
        contentType: 'application/json'
    };
    
    $.ajax(settings);  
}

function resetPassword(post, callback) {
    const settings = {
        // headers: {'Authorization': `Bearer ${authToken.authToken}`},
        url: '/searchData/' + id,
        dataType: 'json',
        type: 'PUT',
        data: JSON.stringify(post),
        success: callback,
        contentType: 'application/json'
    };
    
    $.ajax(settings);
}

function displaySearchData (data) {
    let p = $('.container-history p')
    let renderingPosts = data.posts.map((post) => ({
        Location: post.location,
        Budget: post.budget + ' USD', 
        Meals_a_day: post.meals + ' (eating out)',
        Length_of_stay: post.time + '' + post.unit,
        Result: post.info,
        id: post._id
    }));
    console.log(renderingPosts);

    let html = '';
    var array = renderingPosts;
        if (array) {

            $.each(array, function (i) {

                html += ('<div class="searchwrap"><ul><div class="wrapper"><button class="historyremove" data-id="'+array[i].id+'"><span class="button-label">remove</span></button></div>')
                delete array[i].id;
                $.each(array[i], function (key, value) {
                    html += ('<li>' + key + ': ' + value + '</li>');
                });

                html += ('</ul></div>')
                html += '<br></br>';    
            });

                $('.container-history p').html(html);

                $('.historyremove').on('click', function() { 
                
                    deleteSearchData($(this).data('id'), function (obj) { removeSearchData(obj)});
                });
        }
}

function removeSearchData(obj) {

    $(`button[data-id="${obj._id}"]`).closest('.searchwrap').remove();
}


function successFunction() {
    console.log('success');
}

function userCreated() {
    console.log('new user created');
}

function userLoggedIn(data) {
    authToken = data;
    $('.home').removeClass('hidden');   
    $('.topnav p').append('Welcome, ', loginData.username);
    $('.historystore').removeClass('hidden');
    $('.title').addClass('hidden');
    $('.signin').addClass('hidden');
    $('.logout').removeClass('hidden');
    $('.login').addClass('hidden');
    $('.search').removeClass('hidden');
    $('.home').addClass('hidden');
    $('.resetlink').removeClass('hidden');
    console.log(data);
    console.log('user logged in');
}

function createError() {

    $('.container p').append('Username is already taken')
}

function loginError() {

    $('.containerLogin p').append('Username or password is incorrect.') 
}

function deleteData(data) {

     console.log(data);
}

function passwordChange() {

console.log('password changed');

}

function signupPassword() {
    let x = document.getElementById("password");
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
}

function loginPassword() {
    let x = document.getElementById("password-login");
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
}


function setupClickHandlers() {

    $('.search').submit(event => {
        event.preventDefault();
        postVal.location = $(event.currentTarget).find('#location').val();
        postVal.budget = $(event.currentTarget).find('#budget').val();
        postVal.time = $(event.currentTarget).find('#time').val();
        postVal.meals = $(event.currentTarget).find('#meals').val();
        $('.container-results p').text('');
        getNumbeoData(postVal.location, postVal.budget, postVal.time, postVal.meals, displayNumbeoData);
    });

    $('.signup').submit(event => { 
        event.preventDefault();
        userData.firstName = $(event.currentTarget).find('#firstName').val();
        userData.lastName = $(event.currentTarget).find('#lastName').val();
        userData.username = $(event.currentTarget).find('#email').val();
        userData.password = $(event.currentTarget).find('#password').val();
        createUser(userData, userCreated, createError);
        $('.container p').text('');
    });

    $('.login').submit(event => { 
        event.preventDefault();
        loginData.username = $(event.currentTarget).find('#email-login').val();
        loginData.password = $(event.currentTarget).find('#password-login').val();
        loginUser(loginData, userLoggedIn, loginError);
        $('.containerLogin p').text('');
    });

    $('.js-reset-btn').submit(event => { 
        event.preventDefault();
        reset.username = $(event.currentTarget).find('#username').val();
        reset.oldpassword = $(event.currentTarget).find('#oldpassword').val();
        reset.newpassword = $(event.currentTarget).find('#newpassword').val();
        resetPassword(reset, passwordChange);
        $('.containerLogin p').text('');
    });


    $('.save').on('click', function() { 
        postVal.info = info;
        postVal.unit = unit;
        $('.container-results').addClass('hidden');
        
        sendSearchData(postVal, successFunction);
    });

    $('.delete').on('click', function() { 
        $('.container-results').addClass('hidden');    
    });

    $('.historystore').on('click', function(){
        $('.signup').addClass('hidden');    
        $('.login').addClass('hidden');
        $('.aboutpage').addClass('hidden');
        $('.container-history').removeClass('hidden');   
        $('.search').addClass('hidden');
        $('.searchnav').removeAttr('hidden');
        $('.title').addClass('hidden');
        getSearchData(displaySearchData);
    });

    $('.historyremove').on('click', function() { 
        console.log('delete');
         deleteSearchData(deleteData);
    });
 
    
    $('.home').on('click', function(){
        $('.signup').removeClass('hidden');
        $('.login').addClass('hidden');
        $('.aboutpage').removeClass('hidden');  
        $('.search').addClass('hidden');
        $('.container-history').addClass('hidden');
        $('.searchnav').attr('hidden', 'true');
        $('.title').removeClass('hidden');
        $('.container p').text('');
    });

    $('.login-link').on('click', function(){
        $('.login').removeClass('hidden');
        $('.signup').addClass('hidden');
        $('.search').addClass('hidden');
        $('.aboutpage').addClass('hidden');
        $('.container-history').addClass('hidden');
        $('.container-results').addClass('hidden');
    });

    $('.reset-link').on('click', function(){
        $('.login').addClass('hidden');
        $('.signup').addClass('hidden');
        $('.search').addClass('hidden');
        $('.aboutpage').addClass('hidden');
        $('.container-history').addClass('hidden');
        $('.container-results').addClass('hidden');
        $('.containerReset').removeClass('hidden');
        $('.searchnav').removeattr('hidden');
    });

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
        $('.signin').removeClass('hidden');
        $('.login').removeClass('hidden');
        $('.title').removeClass('hidden');
        $('.js-query').text('');
        $('.home').removeClass('hidden');
        $('.containerReset').addClass('hidden');
        
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
};


$(function() {
    setupClickHandlers();
})
