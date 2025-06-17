import { updateHeaderCartBadge, toggleResponsiveMenu } from './utils.js';

function toggleForms(form) {
  document.getElementById("register-container").style.display =
    form === "register" ? "block" : "none";
  document.getElementById("login-container").style.display =
    form === "login" ? "block" : "none";
}

window.toggleForms = toggleForms;

document.getElementById("registerForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const name = document.getElementById("regName").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const phone = document.getElementById("regPhone").value.trim();
    const address = document.getElementById("regAddress").value.trim();
    const password = document.getElementById("regPassword").value;
    const confirm = document.getElementById("regConfirm").value;
    const error = document.getElementById("regError");

    // Validasi Email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      error.textContent = "Format email tidak valid.";
      return;
    }

    // Validasi Nomor HP (hanya angka, minimal 10 digit, maksimal 15 digit)
    const phonePattern = /^\d{10,15}$/;
    if (!phonePattern.test(phone)) {
      error.textContent = "Nomor HP harus terdiri dari 10–15 angka.";
      return;
    }

    // Validasi Password: Minimal 8 karakter, harus ada huruf dan angka
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordPattern.test(password)) {
      error.textContent =
        "Password harus minimal 8 karakter dan mengandung huruf dan angka.";
      return;
    }
    if (password !== confirm) {
      error.textContent = "Konfirmasi password tidak sesuai.";
      return;
    }

    const user = { name, email, phone, address, password };
    sessionStorage.setItem("modixUser", JSON.stringify(user));
    alert("Registrasi berhasil! Silakan login.");
    toggleForms("login");
  });

document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;
  const error = document.getElementById("loginError");
  const stored = JSON.parse(sessionStorage.getItem("modixUser"));

  if (!stored || stored.email !== email || stored.password !== password) {
    error.textContent = "Email atau password salah!";
    return;
  }

  alert("Login berhasil!");
  window.location.href = "/index.html";
});

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