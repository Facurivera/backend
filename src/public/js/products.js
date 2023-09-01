const crearCarrito = async () => {
    try {
        if (localStorage.getItem("carrito")) {
            return await JSON.parse(localStorage.getItem("carrito"));
        } else {
            const response = await fetch("/api/carts/", {
                method: "POST",
                headers: {"Content-type": "application/json; charset=UTF-8"}
            });
            const data = await response.json();
            localStorage.setItem("carrito", JSON.stringify(data));
    
            return data;
        }
    } catch(error) {
        console.log("Error no se pudo crear el carrito");
    }
}

const obtenerIdCarrito = async () => {
    try {
        let cart = await crearCarrito();
    
        return cart.id;
    } catch(error) {
        console.log("Error id no obtenido");
    }
}

const agregarProductoAlCarrito = async (pid) => {
    try {
        let cid = await obtenerIdCarrito();
    
        await fetch("/api/carts/" + cid + "/products/" + pid, {
            method: "POST",
            headers: {"Content-type": "application/json; charset=UTF-8"}
        })
        .then(response => response.json())
        .then(data => {
            console.log("Se agregó al Carrito");
        });
    } catch(error) {
        console.log("Error el producto no se pudo agregar");
    }
}