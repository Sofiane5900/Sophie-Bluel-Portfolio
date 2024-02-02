document.addEventListener("DOMContentLoaded", (event) => {
    // Récupération des éléments du DOM
    const galleryElement = document.querySelector(".gallery");
    const categoryElement = document.querySelector(".category");
    let work = []; // Tableau pour stocker les travaux
    
    // Déclarer une variable loggedUser pour stocker les données de l'utilisateur connecté
    let loggedUser = null;
    
    // Si j'ai un token dans le localStorage, je récupère les données de l'utilisateur connecté
    if (localStorage.getItem("token")) {
        let edition = document.querySelector("#edit-mode");
        edition.style.display = "block"; 
    } 


    // Appel à l'API pour récupérer les travaux
    fetch("http://localhost:5678/api/works") 
        .then(response => response.json())
        .then((works) => {
            console.log(works);
            work = works;
            let workArray = new Set(); // Utilisation de Set pour éviter les doublons de catégories

            // Création de la catégorie "Tous" dans le menu
            const tousCategory = document.createElement("li"); 
            tousCategory.classList.add("category-item-tous");
            categoryElement.appendChild(tousCategory); 
       
            const tousElement = document.createElement("p"); 
            tousElement.innerText = "Tous"; 
            tousCategory.appendChild(tousElement);
       
            tousElement.addEventListener("click", () => { 
                // Effacer la galerie
                galleryElement.innerHTML = ''; 
       
                // Afficher tous les travaux dans la galerie
                works.forEach(work => {
                    const galleryItem = document.createElement("figure");
                    galleryItem.classList.add("gallery-item");
                   
                    const imageElement = document.createElement("img");
                    imageElement.src = work.imageUrl;
                    galleryItem.appendChild(imageElement);
                   
                    const titleElement = document.createElement("figcaption");
                    titleElement.innerText = work.title;
                    galleryItem.appendChild(titleElement);
                   
                    galleryElement.appendChild(galleryItem);
                });
            });

            // Ajout des éléments à la galerie
            for (const work of works) {
                const galleryItem = document.createElement("figure");
                galleryItem.classList.add("gallery-item");

                const imageElement = document.createElement("img");
                imageElement.src = work.imageUrl;
                galleryItem.appendChild(imageElement);

                const titleElement = document.createElement("figcaption");
                titleElement.innerText = work.title;
                galleryItem.appendChild(titleElement);

                workArray.add(work.category.name);

                // Ajout directement à la galerie
                galleryElement.appendChild(galleryItem);
            }

            // Ajout des catégories au menu
            workArray.forEach(categoryName => {
                const categoryArray = document.createElement("li");
                categoryArray.classList.add("category-item");
                categoryElement.appendChild(categoryArray);

                const nameElement = document.createElement("p");
                nameElement.innerText = categoryName;
                categoryArray.appendChild(nameElement);

                nameElement.addEventListener("click", () => {
                    // Effacer la galerie
                    galleryElement.innerHTML = '';

                    // Filtrer les travaux en fonction de la catégorie
                    const filteredWorks = categoryName === "Tous" 
                        ? works // Je veux tous les travaux
                        : works.filter(work => work.category.name === categoryName); 

                    // Afficher les travaux filtrés dans la galerie
                    filteredWorks.forEach(work => {
                        const galleryItem = document.createElement("figure"); 
                        galleryItem.classList.add("gallery-item");

                        const imageElement = document.createElement("img");
                        imageElement.src = work.imageUrl;
                        galleryItem.appendChild(imageElement);

                        const titleElement = document.createElement("figcaption");
                        titleElement.innerText = work.title;
                        galleryItem.appendChild(titleElement);

                        galleryElement.appendChild(galleryItem);
                    });
                });
            });
            console.log(workArray);
        });
});
