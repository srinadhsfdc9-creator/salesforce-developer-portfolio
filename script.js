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

    const cacheOffsets = () => {
        sectionOffsets = sections.map(sec => ({
            id: sec.id,
            top: sec.offsetTop
        }));
    };

    cacheOffsets();
    window.addEventListener('resize', cacheOffsets, { passive: true });

    const updateActiveLink = () => {
        let current = '';
        const scrollPos = window.scrollY;
        for (let i = 0; i < sectionOffsets.length; i++) {
            if (scrollPos >= sectionOffsets[i].top - 110) {
                current = sectionOffsets[i].id;
            }
        }
        navLinks.forEach(link => {
            const matches = link.getAttribute('href') === `#${current}`;
            link.classList.toggle('active', matches);
        });
    };

    window.addEventListener('scroll', updateActiveLink, { passive: true });
    updateActiveLink();

    // ==========================================
    // 5. Cursor Glow Effect (Optimized with translate3d for GPU compositor)
    // ==========================================
    const cursorGlow = document.getElementById('cursor-glow');
    if (cursorGlow) {
        let mx = 0, my = 0, gx = 0, gy = 0;

        document.addEventListener('mousemove', e => {
            mx = e.clientX;
            my = e.clientY;
        }, { passive: true });

        const lerp = (a, b, t) => a + (b - a) * t;

        const animGlow = () => {
            gx = lerp(gx, mx, 0.07);
            gy = lerp(gy, my, 0.07);
            cursorGlow.style.transform = `translate3d(calc(${gx}px - 50%), calc(${gy}px - 50%), 0)`;
            requestAnimationFrame(animGlow);
        };

        animGlow();

        document.addEventListener('mouseleave', () => { cursorGlow.style.opacity = '0'; });
        document.addEventListener('mouseenter', () => { cursorGlow.style.opacity = '1'; });
    }

    // ==========================================
    // 6. Scroll Reveal (IntersectionObserver)
    // ==========================================
    const revealEls = document.querySelectorAll('.scroll-reveal');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('revealed');
                    }, i * 70);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        revealEls.forEach(el => observer.observe(el));
    } else {
        revealEls.forEach(el => el.classList.add('revealed'));
    }

    // ==========================================
    // 7. Card Subtle 3D Tilt Effect
    // ==========================================
    const tiltTargets = document.querySelectorAll('.sk-card, .proj-card, .cert-card-new, .svc-card');

    tiltTargets.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect    = card.getBoundingClientRect();
            const cx      = rect.width  / 2;
            const cy      = rect.height / 2;
            const rx      = ((e.clientY - rect.top  - cy) / cy) * -5;
            const ry      = ((e.clientX - rect.left - cx) / cx) *  5;
            card.style.transform = `translateY(-5px) perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

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
    // 9. Live Traffic Simulator (Demo)
    // ==========================================
    const btnSimulate  = document.getElementById('btnSimulateTraffic');
    const consoleLogs  = document.getElementById('dashConsoleLogs');
    const queueCount   = document.getElementById('dashQueueCount');
    const latencyVal   = document.getElementById('dashLatencyVal');
    const connector1   = document.getElementById('connector1');
    const connector2   = document.getElementById('connector2');

    const trafficScenario = [
        { text: 'OUTBOUND POST /v2/charges [Initiating Handshake]',           cmd: 'OUTBOUND', status: 'pending' },
        { text: 'GATEKEEPER Auth Token verified via Named Credential key.',    cmd: 'SYSTEM',   status: 'success' },
        { text: 'GATEKEEPER Executing HTTP Callout...',                        cmd: 'SYSTEM',   status: 'success' },
        { text: 'OUTBOUND [503 Service Unavailable] Transient failure.',       cmd: 'OUTBOUND', status: 'fail',  queue: '1 PENDING' },
        { text: 'RETRY_QUEUE Enqueuing IntegrationRetryQueue.cls...',          cmd: 'SYSTEM',   status: 'retry', queue: '1 PENDING' },
        { text: 'RETRY_QUEUE Executing... (Attempt 1 of 3)',                   cmd: 'SYSTEM',   status: 'retry' },
        { text: 'OUTBOUND [200 OK] POST /v2/charges (Retry Successful)',       cmd: 'OUTBOUND', status: 'success', queue: '0 PENDING', latency: '128ms' },
        { text: 'GATEKEEPER Transaction committed. Event published.',          cmd: 'SYSTEM',   status: 'success' },
        { text: 'PLATFORM_EVENT PaymentProcessed published to subscribers.',   cmd: 'SYSTEM',   status: 'success' },
        { text: '--- Session complete. 1 retry executed. Latency: 128ms ---',  cmd: 'SYSTEM',   status: 'success' },
    ];

    const statusCls = { success: 'success', fail: 'fail', retry: 'retry', pending: '' };

    const appendLog = (entry) => {
        if (!consoleLogs) return;
        const now  = new Date();
        const time = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
        const line = document.createElement('div');
        line.className = 'dash-log-line';
        line.innerHTML = `<span class="log-t">[${time}]</span> <span class="log-cmd">${entry.cmd}</span> <span class="log-status ${statusCls[entry.status] || ''}">${entry.status.toUpperCase()}</span> ${entry.text}`;
        consoleLogs.appendChild(line);
        consoleLogs.scrollTop = consoleLogs.scrollHeight;
    };

    const activateConnector = (el, active) => {
        if (!el) return;
        el.querySelector('.connector-pulse')?.classList.toggle('active', active);
    };

    if (btnSimulate) {
        let running = false;
        btnSimulate.addEventListener('click', () => {
            if (running) return;
            running = true;
            btnSimulate.disabled = true;
            btnSimulate.textContent = 'Simulating...';

            if (consoleLogs) consoleLogs.innerHTML = '';

            trafficScenario.forEach((entry, i) => {
                setTimeout(() => {
                    appendLog(entry);

                    if (entry.queue && queueCount)  queueCount.textContent  = entry.queue;
                    if (entry.latency && latencyVal) latencyVal.textContent = entry.latency;

                    if (entry.status === 'fail') {
                        activateConnector(connector1, false);
                        activateConnector(connector2, false);
                    } else if (entry.status === 'success') {
                        activateConnector(connector1, true);
                        activateConnector(connector2, true);
                    }

                    if (i === trafficScenario.length - 1) {
                        setTimeout(() => {
                            running = false;
                            btnSimulate.disabled = false;
                            btnSimulate.textContent = 'Simulate Live Traffic';
                        }, 800);
                    }
                }, i * 700);
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
