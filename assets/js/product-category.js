import { showToast, updateHeaderCartBadge, toggleResponsiveMenu } from './utils.js';

let initialCards = [];

document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.product-grid');
    initialCards = Array.from(grid.querySelectorAll('.product-card')).map(card => card.cloneNode(true));
    
    const sortDropdown = document.querySelector('.sort-dropdown');
    if (sortDropdown) {
        sortDropdown.addEventListener('change', () => {
            const sortBy = sortDropdown.value;
            
            if (sortBy === 'Featured') {
                resetToInitialView();
                showToast('Restored to Featured view');
            } else {
                sortProducts(sortBy);
                showToast('Sorted by: ' + sortBy);
            }
        });
    }

    toggleResponsiveMenu();
    updateHeaderCartBadge();
});

function resetToInitialView() {
    const grid = document.querySelector('.product-grid');
    
    grid.innerHTML = '';
    
    initialCards.forEach(card => {
        const newCard = card.cloneNode(true);
        grid.appendChild(newCard);
    });
}

function sortProducts(sortBy) {
    const grid = document.querySelector('.product-grid');
    const cards = Array.from(grid.querySelectorAll('.product-card'));

    cards.sort((a, b) => {
        const priceA = parseFloat(a.querySelector('.product-price').textContent.replace('Rp', ''));
        const priceB = parseFloat(b.querySelector('.product-price').textContent.replace('Rp', ''));

        return sortBy.includes('Low to High') ? priceA - priceB : priceB - priceA;
    });

    grid.innerHTML = '';
    cards.forEach(card => grid.appendChild(card));
}