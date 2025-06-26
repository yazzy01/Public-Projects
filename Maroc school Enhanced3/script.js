// JavaScript for Digital Morocco School Website

// Animation for "Qui somme nous ?" text
document.addEventListener('DOMContentLoaded', function() {
    const animatedText = document.querySelector('.animated-text');
    if (animatedText) {
        const text = animatedText.textContent;
        animatedText.textContent = '';
        
        // Create a span for each character
        for (let i = 0; i < text.length; i++) {
            const span = document.createElement('span');
            span.textContent = text[i];
            span.style.animationDelay = (i * 0.05) + 's';
            animatedText.appendChild(span);
        }
    }
    
    // Animation replay on hover
    animatedText.addEventListener('mouseenter', function() {
        const spans = this.querySelectorAll('span');
        spans.forEach((span, index) => {
            span.style.opacity = '0';
            span.style.transform = 'translateX(-20px)';
            setTimeout(() => {
                span.style.opacity = '1';
                span.style.transform = 'translateX(0)';
            }, index * 50);
        });
    });
});

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('nav a, .cta-button');
    
    for (const link of links) {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 70,
                        behavior: 'smooth'
                    });
                }
            }
        });
    }
});

// Mobile menu toggle
const createMobileMenu = () => {
    const navbar = document.querySelector('.navbar');
    
    // Only create if it doesn't exist yet
    if (!document.querySelector('.mobile-menu-btn')) {
        const mobileMenuBtn = document.createElement('div');
        mobileMenuBtn.className = 'mobile-menu-btn';
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        
        navbar.appendChild(mobileMenuBtn);
        
        mobileMenuBtn.addEventListener('click', function() {
            const nav = document.querySelector('nav');
            nav.classList.toggle('active');
        });
    }
};

// Initialize mobile menu on smaller screens
window.addEventListener('load', function() {
    if (window.innerWidth <= 768) {
        createMobileMenu();
    }
});

window.addEventListener('resize', function() {
    if (window.innerWidth <= 768) {
        createMobileMenu();
    } else {
        // Remove active class when screen is resized larger
        const nav = document.querySelector('nav');
        if (nav && nav.classList.contains('active')) {
            nav.classList.remove('active');
        }
    }
});

// Form submission
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const nom = document.getElementById('nom').value;
            const prenom = document.getElementById('prenom').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // Simple validation
            if (!nom || !prenom || !email || !message) {
                alert('Veuillez remplir tous les champs du formulaire.');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Veuillez entrer une adresse email valide.');
                return;
            }
            
            // Here you would normally send the form data to a server
            // For now, just show a success message
            alert('Merci pour votre message ! Nous vous contacterons bientôt.');
            this.reset();
        });
    }
});

// Add active class to current navigation item
document.addEventListener('DOMContentLoaded', function() {
    const currentLocation = window.location.pathname;
    const navLinks = document.querySelectorAll('nav ul li a');
    
    // Default to first nav item if on homepage
    if (currentLocation === '/' || currentLocation.includes('index.html')) {
        navLinks[0].classList.add('active');
    } else {
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && currentLocation.includes(href)) {
                link.classList.add('active');
            }
        });
    }
});

// Sticky header with scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.classList.add('sticky');
    } else {
        header.classList.remove('sticky');
    }
});

// Course card hover effects
document.addEventListener('DOMContentLoaded', function() {
    const courseCards = document.querySelectorAll('.course-card');
    
    courseCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.1)';
        });
    });
});

// Read more functionality for articles
document.addEventListener('DOMContentLoaded', function() {
    const readMoreLinks = document.querySelectorAll('.read-more');
    
    readMoreLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const articleContent = this.closest('.article-content');
            const articleTitle = articleContent.querySelector('h3').textContent;
            
            alert('Article: ' + articleTitle + '\nCette fonctionnalité sera disponible prochainement.');
        });
    });
});
