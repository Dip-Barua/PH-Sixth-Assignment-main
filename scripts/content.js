// Function to load categories
const loadCategories = () => {
    fetch("https://openapi.programming-hero.com/api/peddy/categories")
        .then(res => res.json())
        .then(data => {
            displayCategories(data.categories);
            loadPets();
        })
        .catch(error => console.log("Error loading categories:", error));
};

// Function to display categories
const displayCategories = (categories) => {
    const categoryContainer = document.getElementById("categories");
    categoryContainer.innerHTML = '';

    categories.forEach(item => {
        const button = document.createElement("button");
        button.classList.add("btn", "text-2xl", "sm:w-3/12", "sm:w-10/12","h-full", "mx-4","gap-4", "items-center", "flex", "p-4", "font-bold", 'hover:bg-green-400');
        
        button.onclick = () => {
            document.querySelectorAll('.btn.active').forEach(btn => {
                btn.classList.remove('active', 'bg-green-400', 'text-white', 'rounded-full');
                btn.classList.add('bg-gray-100', 'text-black');
            });
            
            button.classList.add('active', 'bg-green-400', 'text-white', 'hover:bg-green-400', 'rounded-full');
            
            // Show loader before fetching pets
            showLoader();
            setTimeout(() => {
                loadCategoryPets(item.category);
            }, 2000);
        };

        const logo = document.createElement("img");
        logo.src = item.category_icon;
        logo.alt = `${item.category} logo`;
        logo.classList.add("w-10", "h-10", "mr-2");

        const categoryName = document.createTextNode(item.category);

        button.appendChild(logo);
        button.appendChild(categoryName);

        categoryContainer.append(button);
    });
};

// Function to sort pets by price in descending order
const sortByPrice = (pets) => {
    return pets.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
};

// Function to sort pets in decending order of their  when the 'Sort by Price' button is clicked
const handleSortByPrice = () => {
    const activeCategoryButton = document.querySelector('.btn.active');
    if (activeCategoryButton) {
        const activeCategory = activeCategoryButton.textContent.trim();
        loadCategoryPets(activeCategory, true);
    } else {
        loadPets(true);
    }
};

// Load pets from a specific category
const loadCategoryPets = (category, sort = false) => {
    const url = `https://openapi.programming-hero.com/api/peddy/category/${category}`;
    fetch(url)
        .then(res => res.json())
        .then(data => {
            let pets = data.data || [];
            if (sort) {
                pets = sortByPrice(pets);
            }
            displayPets(pets);
        })
        .catch(error => console.log("Error fetching pets for category:", error));
};

const loadPets = (sort = false) => {
    fetch("https://openapi.programming-hero.com/api/peddy/pets")
        .then(res => res.json())
        .then(data => {
            let pets = data.pets || [];
            if (sort) {
                pets = sortByPrice(pets);
            }
            displayPets(pets);
        })
        .catch(error => console.log("Error loading pets:", error));
};

// Show loader function
const showLoader = () => {
    const petContainer = document.getElementById("pets");
    petContainer.innerHTML = `<div class="loader grid col-span-full mx-auto"></div>`;
};

// Function to display pets
const displayPets = (pets) => {
    const petContainer = document.getElementById("pets");

    petContainer.innerHTML = '';

    if (!pets || pets.length === 0) {
        petContainer.innerHTML = `
        <div class="text-center col-span-3 p-12">
        <img class="mx-auto" src="/assets/img/error.webp">
        <h2 class="text-4xl font-bold text-center">No Information Available.</h2>
        <p class="text-slate-600 my-10">It is a long established fact that a reader will be distracted by the readable content of a page when looking at <br>
its layout. The point of using Lorem Ipsum is that it has a.</p>
        </div>
        `;
        return;
    }

    pets.forEach(pet => {
        const card = document.createElement("div");
        card.classList.add("card", "card-compact", "bg-base-100", "p-4", "w-full", "shadow-md");
        card.innerHTML = `
            <figure>
                <img src="${pet.image}" alt="${pet.pet_name}" class="h-full w-full object-cover"/>
            </figure>
            <div class="card-body">
                <h2 class="card-title font-bold text-xl sm:text-2xl">${sanitizeInput(pet.pet_name)}</h2>
                <p class="text-gray-3 flex items-center gap-1 text-bold text-sm sm:text-lg"><img src="/assets/img/breed.png" class="w-6 h-6"> Breed: ${sanitizeInput(pet.breed) ? pet.breed : 'N/A'}</p>
                <p class="text-gray-3 flex items-center gap-1 text-bold text-sm sm:text-lg"><img src="/assets/img/birth.png" class="w-6 h-6"> Birth: ${sanitizeInput(pet.date_of_birth) ? pet.date_of_birth : 'N/A'}</p>
                <p class="text-gray-3 flex items-center gap-1 text-bold text-sm sm:text-lg"><img src="/assets/img/gender.png" class="w-6 h-6"> Gender: ${sanitizeInput(pet.gender) ? pet.gender : 'N/A'}</p>
                <p class="text-gray-3 flex items-center gap-1 text-bold text-sm sm:text-lg"><img src="/assets/img/dollar.png" class="w-6 h-6"> Price: ${sanitizeInput(pet.price) ? '$' + pet.price : 'N/A'}</p>
                <hr>
                <div class="card-actions justify-between">
                    <button class="btn btn-outline border-slate-300 sm:w-3/12" onclick="addImageToDisplay('${pet.image}')"><img src="/assets/img/like.png"></button>
                    <button class="btn btn-outline border-slate-300 font-bold sm:w-4/12" onclick="startAdoptCountdown(this)">Adopt</button>
                    <button class="btn btn-outline border-slate-300 font-bold w-full sm:w-4/12" onclick="showPetDetails('${sanitizeInput(pet.pet_name)}', '${pet.image}', '${sanitizeInput(pet.breed)}', '${sanitizeInput(pet.gender)}','${sanitizeInput(pet.date_of_birth)}', '${sanitizeInput(pet.price)}' ,'${sanitizeInput(pet.vaccinated_status)}', '${sanitizeInput(pet.pet_details)}')">Details</button>
                </div>
            </div>
        `;

        petContainer.appendChild(card);
    });
};

