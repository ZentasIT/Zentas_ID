document.addEventListener("DOMContentLoaded", function() {
    var searchBox = document.getElementById("searchbox");

    searchBox.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            // Вызываем вашу определенную функцию
            yourFunction(); // Замените yourFunction() на вашу функцию
        }
    });
});

function yourFunction() {

    console.log("Enter pressed!");
    let searchBox = document.getElementById("searchbox").value
    searchBox = searchBox.replace(' ', "&");
    let hostname = window.location.hostname;
    console.log(searchBox);
    window.open(`http://${hostname}/search/mp?search=${searchBox}`, '_blank');



}
