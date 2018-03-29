// let MOCK_STATUS_UPDATES = {
//     "statusUpdates": [
//         {
//             "name":"Belgrade, Serbia",
            
//             "prices":[
//                {
//                   "average_price":5.443478260869566,
//                }
//             ]
//         }
//     ]  
// };



function getNumbeoData(searchTerm, callback) {
    const settings = {
        url: `https://www.numbeo.com/api/city_prices?api_key=4uxocu7eiqwid6&query=${searchTerm}`,
        dataType: 'json',
        type: 'GET',
        success: callback,
        headers: {
            'Access-Control-Allow-Origin': '*',
        }
    };
    $.ajax(settings);  
}



function displayNumbeoData(data) {

       $('.container-results').append(data.prices[0].average_price);
}


function getAndDisplayNumbeoData() {
    $('.search').submit(event => {
        event.preventDefault();
        const queryTarget = $(event.currentTarget).find('.js-query-name');
        const query = queryTarget.val();
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