// Function to start the adopt countdown on screen
const startAdoptCountdown = (button) => {
    const countdownDisplay = document.getElementById("countdownDisplay");
    countdownDisplay.style.display = 'flex';
    countdownDisplay.textContent = '';

    let countdown = 4;
    const countdownInterval = setInterval(() => {
        countdown--;
        if (countdown > 0) {
            // countdownDisplay.textContent = countdown;
            if (countdown > 0) {
                countdownDisplay.innerHTML = `
                    <div class="bg-white rounded-lg shadow-lg text-center p-4 md:p-6 w-9/12 md:w-3/12 ">
                    <img class=" mx-auto w-4/12" src="/assets/img/handshake.png">
                        <h1 class="text-black text-4xl my-2">Congrates!</h1>
                        <p class="text-black text-xl">Adoption Process is starting for your pet</p>
                        <h1 class="text-black text-7xl">${countdown}</h1>
                    </div>`;
            }
            
            
        } else {
            clearInterval(countdownInterval);
            countdownDisplay.style.display = 'none';
            button.textContent = "Adopted";
            button.disabled = true;
            button.classList.add("bg-gray-300", "cursor-not-allowed");
        }
    }, 1000);
};

// Function to add the image to the display section when 'like button is clicked
const addImageToDisplay = (image) => {
    const imageDisplayContainer = document.getElementById("imageDisplay");
    
    const imgElement = document.createElement("img");
    imgElement.src = image;
    imgElement.alt = "Pet Image";
    imgElement.classList.add("w-full", "h-full", "object-cover", "m-2", "rounded");

    imageDisplayContainer.appendChild(imgElement);
};

// Function to sanitize input data
const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;

    return input
        .replace(/\\/g, '\\\\')
        .replace(/'/g, "\\'")
        .replace(/"/g, '&quot;')
        .replace(/&/g, '&amp;') 
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
};

// Function to show pet details in modal
const showPetDetails = (name, image, breed, gender, birth, price, vaccinated, petDetails) => {
    const modal = document.getElementById("petDetailsModal");
    document.getElementById("petName").textContent = sanitizeInput(name);
    document.getElementById("petImage").src = image; 
    document.getElementById("petBreed").textContent = sanitizeInput(breed) || 'N/A';
    document.getElementById("petGender").textContent = sanitizeInput(gender) || 'N/A';
    document.getElementById("pet_details").textContent = sanitizeInput(petDetails) || 'N/A';
    document.getElementById("vaccinated_status").textContent = sanitizeInput(vaccinated) || 'N/A';
    document.getElementById("petBirth").textContent = sanitizeInput(birth) || 'N/A';
    document.getElementById("petPrice").textContent = price ? '$' + sanitizeInput(price) : 'N/A';

    modal.classList.remove("hidden");
};

document.addEventListener("click", (event) => {
    if (event.target.classList.contains("close")) {
        const modal = document.getElementById("petDetailsModal");
        modal.classList.add("hidden");
    }
});

loadCategories();

document.addEventListener("DOMContentLoaded", () => {
    loadCategories();

    const sortByPriceButton = document.getElementById("sortByPriceBtn");
    sortByPriceButton.onclick = handleSortByPrice;
});
