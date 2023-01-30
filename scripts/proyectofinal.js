//Variable con el elemento del DOM
let nombreForm = document.querySelector("#nombre");
let correoForm = document.querySelector("#correo");

//Eventos
nombreForm.addEventListener("input", function () {
  // console.log(nombreForm.value);
  if (nombreForm.value === "") {
    console.log("Ingrese un nombre válido");
  }
});

correoForm.addEventListener("input", function () {
  // console.log(correoForm.value);
  if (correoForm.value === "") {
    console.log("Ingrese un correo electrónico válido");
  }
});

let formulario = document.querySelector("#formulario");

let info = document.querySelector(".info");

//agregar informacion al DOM
const mostrarInfo = formulario.addEventListener("submit", function (e) {
  e.preventDefault();

  if (nombreForm.value == " ") {

    
    info.innerHTML = `
    <div class="alert alert-warning" role="alert">
  <h5> Por favor ingrese un nombre valido.</h5></div>`;
  }else if (correoForm.value == " "){
    
    info.innerHTML = `
    <div class="alert alert-warning" role="alert">
  <h5> Por favor ingrese un correo valido.</h5></div>`;
  } else{

    //Guardando el dato del nombre en el storage y montrandolo en el info.inner
    const inputNombre = document.getElementById("nombre").value;
    localStorage.setItem("myInputNombre", inputNombre);
    const localNombre = localStorage.getItem("myInputNombre");


    //Guardando el dato del correo en el storage y montrandolo en el info.inner
    const inputCorreo = document.getElementById("correo").value;
    localStorage.setItem("myInputCorreo", inputCorreo);
    const localCorreo = localStorage.getItem("myInputNombre");

    info.innerHTML = `
    <div class="alert alert-warning" role="alert">
  <h5> Muchas gracias ${localNombre} por tu mensaje, te responderemos a ${localCorreo} para concretar detalles de tu compra.</h5></div>`;
  Swal.fire(
    'Gracias!',
    'pronto nos estaremos contactando con usted!',
    'success'
  )
  }

});

//MOSTRAR EL STOCK DE LOS PRODUCTOS

// OBTENEMOS EL ESPACIO PARA MOSTRAR EL STOCK DEL PRODUCTO
let infoProducto = document.querySelector("#infoProductos");


// FUNCION PARA COGER EL VALOR DEL JSON Y COMPARARLO CON EL BUSCADOR
const findProdById = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
    fetch("./data.json")
      .then((res) => res.json())
      .then((data) => {
        const prod = data.find((item) => item.id === id);
        if (prod) {
          resolve(prod);

          // SE MUESTRA EN EL DOM EL NOMBRE Y PRECIO DEL PRODUCTO INDICADO
          infoProducto.innerHTML = `
    <div class="alert alert-warning" role="alert">
  <h5> Muchas gracias por su interes el ${prod.nombre} se encuentra disponible y cuesta ${prod.precio} para concretar llena el formulario.</h5></div>`;
          
        } else {
          reject("No se encuentra el producto");
          infoProducto.innerHTML = "no se encuentra el producto"
        }
      }, 1000);
      })
      .catch((error) => reject(error));
  });
};

// SE AGREGA LAS VARIABLES PARA CAPTURAR AL INPUT Y EL BOTON PARA BUSCAR EL PRODUCTO
const inputId = document.getElementById("buscador");
const button = document.getElementById("btnBuscar");

// EVENTO PARA ACTIVAR CON CLICK LA FUNCION DONDE COMPARA EL IMPUT CON EL JSON
button.addEventListener("click", () => {
  const id = parseInt(inputId.value, 10);

  findProdById(id)
    .then((prod) => console.log(prod))
    .catch((err) => console.log(err));
});




//////---------PRODUCTOS DOM-------------//////

// CREA LAS CARDS DE LOS PRODUCTOS USANDO EL METODO ASYNC
const lista = document.querySelector("#contenedorProducto");
// EXTRAEMOS LA INFO DE NUESTRO DATA JSON LOCAL
const pedirPost = async () => {
  //Lee el contenido del JSON y extrae la información del producto
  const resp = await fetch("./data.json");
  const data = await resp.json();
//Seleccionando productos para verlos en DOM
  data.forEach((post) => {
    const li = document.createElement("div");
      li.innerHTML = `
      
        <div class="col">
          <div class="card" >
            <div class="card-body">
              <h5 class="card-title" >${post.nombre}</h5>
              <p class="card-text">${post.precio}</p>
              <button class="btn btn-primary agregarCarrito" data-id="${post.id}">Agregar</button>
            </div>
          </div>
        </div>
        
        `;
      lista.append(li);
  });
};
//LLAMA AL METODO PARA CREAR LOS PRODUCTOS
pedirPost();

