// Premium Portfolio JavaScript with GSAP, Lottie, and WebGL

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin);

// Global variables
let particleSystem;
let cursor = { x: 0, y: 0 };
let mouse = { x: 0, y: 0 };
let isLoaded = false;

// Typing animation text
const roles = [
    "AI Enthusiast",
    "Data Analyst",
    "Frontend Developer",
    "Digital Marketer"
];

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    initializePreloader();
    initializeTheme();
    initializeCustomCursor();
    initializeScrollProgress();
    initializeParticleSystem();
    initializeGSAPAnimations();
    initializeNavigation();
    initializeContactForm();
    initializeMagneticElements();
    initializeLottieAnimations();
    initializeScrollAnimations();
    initializeRadialCharts();
    initializeSwipers();
    initializeProjectFilters();
    initializeProjectModal();
    initializeTimelineEnhancements();
    initializeCounters();
    initializeScrollToExplore();
    initializeHeroButtons();
    initializeCertificates();
});

// Initialize hero section buttons
function initializeHeroButtons() {
    // Get the buttons
    const getInTouchBtn = document.querySelector('.hero-actions .btn-primary');
    const viewWorkBtn = document.querySelector('.hero-actions .btn-secondary');
    const headerHeight = document.querySelector('nav')?.offsetHeight || 80;

    // Add click handler for Get In Touch button
    if (getInTouchBtn) {
        getInTouchBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                const targetPosition = contactSection.offsetTop - headerHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                // Update URL
                history.pushState(null, '', '#contact');
            }

// Certificates: upload, gallery, modal, persistence
function initializeCertificates() {
    const gallery = document.getElementById('cert-gallery');
    const modal = document.getElementById('certificate-modal');
    const modalClose = document.getElementById('certificate-modal-close');
    const modalImg = document.getElementById('certificate-image');
    const modalPdf = document.getElementById('certificate-pdf');
    const modalTitle = document.getElementById('certificate-modal-title');

    if (!gallery) return; // Section may not exist

    // Show loading state
    gallery.innerHTML = `
        <div class="col-span-full text-center py-8">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Loading certificates...</p>
        </div>`;

    // Modal handling
    if (modal && modalClose) {
        modalClose.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeModal(); });
    }

    function closeModal() {
        gsap.to('.modal-card', {
            y: 20, opacity: 0, duration: 0.2, ease: 'power2.in', onComplete: () => {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
                modalImg.src = '';
                modalPdf.src = '';
                modalImg.classList.add('hidden');
                modalPdf.classList.add('hidden');
                document.body.style.overflow = '';
            }
        });
    }

    // Load manifest and render
    console.log('Fetching certificates manifest from: images/certificates/certificates.json');

    // Try to fetch the manifest
    fetch('images/certificates/certificates.json', { 
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
    .then(r => {
        console.log('Response status:', r.status, r.statusText);
        if (!r.ok) {
            return r.text().then(text => {
                console.error('Response text:', text);
                throw new Error(`Failed to load manifest: ${r.status} ${r.statusText}`);
            });
        }
        return r.json().catch(e => {
            console.error('JSON parse error:', e);
            throw new Error('Invalid JSON format in certificates.json');
        });
    })
    .then(list => {
        if (!Array.isArray(list)) {
            console.error('Manifest is not an array:', list);
            throw new Error('certificates.json should contain an array of certificates');
        }
        console.log('Manifest loaded with', list.length, 'items');
        if (list.length === 0) {
            console.warn('No certificates found in the manifest');
        }
        return list;
    })
    .then(render)
    .catch(err => {
        console.error('Error in certificate loading:', err);
        gallery.innerHTML = `
            <div class="text-center p-8 max-w-md mx-auto">
                <div class="text-red-500 text-4xl mb-4">⚠️</div>
                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Error Loading Certificates</h3>
                <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">${err.message || 'Unknown error occurred'}</p>
                <div class="bg-gray-100 dark:bg-gray-800 p-3 rounded text-left text-xs font-mono overflow-auto max-h-40">
                    ${err.stack || 'No stack trace available'}
                </div>
                <p class="mt-4 text-xs text-gray-500">Check browser console for technical details</p>
            </div>`;
    });

    function render(items) {
        if (!items.length) {
            gallery.innerHTML = '<div class="text-center text-sm text-gray-500 dark:text-gray-400">No certificates yet. Place files in <code>images/certificates/</code> and list them in <code>certificates.json</code>.</div>';
            return;
        }
        gallery.innerHTML = items.map(buildCardHTML).join('');
        gallery.querySelectorAll('[data-action="view"]').forEach(btn => btn.addEventListener('click', onView));
    }

    function buildCardHTML(item) {
        const base = 'images/certificates/';
        const file = String(item.file || '');
        const url = base + file;
        const title = escapeHtml(item.title || file);
        const date = item.date ? new Date(item.date).toLocaleDateString() : '';
        const ext = file.split('.').pop().toLowerCase();
        const isPDF = ext === 'pdf';
        
        console.log('Building card for:', { file, url, isPDF });
        
        // Create a unique ID for this card to track loading state
        const cardId = 'card-' + Math.random().toString(36).substr(2, 9);
        
        // Determine the thumbnail content based on file type
        let thumbContent = '';
        
        if (isPDF) {
            thumbContent = `
                <div class="relative h-48 bg-gray-100 dark:bg-gray-800 rounded-t-lg flex items-center justify-center">
                    <div class="text-red-500 text-6xl">
                        <i class="fas fa-file-pdf"></i>
                    </div>
                    <span class="absolute bottom-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">PDF</span>
                </div>`;
        } else {
            thumbContent = `
                <div class="relative h-48 bg-gray-100 dark:bg-gray-800 rounded-t-lg overflow-hidden">
                    <img 
                        src="${url}" 
                        alt="${title}"
                        class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        onload="console.log('Image loaded:', '${url}'); this.parentElement.classList.add('bg-transparent')" 
                        onerror="console.error('Image failed to load:', '${url}'); this.src='https://via.placeholder.com/800x500/1F2937/FFFFFF?text=Certificate+Not+Found'"
                    >
                </div>`;
        }
        return `
        <div class="cert-item bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 border border-gray-200 dark:border-gray-700 flex flex-col h-full" 
             data-file="${escapeHtml(file)}" 
             data-title="${title}" 
             data-type="${isPDF ? 'pdf' : 'image'}">
            
            ${thumbContent}
            
            <div class="p-4 flex flex-col flex-grow">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2" title="${title}">${title}</h3>
                ${date ? `<p class="text-sm text-gray-500 dark:text-gray-400 mb-3">${date}</p>` : ''}
                
                <div class="mt-auto flex space-x-2">
                    <button class="cert-btn view flex-1 bg-blue-100 hover:bg-blue-200 text-blue-800 dark:bg-blue-900 dark:hover:bg-blue-800 dark:text-blue-100" 
                            data-action="view">
                        <i class="fas fa-eye mr-1"></i> View
                    </button>
                    <a class="cert-btn flex-1 text-center bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200" 
                       href="${url}" 
                       download>
                        <i class="fas fa-download mr-1"></i> Save
                    </a>
                </div>
            </div>
        </div>`;
    }

    function onView(e) {
        e.preventDefault();
        const card = e.currentTarget.closest('.cert-item');
        const file = card.getAttribute('data-file');
        const type = card.getAttribute('data-type');
        const title = card.getAttribute('data-title');
        const src = 'images/certificates/' + file;
        
        console.log('Viewing certificate:', { file, type, title, src });
        
        modalTitle.textContent = title || 'Certificate';
        
        // Reset modal content
        modalImg.classList.add('hidden');
        modalPdf.classList.add('hidden');
        
        if (type === 'pdf') {
            // For PDFs, use an iframe
            modalPdf.src = src + '#view=fitH';
            modalPdf.classList.remove('hidden');
            console.log('PDF source set to:', src);
        } else {
            // For images, use an img element
            modalImg.src = src;
            modalImg.classList.remove('hidden');
            console.log('Image source set to:', src);
        }
        
        // Show the modal
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.body.style.overflow = 'hidden';
        
        // Animate modal appearance
        gsap.fromTo(modal.querySelector('.bg-white, .dark\\:bg-gray-800'), 
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.25, ease: 'power2.out' }
        );
    }

    function escapeHtml(str) {
        return String(str).replace(/[&<>"]/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[s]));
    }
}
        });
    }

    // Add click handler for View Work button
    if (viewWorkBtn) {
        viewWorkBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // First try to find the projects section
            let targetSection = document.getElementById('projects') || 
                               document.getElementById('portfolio') || 
                               document.getElementById('achievements');
            
            // If no specific section found, just scroll to the next section after hero
            if (!targetSection) {
                const heroSection = document.getElementById('home');
                if (heroSection && heroSection.nextElementSibling) {
                    targetSection = heroSection.nextElementSibling;
                }
            }

            if (targetSection) {
                const targetPosition = targetSection.offsetTop - headerHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                // Update URL
                history.pushState(null, '', `#${targetSection.id}`);
            }
        });
    }
}

