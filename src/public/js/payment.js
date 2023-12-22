document.addEventListener("DOMContentLoaded", () => {
    const paymentButton = document.getElementById("payment");
  
    if (paymentButton) {
      paymentButton.addEventListener("click", async () => {
        const cartId = await obtenerIdCarrito();
  
        if (!cartId) {
          console.error("El ID del carrito es inválido o no se ha encontrado.");
          return;
        }
  
        const response = await fetch("/payment/create-checkout-session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ cartId: cartId }) 
        });
  
        const data = await response.json();
        if (response.ok) {
          window.location.href = data.url; 
        } else {
          console.error("Error al iniciar la sesión de pago.");
        }
      });
    }
  });