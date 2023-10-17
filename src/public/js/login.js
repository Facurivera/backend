const loginUser = async () => {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    try{
        const response = await fetch(`/api/sessions/login`, {
            method:"POST",
            headers: {"Content-type": "application/json; charset=UTF-8"},
            body: JSON.stringify({email:email, pass:password})
        });
        if (!response.ok || response.headers.get("Content-Type") !== "application/json; charset=UTF-8") {
            console.error("Error en la respuesta del servidor");
            return;
        }
        const data = await response.json();
        if (data.status === "success") {
          window.location.href = data.redirect;
        } else {
          console.log("Error", data);
        }
      } catch (error) {
        console.log("error", error);
      }
    };
    document.getElementById("btnLogIn").onclick = loginUser;