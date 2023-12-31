const obtenerIdCarrito = () => {
    return JSON.parse(localStorage.getItem("cart")) || [];
}
const agregarProductoAlCarrito = async (pid) => {
    try {
        let cart = obtenerIdCarrito();

        const response = await fetch("/api/carts/" + cart.id + "/products/" + pid, {
            method: "POST",
            headers: { "Content-type": "application/json; charset=UTF-8" }
        });

        if (!response.ok) {
            console.error("Error en la respuesta del servidor:", response.status, response.statusText);
            return;
        }

        const contentType = response.headers.get("Content-Type");
        if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
            console.log("Se agregó al Carrito:", data);

            cart = obtenerIdCarrito();
        } else {
            console.error("Error: La respuesta no tiene el formato JSON esperado");
        }
    } catch (error) {
        console.error("Error en agregar el Producto al Carrito: ", error);
    }
}

