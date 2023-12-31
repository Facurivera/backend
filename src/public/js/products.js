const obtenerIdCarrito = () => {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

const agregarProductoAlCarrito = async (pid) => {
    try {
        let cart = obtenerIdCarrito();
    
        const response = await fetch("/api/carts/" + cart.id + "/products/" + pid, {
            method: "POST",
            headers: {"Content-type": "application/json; charset=UTF-8"}
        });

        if (!response.ok || response.headers.get("Content-Type") !== "application/json; charset=UTF-8") {
            console.error("Error en la respuesta del servidor");
            return;
        }

        const data = await response.json();
        console.log("Se agregó al Carrito");
    } catch (error) {
        console.log("Error en agregar el Producto al Carrito " + error);
    }
}
