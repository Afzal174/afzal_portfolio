document.addEventListener('DOMContentLoaded', function() {
    // Typing effect
    const typedText = document.querySelector('.typed-text');
    if (typedText) {
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
    }
    
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function() {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    
    function reveal() {
        revealElements.forEach((element, index) => {
            const windowHeight = window.innerHeight;
            const elementTop = element.getBoundingClientRect().top;
            const revealPoint = 150;
            
            if (elementTop < windowHeight - revealPoint) {
                const delay = Math.floor(index / 5) * 0.1;
                element.style.transitionDelay = `${delay}s`;
                element.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', reveal);
    reveal();

    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
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
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    btn.innerHTML = '<i class="fas fa-check"></i> Sent!';
                    btn.style.background = 'var(--accent)';
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

    const skillBars = document.querySelectorAll('.skill-progress');
    
    function animateSkillBars() {
        skillBars.forEach((bar, index) => {
            const width = bar.style.width;
            bar.style.transform = 'scaleX(0)';
            setTimeout(() => {
                bar.style.transition = `transform 1.2s cubic-bezier(0.4, 0, 0.2, 1)`;
                bar.style.transform = 'scaleX(1)';
                bar.style.transformOrigin = 'left';
            }, 500 + (index * 150));
        });
    }

    const skillsSection = document.querySelector('.skills');
    if (skillsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateSkillBars();
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(skillsSection);
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    let lastScroll = 0;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.style.background = 'rgba(0, 0, 0, 0.8)';
            navbar.style.boxShadow = '0 2px 30px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(0, 0, 0, 0.5)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.05)';
        }
        
        lastScroll = currentScroll;
    });

    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.zIndex = '10';
        });
        card.addEventListener('mouseleave', () => {
            card.style.zIndex = '1';
        });
    });
});