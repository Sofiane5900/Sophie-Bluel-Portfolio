
// Je charge le DOM avant d'executer le script
document.addEventListener("DOMContentLoaded", (event) => {


// Je récupère l'élément HTML qui a la classe "gallery"
const galleryElement = document.querySelector(".gallery");


fetch("http://localhost:5678/api/works") // Je fais une requête HTTP pour récupérer les données de l'API
    .then(response => { // Je récupère la réponse de l'API
        return response.json(); // Je convertis la réponse en JSON
    }) .then((works) => { // Je récupère les données JSON
        console.log(works); 
        for (const work of works) { // Je parcours les données 

            const galleryElement = document.createElement("figure"); 
            galleryElement.classList.add("gallery-item");
            document.querySelector(".gallery").appendChild(galleryElement);

            const imageElement = document.createElement("img");
            imageElement.src = work.imageUrl;
            galleryElement.appendChild(imageElement);

            const titleElement = document.createElement("figcaption");
            titleElement.innerText = work.title;
            galleryElement.appendChild(titleElement);
         
        }
    });

    fetch("http://localhost:5678/api/categories") 
    .then(response => {
        return response.json();
    }) .then((categories) => {
        console.log(categories); 
        for (const category of categories) { 

            const categoryElement = document.createElement("li"); 
            categoryElement.classList.add("category-item");
            document.querySelector(".category").appendChild(categoryElement);

            const titleElement = document.createElement("p");
            titleElement.innerText = category.name;
            categoryElement.appendChild(titleElement);

 
        }
    });
});



