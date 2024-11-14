// Load product data from JSON
fetch('products.json')
    .then(response => response.json())
    .then(products => {
        let filteredProducts = [...products];
        const productsPerPage = 50;
        let currentPage = 1;
        let sortOrder = {
            price: null, // Can be 'asc', 'desc', or null
            nem: null,   // Can be 'asc', 'desc', or null
            artikler: null, // Can be 'asc', 'desc', or null
            skud: null // New sort order for Skud
        };

        // Retrieve the saved list from localStorage
        let selectedProducts = JSON.parse(localStorage.getItem('selectedProducts')) || [];

        const productContainer = document.getElementById('product-container');
        const paginationControls = document.getElementById('pagination-controls');

        // Filtering Elements
        const searchNameInput = document.getElementById('search-name');
        const searchVarenrInput = document.getElementById('search-varenr');
        const shopFiltersContainer = document.getElementById('shop-filters');
        const typeFiltersContainer = document.getElementById('type-filters');
        const kaliberFiltersContainer = document.getElementById('kaliber-filters'); // Added Kaliber filter

        // Sort Symbols
        const sortPriceSymbol = document.getElementById('sort-price');
        const sortNemSymbol = document.getElementById('sort-nem');
        const sortArtiklerSymbol = document.getElementById('sort-artikler');
        const sortSkudSymbol = document.getElementById('sort-skud'); // Added Skud sort symbol

        // Generate unique shop, type, and kaliber options
        const shops = [...new Set(products.map(p => p.shop))];
        const types = [...new Set(products.map(p => p.type))];
        const kalibers = [...new Set(products.map(p => p.kaliber))].sort((a, b) => a - b);

        // Populate shop filter checkboxes
        shops.forEach(shop => {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = shop;
            checkbox.classList.add('shop-filter');
            const label = document.createElement('label');
            label.textContent = shop;
            shopFiltersContainer.appendChild(checkbox);
            shopFiltersContainer.appendChild(label);
            shopFiltersContainer.appendChild(document.createElement('br'));
        });

        // Populate type filter checkboxes
        types.forEach(type => {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = type;
            checkbox.classList.add('type-filter');
            const label = document.createElement('label');
            label.textContent = type;
            typeFiltersContainer.appendChild(checkbox);
            typeFiltersContainer.appendChild(label);
            typeFiltersContainer.appendChild(document.createElement('br'));
        });

        // Populate Kaliber filter checkboxes
        kalibers.forEach(kaliber => {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = kaliber;
            checkbox.classList.add('kaliber-filter');
            const label = document.createElement('label');
            label.textContent = `${kaliber} mm`;
            kaliberFiltersContainer.appendChild(checkbox);
            kaliberFiltersContainer.appendChild(label);
            kaliberFiltersContainer.appendChild(document.createElement('br'));
        });

        // Function to apply filters and sorting
        function applyFiltersAndSorting() {
            const searchQuery = searchNameInput.value.toLowerCase();
            const searchVarenrQuery = searchVarenrInput.value.toLowerCase();

            // Get selected shop, type, and kaliber filters
            const selectedShops = Array.from(document.querySelectorAll('.shop-filter:checked')).map(cb => cb.value);
            const selectedTypes = Array.from(document.querySelectorAll('.type-filter:checked')).map(cb => cb.value);
            const selectedKalibers = Array.from(document.querySelectorAll('.kaliber-filter:checked')).map(cb => cb.value);

            // Filter products
            filteredProducts = products.filter(product => {
                const matchesName = product.name.toLowerCase().includes(searchQuery);
                const matchesVarenr = product.varenr.toLowerCase().includes(searchVarenrQuery);
                const matchesShop = selectedShops.length === 0 || selectedShops.includes(product.shop);
                const matchesType = selectedTypes.length === 0 || selectedTypes.includes(product.type);
                
                // Adjusted logic for matching Kaliber
                const matchesKaliber = selectedKalibers.length === 0 || selectedKalibers.some(selected => {
                    if (product.kaliber.includes('-')) {
                        const [min, max] = product.kaliber.split('-').map(Number);
                        const selectedValue = parseInt(selected);
                        return selectedValue >= min && selectedValue <= max;
                    } else {
                        return product.kaliber === selected;
                    }
                });

                return matchesName && matchesVarenr && matchesShop && matchesType && matchesKaliber;
            });

            // Apply sorting
            if (sortOrder.price) {
                filteredProducts.sort((a, b) => sortOrder.price === 'asc' ? a.price - b.price : b.price - a.price);
            }
            if (sortOrder.nem) {
                filteredProducts.sort((a, b) => sortOrder.nem === 'asc' ? a.nem - b.nem : b.nem - a.nem);
            }
            if (sortOrder.artikler) {
                filteredProducts.sort((a, b) => sortOrder.artikler === 'asc' ? a.artikler - b.artikler : b.artikler - a.artikler);
            }
            if (sortOrder.skud) { // Sorting for Skud
                filteredProducts.sort((a, b) => sortOrder.skud === 'asc' ? a.skud - b.skud : b.skud - a.skud);
            }

            // Display products
            displayProducts(currentPage);
        }

        // Function to display products
        function displayProducts(page) {
            productContainer.innerHTML = '';
            const start = (page - 1) * productsPerPage;
            const end = start + productsPerPage;
            const productsToShow = filteredProducts.slice(start, end);

            productsToShow.forEach(product => {
                const row = document.createElement('tr');
                
// Play button cell
const playButtonCell = document.createElement('td');
playButtonCell.classList.add('play-button-cell');

// Check if the product has a valid video link
if (product.video && product.video !== "x" && product.video.trim() !== "") {
    const playButton = document.createElement('button');
    playButton.classList.add('play-btn');
    playButton.textContent = '▶';

    playButton.onclick = () => {
        showVideoModal(product.video);
    };

    playButtonCell.appendChild(playButton);
}

row.appendChild(playButtonCell);

                // Image cell
                const imageCell = document.createElement('td');
                const img = document.createElement('img');
                img.src = product.image;
                img.alt = product.name;
                img.classList.add('product-image');
                img.dataset.productName = product.name;
                imageCell.appendChild(img);
                row.appendChild(imageCell);

            
                // Vare Navn cell
                const nameCell = document.createElement('td');
                nameCell.textContent = product.name;
                row.appendChild(nameCell);
            
                // Varenr cell
                const varenrCell = document.createElement('td');
                varenrCell.textContent = product.varenr;
                row.appendChild(varenrCell);
            
                // Distributør (Shop) cell
                const shopCell = document.createElement('td');
                shopCell.textContent = product.shop;
                row.appendChild(shopCell);
            
                // Type cell
                const typeCell = document.createElement('td');
                typeCell.textContent = product.type;
                row.appendChild(typeCell);
            
                // Kaliber cell
                const kaliberCell = document.createElement('td');
                kaliberCell.textContent = product.kaliber ? `${product.kaliber} mm` : 'Ukendt';
                row.appendChild(kaliberCell);
            
                // Skud cell
                const skudCell = document.createElement('td');
                skudCell.textContent = product.skud ? `${product.skud} skud` : 'Ukendt';
                row.appendChild(skudCell);
            
                // Pris cell with suffix
                const priceCell = document.createElement('td');
                priceCell.textContent = `${product.price} DKK`;
                row.appendChild(priceCell);
            
                // NEM cell with suffix
                const nemCell = document.createElement('td');
                nemCell.textContent = `${product.nem} g`;
                row.appendChild(nemCell);
            
                // Artikler cell with suffix
                const artiklerCell = document.createElement('td');
                artiklerCell.textContent = `${product.artikler} stk`;
                row.appendChild(artiklerCell);
            
// Tilføj cell with "+" button
const addCell = document.createElement('td');
addCell.style.border = 'none'; // No border for this cell

const addButton = document.createElement('button');
addButton.textContent = '+';
addButton.classList.add('add-btn'); // Apply "add-btn" class for styling

// Add a selected style if the product is already in the list
if (selectedProducts.includes(product.name)) {
    addButton.classList.add('selected'); // Use "selected" class to indicate selection
}

// Click event to add/remove product from the list
addButton.addEventListener('click', () => {
    if (selectedProducts.includes(product.name)) {
        // If the product is already selected, remove it
        selectedProducts = selectedProducts.filter(id => id !== product.name);
        addButton.classList.remove('selected'); // Remove selected class
    } else {
        // If the product is not selected, add it
        selectedProducts.push(product.name);
        addButton.classList.add('selected'); // Apply selected class
    }

    // Save updated list to localStorage
    localStorage.setItem('selectedProducts', JSON.stringify(selectedProducts));
});


addCell.appendChild(addButton);
row.appendChild(addCell);

            
                productContainer.appendChild(row);
            });
            

            createPaginationControls();
        }

        // Function to toggle sort order
        function toggleSortOrder(symbolElement, key) {
            if (sortOrder[key] === 'asc') {
                sortOrder[key] = 'desc';
                symbolElement.style.color = 'blue'; // High to Low (Blue)
            } else if (sortOrder[key] === 'desc') {
                sortOrder[key] = null;
                symbolElement.style.color = 'black'; // Reset (Default Color)
            } else {
                sortOrder[key] = 'asc';
                symbolElement.style.color = '#F7A60C'; // Low to High (Green)
            }

            // Reset the colors of other sort symbols
            if (key !== 'price') sortPriceSymbol.style.color = 'black';
            if (key !== 'nem') sortNemSymbol.style.color = 'black';
            if (key !== 'artikler') sortArtiklerSymbol.style.color = 'black';
            if (key !== 'skud') sortSkudSymbol.style.color = 'black'; // Reset Skud color

            applyFiltersAndSorting();
        }

        // Event listeners for filtering and sorting
        searchNameInput.addEventListener('input', applyFiltersAndSorting);
        searchVarenrInput.addEventListener('input', applyFiltersAndSorting);
        shopFiltersContainer.addEventListener('change', applyFiltersAndSorting);
        typeFiltersContainer.addEventListener('change', applyFiltersAndSorting);
        kaliberFiltersContainer.addEventListener('change', applyFiltersAndSorting); // Added Kaliber filter event
        sortPriceSymbol.addEventListener('click', () => toggleSortOrder(sortPriceSymbol, 'price'));
        sortNemSymbol.addEventListener('click', () => toggleSortOrder(sortNemSymbol, 'nem'));
        sortArtiklerSymbol.addEventListener('click', () => toggleSortOrder(sortArtiklerSymbol, 'artikler'));
        sortSkudSymbol.addEventListener('click', () => toggleSortOrder(sortSkudSymbol, 'skud')); // Added Skud sort event

        // Initial display
        applyFiltersAndSorting();
    })
    .catch(error => console.error('Error loading products:', error));
