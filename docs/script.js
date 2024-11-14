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
