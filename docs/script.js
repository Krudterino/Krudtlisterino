// Detect which page is active
document.addEventListener('DOMContentLoaded', function () {
    setTimeout(() => { addPlayButtonToProductRows(); }, 500);
    console.log('DOM fully loaded and parsed');
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    document.body.appendChild(tooltip);

    function showTooltip(cell, event) {
        tooltip.textContent = cell.textContent;
        tooltip.style.visibility = 'visible';
        tooltip.style.opacity = '1';
        tooltip.style.top = `${event.pageY + 10}px`;
        tooltip.style.left = `${event.pageX + 10}px`;
    }

    function hideTooltip() {
        tooltip.style.visibility = 'hidden';
        tooltip.style.opacity = '0';
    }

    function attachTooltipListeners() {
        document.querySelectorAll('td').forEach(cell => {
            cell.addEventListener('mouseenter', function (e) {
                if (this.scrollWidth > this.clientWidth) {
                    showTooltip(this, e);
                }
            });

            cell.addEventListener('mousemove', function (e) {
                if (tooltip.style.visibility === 'visible') {
                    tooltip.style.top = `${e.pageY + 10}px`;
                    tooltip.style.left = `${e.pageX + 10}px`;
                }
            });

            cell.addEventListener('mouseleave', hideTooltip);
        });
    }

    function observeDynamicContent(container) {
        const observer = new MutationObserver(() => {
            attachTooltipListeners(); // Attach listeners to new content
        });

        observer.observe(container, { childList: true, subtree: true });
    }

    // Detect which page is active
    const productContainer = document.getElementById('product-container');
    const listContainer = document.getElementById('list-container');

    if (productContainer) {
        console.log('Product container found');
        observeDynamicContent(productContainer);
        attachTooltipListeners();
        addPlayButtonColumnToHeader(productContainer);
    }

    if (listContainer) {
        console.log('List container found');
        observeDynamicContent(listContainer);
        attachTooltipListeners();
        addPlayButtonColumnToHeader(listContainer);
    }
});
function showVideoModal(videoUrl) {
    const modal = document.getElementById('video-modal');
    const videoContainer = document.getElementById('video-container');

    // Create an iframe with the embedded YouTube URL
    const iframe = document.createElement('iframe');
    iframe.width = '1120';
    iframe.height = '630';
    iframe.src = videoUrl.replace("watch?v=", "embed/"); // Converts YouTube URL to embeddable format
    iframe.title = 'YouTube video player';
    iframe.frameBorder = '0';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;

    // Clear previous content and add the iframe
    videoContainer.innerHTML = '';
    videoContainer.appendChild(iframe);

    // Show the modal
    modal.style.display = 'block';
}

// Event listener to close the modal
document.getElementById('close-modal').addEventListener('click', () => {
    const modal = document.getElementById('video-modal');
    modal.style.display = 'none';
    document.getElementById('video-container').innerHTML = ''; // Clear the video content when closing
});

// Close the modal if clicking outside of the modal content
window.addEventListener('click', (event) => {
    const modal = document.getElementById('video-modal');
    if (event.target === modal) {
        modal.style.display = 'none';
        document.getElementById('video-container').innerHTML = ''; // Clear the video content when closing
    }
});





// Global products array to hold all products data
let products = [];

// Load product data from JSON and initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Fetch the products JSON data
    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            products = data; // Set products array to global scope for access in other functions
            observeProductImages(); // Add event listeners to images (click and hover)
        })
        .catch(error => console.error('Error loading products:', error));

    // Mutation observer to handle dynamically added images (useful for pagination or dynamic updates)
    const productContainer = document.getElementById('product-container') || document.getElementById('list-container');
    if (productContainer) {
        const observer = new MutationObserver(() => {
            observeProductImages(); // Attach event listeners to newly added images
        });
        observer.observe(productContainer, { childList: true, subtree: true });
    }
});

function observeProductImages() {
    const productImages = document.querySelectorAll('.product-image');

    productImages.forEach((img) => {
        if (!img.dataset.eventsAttached) {
            // Handle click to open product link
            img.addEventListener('click', () => {
                const productName = img.dataset.productName; // Get product name from dataset
                const product = products.find((p) => p.name === productName); // Search by name

                if (product?.produktlink) {
                    window.open(product.produktlink, '_blank'); // Open the product link in a new tab
                } else {
                    console.error(`Produktlink not found for product: ${productName}`);
                }
            });

            // Image enlargement logic on hover
            let hoverTimeout;
            let enlargedImg;

            img.addEventListener('mouseenter', () => {
                hoverTimeout = setTimeout(() => {
                    const rect = img.getBoundingClientRect();
                    enlargedImg = img.cloneNode(true);

                    // Style the enlarged image
                    Object.assign(enlargedImg.style, {
                        transform: 'scale(5)',
                        position: 'absolute',
                        zIndex: '1000',
                        pointerEvents: 'none',
                        top: `${rect.top + window.scrollY}px`,
                        left: `${rect.left + window.scrollX}px`,
                        width: `${rect.width}px`,
                        height: `${rect.height}px`,
                    });

                    enlargedImg.classList.add('enlarged-image');
                    document.body.appendChild(enlargedImg);

                    img.dataset.enlargedImageId = `enlarged-${img.dataset.productName}`;
                    enlargedImg.dataset.enlargedImageId = `enlarged-${img.dataset.productName}`;
                }, 300); // Delay for hover effect
            });

            img.addEventListener('mouseleave', () => {
                clearTimeout(hoverTimeout);
                if (enlargedImg) {
                    enlargedImg.remove(); // Ensure enlarged image is cleaned up
                }
            });

            img.dataset.eventsAttached = 'true'; // Prevent duplicate event listeners
        }
    });
}


