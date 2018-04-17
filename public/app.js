



function getNumbeoData(cityName, callback) {
   
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
        const queryTarget = $(event.currentTarget).find('.js-location');
        const query = queryTarget.val();
        console.log(queryTarget.val());
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



