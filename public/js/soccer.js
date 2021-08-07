let datosAdmin = null; // DATOS DEL ADMIN LOGUEADO

// VERIFICAR QUE EL QUE ENTRE SEA UN ADMINISTRADOR LOGUEADO
var url = (window.location.hostname.includes('localhost'))
? 'http://localhost:8080/'
: 'https://app-socce.herokuapp.com/';

const linkFutb = document.querySelector(".futbolistas");
const linkEqui = document.querySelector(".equipos");

// CERRAR SESION
function sesion(){
    localStorage.removeItem('token');
    window.location = 'index.html';
}


// Extraemos el token que tengamos en el navegador
// Validamos token, para verificar que sea un admin
const validarToken = async() =>{
    const tok = localStorage.getItem('token') || '';

    if (tok.length <= 10) {
        // Redireccionamos si el token es incorrecto
        window.location = 'index.html';
        throw new Error('No existe un token en el servidor');
    }

    const resp = await fetch(`${url}auth/`, { 
        headers: { 'x-token': tok }
    });

    const { admin, token } = await resp.json();

    if(!token){
        window.location = 'index.html';
        throw new Error('No existe un token en el servidor');
    }
    // Actualizamos el token
    localStorage.setItem('token', token);
    datosAdmin = admin;
    tablaFutbolistas();
}

// Llenar tabla de futbolistas
const tablaFutbolistas = async() => {
    linkEqui.classList.remove("activo");
    linkFutb.classList.add("activo");
    const resp = await fetch(`${url}futbolista`);
    const { futbolistas } = await resp.json();
    if(futbolistas){
        llenar_tabla(futbolistas,"futbolista");
    }
}

// Llenar tabla de equipos
const tablaEquipos = async() => {
    linkEqui.classList.add("activo");
    linkFutb.classList.remove("activo");
    const resp = await fetch(`${url}equipo`);
    const { equipos } = await resp.json();
    if(equipos){
        llenar_tabla(equipos,"equipos");
    }
    return equipos;
}

// Cabecera para la tabla de futbolistas
const cabeceraFutbolistas = `
<tr>
    <th scope="col" class="text-center"> ID           </th>
    <th scope="col" class="text-center"> NAME         </th>
    <th scope="col" class="text-center"> AGE          </th>
    <th scope="col" class="text-center"> TEAM_ID      </th>
    <th scope="col" class="text-center"> SQUAD_NUMBER </th>
    <th scope="col" class="text-center"> POSITION     </th>
    <th scope="col" class="text-center"> NATIONALITY  </th>
    <th scope="col" class="text-center"> EDITAR       </th>
    <th scope="col" class="text-center"> ELIMINAR     </th>
</tr>
`;

// Cabecera para la tabla de equipos
const cabeceraEquipos = `
<tr>
    <th scope="col" class="text-center"> ID        </th>
    <th scope="col" class="text-center"> NAME      </th>
    <th scope="col" class="text-center"> LEAGE     </th>
    <th scope="col" class="text-center"> COUNTRY   </th>
    <th scope="col" class="text-center"> EDITAR    </th>
    <th scope="col" class="text-center"> ELIMINAR  </th>
</tr>
`;