// Initialize scroll to explore functionality
function initializeScrollToExplore() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    const scrollArrow = document.querySelector('.scroll-arrow');
    const scrollText = document.querySelector('.scroll-text');
    
    // Function to handle scroll to next section
    function scrollToNextSection() {
        const heroSection = document.getElementById('home');
        const nextSection = document.getElementById('achievements');
        
        if (nextSection) {
            const headerHeight = document.querySelector('nav').offsetHeight;
            const nextSectionTop = nextSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
                top: nextSectionTop,
                behavior: 'smooth'
            });
        }
    }
    
    // Add click event listeners
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', scrollToNextSection);
    }
    
    if (scrollArrow) {
        scrollArrow.addEventListener('click', scrollToNextSection);
    }
    
    if (scrollText) {
        scrollText.addEventListener('click', scrollToNextSection);
    }
    
    // Add hover effect
    if (scrollArrow && scrollText) {
        scrollArrow.style.cursor = 'pointer';
        scrollText.style.cursor = 'pointer';
        
        // Add hover effect
        const scrollElements = [scrollArrow, scrollText];
        scrollElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                scrollArrow.style.color = 'var(--primary-color)';
                scrollText.style.color = 'var(--primary-color)';
            });
            
            element.addEventListener('mouseleave', () => {
                scrollArrow.style.color = 'var(--text-secondary)';
                scrollText.style.color = 'var(--text-secondary)';
            });
        });
    }
}

