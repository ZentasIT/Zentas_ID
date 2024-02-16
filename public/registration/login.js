const email_login = document.getElementById('email_login');
const code_login = document.getElementById('code_login');

function login_check(){
    if (email_login.value.includes("@")){
        console.log("email++")
        sendEmail()
    }
}
function sendEmail(){
    const data = {
        email: email_login.value

    };
    fetch('/api/login', {
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
            console.log('Успешно отправлено:', data);
            // Здесь можно выполнить дополнительные действия при успешной отправке
            if (data && data.message) {
                console.log('Получено сообщение:', data.message);
                // Здесь можно выполнить дополнительные действия с полученным сообщением
                document.getElementById('alert').style.display = 'block';
                document.getElementById('alert').textContent = data.message;
                setTimeout(function () {
                    document.getElementById('alert').style.display = 'none';

                }, 3000); // Перемещение setTimeout после аргумента функции
            }
            if (data && data.success) {
                resize_code()
            }
        })
        .catch(error => {
            console.error('Ошибка при отправке данных:', error);
            // Здесь можно выполнить дополнительные действия при ошибке отправки
        });
}
function sendCode(){
    const data = {
        user_email: email_login.value,
        user_code: code_login.value

    };
    fetch('/api/login', {
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
            console.log('Успешно отправлено:', data);
            // Здесь можно выполнить дополнительные действия при успешной отправке
            if (data && data.message) {
                console.log('Получено сообщение:', data.message);
                // Здесь можно выполнить дополнительные действия с полученным сообщением
                document.getElementById('alert').style.display = 'block';
                document.getElementById('alert').textContent = data.message;
                setTimeout(function () {
                    document.getElementById('alert').style.display = 'none';

                }, 3000); // Перемещение setTimeout после аргумента функции
            }
            if (data && data.success) {
                resize_loggined()
                checkAccessToken(getName)
            }
        })
        .catch(error => {
            console.error('Ошибка при отправке данных:', error);
            // Здесь можно выполнить дополнительные действия при ошибке отправки
        });
}