// LISTAR FUTBOLISTAS O EQUIPO EN LA TABLA
const lista    = document.querySelector("#listar");
const llenar_tabla = (datos,nameTable) => {
    
    const cabecera = document.querySelector("#cabecera");
    const add      = document.querySelector("#add");
    let tabla = '';
    if(nameTable === "futbolista"){ // LLENAMOS LA TABLA DE FUTBOLISTAS
        // Agregamos la cabecera de la tabla de futbolista
        cabecera.innerHTML = cabeceraFutbolistas;
        add.innerHTML = `
        <td colspan="1" > <button type="button" onclick="add('futbolista')" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">Add +</button></td>
        <td colspan="8"> <h3 class="text-center">Futbolistas</h3> </td>`
        ;

        // LISTAMOS LOS FUTBOLISTAS
        for (const item of datos) { 
            tabla += `
            <tr id="fila${item.id}">
                <th class="text-center"> ${ item.id          } </th>
                <td class="text-center"> ${ item.name        } </td>
                <td class="text-center"> ${ item.age         } </td>
                <td class="text-center"> ${ item.team_id     } </td>
                <td class="text-center"> ${ item.squad_number} </td>
                <td class="text-center"> ${ item.position    } </td>
                <td class="text-center"> ${ item.nationality } </td>
                <td class="text-center"> <button onclick="formEdit(${item.id},'futbolista')"   type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#exampleModal">Editar</button> </td>
                <td class="text-center"> <button onclick="formEli(${item.id},'futbolista')" type="button" class="btn btn-danger">Eliminar</button> </td>
            </tr>
        `;
        }
    }else if(nameTable === "equipos"){ // LLENAMOS LA TABLA DE EQUIPOS
        // Agregamos la cabecera de la tabla equipos
        cabecera.innerHTML = cabeceraEquipos;
        add.innerHTML = `
        <td colspan="1" > <button type="button" onclick="add('equipo')" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">Add +</button> </td>
        <td colspan="8"> <h3 class="text-center">Equipos</h3> </td>
        `;

        // LISTAMOS LOS EQUIPOS
        for (const item of datos) { 
            tabla += `
            <tr id="fila${item.id}">
                <th class="text-center"> ${ item.id     } </th>
                <td class="text-center"> ${ item.nombre } </td>
                <td class="text-center"> ${ item.league } </td>
                <td class="text-center"> ${ item.country} </td>
                <td class="text-center"> <button onclick="formEdit(${item.id},'equipo')" type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#exampleModal">Editar</button> </td>
                <td class="text-center"> <button onclick="formEli(${item.id},'equipo')"  type="button" class="btn btn-danger">Eliminar</button> </td>
            </tr>
        `;
        }
    }

    lista.innerHTML = tabla;

}


// Evento para mostrar modal edicion para futbolista o un equipo
async function formEdit(id,tabla){
    
    if(tabla === "futbolista"){ // Editar futbolista
        const resp = await fetch(`${ url }futbolista/${ id }`);
        const { futbolista } = await resp.json();
        formModalFutbolita(futbolista);
    }else if(tabla === "equipo"){ // Editar equipo
        const resp = await fetch(`${ url }equipo/${ id }`);
        const { equipo } = await resp.json();
        formModalEquipo(equipo);
    }
    
    
}

// Evento para eliminar un futbolista o un equipo
async function formEli(id,tabla){
    if(tabla === "futbolista"){ // Eliminar futbolista
        const resp = await fetch(`${ url }futbolista/${ id }`,{
            method: 'DELETE',
        });
        const { ok } = await resp.json();
        if(ok){
            const fila = document.querySelector(`#fila${id}`);
            fila.innerHTML = '';
        }
        formModalFutbolita(futbolista);
    }else if(tabla === "equipo"){ // Eliminar equipo
        const resp = await fetch(`${ url }equipo/${ id }`,{
            method: 'DELETE',
        });
        const { ok } = await resp.json();
        if(ok){
            const fila = document.querySelector(`#fila${id}`);
            fila.innerHTML = '';
        }
    }
}

// Evento click
async function add(tabla){
    if(tabla === "futbolista"){ // Agregar un nuevo futbolista
        const resp = await fetch(`${url}equipo`);
        const { equipos } = await resp.json();
        let listarEquipos = '';
        for (const equipo of equipos) {
            listarEquipos += `
            <option value="${equipo.id}" >${equipo.nombre}</option>
        `;    
        }
        formAddFutbolita(listarEquipos);
    }else if(tabla === "equipo"){ // Agregar un nuevo equipo
        formAddEquipo();
    }
}


/* --- FORMULARIO - MODAL-EDITAR FUTBOLISTA / EQUIPO --- */

