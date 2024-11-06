document.addEventListener('DOMContentLoaded', function () {
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
        observeDynamicContent(productContainer);
        attachTooltipListeners();
    }

    if (listContainer) {
        observeDynamicContent(listContainer);
        attachTooltipListeners();
    }
});
