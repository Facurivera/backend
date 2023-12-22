document.getElementById('uploadForm').addEventListener('submit', function(event) {
    console.log("Formulario de carga enviado");
    event.preventDefault();
    submitForm(this, 'uploadMessage');
});

document.getElementById('uploadPremiumForm').addEventListener('submit', function(event) {
    console.log("Formulario de carga premium enviado");
    event.preventDefault();
    submitForm(this, 'uploadPremiumMessage');
});


       function submitForm(form, messageId) {
    console.log("submitForm llamado", form.action);
    const formData = new FormData(form);
    fetch(form.action, {
        method: 'POST',
        body: formData
    })
    .then(response => {
        console.log("Respuesta recibida", response);
        return response.json();
    })
    .then(data => {
        console.log("Datos procesados", data);
        document.getElementById(messageId).innerText = data.message;
    })
    .catch(error => {
        console.error("Error durante la carga del archivo", error);
        document.getElementById(messageId).innerText = 'Error al cargar el archivo';
    });
}