// Preloader Animation
function initializePreloader() {
    const preloader = document.getElementById('preloader');
    const progressBar = document.querySelector('.preloader-bar');

    // Simulate loading progress
    let progress = 0;
    const loadingInterval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(loadingInterval);

            // Animate preloader out
            gsap.to(preloader, {
                opacity: 0,
                duration: 0.5,
                ease: "power2.inOut",
                onComplete: () => {
                    preloader.style.display = 'none';
                    isLoaded = true;
                    initializeMainAnimations();
                }
            });
        }
        progressBar.style.width = progress + '%';
    }, 100);
}

// Theme Toggle with Animated Sun/Moon Morph
function initializeTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const sunIcon = document.querySelector('.theme-sun');
    const moonIcon = document.querySelector('.theme-moon');
    const root = document.documentElement;

    // Function to set theme
    function setTheme(theme) {
        // Set data-theme attribute
        root.setAttribute('data-theme', theme);
        // Set Tailwind dark class
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        // Save to localStorage
        localStorage.setItem('theme', theme);
        
        // Update icons
        if (theme === 'dark') {
            gsap.to(sunIcon, { opacity: 0, scale: 0, rotation: -180, duration: 0.3, ease: "power2.inOut" });
            gsap.to(moonIcon, { opacity: 1, scale: 1, rotation: 0, duration: 0.3, ease: "power2.inOut" });
        } else {
            gsap.to(moonIcon, { opacity: 0, scale: 0, rotation: 180, duration: 0.3, ease: "power2.inOut" });
            gsap.to(sunIcon, { opacity: 1, scale: 1, rotation: 0, duration: 0.3, ease: "power2.inOut" });
        }
        
        // Update background color
        document.body.style.backgroundColor = theme === 'dark' ? '#0f172a' : '#ffffff';
    }

    // Check for saved theme or use system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    
    // Set initial theme
    if (savedTheme) {
        setTheme(savedTheme);
    } else {
        setTheme(prefersDark ? 'dark' : 'light');
    }

    // Set initial icon states
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        gsap.set(sunIcon, { opacity: 0, scale: 0, rotation: -180 });
        gsap.set(moonIcon, { opacity: 1, scale: 1, rotation: 0 });
    } else {
        gsap.set(moonIcon, { opacity: 0, scale: 0, rotation: 180 });
        gsap.set(sunIcon, { opacity: 1, scale: 1, rotation: 0 });
    }

    // Toggle theme on button click
    themeToggle.addEventListener('click', function() {
        const currentTheme = root.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    });

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('theme')) {  // Only if user hasn't set a preference
            setTheme(e.matches ? 'dark' : 'light');
        }
    });
}

