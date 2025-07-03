// script.js

document.addEventListener("DOMContentLoaded", () => {
  // Smooth scroll for internal links
  document.querySelectorAll("a[href^='#']").forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // Lazy loading images (if needed)
  const lazyImages = document.querySelectorAll("img[loading='lazy']");
  lazyImages.forEach(img => {
    img.addEventListener('load', () => {
      img.classList.add('loaded');
    });
  });

  // Toggle mobile menu for index.html
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

  // Plant search and filter functionality for plants.html
  const plantSearchInput = document.getElementById('plantSearch');
  const categoryButtons = document.querySelectorAll('.filter-btn');
  const plantGrid = document.getElementById('plantGrid');

  let allPlants = []; // To store all loaded plant data
  let currentCategory = 'all'; // Default active category

  // Function to render plant cards
  function renderPlantCards(plantsToRender) {
    plantGrid.innerHTML = ''; // Clear existing cards
    if (plantsToRender.length === 0) {
      plantGrid.innerHTML = '<p>No plants found matching your criteria.</p>';
      return;
    }

    plantsToRender.forEach(plant => {
      const card = document.createElement('div');
      card.classList.add('card');
      card.dataset.category = plant.category;
      card.innerHTML = `
        <img src="${plant.image}" alt="${plant.name} - ${plant.description}" />
        <h3>${plant.name}</h3>
        <p>${plant.description}</p>
      `;
      plantGrid.appendChild(card);
    });
  }

  // Function to filter plants based on search term and category
  function filterPlants() {
    const searchTerm = plantSearchInput.value.toLowerCase();

    const filteredPlants = allPlants.filter(plant => {
      const plantName = plant.name.toLowerCase();
      const plantDescription = plant.description.toLowerCase();
      const plantCategory = plant.category;

      const matchesSearch = plantName.includes(searchTerm) || plantDescription.includes(searchTerm);
      const matchesCategory = currentCategory === 'all' || plantCategory === currentCategory;

      return matchesSearch && matchesCategory;
    });
    renderPlantCards(filteredPlants);
  }

  // Fetch plant data from JSON file
  async function fetchPlantData() {
    try {
      const response = await fetch('plants.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      allPlants = await response.json();
      filterPlants(); // Initial render and filter after data is loaded

      // Initial filter based on URL parameter for categories from index.html
      const urlParams = new URLSearchParams(window.location.search);
      const categoryParam = urlParams.get('category');
      if (categoryParam) {
        const initialButton = document.querySelector(`.filter-btn[data-category="${categoryParam}"]`);
        if (initialButton) {
          // Remove active from default 'all' button
          document.querySelector('.filter-btn[data-category="all"]').classList.remove('active');
          initialButton.classList.add('active');
          currentCategory = categoryParam;
          filterPlants();
        }
      }

    } catch (error) {
      console.error('Error fetching plant data:', error);
      plantGrid.innerHTML = '<p>Failed to load plant data. Please try again later.</p>';
    }
  }

  // Event listeners for search and category buttons
  if (plantSearchInput && categoryButtons.length > 0 && plantGrid) {
    plantSearchInput.addEventListener('keyup', filterPlants);

    categoryButtons.forEach(button => {
      button.addEventListener('click', function() {
        // Remove active class from all buttons
        categoryButtons.forEach(btn => btn.classList.remove('active'));

        // Add active class to the clicked button
        this.classList.add('active');

        currentCategory = this.dataset.category;
        filterPlants();
      });
    });
  }

  // Fetch data when the DOM is fully loaded
  fetchPlantData();

  // Intersection Observer for history section animations
  const historyItems = document.querySelectorAll('.history-item');

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.3 // Trigger when 30% of the item is visible
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Stop observing once animated
      }
    });
  }, observerOptions);

  historyItems.forEach(item => {
    observer.observe(item);
  });

  // Dynamic background color change on scroll (simplified example)
  const body = document.body;
  const colors = ['#f4f4f4', '#e0e0e0', '#d0d0d0', '#c0c0c0']; // Example colors
  let colorIndex = 0;

  window.addEventListener('scroll', () => {
    const scrollPercentage = (document.documentElement.scrollTop + document.body.scrollTop) / (document.documentElement.scrollHeight - document.documentElement.clientHeight);
    const newColorIndex = Math.floor(scrollPercentage * colors.length);

    if (newColorIndex !== colorIndex) {
      colorIndex = newColorIndex;
      body.style.backgroundColor = colors[colorIndex];
    }
  });
});