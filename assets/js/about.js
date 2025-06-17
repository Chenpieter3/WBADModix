import { updateHeaderCartBadge, toggleResponsiveMenu } from './utils.js';

let counter = document.getElementById("buyer-counter");
let target = 5123;
let count = 0;

let counterInterval = setInterval(() => {
  if (count < target) {
    count += Math.ceil(target / 100);
    counter.innerText = count > target ? target : count;
  } else {
    clearInterval(counterInterval);
  }
}, 50);

async function copyText(elementId) {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Element not found');
    }
    
    const text = element.innerText;
    await navigator.clipboard.writeText(text);
    
    const originalText = element.innerText;
    element.innerText = 'Copied!';
    element.style.color = '#4CAF50';
    
    setTimeout(() => {
      element.innerText = originalText;
      element.style.color = '';
    }, 2000);
  } catch (err) {
    console.error('Failed to copy text:', err);
    alert('Failed to copy text. Please try again.');
  }
}

const testimonials = [
  { text: `"Layanannya cepat dan ramah!" - Andi`, rating: 5 },
  { text: `"Produk berkualitas, pengiriman cepat." - Sari`, rating: 5 },
  { text: `"Saya puas belanja di sini, recomended banget!" - Budi`, rating: 5 },
  { text: `"Top markotop!" - Lina`, rating: 5 }
];

let index = 0;
const container = document.getElementById("testimoni-container");
const prevButton = document.querySelector('.slider button:first-child');
const nextButton = document.querySelector('.slider button:last-child');

function showTestimonial(i) {
  if (!container) return;
  container.innerText = testimonials[i].text;
}

function nextSlide() {
  index = (index + 1) % testimonials.length;
  showTestimonial(index);
}

function prevSlide() {
  index = (index - 1 + testimonials.length) % testimonials.length;
  showTestimonial(index);
}

if (prevButton) {
  prevButton.addEventListener('click', () => {
    clearInterval(testimonialInterval);
    prevSlide();
    testimonialInterval = setInterval(nextSlide, 5000);
  });
}

if (nextButton) {
  nextButton.addEventListener('click', () => {
    clearInterval(testimonialInterval);
    nextSlide();
    testimonialInterval = setInterval(nextSlide, 5000);
  });
}

let testimonialInterval = setInterval(nextSlide, 5000);

container?.addEventListener('mouseenter', () => {
  clearInterval(testimonialInterval);
});

container?.addEventListener('mouseleave', () => {
  testimonialInterval = setInterval(nextSlide, 5000);
});

document.addEventListener('DOMContentLoaded', () => {
  showTestimonial(index);
  toggleResponsiveMenu();
  updateHeaderCartBadge();
});
