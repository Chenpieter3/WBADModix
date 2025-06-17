import { updateHeaderCartBadge, toggleResponsiveMenu } from './utils.js';

$(document).ready(function() {
    const $slider = $('.slider-wrapper');
    const $slides = $('.slide');
    const $dots = $('.slider-dots');
    const totalSlides = $slides.length;
    let currentSlide = 0;
    let slideInterval;

    for (let i = 0; i < totalSlides; i++) {
        $dots.append(`<span class="dot ${i === 0 ? 'active' : ''}" data-slide="${i}"></span>`);
    }

    function showSlide(index) {
        $slides.removeClass('active');
        $('.dot').removeClass('active');
        
        $(`.slide:eq(${index})`).addClass('active');
        $(`.dot:eq(${index})`).addClass('active');
        
        currentSlide = index;
    }

    function nextSlide() {
        let next = currentSlide + 1;
        if (next >= totalSlides) {
            next = 0;
        }
        showSlide(next);
    }

    function prevSlide() {
        let prev = currentSlide - 1;
        if (prev < 0) {
            prev = totalSlides - 1;
        }
        showSlide(prev);
    }

    function startAutoSlide() {
        if (slideInterval) {
            clearInterval(slideInterval);
        }
        slideInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoSlide() {
        if (slideInterval) {
            clearInterval(slideInterval);
            slideInterval = null;
        }
    }

    $('.slider-nav.next').on('click', function() {
        stopAutoSlide();
        nextSlide();
        startAutoSlide();
    });

    $('.slider-nav.prev').on('click', function() {
        stopAutoSlide();
        prevSlide();
        startAutoSlide();
    });

    $('.dot').on('click', function() {
        stopAutoSlide();
        const slideIndex = $(this).data('slide');
        showSlide(slideIndex);
        startAutoSlide();
    });

    startAutoSlide();

    $('.slider-container').hover(
        function() {
            stopAutoSlide();
        },
        function() {
            startAutoSlide();
        }
    );
}); 

function sendToWhatsApp() {
    var name = document.getElementById('name').value.trim();
    var company = document.getElementById('company').value.trim();
    var error = document.getElementById('formError');
    if (!name || !company) {
      error.textContent = 'Nama dan Perusahaan/Instansi wajib diisi.';
      return;
    }
    error.textContent = '';
    var message = `Halo ModiX, saya ${name} dari ${company} ingin konsultasi/tanya katalog harga.`;
    var phone = '6281234567890';
    var url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

document.addEventListener('DOMContentLoaded', function() {
  toggleResponsiveMenu();
  updateHeaderCartBadge();
});

window.addEventListener('resize', function() {
  if (window.innerWidth > 900) {
    document.querySelectorAll('.has-dropdown.dropdown-open').forEach(function(el) {
      el.classList.remove('dropdown-open');
    });
  }
});