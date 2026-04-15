// Philippines time (Asia/Manila)
function updatePhilippinesTime() {
  const options = {
    timeZone: "Asia/Manila",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  };

  const now = new Date();
  const phTimeString = now.toLocaleTimeString("en-PH", options);
  const phTimeElement = document.getElementById("ph-time");

  if (phTimeElement) {
    phTimeElement.textContent = "Philippines Time: " + phTimeString;
  }
}

updatePhilippinesTime();
setInterval(updatePhilippinesTime, 1000);

// Run after DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  // Scroll reveal for all variants
  const revealElements = document.querySelectorAll(
    ".reveal, .reveal-up, .reveal-left, .reveal-fade"
  );

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target); // animate once
        }
      });
    },
    { threshold: 0.15 }
  );

  revealElements.forEach(el => observer.observe(el));

  /* --------------------------
     Theme toggle + face swap
  --------------------------- */
  const themeToggle = document.getElementById("theme-toggle");
  const profilePic = document.getElementById("profile-pic");

  let isDark = false;

  function swapProfileImage(src) {
    if (!profilePic) return;

    profilePic.classList.add("fading");

    setTimeout(() => {
      profilePic.src = src;
      profilePic.onload = () => {
        profilePic.classList.remove("fading");
      };
    }, 150);
  }

  function applyTheme() {
    if (isDark) {
      document.body.classList.add("dark-theme");
      swapProfileImage("me-back.jpg"); // back view for dark mode
    } else {
      document.body.classList.remove("dark-theme");
      swapProfileImage("me-front.jpg"); // front view for light mode
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      isDark = !isDark;
      applyTheme();
    });

    // run once on load (default light + front)
    applyTheme();
  }

  /* --------------------------
     Experience expand / collapse
  --------------------------- */
  const expCard = document.querySelector(".experience-card");
  const expToggleBtn = document.getElementById("exp-toggle-btn");

  if (expCard && expToggleBtn) {
    let expOpen = false;

    expToggleBtn.addEventListener("click", () => {
      expOpen = !expOpen;
      expCard.classList.toggle("expanded", expOpen);
      // no text change; chevron icon + CSS handle the visual state
    });
  }

  /* --------------------------
     Contact form (Formspree AJAX
     with spinner + check state)
  --------------------------- */
  const contactForm = document.querySelector(".contact-form");

  if (contactForm) {
    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault(); // stop normal redirect

      const submitBtn = contactForm.querySelector("button[type='submit']");
      if (!submitBtn) return;

      const originalText = submitBtn.textContent;

      // set loading state: spinner only
      submitBtn.disabled = true;
      submitBtn.classList.add("is-loading");
      submitBtn.textContent = "";

      // simple inline status message
      let statusEl = contactForm.querySelector(".form-status");
      if (!statusEl) {
        statusEl = document.createElement("p");
        statusEl.className = "form-status";
        statusEl.style.marginTop = "0.5rem";
        statusEl.style.fontSize = "0.85rem";
        contactForm.appendChild(statusEl);
      }

      try {
        const formData = new FormData(contactForm);

        const response = await fetch(contactForm.action, {
          method: contactForm.method,
          body: formData,
          headers: {
            "Accept": "application/json"
          }
        });

        if (response.ok) {
          // success: text + check state
          statusEl.textContent = "Thanks! Your message has been sent.";
          statusEl.style.color = "green";
          contactForm.reset();

          submitBtn.classList.remove("is-loading");
          submitBtn.classList.add("is-success");
          submitBtn.textContent = "";

          // after 2.5s, restore normal button
          setTimeout(() => {
            submitBtn.classList.remove("is-success");
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
          }, 2500);
        } else {
          // Formspree may return JSON with errors
          let errorText = "Oops, there was a problem sending your message.";
          try {
            const data = await response.json();
            if (data && data.errors) {
              errorText = data.errors.map(e => e.message).join(", ");
            }
          } catch (e) {
            // ignore JSON parse error, use default text
          }
          statusEl.textContent = errorText;
          statusEl.style.color = "red";

          submitBtn.classList.remove("is-loading");
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }
      } catch (err) {
        statusEl.textContent = "Network error. Please try again.";
        statusEl.style.color = "red";

        submitBtn.classList.remove("is-loading");
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }
});