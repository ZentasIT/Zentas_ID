document.getElementById('edit-modal').style.display = 'none';

function closeModal(){
    document.getElementById('edit-modal').style.display = 'none';
}
function openModal(){
    document.getElementById('edit-modal').style.display = 'flex';
    moadlConf()
}
const fam = document.getElementById('Familiya')
const nam = document.getElementById('Imya')
const oth = document.getElementById('Othestvo')
const dat = document.getElementById('datar')
const phn = document.getElementById('phn')
const ids = document.getElementById('ids')
function moadlConf(){


    fam.value = userSurname
    nam.value = userName
    oth.value = middleName
    dat.value = date
    phn.value = phone
    ids.textContent = id


}
function modalSave(){
    requestMpData()
    function requestMpData(){
        let accessToken = getAccessTokenFromCookies();
        if (accessToken === null){
            accessToken = 'nine'
        }

        let data = {
            edit: true,
            name: nam.value,
            surName: fam.value,
            middleName: oth.value,
            phone: phn.value,
            date: dat.value,
            id: id,
            userid: accessToken

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
                document.getElementById('edit-modal').style.display = 'none';

            })

            .catch(error => {
                console.error('Ошибка при отправке данных:', error);
                location.replace('/api/refresh')
                // Здесь можно выполнить дополнительные действия при ошибке отправки
            });
    }
}