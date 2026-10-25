
const searchInput = document.getElementById("searchInput");
const locationFilter = document.getElementById("locationFilter");
const savedOnly = document.getElementById("savedOnly");

const cards = document.querySelectorAll(".card");
const noResults = document.getElementById("noResults");
const resultsCount = document.getElementById("resultsCount");
const clearSaved = document.getElementById("clearSaved");

const STORAGE_KEY = "internFinderSaved";
const validIds = ["frontend-1", "ui-2", "web-3"];

let savedIds;

try {
    const storedIds = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "[]"
    );

    savedIds = new Set(
        Array.isArray(storedIds)
            ? storedIds.filter(id => validIds.includes(id))
            : []
    );
} catch (error) {
    savedIds = new Set();
}

// Save internships in browser storage
function saveToStorage() {
    try {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify([...savedIds])
        );
    } catch (error) {
        alert("Unable to save changes in this browser.");
    }
}

// Update Save button appearance
function updateSaveButton(card) {
    const button = card.querySelector(".save-button");
    const isSaved = savedIds.has(card.dataset.id);

    button.textContent = isSaved ? "★ Saved" : "☆ Save";
    button.setAttribute("aria-pressed", String(isSaved));
}

// Search and filter internships
function filterInternships() {
    const query = searchInput.value.toLowerCase().trim();
    const location = locationFilter.value;

    let visibleCount = 0;

    cards.forEach(function (card) {
        const text = card.textContent.toLowerCase();

        const matchesSearch = text.includes(query);

        const matchesLocation =
            location === "all" || text.includes(location);

        const matchesSaved =
            !savedOnly.checked || savedIds.has(card.dataset.id);

        const showCard =
            matchesSearch && matchesLocation && matchesSaved;

        card.hidden = !showCard;

        if (showCard) {
            visibleCount++;
        }
    });

    resultsCount.textContent =
        visibleCount +
        (visibleCount === 1
            ? " internship available"
            : " internships available");

    noResults.hidden = visibleCount > 0;
}

// Search while typing
searchInput.addEventListener("input", filterInternships);

// Filter by location
locationFilter.addEventListener("change", filterInternships);

// Show saved internships only
savedOnly.addEventListener("change", filterInternships);

// Save and unsave internships
cards.forEach(function (card) {
    const saveButton = card.querySelector(".save-button");
    const id = card.dataset.id;

    updateSaveButton(card);

    saveButton.addEventListener("click", function () {
        if (savedIds.has(id)) {
            savedIds.delete(id);
        } else {
            savedIds.add(id);
        }

        saveToStorage();
        updateSaveButton(card);
        filterInternships();
    });
});

// Clear saved internships
clearSaved.addEventListener("click", function () {
    savedIds.clear();
    saveToStorage();

    cards.forEach(updateSaveButton);
    filterInternships();
});


cards.forEach(function (card) {
    const viewButton = card.querySelector(".apply-button");

    viewButton.addEventListener("click", function () {
        const role = card.querySelector("h3").textContent;
        const details = card.querySelectorAll("p");
        const companyAndLocation = details[0].textContent;
        const stipend = details[1].textContent;

        alert(
            "INTERNSHIP DETAILS\n\n" +
            "Role: " + role + "\n" +
            "Company & Location: " + companyAndLocation + "\n" +
            "Stipend: " + stipend +
            "\n\nThis is a sample listing. " +
            "A real application link is not available yet."
        );
    });
});


// Display initial internships
filterInternships();