// Custom Magnetic Cursor
function initializeCustomCursor() {
    const cursorEl = document.getElementById('cursor');
    const cursorTrail = document.getElementById('cursor-trail');
    const cursorMagnetic = document.getElementById('cursor-magnetic');

    // Mouse move handler
    document.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;

        // Update cursor position
        gsap.to(cursorEl, {
            x: mouse.x - 12,
            y: mouse.y - 12,
            duration: 0.1,
            ease: "power2.out"
        });

        // Update trail position
        gsap.to(cursorTrail, {
            x: mouse.x - 24,
            y: mouse.y - 24,
            duration: 0.3,
            ease: "power2.out"
        });
    });

    // Magnetic effect for interactive elements
    const magneticElements = document.querySelectorAll('.magnetic-btn, .nav-link, .project-card, .skill-item');

    magneticElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            gsap.to(cursorEl, { scale: 2, duration: 0.3, ease: "power2.out" });
            gsap.to(cursorTrail, { scale: 1.5, duration: 0.3, ease: "power2.out" });
        });

        element.addEventListener('mouseleave', () => {
            gsap.to(cursorEl, { scale: 1, duration: 0.3, ease: "power2.out" });
            gsap.to(cursorTrail, { scale: 1, duration: 0.3, ease: "power2.out" });
        });

        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const deltaX = (e.clientX - centerX) * 0.3;
            const deltaY = (e.clientY - centerY) * 0.3;

            gsap.to(cursorMagnetic, {
                x: centerX + deltaX - 40,
                y: centerY + deltaY - 40,
                duration: 0.5,
                ease: "power2.out"
            });
        });
    });
}

// Scroll Progress Bar
function initializeScrollProgress() {
    const progressBar = document.getElementById('scroll-progress');

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;

        gsap.to(progressBar, {
            width: scrollPercent + '%',
            duration: 0.1,
            ease: "none"
        });
    });
}

// WebGL Particle System
function initializeParticleSystem() {
    const canvas = document.getElementById('particle-canvas');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Create particle geometry
    const particleCount = 1000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

        // Random colors
        const color = new THREE.Color();
        color.setHSL(Math.random() * 0.1 + 0.5, 0.7, 0.6);
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Create particle material
    const material = new THREE.PointsMaterial({
        size: 0.02,
        vertexColors: true,
        transparent: true,
        opacity: 0.6
    });

    // Create particle system
    particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);

    camera.position.z = 5;

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);

        particleSystem.rotation.x += 0.001;
        particleSystem.rotation.y += 0.002;

        renderer.render(scene, camera);
    }

    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// GSAP Animations
function initializeGSAPAnimations() {
    // Set initial states
    gsap.set('.hero-name', { opacity: 0, y: 50 });
    gsap.set('.hero-subtitle', { opacity: 0, y: 30 });
    gsap.set('.hero-description', { opacity: 0, y: 30 });
    gsap.set('.hero-actions', { opacity: 0, y: 30 });
    gsap.set('.profile-container', { opacity: 0, scale: 0.8 });
    gsap.set('.scroll-indicator', { opacity: 0, y: 20 });

    // Set section elements
    gsap.set('.section-title', { opacity: 0, y: 50 });
    gsap.set('.section-subtitle', { opacity: 0, y: 30 });
    gsap.set('.text-card', { opacity: 0, y: 30 });
    gsap.set('.skill-category', { opacity: 0, y: 50 });
    gsap.set('.timeline-item', { opacity: 0, x: -50 });
    gsap.set('.project-card', { opacity: 0, y: 50 });
    gsap.set('.contact-card', { opacity: 0, x: -30 });
}

