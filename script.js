document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
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

    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Apply animation to sections
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    // Animate stat cards with delay
    const cards = document.querySelectorAll('.stat-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.6s ease-out';
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200);
    });

    // Animate numbers counting up
    function animateNumbers() {
        const statNumbers = document.querySelectorAll('.stat-card h3');
        
        statNumbers.forEach((numberElement, index) => {
            const targetNumber = parseInt(numberElement.getAttribute('data-target'));
            const isHours = index === 2; // Third card is hours
            
            if (isNaN(targetNumber)) return;
            
            let currentNumber = 0;
            const increment = targetNumber / 60; // Animate over 60 frames
            const duration = 2000; // 2 seconds
            const stepTime = duration / 60;
            
            const timer = setInterval(() => {
                currentNumber += increment;
                if (currentNumber >= targetNumber) {
                    currentNumber = targetNumber;
                    clearInterval(timer);
                }
                
                if (isHours) {
                    numberElement.textContent = Math.floor(currentNumber) + ' hrs';
                } else {
                    numberElement.textContent = Math.floor(currentNumber);
                }
            }, stepTime);
        });
    }

    // Trigger number animation when stats section is visible
    const statsSection = document.getElementById('stats');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateNumbers();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        statsObserver.observe(statsSection);
    }

    // Parallax effect for hero background (removed for better performance)
    // window.addEventListener('scroll', () => {
    //     const scrolled = window.pageYOffset;
    //     const hero = document.querySelector('.hero');
    //     if (hero) {
    //         hero.style.backgroundPositionY = -(scrolled * 0.5) + 'px';
    //     }
    // });

    // Copy M-Pesa number functionality
    const copyButton = document.getElementById('copy-mpesa');
    const mpesaNumber = document.getElementById('mpesa-number');
    const copyFeedback = document.getElementById('copy-feedback');

    if (copyButton && mpesaNumber) {
        copyButton.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(mpesaNumber.textContent);
                copyFeedback.textContent = 'M-Pesa number copied to clipboard!';
                copyFeedback.classList.add('show');
                setTimeout(() => {
                    copyFeedback.classList.remove('show');
                }, 3000);
            } catch (err) {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = mpesaNumber.textContent;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                copyFeedback.textContent = 'M-Pesa number copied to clipboard!';
                copyFeedback.classList.add('show');
                setTimeout(() => {
                    copyFeedback.classList.remove('show');
                }, 3000);
            }
        });
    }

    console.log("Voicing for the Boychild: Modern, lively website initialized.");
});