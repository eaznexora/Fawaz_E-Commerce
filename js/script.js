document.addEventListener('DOMContentLoaded', function () {
    if (window.lucide && typeof lucide.createIcons === 'function') {
        lucide.createIcons();
    }

    // --- Navbar Logic ---
    const navbar = document.getElementById('navbar');
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuIcon = document.getElementById('mobile-menu-icon');

    function updateNavTheme() {
        if (!navbar || !mobileMenuIcon) return;
        const isDarkMode = document.body.classList.contains('dark-mode');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
            navbar.classList.remove('top');
            mobileMenuIcon.classList.remove('text-white');
            mobileMenuIcon.classList.add(isDarkMode ? 'text-white' : 'text-gray-800');
        } else {
            navbar.classList.remove('scrolled');
            navbar.classList.add('top');
            mobileMenuIcon.classList.add('text-white');
            mobileMenuIcon.classList.remove('text-gray-800');
        }
    }
    window.addEventListener('scroll', updateNavTheme);

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Close mobile menu when a link is clicked
    const mobileNavLinks = document.querySelectorAll('#mobile-menu a');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });
    

    // --- All Projects Filter Logic ---
    const filterButtons = document.querySelectorAll('.project-filter-btn');
    const projectCardWrappers = document.querySelectorAll('.project-card-wrapper');

    if (filterButtons.length && projectCardWrappers.length) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                const filter = button.dataset.filter;

                projectCardWrappers.forEach(wrapper => {
                    const card = wrapper.querySelector('.project-card');
                    if (!card) return;
                    if (filter === 'all' || card.dataset.category === filter) {
                        wrapper.style.display = 'block';
                    } else {
                        wrapper.style.display = 'none';
                    }
                });
            });
        });
    }
    

    // --- Contact Form WhatsApp Logic ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const fullName = document.getElementById('fullName').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const details = document.getElementById('details').value;
            let message = `Hello Eaz Nexora,%0a%0a*Name:* ${fullName}%0a*Email:* ${email}%0a`;
            if (phone) message += `*Phone:* ${phone}%0a`;
            message += `*Project Details:*%0a${details}`;
            const whatsappUrl = `https://wa.me/917039233801?text=${message}`;
            window.open(whatsappUrl, '_blank');
        });
    }

    // --- Reversible Fade-in on Scroll Animation ---
let lastScrollTop = 0;
const fadeSections = document.querySelectorAll('.fade-in-section');

if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
            const goingDown = currentScroll > lastScrollTop;
            
            if (entry.isIntersecting) {
                // Fade in when entering viewport
                entry.target.classList.add('is-visible');
                entry.target.classList.remove('is-hidden');
            } else {
                // Fade out when leaving viewport (depending on scroll direction)
                if (goingDown) {
                    // Scrolling down → fade out upwards
                    entry.target.classList.remove('is-visible');
                    entry.target.classList.add('is-hidden');
                } else {
                    // Scrolling up → fade out downwards
                    entry.target.classList.remove('is-visible');
                    entry.target.classList.add('is-hidden');
                }
            }

            lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
        });
    }, { threshold: 0.15 });

    fadeSections.forEach(section => observer.observe(section));
} else {
    fadeSections.forEach(section => section.classList.add('is-visible'));
}


    // --- Dark Mode & Particles ---
    const toggleButton = document.getElementById('dark-mode-toggle');
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas ? canvas.getContext('2d') : null;
    let particlesArray = [];
    let animationFrameId;

    function setCanvasSize() {
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 1.5 + 0.5;
            this.speedX = Math.random() * 0.4 - 0.2;
            this.speedY = Math.random() * 0.4 - 0.2;
        }
        update() {
            if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
            if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;
            this.x += this.speedX;
            this.y += this.speedY;
        }
        draw() {
            if (!ctx) return;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        if (!canvas) return;
        particlesArray = [];
        let numberOfParticles = (canvas.height * canvas.width) / 9000;
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }

    function animateParticles() {
        if (!ctx || !canvas) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
        animationFrameId = requestAnimationFrame(animateParticles);
    }

    const enableDarkMode = () => {
        document.body.classList.add('dark-mode');
        if (sunIcon) sunIcon.classList.add('hidden');
        if (moonIcon) moonIcon.classList.remove('hidden');
        try { localStorage.setItem('theme', 'dark'); } catch(e) {}
        if (canvas && ctx) {
            setCanvasSize();
            initParticles();
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            animateParticles();
        }
        updateNavTheme();
    };

    const disableDarkMode = () => {
        document.body.classList.remove('dark-mode');
        if (sunIcon) sunIcon.classList.remove('hidden');
        if (moonIcon) moonIcon.classList.add('hidden');
        try { localStorage.setItem('theme', 'light'); } catch(e) {}
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        if (ctx && canvas) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        updateNavTheme();
    };

    if (toggleButton) {
        toggleButton.addEventListener('click', () => {
            if (document.body.classList.contains('dark-mode')) {
                disableDarkMode();
            } else {
                enableDarkMode();
            }
        });
    }

    try {
        if (localStorage.getItem('theme') === 'dark') {
            enableDarkMode();
        } else {
            disableDarkMode();
        }
    } catch(e) {
        disableDarkMode();
    }

    window.addEventListener('resize', () => {
        if (document.body.classList.contains('dark-mode') && canvas) {
            setCanvasSize();
            initParticles();
        }
    });

    // Initial call to set navbar state
    updateNavTheme();
});
// ===== Auto-Add 'active' class to current page links =====
document.addEventListener("DOMContentLoaded", () => {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll(".nav-link");

  navLinks.forEach(link => {
    const linkPage = link.getAttribute("href");

    if (linkPage === currentPage) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
});
// ===== Highlight Active Navbar Link (Desktop + Mobile) =====
document.addEventListener("DOMContentLoaded", () => {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const allLinks = document.querySelectorAll(".nav-link");

  allLinks.forEach(link => {
    const linkPage = link.getAttribute("href");
    if (linkPage === currentPage) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
});

// ===== Ensure mobile nav re-checks after it's toggled =====
const menuToggle = document.getElementById("menu-toggle");
if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    const mobileLinks = document.querySelectorAll("#mobile-menu .nav-link");

    mobileLinks.forEach(link => {
      const linkPage = link.getAttribute("href");
      if (linkPage === currentPage) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  });
}
// ===== 3D Tilt for Cards =====
document.querySelectorAll('.card-hover-effect').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = ((y / rect.height) - 0.5) * 8;
    const rotateY = ((x / rect.width) - 0.5) * -8;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
  });
});