// Main animations after preloader
function initializeMainAnimations() {
    // Hero section animations
    const heroTl = gsap.timeline();

    heroTl.to('.hero-name', { opacity: 1, y: 0, duration: 1, ease: "power3.out" })
        .to('.hero-subtitle', { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "-=0.5")
        .to('.hero-description', { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "-=0.3")
        .to('.hero-actions', { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "-=0.3")
        .to('.profile-container', { opacity: 1, scale: 1, duration: 1, ease: "back.out(1.7)" }, "-=0.8")
        .to('.scroll-indicator', { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "-=0.5");

    // Start typing animation
    startTypingAnimation();

    // Profile image parallax
    initializeProfileParallax();
}

// Typing Animation
function startTypingAnimation() {
    let currentRoleIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;

    function typeText() {
        const currentRole = roles[currentRoleIndex];
        const typingElement = document.getElementById('typing-text');

        if (isDeleting) {
            typingElement.textContent = currentRole.substring(0, currentCharIndex - 1);
            currentCharIndex--;
        } else {
            typingElement.textContent = currentRole.substring(0, currentCharIndex + 1);
            currentCharIndex++;
        }

        let typeSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && currentCharIndex === currentRole.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && currentCharIndex === 0) {
            isDeleting = false;
            currentRoleIndex = (currentRoleIndex + 1) % roles.length;
            typeSpeed = 500;
        }

        setTimeout(typeText, typeSpeed);
    }

    // Start typing after a delay
    setTimeout(typeText, 2000);
}

// Profile Image Parallax Effect
function initializeProfileParallax() {
    const profileContainer = document.querySelector('.profile-container');

    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth) - 0.5;
        const y = (e.clientY / window.innerHeight) - 0.5;

        gsap.to(profileContainer, {
            rotationY: x * 10,
            rotationX: -y * 10,
            duration: 0.5,
            ease: "power2.out"
        });
    });
}

// Navigation with Active Section Highlight
function initializeNavigation() {
    // Register ScrollTo plugin
    gsap.registerPlugin(ScrollToPlugin);

    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    const mobileMenu = document.querySelector('.mobile-menu');
    const hamburger = document.querySelector('.hamburger');
    const overlay = document.querySelector('.overlay');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');
    const headerHeight = document.querySelector('nav')?.offsetHeight || 80;

    // Smooth scroll for navigation links
    function handleNavClick(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (!targetSection) return;

        // Close mobile menu if open
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }

        // Calculate the target position with offset
        const targetPosition = targetSection.offsetTop - headerHeight;
        
        // Smooth scroll to target
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });

        // Update URL
        history.pushState(null, '', targetId);
    }

    // Desktop nav links
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavClick);
    });

    // Mobile nav links
    if (mobileLinks.length) {
        mobileLinks.forEach(link => {
            link.addEventListener('click', handleNavClick);
        });
    }

    // Mobile menu toggle
    if (hamburger && mobileMenu && overlay) {
        hamburger.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            overlay.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });
    }

    // Close mobile menu when clicking overlay
    if (overlay) {
        overlay.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // Active section detection
    function setActiveSection() {
        let current = '';
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === current) {
                link.classList.add('active');
            }
        });

        // Also update mobile nav
        mobileLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === current) {
                link.classList.add('active');
            }
        });
    }

    // Run on load and scroll
    window.addEventListener('load', setActiveSection);
    window.addEventListener('scroll', setActiveSection);
}