//////----------------------------------//////
//Seleccionando productos para verlos en DOM

//Lee el contenido del HTML al que le dimos click y extrae la información del producto
/* const cards = document.querySelectorAll(".card");
cards.forEach((card) => {
  card.addEventListener("click", (e) => {
    leerDatosProducto(e.target.parentElement);
  });
});
*/
//////----------------------------------//////
// SELECCIONA AL BOTON DE COMPRA
let btnComprar = document.querySelector("#btnComprar");

const activarCompra = btnComprar.addEventListener("click", function (e) {
  e.preventDefault();
  //ELIMINA TODOS LOS PRODUCTOS DEL CARRITO
  let productoID = e.target.getAttribute("id");
    articulosCarrito = articulosCarrito.filter(
      (producto) => producto.id === productoID
    );
    carritoHTML();
  //CREA UN MENSAJE DE HABER FINZALIZADO LA COMPRA
  Swal.fire(
    'Gracias!',
    'Estaremos informandole de su compra!',
    'success'
  )

});


//Array vacio para guardar los productos
let articulosCarrito = [];

function leerDatosProducto(producto) {
  const infoProducto = {
    titulo: producto.querySelector(".card-title").textContent,
    texto: producto.querySelector(".card-text").textContent,
    id: producto.querySelector(".btn").getAttribute("data-id"),
  };

  //Agrega elementos al carrito
  articulosCarrito = [...articulosCarrito, infoProducto];
  // console.log(articulosCarrito);

  //LLamo a la funcion para mostrar los productos en el carrito
  carritoHTML();
}

//Mostrar los productos en el carrito
const carrito = document.querySelector("#carrito");

function carritoHTML() {
  //Limpiar el HTML
  limpiarHTML();

  articulosCarrito.forEach((producto) => {
    const row = document.createElement("p");
    row.innerHTML = `
    <div class="container">
    <h5>${producto.titulo}</h5>
    <p>${producto.texto}</p>
    <button class="btn btn-danger" id="${producto.id}">Eliminar</button>
    </div>
    `;
    carrito.appendChild(row);
  });
}

function limpiarHTML() {
  carrito.innerHTML = "";
}

carrito.addEventListener("click", eliminarProducto);

// Eliminar productos del carrito

function eliminarProducto(e) {
  if (e.target.classList.contains("btn-danger")) {
    let productoID = e.target.getAttribute("id");
    articulosCarrito = articulosCarrito.filter(
      (producto) => producto.id !== productoID
    );
    carritoHTML();
  }
}

////--------OPCIONES MULTIPLES--------------//////

let optionSelected = document.querySelectorAll(".form-select");
let btnreservar = document.querySelector(".btn-reservar");

btnreservar.addEventListener("click", function () {

  //Guardando el dato del dia en el storage y montrandolo en el selector
  const inputDia = document.querySelector("#day").value;
    localStorage.setItem("myInputDia", inputDia);
    const localDia = localStorage.getItem("myInputDia");

    //Guardando el dato de la hora en el storage y montrandolo en el selector
    const inputHora = document.querySelector("#hr").value;
    localStorage.setItem("myInputHora", inputHora);
    const localHora = localStorage.getItem("myInputHora");


  
  Swal.fire(
    'Gracias!',
    'su cita se ha reservado con exito',
    'success'
  )

  let selector = document.querySelector(".selector");
  selector.innerHTML = `
  <div class="alert alert-success" role="alert">
  <h5>Vas a asistir el dia ${localDia} a las ${localHora} hs.</h5>
  </div>`;
});



//PRUEBA



//Lee el contenido del HTML al que le dimos click y extrae la información del producto

lista.addEventListener("click", seleccionarProducto);

// Eliminar productos del carrito

function seleccionarProducto(e) {
  if (e.target.classList.contains("btn-primary")) {
    leerDatosProducto(e.target.parentElement);
    
  }
}


//PRUEBA DE LIBRERIA

let alerta = document.querySelector("#alerta");

const activarAlerta = alerta.addEventListener("click", function (e) {
  e.preventDefault();

  Swal.fire(
    'Good job!',
    'You clicked the button!',
    'success'
  )

});








