// Load product data from JSON
fetch('products.json')
    .then(response => response.json())
    .then(products => {
        let selectedproductnames = JSON.parse(localStorage.getItem('selectedProducts')) || [];
        let savedQuantities = JSON.parse(localStorage.getItem('productQuantities')) || {};
        let savedCustomPrices = JSON.parse(localStorage.getItem('customPrices')) || {};
        let productQuantities = {};
        let customPrices = {};

        let selectedProducts = products.filter(product => selectedproductnames.includes(product.name));
        selectedProducts.forEach(product => {
            productQuantities[product.name] = savedQuantities[product.name] || 1;
            customPrices[product.name] = savedCustomPrices[product.name] ?? product.price;
        });

        let filteredProducts = [...selectedProducts];
        let sortOrder = { price: null, nem: null, artikler: null, skud: null };

        const productContainer = document.getElementById('list-container');
        const searchNameInput = document.getElementById('search-name');
        const searchVarenrInput = document.getElementById('search-varenr');
        const sortPriceSymbol = document.getElementById('sort-price');
        const sortNemSymbol = document.getElementById('sort-nem');
        const sortArtiklerSymbol = document.getElementById('sort-artikler');
        const sortSkudSymbol = document.getElementById('sort-skud');
        const shopFiltersContainer = document.getElementById('shop-filters');
        const typeFiltersContainer = document.getElementById('type-filters');

        const shops = [...new Set(selectedProducts.map(p => p.shop))];
        const types = [...new Set(selectedProducts.map(p => p.type))];

        // Create checkboxes for shop filters
        shops.forEach(shop => {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = shop;
            checkbox.classList.add('shop-filter');
            shopFiltersContainer.appendChild(checkbox);

            const label = document.createElement('label');
            label.textContent = shop;
            shopFiltersContainer.appendChild(label);
            shopFiltersContainer.appendChild(document.createElement('br'));
        });

        // Create checkboxes for type filters
        types.forEach(type => {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = type;
            checkbox.classList.add('type-filter');
            typeFiltersContainer.appendChild(checkbox);

            const label = document.createElement('label');
            label.textContent = type;
            typeFiltersContainer.appendChild(label);
            typeFiltersContainer.appendChild(document.createElement('br'));
        });

        function saveData() {
            localStorage.setItem('productQuantities', JSON.stringify(productQuantities));
            localStorage.setItem('customPrices', JSON.stringify(customPrices));
            localStorage.setItem('selectedProducts', JSON.stringify(selectedProducts.map(product => product.name)));
        }

        function applyFiltersAndSearch() {
            const searchQuery = searchNameInput.value.toLowerCase();
            const searchVarenrQuery = searchVarenrInput.value.toLowerCase();

            const selectedShops = Array.from(document.querySelectorAll('.shop-filter:checked')).map(cb => cb.value);
            const selectedTypes = Array.from(document.querySelectorAll('.type-filter:checked')).map(cb => cb.value);

            filteredProducts = selectedProducts.filter(product => {
                const matchesName = product.name.toLowerCase().includes(searchQuery);
                const matchesVarenr = product.varenr.toLowerCase().includes(searchVarenrQuery);
                const matchesShop = selectedShops.length === 0 || selectedShops.includes(product.shop);
                const matchesType = selectedTypes.length === 0 || selectedTypes.includes(product.type);
                return matchesName && matchesVarenr && matchesShop && matchesType;
            });

            applySorting();
        }

        function applySorting() {
            if (sortOrder.skud) {
                filteredProducts.sort((a, b) => sortOrder.skud === 'asc' ? a.skud - b.skud : b.skud - a.skud);
            }
            if (sortOrder.price) {
                filteredProducts.sort((a, b) => sortOrder.price === 'asc' ? customPrices[a.id] - customPrices[b.id] : customPrices[b.id] - customPrices[a.id]);
            }
            if (sortOrder.nem) {
                filteredProducts.sort((a, b) => sortOrder.nem === 'asc' ? a.nem - b.nem : b.nem - a.nem);
            }
            if (sortOrder.artikler) {
                filteredProducts.sort((a, b) => sortOrder.artikler === 'asc' ? a.artikler - b.artikler : b.artikler - a.artikler);
            }

            displayProducts();
            calculateSums();
        }

        function displayProducts() {
            productContainer.innerHTML = '';
            const productsToShow = filteredProducts;

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


                const imageCell = document.createElement('td');
                const img = document.createElement('img');
                img.dataset.productName = product.name;
                img.src = product.image;
                img.alt = product.name;
                img.classList.add('product-image');
                imageCell.appendChild(img);
                row.appendChild(imageCell);

                const nameCell = document.createElement('td');
                nameCell.textContent = product.name;
                row.appendChild(nameCell);

                const varenrCell = document.createElement('td');
                varenrCell.textContent = product.varenr;
                row.appendChild(varenrCell);

                const shopCell = document.createElement('td');
                shopCell.textContent = product.shop;
                row.appendChild(shopCell);

                const typeCell = document.createElement('td');
                typeCell.textContent = product.type;
                row.appendChild(typeCell);

                const skudCell = document.createElement('td');
                skudCell.textContent = product.skud ? `${product.skud} skud` : 'Ukendt';
                row.appendChild(skudCell);

                // Price Cell
                const priceCell = document.createElement('td');
                const priceInputWrapper = document.createElement('div');
                priceInputWrapper.classList.add('price-input-wrapper');
                priceInputWrapper.style.textAlign = 'center';

                const priceInput = document.createElement('input');
                priceInput.type = 'number';
                priceInput.min = '0';
                priceInput.value = customPrices[product.name];
                priceInput.classList.add('price-input');

                if (customPrices[product.name] !== product.price) {
                    priceInput.classList.add('custom-price');
                }

                priceInput.addEventListener('blur', () => {
                    const newPrice = parseFloat(priceInput.value) || 0;
                    customPrices[product.name] = newPrice > 0 ? newPrice : product.price;
                    saveData();
                    displayProducts();
                    calculateSums();
                });

                const dkkLabel = document.createElement('span');
                dkkLabel.classList.add('price-suffix');
                dkkLabel.textContent = 'DKK';

                priceInputWrapper.appendChild(priceInput);
                priceInputWrapper.appendChild(dkkLabel);
                priceCell.appendChild(priceInputWrapper);

                if (productQuantities[product.name] > 1) {
                    const totalPrice = customPrices[product.name] * productQuantities[product.name];
                    const totalPriceSpan = document.createElement('div');
                    totalPriceSpan.textContent = `(${formatWithCommas(totalPrice)} DKK)`;
                    totalPriceSpan.style.fontWeight = 'normal';
                    totalPriceSpan.style.textAlign = 'center';
                    totalPriceSpan.style.fontSize = 'smaller';
                    priceCell.appendChild(totalPriceSpan);
                }

                row.appendChild(priceCell);

                const nemCell = document.createElement('td');
                nemCell.style.textAlign = 'center';
                nemCell.textContent = `${product.nem} g`;

                if (productQuantities[product.name] > 1) {
                    const totalNem = product.nem * productQuantities[product.name];
                    const totalNemSpan = document.createElement('div');
                    totalNemSpan.textContent = `(${totalNem} g)`;
                    totalNemSpan.style.fontWeight = 'normal';
                    totalNemSpan.style.textAlign = 'center';
                    totalNemSpan.style.fontSize = 'smaller';
                    nemCell.appendChild(totalNemSpan);
                }
                row.appendChild(nemCell);

                const artiklerCell = document.createElement('td');
                artiklerCell.style.textAlign = 'center';
                artiklerCell.textContent = `${product.artikler} stk`;

                if (productQuantities[product.name] > 1) {
                    const totalArtikler = product.artikler * productQuantities[product.name];
                    const totalArtiklerSpan = document.createElement('div');
                    totalArtiklerSpan.textContent = `(${totalArtikler} stk)`;
                    totalArtiklerSpan.style.fontWeight = 'normal';
                    totalArtiklerSpan.style.textAlign = 'center';
                    totalArtiklerSpan.style.fontSize = 'smaller';
                    artiklerCell.appendChild(totalArtiklerSpan);
                }
                row.appendChild(artiklerCell);

                // Quantity Cell
                const quantityCell = document.createElement('td');
                const quantityInput = document.createElement('input');
                quantityInput.type = 'number';
                quantityInput.min = '1';
                quantityInput.value = productQuantities[product.name];
                quantityInput.classList.add('quantity-input');
                quantityInput.addEventListener('input', () => {
                    const newQuantity = Math.max(1, parseInt(quantityInput.value) || 1);
                    productQuantities[product.name] = newQuantity;
                    saveData();
                    displayProducts();
                    calculateSums();
                });
                quantityCell.appendChild(quantityInput);
                row.appendChild(quantityCell);

          // Remove button
            const removeCell = document.createElement('td');
            removeCell.style.border = 'none';
            const removeButton = document.createElement('button');
            removeButton.textContent = '-';
            removeButton.classList.add('remove-btn');
            removeButton.dataset.name = product.name; // Use name consistently

            removeButton.addEventListener('click', () => {
               selectedProducts = selectedProducts.filter(p => p.name !== product.name); // Compare with name
              filteredProducts = filteredProducts.filter(p => p.name !== product.name); // Compare with name
              saveData(); // Save updated list
              displayProducts(); // Re-render products
             calculateSums(); // Update sums
            });

            removeCell.appendChild(removeButton);
            row.appendChild(removeCell);

            productContainer.appendChild(row);

                      });
                   }

        function calculateSums() {
            let totalPrice = 0;
            let totalNem = 0;
            let totalArtikler = 0;

            filteredProducts.forEach(product => {
                const quantity = productQuantities[product.name];
                totalPrice += customPrices[product.name] * quantity;
                totalNem += product.nem * quantity;
                totalArtikler += product.artikler * quantity;
            });

            document.getElementById('sum-price').textContent = `${formatWithCommas(totalPrice)} DKK`;
            document.getElementById('sum-nem').textContent = `${totalNem} g`;
            document.getElementById('sum-artikler').textContent = `${totalArtikler} stk`;
        }
        function formatWithCommas(value) {
            const formatted = value.toLocaleString('en-DK'); // Formats with commas (Fjerner mange kommataller)
            const parts = formatted.split(',');
            return parts.slice(0, 3).join(','); // Allow up to two commas
        }
        

        function toggleSortOrder(symbolElement, key) {
            if (sortOrder[key] === 'asc') {
                sortOrder[key] = 'desc';
                symbolElement.style.color = 'blue';
            } else if (sortOrder[key] === 'desc') {
                sortOrder[key] = null;
                symbolElement.style.color = 'black';
            } else {
                sortOrder[key] = 'asc';
                symbolElement.style.color = '#F7A60C';
            }

            if (key !== 'price') sortPriceSymbol.style.color = 'black';
            if (key !== 'nem') sortNemSymbol.style.color = 'black';
            if (key !== 'artikler') sortArtiklerSymbol.style.color = 'black';

            applySorting();
        }

        searchNameInput.addEventListener('input', applyFiltersAndSearch);
        searchVarenrInput.addEventListener('input', applyFiltersAndSearch);
        shopFiltersContainer.addEventListener('change', applyFiltersAndSearch);
        typeFiltersContainer.addEventListener('change', applyFiltersAndSearch);
        sortPriceSymbol.addEventListener('click', () => toggleSortOrder(sortPriceSymbol, 'price'));
        sortNemSymbol.addEventListener('click', () => toggleSortOrder(sortNemSymbol, 'nem'));
        sortArtiklerSymbol.addEventListener('click', () => toggleSortOrder(sortArtiklerSymbol, 'artikler'));
        sortSkudSymbol.addEventListener('click', () => toggleSortOrder(sortSkudSymbol, 'skud'));

        applyFiltersAndSearch();
    })
    .catch(error => console.error('Error loading products:', error));
