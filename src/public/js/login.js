const loginUser = async () => {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    try{
        const response = await fetch(`/api/sessions/login`, {
            method:"POST",
            headers: {"Content-type": "application/json; charset=UTF-8"},
            body: JSON.stringify({email:email, password:password})
        });
        
        const data = await response.json();
        
        
        if (response.ok && data.status === "success") {
        window.location.href = data.redirect;
        } else {
          console.log("Error", data);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'credencial invalida',
          });
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'credencial invalida',
        });
      }
    };
    document.getElementById("btnLogIn").onclick = loginUser;