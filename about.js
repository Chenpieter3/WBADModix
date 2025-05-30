// Counter Animation
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

// Copy Function
function copyText(elementId) {
  const text = document.getElementById(elementId).innerText;
  navigator.clipboard.writeText(text).then(() => {
    alert(`${text} berhasil disalin!`);
  });
}

// Testimoni Slider
const testimonials = [
  "“Layanannya cepat dan ramah!” - Andi",
  "“Produk berkualitas, pengiriman cepat.” - Sari",
  "“Saya puas belanja di sini, recomended banget!” - Budi",
  "“Top markotop!” - Lina",
];

let index = 0;
const container = document.getElementById("testimoni-container");

function showTestimonial(i) {
  container.innerText = testimonials[i];
}

function nextSlide() {
  index = (index + 1) % testimonials.length;
  showTestimonial(index);
}

function prevSlide() {
  index = (index - 1 + testimonials.length) % testimonials.length;
  showTestimonial(index);
}

// Initialize first testimonial
showTestimonial(index);
