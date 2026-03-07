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

    // Header scroll behavior
    let lastScrollTop = 0;
    const header = document.querySelector('header');
    const scrollThreshold = 100; // Minimum scroll distance before hiding

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (Math.abs(lastScrollTop - scrollTop) <= scrollThreshold) {
            return;
        }

        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            header.classList.add('hidden');
        } else {
            // Scrolling up
            header.classList.remove('hidden');
        }

        lastScrollTop = scrollTop;
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
    // Hero slideshow functionality
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    // Auto-advance slides every 5 seconds
    setInterval(nextSlide, 5000);

    // Initialize first slide
    if (slides.length > 0) {
        showSlide(0);
    }

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

    // Carousel functionality for image transition section
    document.addEventListener('DOMContentLoaded', function() {
        currentSlide = 0;
        const slides = document.querySelectorAll('.hero-slideshow .slide');
        const totalSlides = slides.length;
        let autoPlayInterval;

        function showSlide(n) {
            slides.forEach(slide => slide.classList.remove('active'));
            slides[currentSlide].classList.add('active');
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % totalSlides;
            showSlide(currentSlide);
            resetAutoPlay();
        }

        function prevSlide() {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            showSlide(currentSlide);
            resetAutoPlay();
        }

        function resetAutoPlay() {
            clearInterval(autoPlayInterval);
            autoPlayInterval = setInterval(nextSlide, 5000);
        }

        // Event listeners for buttons
        const nextBtn = document.getElementById('next-slide');
        const prevBtn = document.getElementById('prev-slide');
        
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);

        // Auto-advance carousel every 5 seconds
        autoPlayInterval = setInterval(nextSlide, 5000);
    });

    // Partners carousel
    window.addEventListener("load", () => {
        const carousel = document.querySelector(".partners-carousel");
        if (!carousel) return;

        const container = carousel.querySelector(".carousel-container");
        const track = carousel.querySelector(".carousel-track");
        if (!container || !track) return;

        // Prevent double init
        if (track.dataset.infiniteInit === "true") return;
        track.dataset.infiniteInit = "true";

        const originalItems = Array.from(track.children).map((el) => el.cloneNode(true));
        let singleSetWidth = 0;

        // Measure current set width (before adding more)
        Array.from(track.children).forEach((item) => {
            singleSetWidth += item.getBoundingClientRect().width;
        });

        // Add one duplicate set for seamless reset
        originalItems.forEach((item) => track.appendChild(item.cloneNode(true)));

        // If viewport is wide, add more so there is never blank space
        while (track.scrollWidth < container.clientWidth + singleSetWidth) {
            originalItems.forEach((item) => track.appendChild(item.cloneNode(true)));
        }

        let x = 0;
        const speed = 45; // px per second
        let last = performance.now();

        function animate(now) {
            const dt = (now - last) / 1000;
            last = now;

            x -= speed * dt;
            if (Math.abs(x) >= singleSetWidth) {
                x += singleSetWidth; // seamless loop point
            }

            track.style.transform = `translateX(${x}px)`;
            requestAnimationFrame(animate);
        }

        requestAnimationFrame(animate);
    });

    console.log("Boyhood Echo Initiative: Modern, lively website initialized.");
});