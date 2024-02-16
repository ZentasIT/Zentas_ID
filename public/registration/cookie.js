// Функция для проверки наличия Access Token и выполнения действий в зависимости от результата
let TokenValid;

async function checkAccessToken(callback) {
    const accessToken = getCookie('accessToken'); // Получаем Access Token из куки

    if (accessToken) {
        // Если Access Token есть, выполняем вашу функцию
        // Например, вы можете вызвать функцию, которая делает запрос к вашему серверу с данными Access Token
        // и выполняет какие-то действия на основе ответа
        // В данном примере мы просто выводим сообщение об успешной аутентификации
        console.log('Authentication successful');
        TokenValid = accessToken
        if (typeof callback === 'function') {
            callback();
        } else {
            console.error('Callback is not a function');
        }
    } else {
        // Если Access Token отсутствует, отправляем запрос на обновление токена
        try {
            const response = await fetch('/refresh', {
                method: 'GET', // Используем метод GET, так как мы отправляем запрос на получение данных
                // Здесь могут быть другие параметры запроса, такие как заголовки или тело запроса
            });

            // Парсим JSON-ответ
            const data = await response.json();

            // Если запрос успешен и вернул новый Access Token
            if (response.ok && data.accessToken) {
                // Сохраняем новый Access Token в куки
                setCookie('accessToken', data.accessToken, 15); // 15 минут

                // Повторно вызываем функцию checkAccessToken для выполнения действий с новым Access Token
                await checkAccessToken();
            } else {
                // Если запрос неуспешен или не вернул новый Access Token, выводим сообщение об ошибке
                console.error('Refresh token failed:', data.message);
            }
        } catch (error) {
            // Если произошла ошибка при выполнении запроса, выводим сообщение об ошибке
            console.error('Refresh token request failed:', error);
        }
    }
}

// Функция для получения значения куки по имени
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

// Функция для установки куки
function setCookie(name, value, minutes) {
    const date = new Date();
    date.setTime(date.getTime() + (minutes * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/`;
}

// Вызываем функцию для проверки Access Token