// Firebase configuration object (from your Firebase Console)
const firebaseConfig = {
    apiKey: "AIzaSyAaG3e2QZBDZ3RQXbsSBCyd_p6rr2slAUU",
    authDomain: "krudtlisterino-4c2fd.firebaseapp.com",
    projectId: "krudtlisterino-4c2fd",
    storageBucket: "krudtlisterino-4c2fd.appspot.com",
    messagingSenderId: "507187923147",
    appId: "1:507187923147:web:228082a4c6ff7f78bd334e",
    measurementId: "G-JNGY9S942W"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore(); // Initialize Firestore

/**
 * Save data to Firestore under a specific code.
 * @param {string} code - The unique 6-character code.
 * @param {object} data - The data to save (localStorage content).
 */
async function saveData(code, data) {
    try {
        await db.collection('sharedLists').doc(code).set(data);
        console.log(`Data successfully saved under code: ${code}`, data);
    } catch (error) {
        console.error('Error saving data:', error);
        alert('Failed to save data. Please try again.');
    }
}

/**
 * Generate a shareable link with a unique 6-character code
 * and save localStorage data under this code.
 */
document.addEventListener('DOMContentLoaded', () => {
    const delButton = document.getElementById('del-button');

    if (!delButton) {
        console.error('DEL button not found.');
        return;
    }

    delButton.addEventListener('click', async function () {
        const randomCode = Math.random().toString(36).substring(2, 8); // Generate 6-character code
        const data = { ...localStorage }; // Clone all localStorage data

        if (Object.keys(data).length === 0) {
            alert('No data in localStorage to share.');
            return;
        }

        try {
            await saveData(randomCode, data);
            const shareableLink = `${window.location.origin}/liste.html#${randomCode}`;
            showPopup(shareableLink);
        } catch (error) {
            console.error('Error during DEL button process:', error);
        }
    });
});

/**
 * Show the custom popup with the generated link.
 * @param {string} link - The generated shareable link.
 */
function showPopup(link) {
    const popup = document.getElementById('link-popup');
    const popupLink = document.getElementById('popup-link');
    const overlay = document.getElementById('popup-overlay');
    const closeButton = document.getElementById('close-popup');

    popupLink.value = link;
    popup.style.display = 'block';
    overlay.style.display = 'block';

    popupLink.select();
    document.execCommand('copy');

    closeButton.addEventListener('click', () => {
        popup.style.display = 'none';
        overlay.style.display = 'none';
    });
}

/**
 * Load shared data from Firestore based on the code in the URL hash
 * and populate localStorage.
 */
/**
 * Load shared data from Firestore based on the code in the URL hash
 * and populate localStorage.
 */
async function loadSharedData() {
    const code = window.location.hash.substring(1); // Extract code from URL hash

    if (code.length !== 6) {
        console.log('No valid 6-character code found in the URL hash.');
        displayDefaultState();
        return;
    }

    console.log(`Attempting to load data for code: ${code}`);

    try {
        const doc = await db.collection('sharedLists').doc(code).get();
        if (doc.exists) {
            const data = doc.data();
            for (const [key, value] of Object.entries(data)) {
                localStorage.setItem(key, value);
            }

            displayDataOnPage(data); // Display data immediately
            history.replaceState(null, '', 'liste.html'); // Clean the URL

            // Reload the page to apply any necessary formatting
            setTimeout(() => {
                window.location.reload();
            }, 50);
        } else {
            alert('No data found for this code.');
            displayDefaultState();
        }
    } catch (error) {
        console.error('Error loading shared data:', error);
        alert('Failed to load data. Please try again later.');
        displayDefaultState();
    }
}

/**
 * Display a default state on the page when no hash or data is present.
 */
function displayDefaultState() {
    const listContainer = document.getElementById('list-container');
    if (!listContainer) {
        console.error('List container not found.');
        return;
    }

    listContainer.innerHTML = '<p>No data available. Add items to your list and generate a link to share.</p>';
}

/**
 * Display loaded data on the `liste.html` page.
 * @param {object} data - The data to display.
 */
function displayDataOnPage(data) {
    const listContainer = document.getElementById('list-container');

    if (!listContainer) {
        console.error('List container not found.');
        return;
    }

    listContainer.innerHTML = ''; // Clear existing content

    const list = document.createElement('ul');
    for (const [key, value] of Object.entries(data)) {
        const item = document.createElement('li');
        item.textContent = `${key}: ${value}`;
        list.appendChild(item);
    }

    listContainer.appendChild(list);
}

// Automatically attempt to load shared data on page load
window.onload = loadSharedData;

// Reload data if the hash changes (e.g., user navigates back to shared link)
window.addEventListener('hashchange', loadSharedData);
