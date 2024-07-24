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
  quoteDisplay.innerHTML = "";
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  const quoteCard = document.createElement("div");
  quoteCard.className = "quote-card";
  const quoteText = document.createElement("p");
  quoteText.textContent = randomQuote.text;
  const quoteCategory = document.createElement("p");
  quoteCategory.textContent = randomQuote.category;
  quoteCard.appendChild(quoteText);
  quoteCard.appendChild(quoteCategory);
  quoteDisplay.appendChild(quoteCard);
}

// Function to add a new quote
function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value;
  const newQuoteCategory = document.getElementById("newQuoteCategory").value;
  const newQuote = {
    text: newQuoteText,
    category: newQuoteCategory,
  };
  quotes.push(newQuote);
  localStorage.setItem("quotes", JSON.stringify(quotes));
  updateCategoryFilter();
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
  showRandomQuote();
}

// Function to filter quotes based on the selected category
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  const filteredQuotes =
    selectedCategory === "all"
      ? quotes
      : quotes.filter((quote) => quote.category === selectedCategory);
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = "";
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
  localStorage.setItem("selectedCategory", selectedCategory);
}

// Function to update the category filter dropdown
function updateCategoryFilter() {
  const categoryFilter = document.getElementById("categoryFilter");
  categoryFilter.innerHTML = "";
  const categories = [...new Set(quotes.map((quote) => quote.category))];
  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = "All Categories";
  categoryFilter.appendChild(allOption);
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
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
    quotes = importedQuotes;
    localStorage.setItem("quotes", JSON.stringify(quotes));
    updateCategoryFilter();
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
    quotes = data.map((post) => ({
      text: post.body,
      category: post.title,
    }));
    localStorage.setItem("quotes", JSON.stringify(quotes));
    updateCategoryFilter();
    showRandomQuote();
  } catch (error) {
    console.error("Error fetching quotes from server:", error);
  }
}

// New function to send a POST request
async function sendPostRequest() {
  const serverUrl = "https://jsonplaceholder.typicode.com/posts";
  const newQuote = {
    title: "New Quote",
    body: "This is a new quote sent via POST request",
    userId: 1,
  };

  try {
    const response = await fetch(serverUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newQuote),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("POST request successful:", data);

    // Add the new quote to the local array
    quotes.push({
      text: data.body,
      category: data.title,
    });

    localStorage.setItem("quotes", JSON.stringify(quotes));
    updateCategoryFilter();
    showRandomQuote();
  } catch (error) {
    console.error("Error sending POST request:", error);
  }
}

// Updated syncQuotes function
async function syncQuotes() {
  try {
    // Fetch quotes from server
    const serverUrl = "https://jsonplaceholder.typicode.com/posts";
    const response = await fetch(serverUrl);
    const serverQuotes = await response.json();

    // Convert server quotes to our format
    const formattedServerQuotes = serverQuotes.map((post) => ({
      text: post.body,
      category: post.title,
    }));

    // Merge local and server quotes
    const mergedQuotes = [...quotes, ...formattedServerQuotes];

    // Remove duplicates (based on text)
    const uniqueQuotes = Array.from(
      new Set(mergedQuotes.map((q) => q.text))
    ).map((text) => mergedQuotes.find((q) => q.text === text));

    // Update local quotes
    quotes = uniqueQuotes;
    localStorage.setItem("quotes", JSON.stringify(quotes));

    // Update UI
    updateCategoryFilter();
    showRandomQuote();

    console.log("Quotes synced successfully");

    // Add an alert to notify the user
    alert("Quotes synced with server!");
  } catch (error) {
    console.error("Error syncing quotes:", error);
    alert("Error syncing quotes. Please try again.");
  }
}

// New function to automatically change quotes
function autoChangeQuote() {
  setInterval(showRandomQuote, 10000); // Change quote every 10 seconds
}

// Function to create the add quote form
function createAddQuoteForm() {
  const formContainer = document.getElementById("formContainer");
  formContainer.innerHTML = `
    <input type="text" id="newQuoteText" placeholder="New quote text" />
    <input type="text" id="newQuoteCategory" placeholder="New quote category" />
    <button onclick="addQuote()">Add Quote</button>
  `;
}

// Event listeners
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
document.getElementById("exportBtn").addEventListener("click", exportToJson);
document
  .getElementById("importFile")
  .addEventListener("change", importFromJsonFile);
document
  .getElementById("refreshQuotes")
  .addEventListener("click", fetchQuotesFromServer);
document
  .getElementById("sendPostRequest")
  .addEventListener("click", sendPostRequest);
document.getElementById("syncQuotes").addEventListener("click", syncQuotes);

// Initialize
showRandomQuote();
updateCategoryFilter();
fetchQuotesFromServer();
autoChangeQuote(); // Start auto-changing quotes
createAddQuoteForm(); // Create the add quote form
