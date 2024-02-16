const name = document.getElementById('r_name')
const surname = document.getElementById('r_surname')
const middle_name = document.getElementById('r_middleName')
const date = document.getElementById('r_date')
const email = document.getElementById('r_email')
const phone = document.getElementById('r_phone')
const password = document.getElementById('r_password')
const passwordRep = document.getElementById('r_passwordR')
const check = document.getElementById('agree')
function registerCheck(){
    if(name.value.length >= 3){
        console.log(date.value)
        if(surname.value.length >= 3){
            console.log('SURNAME +')
            if(middle_name.value.length >= 3){
                console.log('MIDDLE_NAME +')
                if(date.value.length >= 10){
                    console.log('DATE +')
                    if (email.value.includes("@")) {
                        console.log('EMAIL +');
                        if (phone.value.includes("+7") && phone.value.length >= 12){
                            console.log('PHONE +');
                            if(password.value.length >= 6){
                                console.log('PASSWORD +');
                                if (password.value === passwordRep.value){
                                    console.log('PASSWORD REP +');
                                    if (check.checked === true){
                                        console.log('Check +')
                                        registration()
                                    } else if (check.checked === false){
                                        console.log('Вы не согласились с политикой')
                                    }
                                } else{
                                    return('Пароли не совпадают')
                                }
                            } else{
                                return('В пароле не может быть менее 8-х букв!')
                            }
                        } else {
                            return('Телефон должен начинатся с +7 и в нем должно быть не менее 12 символов')
                        }
                    } else {
                        return('В почте нет @');
                    }

                } else{
                    return('В дате не может быть менее 10-х букв!')
                }
            } else{
                return('В отчестве не может быть менее 3-х букв!')
            }
        } else{
            return('В фамилии не может быть менее 3-х букв!')
        }
    } else {
        return('В имени не может быть менее 3-х букв!')
    }
}

function registration(){
    const data = {
        name: name.value,
        family: surname.value,
        otchestvo: middle_name.value,
        number: phone.value,
        email: email.value,
        password: password.value

    };

    fetch('/api/registration', {
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
                resize_verify()
            }
        })
        .catch(error => {
            console.error('Ошибка при отправке данных:', error);
            // Здесь можно выполнить дополнительные действия при ошибке отправки
        });
}