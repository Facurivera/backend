const socket = io();
const content = document.getElementById("content");

socket.on("realTimeProducts", (data) => {
    let salida = ``;

    data.forEach(item => {
        salida += `<div class="prod">
            <img class="img" src="${item.thumbnails}" alt="${this.title}"><br>
            <p class="detail">Nombre : <b>${this.title}</b><br>
            Precio: <b>$ ${this.price}</b><br>
            </p>
        </div>`;
    });

    content.innerHTML = salida;
});

const agregarProducto = () => {
    const title = document.getElementById("title").value;
    const thumbnails = document.getElementById("thumbnails").value;
    const price = document.getElementById("price").value;
    const product = {title:title, thumbnails:thumbnails, price:price};

    socket.emit("nuevoProducto", product);
}

const btnAgregarProducto = document.getElementById("btnAgregarProducto");
btnAgregarProducto.onclick = agregarProducto;

const eliminarProducto = () => {
    const idProduct = document.getElementById("idProduct").value;

    socket.emit("eliminarProducto", idProduct);
}

const btnEliminarProducto = document.getElementById("btnEliminarProducto");
btnEliminarProducto.onclick = eliminarProducto;