document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.delete-button').forEach(button => {
      button.addEventListener('click', function() {
        const userId = this.getAttribute('data-id');
        fetch(`/api/users/${userId}`, { method: 'DELETE' })
          .then(response => response.json())
          .then(data => {
            if(data.success) {
              document.getElementById(`user-${userId}`).remove();
            } else {
              alert('Error al eliminar el usuario');
            }
          });
      });
    });

    document.querySelectorAll('.role-change-button').forEach(button => {
      button.addEventListener('click', function() {
        const userId = this.getAttribute('data-id');
        const select = document.querySelector(`.role-select[data-id="${userId}"]`);
        const newRole = select.value;
        fetch(`/api/users/${userId}/role`, { 
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ role: newRole }),
        })
        .then(response => response.json())
        .then(data => {
          if(data.success) {
            Swal.fire({
      icon: "succes",
      text: "Rol actualizado",
    });
          } else {
            alert('Error al actualizar el rol');
          }
        });
      });
    });
  });