// Load product data from JSON
fetch('products.json')
    .then(response => response.json())
    .then(products => {
        // Retrieve the saved list from localStorage
        let selectedProductIds = JSON.parse(localStorage.getItem('selectedProducts')) || [];

        // Retrieve saved quantities from localStorage
        let savedQuantities = JSON.parse(localStorage.getItem('productQuantities')) || {};
        let productQuantities = {};

        // Filter the products to get only the ones in the user's list
        let selectedProducts = products.filter(product => selectedProductIds.includes(product.id));
        selectedProducts.forEach(product => {
            // Initialize quantity to 1 if not saved
            productQuantities[product.id] = savedQuantities[product.id] || 1;
        });

        let filteredProducts = [...selectedProducts];
        const productsPerPage = 50;
        let currentPage = 1;
        let sortOrder = {
            price: null, // Can be 'asc', 'desc', or null
            nem: null,   // Can be 'asc', 'desc', or null
            artikler: null // Can be 'asc', 'desc', or null
        };

        const productContainer = document.getElementById('list-container');
        const searchNameInput = document.getElementById('search-name');
        const searchVarenrInput = document.getElementById('search-varenr');
        const sortPriceSymbol = document.getElementById('sort-price');
        const sortNemSymbol = document.getElementById('sort-nem');
        const sortArtiklerSymbol = document.getElementById('sort-artikler');

        // Function to save quantities to localStorage
        function saveQuantities() {
            localStorage.setItem('productQuantities', JSON.stringify(productQuantities));
        }

        // Function to apply filters and search
        function applyFiltersAndSearch() {
            const searchQuery = searchNameInput.value.toLowerCase();
            const searchVarenrQuery = searchVarenrInput.value.toLowerCase();

            // Get selected shop and type filters
            const selectedShops = Array.from(document.querySelectorAll('.shop-filter:checked')).map(cb => cb.value);
            const selectedTypes = Array.from(document.querySelectorAll('.type-filter:checked')).map(cb => cb.value);

            // Filter products
            filteredProducts = selectedProducts.filter(product => {
                const matchesName = product.name.toLowerCase().includes(searchQuery);
                const matchesVarenr = product.varenr.toLowerCase().includes(searchVarenrQuery);
                const matchesShop = selectedShops.length === 0 || selectedShops.includes(product.shop);
                const matchesType = selectedTypes.length === 0 || selectedTypes.includes(product.type);
                return matchesName && matchesVarenr && matchesShop && matchesType;
            });

            applySorting(); // Apply sorting after filtering
        }

        // Function to apply sorting
        function applySorting() {
            if (sortOrder.price) {
                filteredProducts.sort((a, b) => sortOrder.price === 'asc' ? a.price - b.price : b.price - a.price);
            }
            if (sortOrder.nem) {
                filteredProducts.sort((a, b) => sortOrder.nem === 'asc' ? a.nem - b.nem : b.nem - a.nem);
            }
            if (sortOrder.artikler) {
                filteredProducts.sort((a, b) => sortOrder.artikler === 'asc' ? a.artikler - b.artikler : b.artikler - a.artikler);
            }

            displayProducts();
            calculateSums(); // Calculate sums after sorting and displaying
        }

        // Function to display products
        function displayProducts() {
            productContainer.innerHTML = '';
            const start = (currentPage - 1) * productsPerPage;
            const end = start + productsPerPage;
            const productsToShow = filteredProducts.slice(start, end);

            productsToShow.forEach(product => {
                const row = document.createElement('tr');

                // Image cell
                const imageCell = document.createElement('td');
                const img = document.createElement('img');
                img.src = product.image;
                img.alt = product.name;
                img.classList.add('product-image');
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

                // Butik Navn cell
                const shopCell = document.createElement('td');
                shopCell.textContent = product.shop;
                row.appendChild(shopCell);

                // Type cell
                const typeCell = document.createElement('td');
                typeCell.textContent = product.type;
                row.appendChild(typeCell);

                // Pris cell with per item and total amount
                const priceCell = document.createElement('td');
                const quantity = productQuantities[product.id];
                const totalPrice = product.price * quantity;
                priceCell.innerHTML = `${product.price} DKK` + (quantity > 1 ? `<br><span style="font-weight: bold;">(${totalPrice} DKK)</span>` : '');
                row.appendChild(priceCell);

                // NEM cell with per item and total amount
                const nemCell = document.createElement('td');
                const totalNem = product.nem * quantity;
                nemCell.innerHTML = `${product.nem} g` + (quantity > 1 ? `<br><span style="font-weight: bold;">(${totalNem} g)</span>` : '');
                row.appendChild(nemCell);

                // Artikler cell with per item and total amount
                const artiklerCell = document.createElement('td');
                const totalArtikler = product.artikler * quantity;
                artiklerCell.innerHTML = `${product.artikler} stk` + (quantity > 1 ? `<br><span style="font-weight: bold;">(${totalArtikler} stk)</span>` : '');
                row.appendChild(artiklerCell);

                // Quantity cell
                const quantityCell = document.createElement('td');
                const quantityInput = document.createElement('input');
                quantityInput.type = 'number';
                quantityInput.min = '1';
                quantityInput.value = quantity;
                quantityInput.style.width = '50px';

                // Update quantity on change
                quantityInput.addEventListener('input', () => {
                    const newQuantity = Math.max(1, parseInt(quantityInput.value) || 1);
                    productQuantities[product.id] = newQuantity;
                    saveQuantities(); // Save updated quantities to localStorage
                    applyFiltersAndSearch(); // Reapply filters to refresh the display
                });

                quantityCell.appendChild(quantityInput);
                row.appendChild(quantityCell);

                productContainer.appendChild(row);
            });
        }

        // Function to calculate and display sums
        function calculateSums() {
            let totalPrice = 0;
            let totalNem = 0;
            let totalArtikler = 0;

            filteredProducts.forEach(product => {
                const quantity = productQuantities[product.id];
                totalPrice += product.price * quantity;
                totalNem += product.nem * quantity;
                totalArtikler += product.artikler * quantity;
            });

            document.getElementById('sum-price').textContent = `${totalPrice} DKK`;
            document.getElementById('sum-nem').textContent = `${totalNem} g`;
            document.getElementById('sum-artikler').textContent = `${totalArtikler} stk`;
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
                symbolElement.style.color = 'green'; // Low to High (Green)
            }

            // Reset the colors of other sort symbols
            if (key !== 'price') sortPriceSymbol.style.color = 'black';
            if (key !== 'nem') sortNemSymbol.style.color = 'black';
            if (key !== 'artikler') sortArtiklerSymbol.style.color = 'black';

            applySorting();
        }

        // Event listeners for filtering and search
        searchNameInput.addEventListener('input', applyFiltersAndSearch);
        searchVarenrInput.addEventListener('input', applyFiltersAndSearch);
        sortPriceSymbol.addEventListener('click', () => toggleSortOrder(sortPriceSymbol, 'price'));
        sortNemSymbol.addEventListener('click', () => toggleSortOrder(sortNemSymbol, 'nem'));
        sortArtiklerSymbol.addEventListener('click', () => toggleSortOrder(sortArtiklerSymbol, 'artikler'));

        // Initial display
        applyFiltersAndSearch();
    })
    .catch(error => console.error('Error loading products:', error));