const modalForm = document.querySelector("#formx");

    // FORMULARIO PARA EDITAR UN FUTBOLISTA
    const formModalFutbolita = (futbolista) => {
        const formFutb = `
            <input type="hidden" class="form-control" id="form" value="editFutbolista" name="formEdit">
            <input type="hidden" class="form-control" id="idEdit" name="idEdit" value="${futbolista.id}" placeholder="Nombre">
            <div class="mb-3">
                <input type="text" class="form-control" id="nameEdit" name="nameEdit" value="${futbolista.name}" placeholder="Nombre">
            </div>
            <div class="mb-3">
                <input type="text" class="form-control" id="ageEdit" name"ageEdit" value="${futbolista.age}" placeholder="Age">
            </div>
            <div class="mb-3">
                <input type="text" class="form-control" id="team_idEdit" name="team_idEdit" value="${futbolista.team_id}" placeholder="Team_id">
            </div>
            <div class="mb-3">
                <input type="text" class="form-control" id="squad_numberEdit" name="squad_numberEdit" value="${futbolista.squad_number}" placeholder="Squad_number">
            </div>
            <div class="mb-3">
                <input type="text" class="form-control" id="positionEdit" name="positionEdit" value="${futbolista.position}" placeholder="Position">
            </div>
            <div class="mb-3">
                <input type="text" class="form-control" id="nationalityEdit" name="nationalityEdit" value="${futbolista.nationality}" placeholder="Nationality">
            </div>
            <div class="mb-3 text-center">
                <button type="submit" class="btn btn-primary">Actualizar</button>
            </div>
        `;

        modalForm.innerHTML = formFutb;
    }

    // FORMULARIO PARA AGREGAR UN FUTBOLISTA
    const formAddFutbolita = (listarE) => {
        const formFutb = `

            <input type="hidden" class="form-control" id="form" value="addFutbolista" name="formAdd" required>
            
            <input type="hidden" class="form-control" id="idAdd" name="idAdd"  placeholder="Nombre" required>
            
            <div class="mb-3">
                <input type="text" class="form-control" id="nameAdd" name="nameAdd"  placeholder="Nombre" required>
            </div>
            <div class="mb-3">
                <input type="text" class="form-control" id="ageAdd" name"ageAdd"  placeholder="Age" required>
            </div>
            <div class="mb-3">
                <select class="form-select form-select-sm" id="team_idAdd" name="team_idAdd" aria-label=".form-select-sm example" required>
                    ${listarE}
                </select>
            </div>
            <div class="mb-3">
                <input type="text" class="form-control" id="squad_numberAdd" name="squad_numberAdd" placeholder="Squad_number" required>
            </div>
            <div class="mb-3">
                <select class="form-select form-select-sm" id="positionAdd" name="positionAdd" aria-label=".form-select-sm example" required>
                    <option value="delantero" >Ataque</option>
                    <option value="medio"  >Medio</option>
                    <option value="defensa">Defensa</option>
                </select>
            </div>
            <div class="mb-3">
                <select class="form-select form-select-sm" id="nationalityAdd" name="nationalityAdd" aria-label=".form-select-sm example" required>
                    ${listar_nationality}
                </select>
            </div>
            <div class="mb-3 text-center">
                <button type="submit" class="btn btn-primary">Agregar</button>
            </div>
        `;

        modalForm.innerHTML = formFutb;
    }

    // FORMULARIO PARA EDITAR EQUIPO
    const formModalEquipo  = (equipo) => {
        const formEquipo = `
            <input type="hidden" class="form-control" id="form" value="editEquipo"  name="form">
            <input type="hidden" class="form-control" id="idEdit" value="${equipo.id}" name="idEdit" required>
            <div class="mb-3">
                <input type="text" class="form-control" id="editNombre" value="${equipo.nombre}" name="editNombre" placeholder="Nombre" required>
            </div>
            <div class="mb-3">
                <input type="text" class="form-control" id="editLeague" value="${equipo.league}" name="editLeague" placeholder="League" required>
            </div>
            <div class="mb-3">
                <input type="text" class="form-control" id="editCountry" value="${equipo.country}" name="editCountry" placeholder="Country" required>
            </div>
            
            <div class="mb-3 text-center">
                <button type="submit" class="btn btn-primary">Actualizar</button>
            </div>
        `;

        modalForm.innerHTML = formEquipo;
    }

    // FORMULARIO PARA AGREGAR UN EQUIPO
    const formAddEquipo    = () => {
        const formEquipo = `

        <input type="hidden" class="form-control" id="form" value="addEquipo" name="formAdd" required>
        
        <div class="mb-3">
            <input type="text" class="form-control" id="nameAdd" name="nameAdd"  placeholder="Nombre" required>
        </div>
        <div class="mb-3">
            <input type="text" class="form-control" id="leagueAdd" name"leagueAdd"  placeholder="league" required>
        </div>
        <div class="mb-3">
            <input type="text" class="form-control" id="countryAdd" name="countryAdd"  placeholder="country" required>
        </div>
        <div class="mb-3 text-center">
            <button type="submit" class="btn btn-primary">Agregar</button>
        </div>
    `;

    modalForm.innerHTML = formEquipo;
    }

    


/* --- EVENTO CLICK PARA EDITAR DE LA BASE DE DATOS UN FUTBOLISTA O UN EQUIPO */
const formx = document.querySelector("#formx");
    
