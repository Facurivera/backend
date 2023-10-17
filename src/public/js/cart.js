const crearCarrito = async () => {
    try {
      if (localStorage.getItem("carrito")) {
        return JSON.parse(localStorage.getItem("carrito"));
      } else {
        const response = await fetch("/api/carts/", {
          method: "POST",
          headers: { "Content-type": "application/json; charset=UTF-8" },
        });
        const data = await response.json();
        localStorage.setItem("carrito", JSON.stringify({ id: data.id }));
        return { id: data.id };
      }
    } catch (error) {
      console.log("Error " + error);
    }
  };
  
  const obtenerIdCarrito = async () => {
    try {
      let cart = await crearCarrito();
      if (!cart.id) {
        console.error("Error ID del carrito");
      }
      return cart.id;
    } catch (error) {
      console.log("Error" + error);
    }
  };
  
  const agregarProductoAlCarrito = async (pid) => {
    try {
      let cid = await obtenerIdCarrito();
  
      if (!cid) {
        return;
      }
      const response = await fetch("/api/carts/" + cid + "/products/" + pid, {
        method: "POST",
        headers: { "Content-type": "application/json; charset=UTF-8" },
      });
  
      const data = await response.json();
    } catch (error) {
      console.log("Error" + error);
    }
  };
  
  async function realizarCompra() {
    try {
      const cartId = await obtenerIdCarrito();
      if (!cartId) {
        throw new Error("Carrito no encontrado");
      }
  
      const url = `/api/carts/${cartId}/purchase`; 
      const response = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        const text = await response.text();
        console.error(text);
        return;
      }

    const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await response.json();
      } else {
        console.error("Respuesta no JSON:", await response.text());
      }
    } catch (error) {
      console.error("Error", error);
    }
  
    
  }