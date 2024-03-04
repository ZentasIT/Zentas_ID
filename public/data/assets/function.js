let userName; // Имя
let userSurname; // Фамилия
let middleName; // Фамилия
let phone; // Номер телефона
let date; // ID
let id;
requestMpData()
function getAccessTokenFromCookies() {
    const cookies = document.cookie.split(';');
    let accessToken = null;
    cookies.forEach(cookie => {
        const [name, value] = cookie.trim().split('=');
        if (name === 'accessToken') {
            accessToken = decodeURIComponent(value);
        }
    });
    return accessToken;
}

// Пример использования функции


function requestMpData(){
    let accessToken = getAccessTokenFromCookies();
    if (accessToken === null){
        accessToken = 'nine'
    }

    let data = {
        mainpage: accessToken

    };
    console.log(data);
    fetch('/api/request', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            userName = data.name;
            userSurname = data.family;
            phone = data.number;
            middleName = data.surname;
            date = data.date;
            id = data.id;
            document.getElementById("loader").remove()
            loadUserHead()
        })

        .catch(error => {
            console.error('Ошибка при отправке данных:', error);
            location.replace('/api/refresh')
            // Здесь можно выполнить дополнительные действия при ошибке отправки
        });
}