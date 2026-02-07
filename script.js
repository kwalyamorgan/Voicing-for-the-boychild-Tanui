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

    // Handle lazy loading for images
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    lazyImages.forEach(img => {
        img.addEventListener('load', () => {
            img.classList.add('loaded');
        });
        // Fallback for browsers that don't support lazy loading
        if ('loading' in HTMLImageElement.prototype === false) {
            img.src = img.src;
        }
    });

    console.log("Boyhood Echo Initiative: Modern, lively website initialized.");
});