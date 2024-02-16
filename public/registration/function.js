function getName(){
    sendPOST("userName", TokenValid, nameSet);
}
function nameSet(name){
    console.log(name)
    document.getElementById("u_name").textContent = name
}

function sendPOST(id, token, callback){
    let data = {
        [id]: token,

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
            console.log('Успешно отправлено:', data);
            if (typeof callback === 'function') {
                callback(data.daaa);
            }

        })
        .catch(error => {
            console.error('Ошибка при отправке данных:', error);
            // Здесь можно выполнить дополнительные действия при ошибке отправки
        });
}