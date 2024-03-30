const login = document.getElementById('login')
const ref = document.getElementById('register')
const mail = document.getElementById('verefym')
const u_ode = document.getElementById('m_code')
const logged = document.getElementById('loggined')

function resize_login() {
    const main = document.querySelector('main');
    ref.style.display = 'none';
    main.style.width = '26.89%';
    main.style.height = '56.13%';

    setTimeout(function () {
        main.style.maxWidth = '400px';
        main.style.maxHeight = '450px';
        login.style.display = 'flex';
    }, 700); // Перемещение setTimeout после аргумента функции
}

function resize_registration() {
    const main = document.querySelector('main');
    login.style.display = 'none';

    main.style.width = '66.36%';
    main.style.height = '81.88%';
    main.style.maxWidth = '981px';
    main.style.maxHeight = '655px';
    setTimeout(function () {
        ref.style.display = 'flex';
        console.log('test');
    }, 300); // Перемещение setTimeout после аргумента функции
}

function resize_verify() {
    const main = document.querySelector('main');
    ref.style.display = 'none';

    main.style.width = '23.04%';
    main.style.height = '29.375%';
    setTimeout(function () {
        mail.style.display = 'flex';
        console.log('test');
        main.style.maxWidth = '341px';
        main.style.maxHeight = '235px';
        const adress = document.getElementById('adress')
        adress.textContent = email.value
    }, 300); // Перемещение setTimeout после аргумента функции
}

function resize_code() {
    const main = document.querySelector('main');
    login.style.display = 'none';

    main.style.width = '73.72%';
    main.style.height = '59.87%';
    setTimeout(function () {
        u_ode.style.display = 'flex';
        console.log('test');
        main.style.maxWidth = '400px';
        main.style.maxHeight = '325px';

    }, 300); // Перемещение setTimeout после аргумента функции
}

function resize_loggined() {
    const main = document.querySelector('main');
    u_ode.style.display = 'none';

    main.style.width = '76.62%';
    main.style.height = '73.37%';
    setTimeout(function () {
        logged.style.display = 'flex';
        console.log('test');
        main.style.maxWidth = '431px';
        main.style.maxHeight = '213px';

    }, 300); // Перемещение setTimeout после аргумента функции
    location.replace('/')
}