formx.addEventListener("submit", async(e) => {
    e.preventDefault();

    const form = document.forms["formx"];
    const datos_form = form["form"].value;
    
    if(datos_form === "editFutbolista"){
        actualizarFutbolista(form);
    }else if(datos_form === "addFutbolista"){
        agregarFutbolista(form);
    }else if(datos_form === "editEquipo"){
        actualizarEquipo(form);
    }else if(datos_form === "addEquipo"){
        agregarEquipo(form);
    }
})


/* --- Metodo para actualizar un futbolista --- */
const actualizarFutbolista = async(form) => {
    const nameEdit        = document.querySelector("#nameEdit").value;
    const ageEdit         = document.querySelector("#ageEdit").value;
    const team_idEdit     = document.querySelector("#team_idEdit").value;
    const squad_nEdit     = document.querySelector("#squad_numberEdit").value;
    const positionEdit    = document.querySelector("#positionEdit").value;
    const nationalityEdit = document.querySelector("#nationalityEdit").value;

    const body = {
        "name"        : form["nameEdit"].value,
        "age"         : form["ageEdit"].value,
        "team_id"     : form["team_idEdit"].value,
        "squad_number": form["squad_numberEdit"].value,
        "position"    : form["positionEdit"].value,
        "nationality" : form["nationalityEdit"].value,
    }

    const resp = await fetch(`${ url }futbolista/${ form["idEdit"].value }`, { 
        method: 'PUT',
        body: JSON.stringify(body),
        headers: {'Content-Type': 'application/json'},
    });

    const { ok, msj, actualizado } = await resp.json();
    if(ok){
        const fila = document.querySelector(`#fila${actualizado.id}`);
        
        // Actualizamos la fila en la que se encuentra el futbolista
        const addFila = `
        <tr id="fila${actualizado.id}">
                <th class="text-center"> ${ actualizado.id          } </th>
                <td class="text-center"> ${ actualizado.name        } </td>
                <td class="text-center"> ${ actualizado.age         } </td>
                <td class="text-center"> ${ actualizado.team_id     } </td>
                <td class="text-center"> ${ actualizado.squad_number} </td>
                <td class="text-center"> ${ actualizado.position    } </td>
                <td class="text-center"> ${ actualizado.nationality } </td>
                <td class="text-center"> <button onclick="formEdit(${actualizado.id},'futbolista')"   type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#exampleModal" data-id="123">Editar</button> </td>
                <td class="text-center"> <button onclick="formEli()" type="button" class="btn btn-danger">Eliminar</button> </td>
            </tr>
        `;

        fila.innerHTML = addFila;
    }
}

/* --- Metodo para agregar un futbolista --- */
const agregarFutbolista = async(form) => {
    const name        = document.querySelector("#nameAdd").value;
    const age         = document.querySelector("#ageAdd").value;
    const team_id     = document.querySelector("#team_idAdd").value;
    const squad_n     = document.querySelector("#squad_numberAdd").value;
    const position    = document.querySelector("#positionAdd").value;
    const nationality = document.querySelector("#nationalityAdd").value;

    const body = {
        "name"        : form["nameAdd"].value,
        "age"         : form["ageAdd"].value,
        "team_id"     : form["team_idAdd"].value,
        "squad_number": form["squad_numberAdd"].value,
        "position"    : form["positionAdd"].value,
        "nationality" : form["nationalityAdd"].value
    }
    
    const resp = await fetch(`${ url }futbolista`, { 
        method: 'POST',
        body: JSON.stringify(body),
        headers: {'Content-Type': 'application/json'},
    });
    const { futbolista } = await resp.json();
    if(futbolista){
        let fila = document.createElement("tr");
        fila.setAttribute("id", `fila${futbolista.id}`);
        fila.innerHTML = `
                <th class="text-center"> ${ futbolista.id          } </th>
                <td class="text-center"> ${ futbolista.name        } </td>
                <td class="text-center"> ${ futbolista.age         } </td>
                <td class="text-center"> ${ futbolista.team_id     } </td>
                <td class="text-center"> ${ futbolista.squad_number} </td>
                <td class="text-center"> ${ futbolista.position    } </td>
                <td class="text-center"> ${ futbolista.nationality } </td>
                <td class="text-center"> <button onclick="formEdit(${futbolista.id},'futbolista')"   type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#exampleModal">Editar</button> </td>
                <td class="text-center"> <button onclick="formEli()" type="button" class="btn btn-danger">Eliminar</button> </td>
        `;

        lista.appendChild(fila);

    }
}

