// Array of quotes
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  {
    text: "The greatest glory in living lies not in never falling, but in rising every time we fall.",
    category: "Inspirational",
  },
  {
    text: "The way to get started is to quit talking and begin doing.",
    category: "Motivational",
  },
  {
    text: "If life were predictable it would cease to be life, and be without flavor.",
    category: "Life",
  },
  {
    text: "Life is what happens when you're busy making other plans.",
    category: "Life",
  },
  {
    text: "The future belongs to those who believe in the beauty of their dreams.",
    category: "Dreams",
  },
];

// Function to display a random quote
function showRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");

  // Clear previous quote
  quoteDisplay.innerHTML = "";

  // Get a random quote
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  // Create quote card elements
  const quoteCard = document.createElement("div");
  quoteCard.className = "quote-card";

  const quoteText = document.createElement("p");
  quoteText.textContent = randomQuote.text;

  const quoteCategory = document.createElement("p");
  quoteCategory.textContent = randomQuote.category;

  // Append quote elements to the quote card
  quoteCard.appendChild(quoteText);
  quoteCard.appendChild(quoteCategory);

  // Append quote card to the quote display
  quoteDisplay.appendChild(quoteCard);
}

// Function to add a new quote
function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value;
  const newQuoteCategory = document.getElementById("newQuoteCategory").value;

  // Create a new quote object
  const newQuote = {
    text: newQuoteText,
    category: newQuoteCategory,
  };

  // Add the new quote to the array
  quotes.push(newQuote);

  // Update local storage with the new quotes array
  localStorage.setItem("quotes", JSON.stringify(quotes));

  // Update categories in the dropdown
  updateCategoryFilter();

  // Clear input fields
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  // Show the updated random quote
  showRandomQuote();
}

// Function to filter quotes based on the selected category
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;

  // Filter quotes based on the selected category
  const filteredQuotes =
    selectedCategory === "all"
      ? quotes
      : quotes.filter((quote) => quote.category === selectedCategory);

  // Update the displayed quotes
  const quoteDisplay = document.getElementById("quoteDisplay");

  // Clear previous quotes
  quoteDisplay.innerHTML = "";

  // Display the filtered quotes
  filteredQuotes.forEach((quote, index) => {
    if (index % 3 === 0) {
      const slideContainer = document.createElement("div");
      slideContainer.className = "quote-slide";
      quoteDisplay.appendChild(slideContainer);
    }

    const quoteCard = document.createElement("div");
    quoteCard.className = "quote-card";

    const quoteText = document.createElement("p");
    quoteText.textContent = quote.text;

    const quoteCategory = document.createElement("p");
    quoteCategory.textContent = quote.category;

    quoteCard.appendChild(quoteText);
    quoteCard.appendChild(quoteCategory);
    quoteDisplay.lastChild.appendChild(quoteCard);
  });

  // Update local storage with the selected category filter
  localStorage.setItem("selectedCategory", selectedCategory);
}

// Function to update the category filter dropdown with dynamically populated categories
function updateCategoryFilter() {
  const categoryFilter = document.getElementById("categoryFilter");

  // Clear previous categories
  categoryFilter.innerHTML = "";

  // Get unique categories from the quotes array
  const categories = [...new Set(quotes.map((quote) => quote.category))];

  // Add "All Categories" option
  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = "All Categories";
  categoryFilter.appendChild(allOption);

  // Add categories as options
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  // Restore the last selected category filter
  const selectedCategory = localStorage.getItem("selectedCategory");
  if (selectedCategory) {
    categoryFilter.value = selectedCategory;
  }
}

// Function to export quotes as JSON
function exportToJson() {
  const json = JSON.stringify(quotes);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "quotes.json";
  link.click();
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    const importedJSON = event.target.result;
    const importedQuotes = JSON.parse(importedJSON);

    // Update the quotes array with the imported quotes
    quotes = importedQuotes;

    // Update local storage with the updated quotes array
    localStorage.setItem("quotes", JSON.stringify(quotes));

    // Update categories in the dropdown
    updateCategoryFilter();

    // Show the updated random quote
    showRandomQuote();
  };

  fileReader.readAsText(event.target.files[0]);
}

// Function to fetch quotes from a server
async function fetchQuotesFromServer() {
  const serverUrl = "https://jsonplaceholder.typicode.com/posts";

  try {
    const response = await fetch(serverUrl);
    const data = await response.json();

    // Transform the data to match your quote structure
    quotes = data.map((post) => ({
      text: post.body,
      category: post.title,
    }));

    localStorage.setItem("quotes", JSON.stringify(quotes)); // Update local storage
    updateCategoryFilter(); // Update the category filter
    showRandomQuote(); // Show a random quote from the updated list
  } catch (error) {
    console.error("Error fetching quotes from server:", error);
  }
}

// Event listener for the "Show New Quote" button
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Event listener for the "Export Quotes" button
document.getElementById("exportBtn").addEventListener("click", exportToJson);

// Event listener for the file input
document
  .getElementById("importFile")
  .addEventListener("change", importFromJsonFile);

// Event listener for the "Refresh Quotes" button
document.getElementById("refreshQuotes").addEventListener("click", async () => {
  await fetchQuotesFromServer();
});

// Generate the initial random quote
showRandomQuote();

// Update the category filter dropdown
updateCategoryFilter();

// Fetch quotes from server when the page loads
(async () => {
  await fetchQuotesFromServer();
})();
