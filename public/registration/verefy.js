if (window.location.hash === '#verefy') {
    // Функция, которую нужно выполнить
    function myFunction() {
        // Ваш код здесь
        console.log('Функция выполнена');
    }

    // Вызов функции
    verefy();
}
function verefy(){
    document.getElementById('alert2').style.display = 'block';
    setTimeout(function () {
        document.getElementById('alert2').style.display = 'none';

    }, 15000); // Перемещение setTimeout после аргумента функции
}