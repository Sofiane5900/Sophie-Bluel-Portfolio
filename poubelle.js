for (const category of categories) {
    const categoryElement = document.createElement("li");
    categoryElement.classList.add("category-item");
    document.querySelector(".category").appendChild(categoryElement);

    const titleElement = document.createElement("p");
    titleElement.innerText = category.name;
    categoryElement.appendChild(titleElement); 

    titleElement.addEventListener("click", (event) => {                 
        const filteredCategories = categories.filter(item => item.name === category.name); // Je filtre les catégories en fonction du nom cliqué
        console.log(filteredCategories); 

        });
}