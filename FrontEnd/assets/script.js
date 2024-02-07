document.addEventListener("DOMContentLoaded", (event) => {
    // Récupération des éléments du DOM
    const galleryElement = document.querySelector(".gallery");
    const categoryElement = document.querySelector(".category");
    let work = []; // Tableau pour stocker les travaux
    
    const editMode = document.querySelector("#edit-mode");
    const modal = document.querySelector(".modal");
    const close = document.querySelector(".modal__close");
    const modalContent = document.querySelector(".modal__content");
    const overlay = document.querySelector(".overlay");
    const modalIcon = document.querySelector(".modal__body--icon");
    const modifyProject = document.querySelector(".modify__project");
    const openAddModal = document.querySelector(".modal__footer--add");

    const add = document.querySelector(".add");
    const addBack = document.querySelector(".add__back");
    const closeAdd = document.querySelector(".add__close");
    const goBackModal = document.querySelector(".add__back");
    const addPicture = document.querySelector(".add__content--picture");
    const picture = document.querySelector(".picture");

    // Déclarer une variable loggedUser pour stocker les données de l'utilisateur connecté
    let loggedUser = null;
    
        // Si j'ai un token dans le localStorage, je récupère les données de l'utilisateur connecté
        if (localStorage.getItem("token")) {
            let edition = document.querySelector("#edit-mode");
            edition.style.display = "block"; 
        } 

    // ** Filtre et affichage des travaux ** //
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

            // Ajout des catégories à la liste
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

                
                
                       // Quand je suis login alors je ne vois plus les filtres 
                       if (localStorage.getItem("token")) {
                        categoryElement.style.display = "none";
                    }

                    // Quand je suis login je vois "modify__project"
                    if (localStorage.getItem("token")) {
                        modifyProject.style.display = "block";
                    } // Sinons je ne le vois pas
                    else {
                        modifyProject.style.display = "none";
                    }

            });
            console.log(workArray);

            // ** Modal ** //

   
            // "modal" should never be opened if the user is not logged in
            if (!localStorage.getItem("token")) {
                modal.style.display = "none";
            }


            function openModal() {
                overlay.style.display = "block";
                modal.style.display = "block";
            }

            function closeModal() {
                overlay.style.display = "none";
                modal.style.display = "none";
            }

            editMode.addEventListener("click", () => {
                openModal();
            });
        
            close.addEventListener("click", (event) => {
                closeModal();
            });    
    
            for (const work of works) {
                // J'affiche tout mes travaux dans ma modal 
                const modalItem = document.createElement("figure");
                // J'ajoute cette element dans ma modal__content
                modalItem.classList.add("modal__item");
                modalContent.appendChild(modalItem);

                const modalImage = document.createElement("img");
                modalImage.src = work.imageUrl;
                modalItem.appendChild(modalImage);

          
                // Je crée une div modal__body--icon pour mes icones qui ce trouve dans ma modal__content 
                const modalBody = document.createElement("div");
                modalBody.classList.add("modal__body--icon");
                modalItem.appendChild(modalBody);

                // J'ajoute une icone de suppresion dans ma div modal__body--icon
                const deleteIcon = document.createElement("i");
                deleteIcon.classList.add("fas", "fa-trash-alt");
                modalBody.appendChild(deleteIcon);
      
                
                // Quand je clique sur l'icone de suppresion, je supprime le travail
                deleteIcon.addEventListener("click", async () => {
                    // Supprimer le travail
                    const response = await fetch(`http://localhost:5678/api/works/${work.id}`, {
                        method: "DELETE",
                        headers: {
                            "Authorization": `Bearer ${localStorage.getItem("token")}`
                        }
                    });
                    if (response.ok) {
                        modalContent.removeChild(modalItem);
                    }
                });

                // Quand je clique sur "add__close", je ferme la modal 
                function closeAddModal() {
                    add.style.display = "none";
                    modal.style.display = "none";
                    overlay.style.display = "none";
                }

                function openAdd() {
                    overlay.style.display = "block";
                    add.style.display = "block";
                }

                function goBack() {
                    add.style.display = "none";
                }
        

            openAddModal.addEventListener("click", () => {
                openAdd();
            });


                closeAdd.addEventListener("click", (event) => {
                    closeAddModal();
                });

                goBackModal.addEventListener("click", (event) => {
                    goBack();
                });


                /// Si j'ajoute une photo sur le label "file", alors ma photo va prendre la place de toute la div "add__content--picture"
                addPicture.addEventListener("change", (event) => {
                    const file = event.target.files[0];
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                
                    reader.onload = () => {
                        // Mettez à jour la source de l'image dans l'élément avec la classe "picture"
                        picture.src = reader.result;
                        // Mettez à jour le contenu de la div avec la classe "add__content--picture"
                        const addContentPicture = document.querySelector('.add__content--picture');
                        if (addContentPicture) {
                            addContentPicture.innerHTML = `<img class="picture" src="${reader.result}" alt="Uploaded Picture">`;
                        }
                    };
                });
                
      
                
                
            
             
       

                
            }
  
        });



});