// Scroll-triggered Animations
function initializeScrollAnimations() {
    // Section headers
    ScrollTrigger.batch('.section-title', {
        onEnter: (elements) => {
            gsap.fromTo(elements,
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: "power3.out" }
            );
        },
        start: "top 80%"
    });

    ScrollTrigger.batch('.section-subtitle', {
        onEnter: (elements) => {
            gsap.fromTo(elements,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power2.out" }
            );
        },
        start: "top 80%"
    });

    // Text cards
    ScrollTrigger.batch('.text-card', {
        onEnter: (elements) => {
            gsap.fromTo(elements,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: "power2.out" }
            );
        },
        start: "top 80%"
    });

    // Skill categories
    ScrollTrigger.batch('.skill-category', {
        onEnter: (elements) => {
            gsap.fromTo(elements,
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 1, stagger: 0.3, ease: "power3.out" }
            );
        },
        start: "top 80%"
    });

    // Timeline items
    ScrollTrigger.batch('.timeline-item', {
        onEnter: (elements) => {
            gsap.fromTo(elements,
                { opacity: 0, x: -50 },
                { opacity: 1, x: 0, duration: 1, stagger: 0.2, ease: "power3.out" }
            );
        },
        start: "top 80%"
    });

    // Project cards
    ScrollTrigger.batch('.project-card', {
        onEnter: (elements) => {
            gsap.fromTo(elements,
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: "power3.out" }
            );
        },
        start: "top 80%"
    });

    // Contact cards
    ScrollTrigger.batch('.contact-card', {
        onEnter: (elements) => {
            gsap.fromTo(elements,
                { opacity: 0, x: -30 },
                { opacity: 1, x: 0, duration: 0.8, stagger: 0.1, ease: "power2.out" }
            );
        },
        start: "top 80%"
    });

    // Skill progress bars
    ScrollTrigger.batch('.skill-progress', {
        onEnter: (elements) => {
            elements.forEach(element => {
                const width = element.getAttribute('data-width');
                gsap.fromTo(element,
                    { width: 0 },
                    { width: width + '%', duration: 2, ease: "power2.out" }
                );
            });
        },
        start: "top 80%"
    });
}

// Radial charts animation
function initializeRadialCharts() {
    const cards = document.querySelectorAll('.radial');
    cards.forEach(card => {
        const pct = parseInt(card.getAttribute('data-percentage') || '0', 10);
        const angle = Math.round(360 * (pct / 100));
        gsap.fromTo(card, { '--angle': '0deg' }, { '--angle': angle + 'deg', duration: 1.5, ease: 'power2.out', scrollTrigger: { trigger: card, start: 'top 85%' } });
    });
}

// Swiper initializations (tools, certificates, project modal)
let toolsSwiper, certsSwiper, projectSwiper;
function initializeSwipers() {
    const toolsEl = document.querySelector('.tools-swiper');
    if (toolsEl) {
        toolsSwiper = new Swiper(toolsEl, {
            slidesPerView: 2,
            spaceBetween: 12,
            breakpoints: { 640: { slidesPerView: 3 }, 1024: { slidesPerView: 5 } },
            autoplay: { delay: 2500, disableOnInteraction: false },
            loop: true,
        });
    }
    const certsEl = document.querySelector('.certs-swiper');
    if (certsEl) {
        certsSwiper = new Swiper(certsEl, {
            slidesPerView: 1.2,
            spaceBetween: 16,
            centeredSlides: true,
            pagination: { el: certsEl.querySelector('.swiper-pagination'), clickable: true },
            breakpoints: { 768: { slidesPerView: 2.2 }, 1024: { slidesPerView: 3 } },
        });
    }
}

// Projects: filters
function initializeProjectFilters() {
    const tabs = document.querySelectorAll('.filter-tab');
    const cards = document.querySelectorAll('.project-card');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');
            const filter = tab.getAttribute('data-filter');
            cards.forEach(card => {
                const cat = card.getAttribute('data-category');
                const show = filter === 'all' || filter === cat;
                gsap.to(card, { autoAlpha: show ? 1 : 0, scale: show ? 1 : 0.95, duration: 0.3, display: show ? 'block' : 'none' });
            });
        });
    });
}

