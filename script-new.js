// Modern JavaScript for Diamond Trucking School
document.addEventListener('DOMContentLoaded', function() {
    
    // Navigation functionality
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-menu a');
    const sections = document.querySelectorAll('.section');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    // Smooth scrolling and section detection
    let isScrolling = false;
    let currentSection = 0;
    
    // Initialize the page
    init();
    
    function init() {
        // Show the first section
        sections[0].classList.add('active');
        navLinks[0].classList.add('active');
        
        // Set up event listeners
        setupEventListeners();
        
        // Start animations
        animateOnLoad();
    }
    
    function setupEventListeners() {
        // Navigation clicks
        navLinks.forEach((link, index) => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                scrollToSection(index);
            });
        });
        
        // Scroll detection
        window.addEventListener('scroll', throttle(handleScroll, 100));
        
        // Mobile menu toggle
        if (hamburger) {
            hamburger.addEventListener('click', toggleMobileMenu);
        }
        
        // Contact form submission
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', handleFormSubmission);
        }
        
        // Intersection Observer for scroll animations
        setupIntersectionObserver();
    }
    
    function handleScroll() {
        const scrollTop = window.pageYOffset;
        
        // Navbar background on scroll
        if (scrollTop > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Update active section
        updateActiveSection();
    }
    
    function updateActiveSection() {
        const scrollPosition = window.scrollY + window.innerHeight / 2;
        
        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                if (currentSection !== index) {
                    currentSection = index;
                    updateActiveNavLink(index);
                }
            }
        });
    }
    
    function updateActiveNavLink(index) {
        navLinks.forEach(link => link.classList.remove('active'));
        if (navLinks[index]) {
            navLinks[index].classList.add('active');
        }
    }
    
    function scrollToSection(index) {
        if (isScrolling) return;
        
        isScrolling = true;
        const targetSection = sections[index];
        
        if (targetSection) {
            // Smooth scroll to section
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Update active states
            currentSection = index;
            updateActiveNavLink(index);
            
            // Reset scrolling flag
            setTimeout(() => {
                isScrolling = false;
            }, 1000);
        }
    }
    
    // Global function for button clicks
    window.scrollToSection = function(sectionName) {
        const sectionIndex = Array.from(sections).findIndex(section => 
            section.id === sectionName
        );
        if (sectionIndex !== -1) {
            scrollToSection(sectionIndex);
        }
    };
    
    function toggleMobileMenu() {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    }
    
    function handleFormSubmission(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        
        // Validate form
        if (!validateForm(data)) {
            return;
        }
        
        // Show loading state
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            showSuccessMessage();
            e.target.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }
    
    function validateForm(data) {
        const required = ['name', 'email', 'program'];
        
        for (let field of required) {
            if (!data[field] || data[field].trim() === '') {
                showErrorMessage(`Please fill in the ${field} field.`);
                return false;
            }
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showErrorMessage('Please enter a valid email address.');
            return false;
        }
        
        return true;
    }
    
    function showSuccessMessage() {
        const message = createNotification('Thank you! We\'ll be in touch soon to discuss your training goals.', 'success');
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 5000);
    }
    
    function showErrorMessage(text) {
        const message = createNotification(text, 'error');
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 5000);
    }
    
    function createNotification(text, type) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = text;
        
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 1rem 2rem;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 2000;
            max-width: 400px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            animation: slideIn 0.3s ease;
            background: ${type === 'success' ? '#28a745' : '#dc3545'};
        `;
        
        return notification;
    }
    
    function setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '-50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    animateElements(entry.target);
                }
            });
        }, observerOptions);
        
        // Observe all sections
        sections.forEach(section => {
            observer.observe(section);
        });
        
        // Observe other animated elements
        document.querySelectorAll('.program-card, .service-item, .feature, .contact-item').forEach(el => {
            observer.observe(el);
        });
    }
    
    function animateElements(container) {
        // Animate cards with stagger effect
        const cards = container.querySelectorAll('.program-card, .service-item, .feature');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.animation = `fadeInUp 0.6s ease forwards`;
            }, index * 100);
        });
        
        // Animate stats
        const stats = container.querySelectorAll('.stat-item');
        stats.forEach((stat, index) => {
            setTimeout(() => {
                animateCountUp(stat);
            }, index * 200);
        });
    }
    
    function animateCountUp(element) {
        const numberElement = element.querySelector('h3');
        if (!numberElement) return;
        
        const finalNumber = parseInt(numberElement.textContent.replace(/\D/g, ''));
        if (isNaN(finalNumber)) return;
        
        const duration = 2000;
        const increment = finalNumber / (duration / 16);
        let current = 0;
        
        const counter = setInterval(() => {
            current += increment;
            if (current >= finalNumber) {
                numberElement.textContent = finalNumber + (numberElement.textContent.includes('%') ? '%' : '+');
                clearInterval(counter);
            } else {
                numberElement.textContent = Math.floor(current) + (numberElement.textContent.includes('%') ? '%' : '+');
            }
        }, 16);
    }
    
    function animateOnLoad() {
        // Add CSS animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes fadeInUp {
                from { transform: translateY(30px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
            
            .program-card:hover {
                animation: pulse 0.6s ease;
            }
            
            .nav-menu.active {
                display: flex;
                flex-direction: column;
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: rgba(17, 17, 17, 0.98);
                padding: 1rem;
                backdrop-filter: blur(10px);
            }
            
            .hamburger.active span:nth-child(1) {
                transform: rotate(45deg) translate(5px, 5px);
            }
            
            .hamburger.active span:nth-child(2) {
                opacity: 0;
            }
            
            .hamburger.active span:nth-child(3) {
                transform: rotate(-45deg) translate(7px, -6px);
            }
        `;
        document.head.appendChild(style);
    }
    
    // Utility function for throttling
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' || e.key === ' ') {
            e.preventDefault();
            if (currentSection < sections.length - 1) {
                scrollToSection(currentSection + 1);
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (currentSection > 0) {
                scrollToSection(currentSection - 1);
            }
        }
    });
    
    // Easter egg: Konami code for special animation
    let konamiCode = '';
    const konamiSequence = 'ArrowUpArrowUpArrowDownArrowDownArrowLeftArrowRightArrowLeftArrowRightKeyBKeyA';
    
    document.addEventListener('keydown', (e) => {
        konamiCode += e.code;
        if (konamiCode.length > konamiSequence.length) {
            konamiCode = konamiCode.slice(-konamiSequence.length);
        }
        
        if (konamiCode === konamiSequence) {
            activateEasterEgg();
            konamiCode = '';
        }
    });
    
    function activateEasterEgg() {
        // Special animation for the truck
        const truck = document.querySelector('.truck-animation i');
        if (truck) {
            truck.style.animation = 'truck-special 2s ease';
            truck.style.color = '#FFD700';
            
            setTimeout(() => {
                truck.style.animation = 'truck-move 3s ease-in-out infinite';
                truck.style.color = '#007bff';
            }, 2000);
        }
        
        // Add special animation
        const specialStyle = document.createElement('style');
        specialStyle.textContent = `
            @keyframes truck-special {
                0% { transform: scale(1) rotate(0deg); }
                25% { transform: scale(1.2) rotate(90deg); }
                50% { transform: scale(1.5) rotate(180deg); }
                75% { transform: scale(1.2) rotate(270deg); }
                100% { transform: scale(1) rotate(360deg); }
            }
        `;
        document.head.appendChild(specialStyle);
        
        showSuccessMessage('🚛 Special trucking powers activated! Keep on trucking! 🚛');
    }
    
    // Performance optimization: Preload images
    function preloadImages() {
        const imageUrls = [
            // Add any image URLs you want to preload
        ];
        
        imageUrls.forEach(url => {
            const img = new Image();
            img.src = url;
        });
    }
    
    // Call preload after a short delay
    setTimeout(preloadImages, 1000);
    
    // Service Worker registration for PWA capabilities (optional)
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then((registration) => {
                    console.log('SW registered: ', registration);
                })
                .catch((registrationError) => {
                    console.log('SW registration failed: ', registrationError);
                });
        });
    }
    
});
