// Load product data from JSON
fetch('products.json')
    .then(response => response.json())
    .then(products => {
        let filteredProducts = [...products];
        const productsPerPage = 50;
        let currentPage = 1;
        let sortOrder = {
            name: 'asc',
            price: 'asc',
            nem: 'asc',
            artikler: 'asc'
        };

        const productContainer = document.getElementById('product-container');
        const paginationControls = document.getElementById('pagination-controls');

        // Sort symbols
        const sortNameSymbol = document.getElementById('sort-name');
        const sortPriceSymbol = document.getElementById('sort-price');
        const sortNemSymbol = document.getElementById('sort-nem');
        const sortArtiklerSymbol = document.getElementById('sort-artikler');

        const sortTypeSelect = document.getElementById('sort-type');
        const sortShopSelect = document.getElementById('sort-shop');

        // Generate unique type and shop options
        const types = [...new Set(products.map(p => p.type))];
        const shops = [...new Set(products.map(p => p.shop))];

        // Populate type filter options
        types.forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type;
            sortTypeSelect.appendChild(option);
        });

        // Populate shop filter options
        shops.forEach(shop => {
            const option = document.createElement('option');
            option.value = shop;
            option.textContent = shop;
            sortShopSelect.appendChild(option);
        });

        // Function to display products in the table
        function displayProducts(page) {
            productContainer.innerHTML = '';
            const start = (page - 1) * productsPerPage;
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

                // Name cell
                const nameCell = document.createElement('td');
                nameCell.textContent = product.name;
                row.appendChild(nameCell);

                // Price cell
                const priceCell = document.createElement('td');
                priceCell.textContent = `$${product.price.toFixed(2)}`;
                row.appendChild(priceCell);

                // Type cell
                const typeCell = document.createElement('td');
                typeCell.textContent = product.type;
                row.appendChild(typeCell);

                // Shop cell
                const shopCell = document.createElement('td');
                shopCell.textContent = product.shop;
                row.appendChild(shopCell);

                // NEM cell
                const nemCell = document.createElement('td');
                nemCell.textContent = `${product.nem}g`;
                row.appendChild(nemCell);

                // Artikler cell
                const artiklerCell = document.createElement('td');
                artiklerCell.textContent = product.artikler;
                row.appendChild(artiklerCell);

                productContainer.appendChild(row);
            });

            createPaginationControls();
        }

        // Function to create pagination controls
        function createPaginationControls() {
            paginationControls.innerHTML = '';
            const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

            for (let i = 1; i <= totalPages; i++) {
                const button = document.createElement('button');
                button.textContent = i;
                if (i === currentPage) button.classList.add('active');
                button.addEventListener('click', () => {
                    currentPage = i;
                    displayProducts(currentPage);
                });
                paginationControls.appendChild(button);
            }
        }

        // Function to apply filters and sorting
        function applyFiltersAndSorting() {
            // Filtering logic
            const selectedType = sortTypeSelect.value;
            const selectedShop = sortShopSelect.value;

            filteredProducts = products.filter(product => {
                const matchesType = selectedType === 'none' || product.type === selectedType;
                const matchesShop = selectedShop === 'none' || product.shop === selectedShop;
                return matchesType && matchesShop;
            });

            // Sorting logic
            const sortProducts = (key, order) => {
                filteredProducts.sort((a, b) => {
                    if (order === 'asc') return a[key] > b[key] ? 1 : -1;
                    else return a[key] < b[key] ? 1 : -1;
                });
            };

            // Apply sorting based on the current sort order
            if (sortOrder.name) sortProducts('name', sortOrder.name);
            if (sortOrder.price) sortProducts('price', sortOrder.price);
            if (sortOrder.nem) sortProducts('nem', sortOrder.nem);
            if (sortOrder.artikler) sortProducts('artikler', sortOrder.artikler);

            // Reset to the first page and display products
            currentPage = 1;
            displayProducts(currentPage);
        }

        // Function to toggle sort order and update UI
        function toggleSortOrder(symbolElement, key) {
            // Toggle sort order
            sortOrder[key] = sortOrder[key] === 'asc' ? 'desc' : 'asc';

            // Update symbol styling
            document.querySelectorAll('.sort-symbol').forEach(el => {
                el.style.color = 'black'; // Reset color
                el.textContent = '⇅'; // Reset symbol
            });

            symbolElement.style.color = 'blue'; // Highlight active symbol
            symbolElement.textContent = sortOrder[key] === 'asc' ? '⇅' : '⇵'; // Update symbol

            applyFiltersAndSorting();
        }

        // Event listeners for sort symbols
        sortNameSymbol.addEventListener('click', () => toggleSortOrder(sortNameSymbol, 'name'));
        sortPriceSymbol.addEventListener('click', () => toggleSortOrder(sortPriceSymbol, 'price'));
        sortNemSymbol.addEventListener('click', () => toggleSortOrder(sortNemSymbol, 'nem'));
        sortArtiklerSymbol.addEventListener('click', () => toggleSortOrder(sortArtiklerSymbol, 'artikler'));

        // Initial display
        applyFiltersAndSorting();
    })
    .catch(error => console.error('Error loading products:', error));
