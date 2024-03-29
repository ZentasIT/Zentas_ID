let userName; // Имя
let userSurname; // Фамилия
let phone; // Номер телефона
let DislayId; // ID

let plusbalance;
let questsbalance;
let expCount;
let expDate;


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
requestMpData()
requestProData()
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
            DislayId = data.id;
            document.getElementById("loader").remove()
            loadUserHead()
        })

        .catch(error => {
            console.error('Ошибка при отправке данных:', error);
            location.replace('/api/refresh')
            // Здесь можно выполнить дополнительные действия при ошибке отправки
        });
}
function requestProData(){
    let accessToken = getAccessTokenFromCookies();
    if (accessToken === null){
        accessToken = 'nine'
    }

    let data = {
        data: accessToken

    };
    console.log(data);
    fetch('/api/pro', {
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
            plusbalance = data.count;
            expCount = data.expCount;
            expDate = data.exp;
            loadPro()
        })

        .catch(error => {
            console.error('Ошибка при отправке данных:', error);
            // location.replace('/api/refresh')
            // Здесь можно выполнить дополнительные действия при ошибке отправки
        });
}