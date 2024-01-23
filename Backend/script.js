
const galleryElement = document.querySelector(".gallery");

fetch("http://localhost:5678/api/works")
    .then(response => {
        return response.json();
    }) .then((users) => {
        console.log(users);
        for (const user of users) {
            const figureElement = document.createElement("figure");
            figureElement.innerText = user.title;
            galleryElement.appendChild(figureElement);
        }

    });
