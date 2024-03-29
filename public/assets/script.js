function loadUserHead(){
    document.getElementById("userName").textContent = `${userName}    ${userSurname}`
    document.getElementById("userIngfo").textContent = `${phone} | ID: ${DislayId}`
}
function loadPro(){
    document.getElementById("count").textContent = `${plusbalance}`
    document.getElementById("expc").textContent = `${expCount}`
    document.getElementById("proTitle").textContent = `Ваша подписка PRO активна до`
    document.getElementById("expDate").textContent = `${expDate}`
    document.getElementById("expdat").textContent = `До ${expDate}`

}
function openModal() {
    var myModal = new bootstrap.Modal(document.getElementById('exampleModal'));
    myModal.show();
}