// Project Modal with gallery and video
const projectData = {
    'ai-analytics': {
        title: 'AI-Powered Analytics Platform',
        images: [
            'https://via.placeholder.com/1000x600/3B82F6/FFFFFF?text=Dashboard+1',
            'https://via.placeholder.com/1000x600/2563EB/FFFFFF?text=Model+Insights'
        ],
        video: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    'bi-dashboard': {
        title: 'Business Intelligence Dashboard',
        images: [
            'https://via.placeholder.com/1000x600/8B5CF6/FFFFFF?text=KPIs',
            'https://via.placeholder.com/1000x600/7C3AED/FFFFFF?text=Interactive+Charts'
        ],
        video: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    'ecommerce': {
        title: 'E-commerce Platform',
        images: [
            'https://via.placeholder.com/1000x600/10B981/FFFFFF?text=Storefront',
            'https://via.placeholder.com/1000x600/059669/FFFFFF?text=Checkout'
        ],
        video: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    }
};

function initializeProjectModal() {
    const modal = document.getElementById('project-modal');
    const titleEl = document.getElementById('project-modal-title');
    const closeBtn = document.getElementById('project-modal-close');
    const swiperWrapper = document.getElementById('project-swiper-wrapper');
    const videoEl = document.getElementById('project-video');
    const triggers = document.querySelectorAll('[data-open-project]');

    function openModal(key) {
        const data = projectData[key];
        if (!data) return;
        titleEl.textContent = data.title;
        swiperWrapper.innerHTML = data.images.map(src => `<div class="swiper-slide"><img src="${src}" class="w-full h-full object-cover"/></div>`).join('');
        videoEl.src = data.video;
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.body.style.overflow = 'hidden';
        // init swiper after content
        projectSwiper = new Swiper('.project-swiper', { pagination: { el: '.swiper-pagination', clickable: true }, navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' } });
        gsap.fromTo('.modal-card', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: 'power2.out' });
    }

    function closeModal() {
        gsap.to('.modal-card', {
            y: 20, opacity: 0, duration: 0.25, ease: 'power2.in', onComplete: () => {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
                videoEl.src = '';
                document.body.style.overflow = 'auto';
            }
        });
    }

    triggers.forEach(t => t.addEventListener('click', (e) => { e.preventDefault(); openModal(t.getAttribute('data-open-project')); }));
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
}

// Timeline enhancements: draw line and expandable cards
function initializeTimelineEnhancements() {
    const line = document.querySelector('.timeline-line');
    if (line) {
        gsap.fromTo(line, { scaleY: 0, transformOrigin: 'top' }, { scaleY: 1, duration: 1.5, ease: 'power3.out', scrollTrigger: { trigger: '#experience', start: 'top 75%' } });
    }
    document.querySelectorAll('.timeline-card.expandable').forEach(card => {
        card.addEventListener('click', () => toggleCard(card));
        card.addEventListener('keypress', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleCard(card); } });
    });
    function toggleCard(card) {
        const expanded = card.getAttribute('aria-expanded') === 'true';
        const more = card.querySelector('.timeline-more');
        card.setAttribute('aria-expanded', String(!expanded));
        if (more) {
            more.classList.toggle('hidden', expanded);
            gsap.fromTo(more, { height: 0, opacity: 0 }, { height: 'auto', opacity: 1, duration: 0.3, ease: 'power2.out' });
        }
    }
}

// Achievements counters
function initializeCounters() {
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target') || '0', 10);
        ScrollTrigger.create({
            trigger: counter,
            start: 'top 85%',
            once: true,
            onEnter: () => {
                let current = 0;
                const duration = 1500;
                const step = Math.max(1, Math.floor(target / (duration / 16)));
                const update = () => {
                    current += step;
                    if (current < target) { counter.textContent = current; requestAnimationFrame(update); }
                    else { counter.textContent = target + '+'; }
                };
                update();
            }
        });
    });
}

// Magnetic Elements
function initializeMagneticElements() {
    const magneticElements = document.querySelectorAll('.magnetic-btn');

    magneticElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            gsap.to(element, { scale: 1.05, duration: 0.3, ease: "power2.out" });
        });

        element.addEventListener('mouseleave', () => {
            gsap.to(element, { scale: 1, duration: 0.3, ease: "power2.out" });
        });

        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const deltaX = (e.clientX - centerX) * 0.1;
            const deltaY = (e.clientY - centerY) * 0.1;

            gsap.to(element, {
                x: deltaX,
                y: deltaY,
                duration: 0.3,
                ease: "power2.out"
            });
        });

        element.addEventListener('mouseleave', () => {
            gsap.to(element, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
        });
    });
}

