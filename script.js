document.addEventListener('DOMContentLoaded', function () {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- Typing effect ---------- */
    const typedText = document.querySelector('.typed-text');
    if (typedText && !prefersReducedMotion) {
        const textArray = ['Web Developer', 'ML Enthusiast', 'Data Analyst', 'Problem Solver'];
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function type() {
            const currentText = textArray[textIndex];

            if (isDeleting) {
                typedText.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typedText.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
            }

            let typeSpeed = isDeleting ? 50 : 100;

            if (!isDeleting && charIndex === currentText.length) {
                typeSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % textArray.length;
                typeSpeed = 500;
            }

            setTimeout(type, typeSpeed);
        }

        type();
    } else if (typedText) {
        typedText.textContent = 'Web Developer';
    }

    /* ---------- Hero: mouse-follow glow + constellation tilt + click ripple ---------- */
    const heroEl = document.querySelector('.hero');
    const finePointer = window.matchMedia('(pointer: fine)').matches;

    if (finePointer && !prefersReducedMotion && heroEl) {
        heroEl.addEventListener('pointermove', (e) => {
            const r = heroEl.getBoundingClientRect();
            heroEl.style.setProperty('--mx', (e.clientX - r.left) + 'px');
            heroEl.style.setProperty('--my', (e.clientY - r.top) + 'px');
        }, { passive: true });
    }

    const visual = document.querySelector('.hero-visual');
    const constellation = document.getElementById('constellation');

    if (finePointer && !prefersReducedMotion && visual && constellation) {
        visual.addEventListener('pointermove', (e) => {
            const r = visual.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width - 0.5;
            const y = (e.clientY - r.top) / r.height - 0.5;
            constellation.style.transform = 'rotateX(' + (-y * 6).toFixed(2) + 'deg) rotateY(' + (x * 8).toFixed(2) + 'deg)';
        }, { passive: true });

        visual.addEventListener('pointerleave', () => {
            constellation.style.transform = '';
        });
    }

    if (!prefersReducedMotion && heroEl) {
        heroEl.addEventListener('click', (e) => {
            const r = heroEl.getBoundingClientRect();
            const ripple = document.createElement('span');
            ripple.className = 'click-ripple';
            ripple.style.left = (e.clientX - r.left) + 'px';
            ripple.style.top = (e.clientY - r.top) + 'px';
            heroEl.appendChild(ripple);
            setTimeout(() => ripple.remove(), 1000);
        });
    }

    /* ---------- Mobile menu ---------- */
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function () {
            const isOpen = navLinks.classList.toggle('active');
            hamburger.classList.toggle('active', isOpen);
            hamburger.setAttribute('aria-expanded', String(isOpen));
        });

        document.querySelectorAll('.nav-links a').forEach((link) => {
            link.addEventListener('click', function () {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            });
        });
    }

    /* ---------- Navbar scrolled state ---------- */
    const navbar = document.getElementById('navbar');
    function onScroll() {
        if (navbar) {
            navbar.classList.toggle('scrolled', window.scrollY > 40);
        }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ---------- Active navigation indicator ---------- */
    const sections = document.querySelectorAll('section[id]');
    const navAnchors = document.querySelectorAll('.nav-links a');

    if ('IntersectionObserver' in window && sections.length) {
        const navObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const id = entry.target.getAttribute('id');
                        navAnchors.forEach((a) => {
                            a.classList.toggle('active', a.getAttribute('href') === '#' + id);
                        });
                    }
                });
            },
            { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
        );
        sections.forEach((section) => navObserver.observe(section));
    }

    /* ---------- Reveal on scroll ---------- */
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

    if ('IntersectionObserver' in window && !prefersReducedMotion) {
        const revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
        );
        revealElements.forEach((el) => revealObserver.observe(el));
    } else {
        revealElements.forEach((el) => el.classList.add('active'));
    }

    /* ---------- Contact form ---------- */
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const btn = contactForm.querySelector('button');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            btn.disabled = true;

            try {
                const formData = new FormData(contactForm);
                const response = await fetch('https://formspree.io/f/xzdydeok', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        Accept: 'application/json'
                    }
                });

                if (response.ok) {
                    btn.innerHTML = '<i class="fas fa-check"></i> Sent!';
                    btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
                    contactForm.reset();
                } else {
                    btn.innerHTML = '<i class="fas fa-times"></i> Error';
                    btn.style.background = '#ef4444';
                }
            } catch (error) {
                btn.innerHTML = '<i class="fas fa-times"></i> Error';
                btn.style.background = '#ef4444';
            }

            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
                btn.disabled = false;
            }, 3000);
        });
    }

    /* ---------- Smooth anchor scrolling (reduced-motion aware) ---------- */
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: prefersReducedMotion ? 'auto' : 'smooth',
                    block: 'start'
                });
            }
        });
    });
});