/* --- Metodo para agregar un equipo --- */
const agregarEquipo = async(form) => {

    const body = {
        "nombre" : form["nameAdd"].value,
        "league" : form["leagueAdd"].value,
        "country": form["countryAdd"].value
    }
    const resp = await fetch(`${ url }equipo`, { 
        method: 'POST',
        body: JSON.stringify(body),
        headers: {'Content-Type': 'application/json'},
    });
    
    const { equipo } = await resp.json();

    if(equipo){
        let fila = document.createElement("tr");
        fila.setAttribute("id", `fila${equipo.id}`);
        fila.innerHTML = `
                <th class="text-center"> ${ equipo.id      } </th>
                <td class="text-center"> ${ equipo.nombre  } </td>
                <td class="text-center"> ${ equipo.league  } </td>
                <td class="text-center"> ${ equipo.country } </td>
                <td class="text-center"> <button onclick="formEdit(${equipo.id},'equipo')"   type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#exampleModal">Editar</button> </td>
                <td class="text-center"> <button onclick="formEli()" type="button" class="btn btn-danger">Eliminar</button> </td>
        `;

        lista.appendChild(fila);

    }
    
}

/* --- Metodo para editar un equipo --- */
const actualizarEquipo = async(form) => {

    const body = {
        "nombre" : form["editNombre"].value,
        "league" : form["editLeague"].value,
        "country": form["editCountry"].value
    }

    const resp = await fetch(`${ url }equipo/${ form["idEdit"].value }`, { 
        method: 'PUT',
        body: JSON.stringify(body),
        headers: {'Content-Type': 'application/json'},
    });

    const { ok, msj, actualizado } = await resp.json();

    if(ok){
        const fila = document.querySelector(`#fila${actualizado.id}`);
        
        // Actualizamos la fila en la que se encuentra el futbolista
        const addFila = `
        <tr id="fila${actualizado.id}">
                <th class="text-center"> ${ actualizado.id          } </th>
                <td class="text-center"> ${ actualizado.nombre      } </td>
                <td class="text-center"> ${ actualizado.league      } </td>
                <td class="text-center"> ${ actualizado.country     } </td>
                <td class="text-center"> <button onclick="formEdit(${actualizado.id},'futbolista')"   type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#exampleModal" data-id="123">Editar</button> </td>
                <td class="text-center"> <button onclick="formEli()" type="button" class="btn btn-danger">Eliminar</button> </td>
            </tr>
        `;

        fila.innerHTML = addFila;
    }
    console.log(msj);
}







/* --- CONSULTAS --- */

const nationality= document.querySelector("#consultar-nationality");
const country    = document.querySelector("#consultar-country");
const equipo     = document.querySelector("#consultar-equipo");
const position   = document.querySelector("#consultar-position");

// CONSULTAR JUGADOR POR NATIONALITY - INICIO
    nationality.addEventListener("submit", async(e) => {
        e.preventDefault();
        const form = document.forms["consultar-nationality"];
        const select_n = document.querySelector("#select-nationality").value;
        const search = form["search-nationality"].value;
        
        if(search === ""){
            return;
        }

        const resp = await fetch(`${url}futbolista/player-nationality/${search}?nationality=${select_n}`);

        const { player } = await resp.json();
        const cabecera = document.querySelector("#cabecera");
        const listar      = document.querySelector("#listar");
        if(player){
            nueva_tabla(player,listar,cabecera);
        }else{
            listar.innerHTML = '';
        }


    });

    const cabecera_nationality = `
    <tr>
        <th scope="col" class="text-center"> ID           </th>
        <th scope="col" class="text-center"> NAME         </th>
        <th scope="col" class="text-center"> NAME EQUIPO  </th>
        <th scope="col" class="text-center"> SQUAD_NUMBER </th>
        <th scope="col" class="text-center"> POSITION     </th>
        <th scope="col" class="text-center"> NATIONALITY  </th>
    </tr>
    `;
    const nueva_tabla = (datos,listar,cabecera) => {

        
        cabecera.innerHTML = cabecera_nationality;
        
        let tabla = `
            <tr>
                <th class="text-center"> ${ datos.id           } </th>
                <td class="text-center"> ${ datos.name         } </td>
                <td class="text-center"> ${ datos.equipo.nombre} </td>
                <td class="text-center"> ${ datos.squad_number } </td>
                <td class="text-center"> ${ datos.position     } </td>
                <td class="text-center"> ${ datos.nationality  } </td>
            </tr>
            `;
        

        listar.innerHTML = tabla;

    }
    var listar_nationality = '';
    const listar_nationalitys = () => {
        const select_nationality = document.querySelector("#select-nationality");
        listar_nationality = `
        <option value="Español/a">Español/a</option>
        <option value="uruguayo/a">uruguayo/a</option>
        <option value="Canadiense">Canadiense</option>
        <option value="Americano/a">Americano/a</option>
        <option value="inglés/inglesa">inglés/inglesa</option>
        <option value="francés/francesa">francés/francesa</option>
        <option value="taliano/a">taliano/a</option>
        <option value="portugués/portuguesa">portugués/portuguesa</option>
        <option value="alemán/alemana">alemán/alemana</option>
        <option value="ruso/a">ruso/a</option>
        <option value="venezolano/a">venezolano/a</option>
        <option value="cubano/a">cubano/a</option>
        <option value="3">argentino/a</option>
        <option value="brasileño/a">brasileño/a</option>
        <option value="boliviano/a">boliviano/a</option>
        <option value="peruano/a">peruano/a</option>
        <option value="chileno/a">chileno/a</option>
        `;
        select_nationality.innerHTML = listar_nationality;
    } 

