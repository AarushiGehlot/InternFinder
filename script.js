
const searchInput = document.getElementById("searchInput");
const locationFilter = document.getElementById("locationFilter");
const savedOnly = document.getElementById("savedOnly");

const cards = document.querySelectorAll(".card");
const noResults = document.getElementById("noResults");
const resultsCount = document.getElementById("resultsCount");

const STORAGE_KEY = "internFinderSaved";
let savedIds = new Set(
    JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
);
function saveToStorage() {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify([...savedIds])
    );
}

// Filter internships using search, location, and saved status
function filterInternships() {
    const query = searchInput.value.toLowerCase().trim();
    const location = locationFilter.value;

    let visibleCount = 0;

    cards.forEach(function (card) {
        const cardText = card.textContent.toLowerCase();

        const matchesSearch = cardText.includes(query);

        const matchesLocation =
            location === "all" || cardText.includes(location);

        const matchesSaved =
    !savedOnly.checked || savedIds.has(card.dataset.id);

        if (matchesSearch && matchesLocation && matchesSaved) {
            card.style.display = "";
            visibleCount++;
        } else {
            card.style.display = "none";
        }
    });

    // Update the number of visible internships
    resultsCount.textContent =
        visibleCount +
        (visibleCount === 1
            ? " internship available"
            : " internships available");

    // Show a message if no internships match
    noResults.hidden = visibleCount > 0;
}

// Search internships while the user types
searchInput.addEventListener("input", filterInternships);

// Filter internships by location
locationFilter.addEventListener("change", filterInternships);

// Show only saved internships
savedOnly.addEventListener("change", filterInternships);

// Save and unsave individual internships
cards.forEach(function (card) {
    const saveButton = card.querySelector(".save-button");

    saveButton.addEventListener("click", function () {
        if (savedCards.has(card)) {
            savedCards.delete(card);
            saveButton.textContent = "☆ Save";
        } else {
            savedCards.add(card);
            saveButton.textContent = "★ Saved";
        }

        filterInternships();
    });
});

// Handle Apply button clicks


const applyButtons = document.querySelectorAll(".card button");

applyButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        alert("Application feature coming soon!");
    });
});

cards.forEach(function (card) {
    const saveButton = card.querySelector(".save-button");
    const id = card.dataset.id;

    function updateSaveButton() {
        const isSaved = savedIds.has(id);
        saveButton.textContent = isSaved ? "★ Saved" : "☆ Save";
    }

    updateSaveButton();

    saveButton.addEventListener("click", function () {
        if (savedIds.has(id)) {
            savedIds.delete(id);
        } else {
            savedIds.add(id);
        }

        saveToStorage();
        updateSaveButton();
        filterInternships();
    });
});

// Display the initial internship count
filterInternships();
const clearSaved = document.getElementById("clearSaved");

clearSaved.addEventListener("click", function () {
    savedIds.clear();
    saveToStorage();

    cards.forEach(function (card) {
        const saveButton = card.querySelector(".save-button");
        saveButton.textContent = "☆ Save";
    });

    filterInternships();
});
