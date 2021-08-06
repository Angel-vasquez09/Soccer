
let datosAdmin = null; // DATOS DEL ADMINISTRADOR LOGUEADO

var url = (window.location.hostname.includes('localhost'))
? 'http://localhost:8080/'
: 'http://localhost:8080/';

const formularioLogin = document.querySelector("#formularioLogin");


formularioLogin.addEventListener("submit", async(e) => {
    e.preventDefault();
    const email = document.querySelector("#email").value;
    const pass  = document.querySelector("#pass").value;

    const auth = {
        "email": email,
        "pass" : pass  
    }

    const verificar = await fetch(`${url}auth`, {
        method: 'POST',
        body: JSON.stringify(auth),
        headers: {'Content-Type': 'application/json'},
    });

    const { admin, token } = await verificar.json();
    console.log(admin);
    if(token){
        localStorage.setItem('token',token);
        datosAdmin = admin;
        window.location = 'soccer.html';
    }
})

