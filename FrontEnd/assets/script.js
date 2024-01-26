document.addEventListener("DOMContentLoaded", (event) => {
    const galleryElement = document.querySelector(".gallery");
    const categoryElement = document.querySelector(".category");
    let work = [];

    fetch("http://localhost:5678/api/works")
        .then(response => response.json())
        .then((works) => {
            console.log(works);
            work = works;
            let workArray = new Set();

            // ** "Tous"  ** //
            const tousCategory = document.createElement("li");
            tousCategory.classList.add("category-item-tous");
            categoryElement.appendChild(tousCategory);
       
            const tousElement = document.createElement("p");
            tousElement.innerText = "Tous";
            tousCategory.appendChild(tousElement);
       
            tousElement.addEventListener("click", () => {

            // Clear the gallery
            galleryElement.innerHTML = '';
       
            // Display all works in the gallery
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

               

            // ** Gallery ** // 
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

                // Add directly to the gallery
                galleryElement.appendChild(galleryItem);
            }

            // ** Category ** //
            workArray.forEach(categoryName => {
                const categoryArray = document.createElement("li");
                categoryArray.classList.add("category-item");
                categoryElement.appendChild(categoryArray);

                const nameElement = document.createElement("p");
                nameElement.innerText = categoryName;
                categoryArray.appendChild(nameElement);

                nameElement.addEventListener("click", () => {
                    // Clear the gallery
                    galleryElement.innerHTML = '';

                    // Filter works based on the category
                    const filteredWorks = categoryName === "Tous"
                        ? works
                        : works.filter(work => work.category.name === categoryName);

                    // Display the filtered works in the gallery
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