// FIN - CONSULTAR JUGADOR POR NATIONALITY









// CONSULTAR JUGADOR POR POSITION - INICIO Consultar jugador por position
    position.addEventListener("submit", async(e) => {
        e.preventDefault();
        const form = document.forms["consultar-position"];
        const select_n = document.querySelector("#select-position").value;
        const search = form["search-position"].value;
        
        if(search === ""){
            return;
        }

        const resp = await fetch(`${url}futbolista/player/${search}?position=${select_n}`);

        const { jugadores } = await resp.json();
        const cabecera = document.querySelector("#cabecera");
        const listar   = document.querySelector("#listar");
        if(jugadores){
            nueva_tabla(jugadores,listar,cabecera);
        }else{
            listar.innerHTML = '';
        }
        
    })
    const cabecera_position = `
    <tr>
        <th scope="col" class="text-center"> ID           </th>
        <th scope="col" class="text-center"> NAME         </th>
        <th scope="col" class="text-center"> NAME EQUIPO  </th>
        <th scope="col" class="text-center"> SQUAD_NUMBER </th>
        <th scope="col" class="text-center"> POSITION     </th>
        <th scope="col" class="text-center"> NATIONALITY  </th>
    </tr>
    `;

// CONSULTAR JUGADOR POR POSITION - FIN










// CONSULTAR TODOS LOS JUGADORES DE UN EQUIPO
equipo.addEventListener("submit", async(e) => {
    e.preventDefault();
    const form = document.forms["consultar-equipo"];
    const search = form["select-equipo"].value;
    
    if(search === ""){
        return;
    }

    const resp = await fetch(`${url}futbolista/equipo/${search}`);

    const { equipo } = await resp.json();
   
    const cabecera = document.querySelector("#cabecera");
    const listar   = document.querySelector("#listar");
    if(equipo){
        console.log(equipo)
        tabla_equipo(equipo,listar,cabecera);
    }else{
        listar.innerHTML = '';
    }
    
})

const tabla_equipo = (jugadores,listar,cabecera) => {

    cabecera.innerHTML = cabecera_equipo;
    let fila_player = '';
    for (const jugador of jugadores) {
        fila_player += `
        <tr>
            <th class="text-center"> ${ jugador.id           } </th>
            <td class="text-center"> ${ jugador.name         } </td>
            <td class="text-center"> ${ jugador.squad_number } </td>
            <td class="text-center"> ${ jugador.position     } </td>
            <td class="text-center"> ${ jugador.nationality  } </td>
        </tr>
        `;
    }

    listar.innerHTML = fila_player;
}
const cabecera_equipo = `
    <tr>
        <th scope="col" class="text-center"> ID           </th>
        <th scope="col" class="text-center"> NAME         </th>
        <th scope="col" class="text-center"> SQUAD_NUMBER </th>
        <th scope="col" class="text-center"> POSITION     </th>
        <th scope="col" class="text-center"> NATIONALITY  </th>
    </tr>
    `;

// Listar los paises registrados en la base de datos
const listaEquipos = async() => {
    const resp = await fetch(`${url}equipo`);
    const { equipos } = await resp.json();
    let listarE = '';
    for (const equipo of equipos) {
        listarE += `
            <option value="${equipo.id}">${equipo.nombre}</option>
        `; 
    }
    const select_e = document.querySelector("#select-equipo");
    select_e.innerHTML = listarE;
}











const main = async() => {
    await validarToken();
    await listaEquipos();
    listar_nationalitys();
}

main();