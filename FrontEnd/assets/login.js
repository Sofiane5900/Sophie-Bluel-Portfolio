document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector("#login-form");
    const errorMessage = document.querySelector(".error-message");

    

    loginForm.addEventListener("submit", async (event)=> {
        event.preventDefault();
        const email = document.querySelector("#email").value;
        const password = document.querySelector("#password").value;

        //Logique pour envoyer les données au serveur
        const response = await fetch("http://localhost:5678/api/users/login" , {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        console.log(data);

        if(response.ok) {
            // Rediriger vers la page d'accueil
            window.location.href = "index.html";
            localStorage.setItem("token", data.token);
            console.log(data.token);
        } else {
            // Afficher le message d'erreur
            errorMessage.innerText = data.message;
            console.log("Erreur de connexion");
        } 


        
    });

});