// Contact Form with Ripple Effect
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    const rippleButtons = document.querySelectorAll('.btn-primary, .btn-secondary');

    // Ripple effect
    rippleButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            const ripple = button.querySelector('.btn-ripple');
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';

            gsap.fromTo(ripple,
                { scale: 0, opacity: 1 },
                { scale: 4, opacity: 0, duration: 0.6, ease: "power2.out" }
            );
        });
    });

    // Form submission with validation + shake
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const required = contactForm.querySelectorAll('#name, #email, #subject, #message');
        let hasError = false;
        required.forEach(input => {
            if (!input.value.trim()) {
                hasError = true;
                input.classList.add('shake');
                setTimeout(() => input.classList.remove('shake'), 500);
            }
        });
        if (hasError) return;

        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.querySelector('.btn-text').textContent;

        // Animate button
        gsap.to(submitButton, { scale: 0.95, duration: 0.1 });
        gsap.to(submitButton, { scale: 1, duration: 0.1, delay: 0.1 });

        submitButton.querySelector('.btn-text').textContent = 'Sending...';
        submitButton.disabled = true;

        // Simulate form submission
        setTimeout(() => {
            submitButton.querySelector('.btn-text').textContent = originalText;
            submitButton.disabled = false;

            // Show success animation
            showSuccessAnimation();
            if (window.showSuccessLottie) window.showSuccessLottie();
        }, 2000);
    });
}

// Success Animation
function showSuccessAnimation() {
    // Create success modal
    const successModal = document.createElement('div');
    successModal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center';
    successModal.innerHTML = `
        <div class="bg-white dark:bg-gray-900 rounded-lg p-8 text-center max-w-md mx-4">
            <div class="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <i class="fas fa-check text-2xl text-white"></i>
            </div>
            <h3 class="text-2xl font-bold mb-2">Message Sent!</h3>
            <p class="text-gray-600 dark:text-gray-300 mb-6">Thank you for reaching out. I'll get back to you soon!</p>
            <button class="btn-primary" onclick="this.parentElement.parentElement.remove()">Close</button>
        </div>
    `;

    document.body.appendChild(successModal);

    // Animate in
    gsap.fromTo(successModal,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" }
    );
}

// Lottie Animations
function initializeLottieAnimations() {
    // Add Lottie animations for micro-interactions
    const lottieContainer = document.getElementById('lottie-container');

    // Create success animation
    const successAnimation = document.createElement('lottie-player');
    successAnimation.setAttribute('src', 'https://assets5.lottiefiles.com/packages/lf20_jcikwtux.json');
    successAnimation.setAttribute('background', 'transparent');
    successAnimation.setAttribute('speed', '1');
    successAnimation.setAttribute('style', 'width: 100px; height: 100px; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); opacity: 0;');

    lottieContainer.appendChild(successAnimation);

    // Show success animation when form is submitted
    window.showSuccessLottie = function () {
        gsap.to(successAnimation, { opacity: 1, duration: 0.3 });
        successAnimation.play();

        setTimeout(() => {
            gsap.to(successAnimation, { opacity: 0, duration: 0.3 });
        }, 3000);
    };
}

// Smooth scrolling for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            gsap.to(window, {
                duration: 1,
                scrollTo: { y: target, offsetY: 80 },
                ease: "power2.inOut"
            });
        }
    });
});

// Performance optimization
function throttle(func, limit) {
    let inThrottle;
    return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Apply throttling to scroll events
window.addEventListener('scroll', throttle(function () {
    // Scroll progress is already handled above
}, 16));

// Preload critical images
function preloadImages() {
    const imageUrls = [
        'https://via.placeholder.com/300x300/3B82F6/FFFFFF?text=AH',
        'https://via.placeholder.com/400x400/3B82F6/FFFFFF?text=AH'
    ];

    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

preloadImages();

// Initialize everything when page loads
window.addEventListener('load', function () {
    if (isLoaded) {
        initializeMainAnimations();
    }
    // Reveal page after theme is applied
    document.documentElement.style.visibility = 'visible';
});

// Handle window resize
window.addEventListener('resize', throttle(function () {
    // Recalculate ScrollTrigger
    ScrollTrigger.refresh();
}, 250));
