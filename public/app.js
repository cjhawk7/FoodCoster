



function getNumbeoData(searchTerm, callback) {
    axios.get(`https://www.numbeo.com/api/city_prices?api_key=4uxocu7eiqwid6&query=${searchTerm}`)
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
        console.log(error);
        });




    // const settings = {
    //     url: `https://www.numbeo.com/api/city_prices?api_key=4uxocu7eiqwid6&query=${searchTerm}`,
    //     dataType: 'json',
    //     type: 'GET',
    //     success: callback,
    // };
    //     headers {
    //         'Access-Control-Allow-Origin':   '*',    
    //         'Access-Control-Allow-Headers': 'Content-Type',
    //         'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE',
    //     }
    // $.ajax(settings);  
}

// function numberOfMeals() {
//     let queryBudget = $()
//     $('.container-results').append() 
// }


function displayNumbeoData(data) {
    $('.container-results').append(data.prices[0].average_price);
}


function getAndDisplayNumbeoData() {
    $('.search').submit(event => {
        event.preventDefault();
        const queryTarget = $(event.currentTarget).find('.js-query-search'[1]);
        const query = queryTarget.val();
        console.log('hi', queryTarget.val());
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



