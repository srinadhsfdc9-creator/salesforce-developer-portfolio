/**
 * Salesforce Developer Portfolio — script.js
 * Clean, modern JavaScript for the redesigned portfolio.
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. Header Scroll Effect
    // ==========================================
    const header = document.getElementById('siteHeader');
    const onScroll = () => {
        if (header) {
            header.classList.toggle('scrolled', window.scrollY > 20);
        }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // ==========================================
    // 2. Mobile Navigation Toggle
    // ==========================================
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu      = document.getElementById('navMenu');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('open');
            mobileToggle.classList.toggle('open', isOpen);
            mobileToggle.setAttribute('aria-expanded', String(isOpen));
        });

        // Close on link click
        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                mobileToggle.classList.remove('open');
                mobileToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // ==========================================
    // 3. Active Nav Link on Scroll (Optimized with Cached Offsets)
    // ==========================================
    const sections  = Array.from(document.querySelectorAll('section[id]'));
    const navLinks  = Array.from(document.querySelectorAll('.nav-link'));
    let sectionOffsets = [];
    let lastActiveSection = '';

    const cacheOffsets = () => {
        sectionOffsets = sections.map(sec => ({
            id: sec.id,
            top: sec.offsetTop
        }));
    };

    cacheOffsets();
    window.addEventListener('load', cacheOffsets, { passive: true });
    window.addEventListener('resize', cacheOffsets, { passive: true });

    const updateActiveLink = () => {
        let current = '';
        const scrollPos = window.scrollY;
        for (let i = 0; i < sectionOffsets.length; i++) {
            if (scrollPos >= sectionOffsets[i].top - 110) {
                current = sectionOffsets[i].id;
            }
        }
        if (current !== lastActiveSection) {
            lastActiveSection = current;
            navLinks.forEach(link => {
                const matches = link.getAttribute('href') === `#${current}`;
                link.classList.toggle('active', matches);
            });
        }
    };

    window.addEventListener('scroll', updateActiveLink, { passive: true });
    updateActiveLink();




    // ==========================================
    // 8. Contact Form Handler (Web3Forms Integration)
    // ==========================================
    const WEB3FORMS_ACCESS_KEY = "12a9abd9-212e-4104-89c0-cb80e1642c16"; // Get your free key at https://web3forms.com
    const contactForm = document.getElementById('contactForm');
    const formMsg     = document.getElementById('formMessage');

    if (contactForm && formMsg) {
        contactForm.addEventListener('submit', e => {
            e.preventDefault();
            const name    = document.getElementById('nameInput')?.value.trim();
            const email   = document.getElementById('emailInput')?.value.trim();
            const message = document.getElementById('messageInput')?.value.trim();

            if (!name || !email || !message) {
                formMsg.textContent = 'Please fill in all fields.';
                formMsg.className   = 'form-feedback error';
                return;
            }

            const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRx.test(email)) {
                formMsg.textContent = 'Please enter a valid email address.';
                formMsg.className   = 'form-feedback error';
                return;
            }

            // Fallback simulation mode if the key is not yet set
            if (WEB3FORMS_ACCESS_KEY === "YOUR_ACCESS_KEY_HERE") {
                formMsg.textContent = '✓ (Demo Mode) Message sent! Paste your Web3Forms Access Key in script.js to receive real emails.';
                formMsg.className   = 'form-feedback success';
                contactForm.reset();
                setTimeout(() => { formMsg.textContent = ''; formMsg.className = 'form-feedback'; }, 6000);
                return;
            }

            formMsg.textContent = 'Sending message...';
            formMsg.className   = 'form-feedback';

            fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    access_key: WEB3FORMS_ACCESS_KEY,
                    name: name,
                    email: email,
                    message: message,
                    subject: `New Portfolio Message from ${name}`
                })
            })
            .then(async (response) => {
                let json = await response.json();
                if (response.status == 200) {
                    formMsg.textContent = '✓ Message sent! I\'ll reply within 24 hours.';
                    formMsg.className   = 'form-feedback success';
                    contactForm.reset();
                } else {
                    formMsg.textContent = json.message || 'Something went wrong. Please try again.';
                    formMsg.className   = 'form-feedback error';
                }
            })
            .catch((error) => {
                console.error(error);
                formMsg.textContent = 'Something went wrong. Please try again.';
                formMsg.className   = 'form-feedback error';
            })
            .then(() => {
                setTimeout(() => {
                    formMsg.textContent = '';
                    formMsg.className = 'form-feedback';
                }, 6000);
            });
        });
    }

    // ==========================================
    // 10. Image Lightbox
    // ==========================================
    const lightbox    = document.getElementById('imageLightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const closeBtn    = document.querySelector('.lightbox-close');

    if (lightbox && lightboxImg) {
        document.querySelectorAll('.proj-gallery-img').forEach(img => {
            img.addEventListener('click', () => {
                lightboxImg.src = img.src;
                lightbox.classList.add('open');
                document.body.style.overflow = 'hidden'; // Lock scroll
            });
        });

        const closeLightbox = () => {
            lightbox.classList.remove('open');
            document.body.style.overflow = ''; // Unlock scroll
            setTimeout(() => { lightboxImg.src = ''; }, 250);
        };

        lightbox.addEventListener('click', closeLightbox);
        closeBtn?.addEventListener('click', closeLightbox);
        
        // Close with escape key
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && lightbox.classList.contains('open')) {
                closeLightbox();
            }
        });
    }

});
