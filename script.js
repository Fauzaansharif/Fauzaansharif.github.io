document.addEventListener("DOMContentLoaded", () => {
  // --- Mobile menu toggle logic ---
  const menuBtn = document.getElementById("menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");

  // Check if the elements exist before adding event listeners
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", () => {
      // Toggle the 'hidden' class to show/hide the menu
      mobileMenu.classList.toggle("hidden");
    });

    // Close the mobile menu when a link inside it is clicked
    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.add("hidden");
      });
    });
  }

  // --- 3D Card Effect for Project Cards ---
  // This effect makes the project cards tilt based on mouse position
  const cards = document.querySelectorAll(".glass-card");

  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      // Get the card's position and dimensions
      const rect = card.getBoundingClientRect();

      // Calculate mouse position relative to the card's center
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate rotation values. The multiplication factor determines the tilt intensity.
      const rotateX = ((y - centerY) / centerY) * -8; // Tilt up/down
      const rotateY = ((x - centerX) / centerX) * 8; // Tilt left/right

      // Apply the 3D transformation using a perspective for depth
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    });

    // Reset the card's transformation when the mouse leaves
    card.addEventListener("mouseleave", () => {
      card.style.transform =
        "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";
    });
  });
});
