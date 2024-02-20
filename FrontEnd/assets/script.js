document.addEventListener("DOMContentLoaded", () => {
  // DOM elements
  const galleryElement = document.querySelector(".gallery");
  const categoryElement = document.querySelector(".category");
  const editMode = document.querySelector("#edit__mode");
  const modifyButton = document.querySelector("#modify__project--button");
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
  const addPicture2 = document.querySelector("#file");
  const titleInput = document.querySelector(".add__content--category");
  const categorySelect = document.querySelector("#category");
  const confirmButton = document.querySelector(".add__footer--confirm");
  const loginMessage = document.querySelector(".login__message");

  // Variables
  let work = [];
  let loggedUser = null;

  // Check if user is logged in and display edit mode
  if (localStorage.getItem("token")) {
    editMode.style.display = "block";
  }

  // Fetch works from API and populate categories
  fetchWorks();
  fetchAndPopulateCategories();

  // Fetch works function
  function fetchWorks() {
    fetch("http://localhost:5678/api/works")
      .then((response) => response.json())
      .then((works) => {
        work = works;
        initializeGallery(works);
        createCategories(works);
        setupEditModeDisplay();
        setupModifyProjectDisplay();
        setupModal();
        setupAddModal();
      });
  }

  // Function to fetch and populate categories
  function fetchAndPopulateCategories() {
    // Fetch categories from API
    fetch("http://localhost:5678/api/categories")
      .then((response) => response.json())
      .then((categories) => {
        // Update the options in the select element
        const categorySelect = document.querySelector("#category");
        categorySelect.innerHTML = ""; // Clear existing options

        categories.forEach((category) => {
          const option = document.createElement("option");
          option.value = category.id;
          option.textContent = category.name;
          categorySelect.appendChild(option);
        });
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }

  // Initialize gallery with all works
  function initializeGallery(works) {
    galleryElement.innerHTML = "";
    works.forEach((work) => {
      createGalleryItem(work);
    });
  }

  // Create gallery item
  function createGalleryItem(work) {
    const galleryItem = document.createElement("figure");
    galleryItem.classList.add("gallery-item");

    const imageElement = document.createElement("img");
    imageElement.src = work.imageUrl;
    galleryItem.appendChild(imageElement);

    const titleElement = document.createElement("figcaption");
    titleElement.innerText = work.title;
    galleryItem.appendChild(titleElement);

    galleryElement.appendChild(galleryItem);
  }

  // Create categories in the menu
  function createCategories(works) {
    const workArray = new Set();

    const tousCategory = document.createElement("li");
    tousCategory.classList.add("category-item-tous");
    categoryElement.appendChild(tousCategory);

    const tousElement = document.createElement("p");
    tousElement.innerText = "Tous";
    tousCategory.appendChild(tousElement);

    tousElement.addEventListener("click", () => {
      displayAllWorks(works);
    });

    works.forEach((work) => {
      workArray.add(work.category.name);
    });

    workArray.forEach((categoryName) => {
      createCategoryElement(categoryName, works);
    });
  }

  // Create category element
  function createCategoryElement(categoryName, works) {
    const categoryArray = document.createElement("li");
    categoryArray.classList.add("category-item");
    categoryElement.appendChild(categoryArray);

    const nameElement = document.createElement("p");
    nameElement.innerText = categoryName;
    categoryArray.appendChild(nameElement);

    nameElement.addEventListener("click", () => {
      displayFilteredWorks(categoryName, works);
    });

    // Display filters conditionally based on login status
    displayFiltersBasedOnLoginStatus();

    // Display modify__project based on login status
    displayModifyProjectBasedOnLoginStatus();
  }

  // Display all works in the gallery
  function displayAllWorks(works) {
    galleryElement.innerHTML = "";
    works.forEach((work) => {
      createGalleryItem(work);
    });
  }

  // Display filtered works in the gallery
  function displayFilteredWorks(categoryName, works) {
    galleryElement.innerHTML = "";
    const filteredWorks =
      categoryName === "Tous"
        ? works
        : works.filter((work) => work.category.name === categoryName);

    filteredWorks.forEach((work) => {
      createGalleryItem(work);
    });
  }

  // Display filters conditionally based on login status
  function displayFiltersBasedOnLoginStatus() {
    if (localStorage.getItem("token")) {
      categoryElement.style.display = "none";
    }
  }

  // Display modify__project based on login status
  function displayModifyProjectBasedOnLoginStatus() {
    modifyProject.style.display = localStorage.getItem("token")
      ? "block"
      : "none";
  }

  // Setup edit mode display
  function setupEditModeDisplay() {
    if (localStorage.getItem("token")) {
      categoryElement.style.display = "none";
    }
  }

  // Setup modify__project display
  function setupModifyProjectDisplay() {
    modifyProject.style.display = localStorage.getItem("token")
      ? "block"
      : "none";
  }

  // Setup modal
  function setupModal() {
    modal.style.display = localStorage.getItem("token") ? "none" : "none";

    modifyButton.addEventListener("click", () => {
      openModal();
    });

    close.addEventListener("click", () => {
      closeModal();
    });

    work.forEach((work) => {
      createModalItem(work);
    });
  }

  // Open modal function
  function openModal() {
    overlay.style.display = "block";
    modal.style.display = "block";
  }

  // Close modal function
  function closeModal() {
    overlay.style.display = "none";
    modal.style.display = "none";
  }

  // Create modal item
  function createModalItem(work) {
    const modalItem = document.createElement("figure");
    modalItem.classList.add("modal__item");
    modalContent.appendChild(modalItem);

    const modalImage = document.createElement("img");
    modalImage.src = work.imageUrl;
    modalItem.appendChild(modalImage);

    const modalBody = document.createElement("div");
    modalBody.classList.add("modal__body--icon");
    modalItem.appendChild(modalBody);

    const deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fas", "fa-trash-alt");
    modalBody.appendChild(deleteIcon);

    deleteIcon.addEventListener("click", async () => {
      const response = await fetch(
        `http://localhost:5678/api/works/${work.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        modalContent.removeChild(modalItem);
      }
    });
  }

  // Setup add modal
  function setupAddModal() {
    add.style.display = "none";
    modal.style.display = "none";

    if (!localStorage.getItem("token")) {
      modal.style.display = "none";
    }

    openAddModal.addEventListener("click", () => {
      openAdd();
    });

    closeAdd.addEventListener("click", () => {
      closeAddModal();
    });

    goBackModal.addEventListener("click", () => {
      goBack();
    });

    addPicture.addEventListener("change", (event) => {
      handlePictureChange(event);
    });

    titleInput.addEventListener("input", checkFields);
    categorySelect.addEventListener("change", checkFields);

    confirmButton.addEventListener("click", () => {
      handleConfirmButtonClick();
    });
  }

  // Open add modal function
  function openAdd() {
    overlay.style.display = "block";
    add.style.display = "block";
  }

  // Close add modal function
  function closeAddModal() {
    add.style.display = "none";
    modal.style.display = "none";
    overlay.style.display = "none";
  }

  // Go back function
  function goBack() {
    add.style.display = "none";
  }

  // Handle picture change function
  function handlePictureChange(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      picture.src = reader.result;
      const addContentPicture = document.querySelector(
        ".add__content--picture"
      );
      if (addContentPicture) {
        addContentPicture.innerHTML = `<img class="picture" src="${reader.result}" alt="Uploaded Picture" style="width: 129px; height: 170px; filter: none;">`;
      }
    };
  }

  // Check if all fields are filled
  function checkFields() {
    const titleValue = titleInput.value.trim();
    const categoryValue = categorySelect.value.trim();

    if (titleValue !== "" && categoryValue !== "") {
      confirmButton.style.backgroundColor = "#1D6154";
      loginMessage.innerText = "";
    } else {
      confirmButton.style.backgroundColor = "grey";
      loginMessage.innerText = "Veuillez remplir tous les champs";
    }
  }

  // Handle confirm button click
  async function handleConfirmButtonClick() {
    const formData = new FormData();
    formData.append("title", titleInput.value);
    formData.append("category", categorySelect.value);
    formData.append("image", addPicture2.files[0]);

    try {
      const response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        body: formData,
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const newWork = await response.json();
        createGalleryItem(newWork);
        closeAddModal();
      } else {
        const errorResponse = await response.text();
        console.error("Error:", errorResponse);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
});
