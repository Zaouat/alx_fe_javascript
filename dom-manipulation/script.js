// Array of quotes
let quotes = [
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

  // Create quote elements
  const quoteText = document.createElement("p");
  quoteText.textContent = randomQuote.text;

  const quoteCategory = document.createElement("p");
  quoteCategory.textContent = randomQuote.category;

  // Append quote elements to the quote display
  quoteDisplay.appendChild(quoteText);
  quoteDisplay.appendChild(quoteCategory);
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

  // Clear input fields
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  // Show the updated random quote
  showRandomQuote();
}

// Function to create add quote form
function createAddQuoteForm() {
  const addQuoteForm = document.createElement("div");

  const quoteTextInput = document.createElement("input");
  quoteTextInput.id = "newQuoteText";
  quoteTextInput.type = "text";
  quoteTextInput.placeholder = "Enter a new quote";

  const categoryTextInput = document.createElement("input");
  categoryTextInput.id = "newQuoteCategory";
  categoryTextInput.type = "text";
  categoryTextInput.placeholder = "Enter quote category";

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.onclick = addQuote;

  addQuoteForm.appendChild(quoteTextInput);
  addQuoteForm.appendChild(categoryTextInput);
  addQuoteForm.appendChild(addButton);

  document.body.appendChild(addQuoteForm);
}

// Show a random quote when the page loads
showRandomQuote();

// Add event listener to the "Show New Quote" button
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Create the add quote form
createAddQuoteForm();
