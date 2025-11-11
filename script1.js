// Enhanced Custom Cursor
let cursor = null;
let cursorFollower = null;
let mouseX = 0;
let mouseY = 0;
let followerX = 0;
let followerY = 0;

// Initialize cursor when DOM is ready
function initCustomCursor() {
    cursor = document.querySelector('.cursor');
    cursorFollower = document.querySelector('.cursor-follower');

    // Check if cursor elements exist
    if (!cursor || !cursorFollower) {
        console.warn('Cursor elements not found');
        return;
    }

    // Select all interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .nav-link, .cta-button, .mobile-menu-btn, .hero-btn, .hover-target, .stat-item, .profile-image, .project-link, .social-icon, .form-submit-btn');

    // Check if device supports hover (not touch device)
    const supportsHover = window.matchMedia('(hover: hover)').matches;
    const isDesktop = window.innerWidth > 768;

    // Cursor movement and animation
    if (supportsHover && isDesktop) {
        // Show cursor elements
        cursor.style.opacity = '1';
        cursorFollower.style.opacity = '1';

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Update cursor position
            if (cursor) {
                cursor.style.left = mouseX + 'px';
                cursor.style.top = mouseY + 'px';
            }
        });

        // Smooth follower animation
        function animateFollower() {
            if (cursorFollower) {
                followerX += (mouseX - followerX) * 0.1;
                followerY += (mouseY - followerY) * 0.1;

                cursorFollower.style.left = followerX + 'px';
                cursorFollower.style.top = followerY + 'px';
            }
            requestAnimationFrame(animateFollower);
        }
        animateFollower();

        // Hover effects for interactive elements
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                if (cursor) cursor.classList.add('hover');
                if (cursorFollower) cursorFollower.classList.add('hover');
            });

            element.addEventListener('mouseleave', () => {
                if (cursor) cursor.classList.remove('hover');
                if (cursorFollower) cursorFollower.classList.remove('hover');
            });
        });
    } else {
        // Hide cursor on touch devices
        if (cursor) cursor.style.display = 'none';
        if (cursorFollower) cursorFollower.style.display = 'none';
    }
}

// Typewriter Effect
class TypewriterEffect {
    constructor() {
this.roles = [
    { text: "Data Analyst", description: "Transforming data into actionable insights using Python, SQL, and visualization tools." },
    { text: "DSA & Problem Solving Enthusiast", description: "Sharpening logic and algorithms to write efficient, optimized solutions." },
    { text: "Power BI Developer", description: "Designing interactive dashboards and visual reports for data-driven decision-making." },
    { text: "Frontend Developer (Beginner)", description: "Building simple, functional web applications using HTML, CSS, JavaScript, and Node.js." },
    { text: "AI&ML Tools Enthusiast", description: "Exploring AI tools, crafting prompts, and integrating APIs for practical solutions." }
];
        this.currentRoleIndex = 0;
        this.currentText = '';
        this.isDeleting = false;
        this.typeSpeed = 100;
        this.deleteSpeed = 50;
        this.pauseTime = 2000;
        this.init();
    }

    init() {
        this.textElement = document.getElementById('typewriter-text');
        this.descriptionElement = document.getElementById('typewriter-description');
        this.type();
    }

    type() {
        const currentRole = this.roles[this.currentRoleIndex];
        const targetText = currentRole.text;

        if (this.isDeleting) {
            this.currentText = targetText.substring(0, this.currentText.length - 1);
        } else {
            this.currentText = targetText.substring(0, this.currentText.length + 1);
        }

        this.textElement.textContent = this.currentText;

        let typeSpeedCurrent = this.isDeleting ? this.deleteSpeed : this.typeSpeed;

        if (!this.isDeleting && this.currentText === targetText) {
            // Finished typing, show description
            this.descriptionElement.style.opacity = '1';
            this.descriptionElement.textContent = currentRole.description;
            typeSpeedCurrent = this.pauseTime;
            this.isDeleting = true;
        } else if (this.isDeleting && this.currentText === '') {
            // Finished deleting, move to next role
            this.isDeleting = false;
            this.currentRoleIndex = (this.currentRoleIndex + 1) % this.roles.length;
            this.descriptionElement.style.opacity = '0';
            typeSpeedCurrent = 500;
        }

        setTimeout(() => this.type(), typeSpeedCurrent);
    }
}
class PortfolioChatbot {
    constructor() {
        this.messages = [];
        this.isTyping = false;
        this.isListening = false;
        this.isMinimized = false;
        this.isDark = false;
        this.recognition = null;

        this.initElements();
        this.initEventListeners();
        this.initSpeechRecognition();
        this.showWelcomeMessage();
    }

    // ---------- Initialization ----------
    initElements() {
        this.chatButton = document.getElementById('chatButton');
        this.chatContainer = document.getElementById('chatContainer');
        this.messagesContainer = document.getElementById('messagesContainer');
        this.inputField = document.getElementById('inputField');
        this.sendBtn = document.getElementById('sendBtn');
        this.micBtn = document.getElementById('micBtn');
        this.closeBtn = document.getElementById('closeBtn');
        this.minimizeBtn = document.getElementById('minimizeBtn');
        this.themeToggle = document.getElementById('themeToggle');
        this.quickReplies = document.getElementById('quickReplies');
        this.chatHeader = document.getElementById('chatHeader');
        this.inputArea = document.getElementById('inputArea');
    }

    initEventListeners() {
        this.chatButton.onclick = () => this.openChat();
        this.closeBtn.onclick = () => this.closeChat();
        this.minimizeBtn.onclick = () => this.toggleMinimize();
        this.themeToggle.onclick = () => this.toggleTheme();
        this.sendBtn.onclick = () => this.handleSend();
        this.micBtn.onclick = () => this.handleVoiceInput();
        this.inputField.addEventListener('keypress', e => e.key === 'Enter' && this.handleSend());
        this.quickReplies.addEventListener('click', e => {
            const btn = e.target.closest('.quick-reply-btn');
            if (btn) this.handleQuickReply(btn.dataset.action);
        });
    }

    initSpeechRecognition() {
        if ('webkitSpeechRecognition' in window) {
            this.recognition = new webkitSpeechRecognition();
            this.recognition.lang = 'en-US';
            this.recognition.onresult = e => {
                this.inputField.value = e.results[0][0].transcript;
                this.setListening(false);
            };
            this.recognition.onerror = () => this.setListening(false);
        }
    }

    // ---------- Chat Window ----------
    openChat() {
        this.chatContainer.classList.add('show');
        this.chatButton.style.display = 'none';
    }

    closeChat() {
        this.chatContainer.classList.remove('show');
        this.chatButton.style.display = 'flex';
    }

    toggleMinimize() {
        this.isMinimized = !this.isMinimized;
        this.chatContainer.classList.toggle('minimized', this.isMinimized);
        this.minimizeBtn.innerHTML = this.isMinimized
            ? '<i class="fas fa-plus"></i>'
            : '<i class="fas fa-minus"></i>';
    }

    toggleTheme() {
        this.isDark = !this.isDark;
        const toggleTargets = [
            this.chatContainer, this.chatHeader, this.messagesContainer,
            this.quickReplies, this.inputArea, this.inputField
        ];
        toggleTargets.forEach(el => el.classList.toggle('dark', this.isDark));

        document.querySelectorAll('.message-content, .quick-reply-btn')
            .forEach(el => el.classList.toggle('dark', this.isDark));

        this.themeToggle.innerHTML = this.isDark
            ? '<i class="fas fa-moon"></i>'
            : '<i class="fas fa-sun"></i>';
    }

    // ---------- Messaging ----------
    addMessage(text, sender) {
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const msg = document.createElement('div');
        msg.className = `message ${sender}`;

        msg.innerHTML = sender === 'bot'
            ? `
                <div class="bot-avatar"><i class="fas fa-robot"></i></div>
                <div class="message-content ${this.isDark ? 'dark' : ''}">
                    ${text}
                    <div class="message-time">${time}</div>
                </div>`
            : `
                <div class="message-content">
                    ${text}
                    <div class="message-time">${time}</div>
                </div>`;

        this.messagesContainer.appendChild(msg);
        this.scrollToBottom();
    }

    showTypingIndicator() {
        const typing = document.createElement('div');
        typing.className = 'message bot';
        typing.id = 'typing-indicator';
        typing.innerHTML = `
            <div class="bot-avatar"><i class="fas fa-robot"></i></div>
            <div class="typing-indicator ${this.isDark ? 'dark' : ''}">
                <div class="dot"></div><div class="dot"></div><div class="dot"></div>
            </div>`;
        this.messagesContainer.appendChild(typing);
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        const el = document.getElementById('typing-indicator');
        if (el) el.remove();
    }

    async typeMessage(text, sender) {
        this.isTyping = true;
        this.showTypingIndicator();
        await new Promise(r => setTimeout(r, 600 + Math.random() * 800));
        this.hideTypingIndicator();
        this.addMessage(text, sender);
        this.isTyping = false;
    }

    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    // ---------- Input Handling ----------
    async handleSend() {
        const text = this.inputField.value.trim();
        if (!text || this.isTyping) return;
        this.addMessage(text, 'user');
        this.inputField.value = '';
        await this.processMessage(text);
    }

    handleVoiceInput() {
        if (this.recognition && !this.isListening) {
            this.setListening(true);
            this.recognition.start();
        }
    }

    setListening(active) {
        this.isListening = active;
        this.micBtn.classList.toggle('listening', active);
        this.micBtn.innerHTML = active
            ? '<i class="fas fa-microphone-slash"></i>'
            : '<i class="fas fa-microphone"></i>';
    }

    async handleQuickReply(action) {
        const replies = {
            bio: "Tell me about Arnav",
            projects: "Show me Arnav's projects",
            leetcode: "Tell me about Arnav's LeetCode progress",
            skills: "What are Arnav's technical skills?",
            goals: "What are Arnav's career goals?",
            experience: "Tell me about Arnav's experience",
            education: "Where did Arnav study?",
            certifications: "Show Arnav's certifications"
        };
        const text = replies[action];
        if (text) {
            this.addMessage(text, 'user');
            await this.processMessage(text);
        }
    }

    // ---------- Message Logic ----------
    async processMessage(input) {
        const q = input.toLowerCase();
        // canonical info from your resume
        const data = {
            name: "Arnav Tomar",
            location: "Modinagar, India",
            email: "arnavtomar1812007@gmail.com",
            linkedin: "linkedin.com/in/arnavtomar18",
            github: "github.com/sea-of-codes",
            summary: `I am a second-year B.Tech Data Science student at SRMIST, Delhi NCR, passionate about Artificial Intelligence and data-driven technologies. I enjoy exploring real-world datasets, applying machine learning techniques, and developing intelligent solutions to solve meaningful, practical problems.`,
            skills: [
                "Python", "NumPy", "Pandas", "Matplotlib",
                "MySQL", "Data Analysis & Visualization", "Data Scraping",
                "Sentiment Analysis", "Machine Learning (Seaborn, Scikit-learn)",
                "C", "C++"
            ],
            experience: `Data Analyst Intern – Ashna AI (ScholarRankAI HQ & Remote) Apr 2025 – Jul 2025.
• Collected, cleaned, and analyzed data for the ScholarRankAI project.
• Created visual reports and dashboards using Python and Matplotlib.
• Derived insights from structured and unstructured datasets.`,
            education: `SRM Institute of Science and Technology (SRMIST), Delhi NCR — B.Tech (CSE, Data Science) Aug 2024 – May 2028.
Current Year: Second Year (3rd Semester). CGPA: 9.3 (First Year).
Sardar Patel Public School, Misrod, Bhopal — Higher Secondary (10+2), CBSE.`,
            projects: [
                {
                    title: "Kaggle Dataset – Best Games of All Time",
                    desc: "Compiled dataset of top-rated video games with release year, genre, platform, critic score, and sales.",
                    link: "https://kaggle.com/datasets/arnavtomar18/best-games-of-all-time"
                },
                {
                    title: "Twitter Sentiment Analysis",
                    desc: "Built a sentiment analysis pipeline to classify comments as Positive, Negative, or Neutral using Python and NLP.",
                    link: "https://github.com/sea-of-codes/Sentiment_analysis"
                }
            ],
            hackathons: [
                "Microsoft Noida Hackathon Pre-Event — Chandigarh University (Oct 2025)",
                "OpenAI NextWave Hackathon (Online) — Sep 2025",
                "Genignite 24-Hour Hackathon — Inderprastha Engineering College (Oct 2025) — Team Tech Catalysts"
            ],
            certifications: [
                "Oracle Data Science Professional Certificate — Oct 2025",
                "Deloitte Australia – Data Analytics Job Simulation (Forage) — Aug 2025",
                "Python Case Study – Sentiment Analysis (Infosys Springboard) — Jun 2025",
                "NLP: Twitter Sentiment Analysis (Coursera)"
            ],
            leetcodeCount: "Multiple Questions Solved",
            goal: "Become a Data Scientist"
        };

        // intent matching
        const contains = (arr) => arr.some(w => q.includes(w));
        let reply = null;

        if (contains(["who are you", "who is arnav", "tell me about arnav", "about arnav", "bio", "about"])) {
            reply = `<strong>${data.name}</strong> — ${data.summary}<br><br>📍 ${data.location} • ✉️ ${data.email} • 🔗 ${data.linkedin} • 💻 ${data.github}`;
        } else if (contains(["skills", "skill", "tech stack", "technologies"])) {
            reply = `<strong>Skills</strong>: ${data.skills.join(", ")}.`;
        } else if (contains(["experience", "intern", "ashna", "work"])) {
            reply = `<strong>Experience</strong>:<br>${data.experience}`;
        } else if (contains(["education", "study", "college", "srmist"])) {
            reply = `<strong>Education</strong>:<br>${data.education}`;
        } else if (contains(["project", "projects", "kaggle", "sentiment"])) {
            const list = data.projects.map(p => `• <strong>${p.title}</strong>: ${p.desc} ${p.link ? `<br><a href="${p.link}" target="_blank">View</a>` : ""}`).join("<br><br>");
            reply = `<strong>Projects & Research</strong>:<br>${list}`;
        } else if (contains(["hackathon", "hackathons", "event"])) {
            reply = `<strong>Hackathons & Events</strong>:<br>• ${data.hackathons.join("<br>• ")}`;
        } else if (contains(["certification", "certifications"])) {
            reply = `<strong>Certifications</strong>:<br>• ${data.certifications.join("<br>• ")}`;
        } else if (contains(["leetcode", "dsa", "problems", "coding"] )) {
            reply = `✅ <strong>LeetCode Progress</strong>: Arnav has solved <strong>${data.leetcodeCount}</strong> LeetCode problems and is actively preparing for a Data Scientist role.`;
        } else if (contains(["goal", "career", "aspire", "want to be", "become"])) {
            reply = `<strong>Career Goal</strong>: ${data.goal}. Focus: data science, ML, and building production-ready models.`;
        } else if (contains(["contact", "email", "reach", "connect"])) {
            reply = `You can contact Arnav at ✉️ <strong>${data.email}</strong> or connect on LinkedIn: <a href="https://${data.linkedin}" target="_blank">${data.linkedin}</a>.`;
        } else if (q.length < 4) {
            reply = "Can you please type a bit more? Ask me about Arnav's skills, projects, education, internships, or LeetCode progress.";
        } else {
            // fallback: helpful suggestions + default info
            reply = `I'm Arnav's assistant — I can share his Summary, Skills, Experience, Projects, Hackathons, Certifications, or LeetCode progress.<br><br>
Try: "Tell me about Arnav", "Show projects", "How many LeetCode problems?", "Education", "Certifications".`;
        }

        // respond
        await this.typeMessage(reply, 'bot');
    }

    // ---------- Welcome ----------
    showWelcomeMessage() {
        setTimeout(() => {
            const text = `👋 Hi! I'm Arnav's assistant. I'm here to help with details about his Data Science journey — summary, skills, projects, internships, certifications, and LeetCode progress (50 problems). Ask me anything!`;
            this.addMessage(text, 'bot');
        }, 700);
    }
}


// Initialize typewriter effect
const typewriter = new TypewriterEffect();

// Navigation Functions
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    mobileMenu.classList.toggle('active');
}

function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    mobileMenu.classList.remove('active');
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetID = this.getAttribute('href');
        const target = document.querySelector(targetID);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            if (typeof closeMobileMenu === 'function') {
                closeMobileMenu();
            }
        }
        // If target doesn't exist, do nothing – let it behave normally
    });
});

// Fade-in on scroll using Intersection Observer
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
            observer.unobserve(entry.target); // Run only once
        }
    });
}, {
    threshold: 0.1
});

// Target all fade-in eligible elements
document.querySelectorAll(
    '.stat-item, .timeline-item, .project-card, .skill-category, .service-card, .stats-grid, .about-text, .section-header, .my-custom-class, .testimonial-card, .contact-info, .footer-section'
).forEach(el => {
    observer.observe(el);
});

// Smooth scrolling to sections
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth'
        });
    }

    // Close mobile menu if open
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
    }
}

function toggleTheme() {
    const body = document.body;
    const root = document.documentElement;
    const themeToggle = document.querySelector('.theme-toggle');
    
    if (body.classList.contains('light')) {
        body.classList.remove('light');
        root.classList.remove('light');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        localStorage.setItem('theme', 'dark');
    } else {
        body.classList.add('light');
        root.classList.add('light');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        localStorage.setItem('theme', 'light');
    }
}

// Load saved theme
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light');
        document.documentElement.classList.add('light');
        document.querySelector('.theme-toggle').innerHTML = '<i class="fas fa-sun"></i>';
    }
});

// Active navigation link highlighting
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}


// Scroll event listener
window.addEventListener('scroll', updateActiveNavLink);

// Navbar background on scroll
function updateNavbarBackground() {
    const navbar = document.querySelector('.navbar');

    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(15, 23, 42, 0.4)';
    } else {
        navbar.style.background = 'rgba(15, 23, 42, 0.45)';
    }
}

// Tooltip functionality
function showTooltip(element, text) {
    const tooltip = document.getElementById('tooltip');
    const rect = element.getBoundingClientRect();

    tooltip.textContent = text;
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
    tooltip.classList.add('show');
}

function hideTooltip() {
    const tooltip = document.getElementById('tooltip');
    tooltip.classList.remove('show');
}

// Initialize tooltips
function initializeTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');

    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            showTooltip(element, element.getAttribute('data-tooltip'));
        });

        element.addEventListener('mouseleave', hideTooltip);
    });
}

// Stats Animation
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');

    statNumbers.forEach(stat => {
        const target = parseInt(stat.textContent);
        const increment = target / 100;
        let current = 0;

        const updateStat = () => {
            if (current < target) {
                current += increment;
                stat.textContent = Math.floor(current) + (stat.textContent.includes('%') ? '%' : '+');
                requestAnimationFrame(updateStat);
            } else {
                stat.textContent = target + (stat.textContent.includes('%') ? '%' : '+');
            }
        };

        updateStat();
    });
}


// Close mobile menu when clicking outside
function closeMobileMenuOnClickOutside(event) {
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');

    if (mobileMenu.classList.contains('active')) {
        if (!mobileMenu.contains(event.target) && !mobileMenuBtn.contains(event.target)) {
            mobileMenu.classList.remove('active');
        }
    }
}

// Close mobile menu when clicking on navigation links
function closeMobileMenuOnLinkClick() {
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            const mobileMenu = document.getElementById('mobileMenu');
            mobileMenu.classList.remove('active');
        });
    });
}

// Typing effect for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';

    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

// Initialize typing effect
function initializeTypingEffect() {
    const heroTitle = document.querySelector('.hero-subtitle');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        typeWriter(heroTitle, originalText, 50);
    }
}

// Smooth scroll for anchor links
function initializeSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Observe elements for animation
document.querySelectorAll('.stats-grid, .about-text, .section-header').forEach(el => {
    observer.observe(el);
});

// Parallax effect for hero background
function handleParallaxEffect() {
    const heroBackground = document.querySelector('.hero-background');
    if (heroBackground) {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        heroBackground.style.transform = `translateY(${rate}px)`;
    }
}

// Navbar background opacity on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const scrolled = window.pageYOffset;

    if (scrolled > 50) {
        navbar.style.background = 'rgba(15, 23, 42, 0.2)';
    } else {
        navbar.style.background = 'rgba(15, 23, 42, 0.3)';
    }
});


// Enhanced form validation
function validateForm() {
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    let isValid = true;

    // Reset previous error states
    [name, email, message].forEach(field => {
        field.style.borderColor = '';
    });

    if (!name.value.trim()) {
        name.style.borderColor = '#ef4444';
        isValid = false;
    }

    if (!email.value.trim() || !emailRegex.test(email.value)) {
        email.style.borderColor = '#ef4444';
        isValid = false;
    }

    if (!message.value.trim()) {
        message.style.borderColor = '#ef4444';
        isValid = false;
    }

    return isValid;
}
// Performance optimization - throttle scroll events
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

const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Apply throttling to scroll events
window.addEventListener('scroll', throttle(() => {
    updateActiveNavLink();
}, 100));


// Add loading animation to project links
function addProjectLinkAnimations() {
    const projectLinks = document.querySelectorAll('.project-link');

    projectLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // stop normal link

            const icon = link.querySelector('i');
            const originalClass = icon.className;

            // Show spinner
            icon.className = 'fas fa-spinner fa-spin';

            // After delay, go to link
            setTimeout(() => {
                icon.className = originalClass;
                window.open(link.href, '_blank'); // ✅ Open link in new tab
            }, 800); // slight delay feels responsive
        });
    });
}


// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Initialize cursor first
    initCustomCursor();

    // Initialize all features
    initializeTooltips();
    initializeSmoothScroll();
    closeMobileMenuOnLinkClick();
    addProjectLinkAnimations();

    // Initialize typing effect after a short delay
    setTimeout(initializeTypingEffect, 500);

    // Add event listeners
    document.addEventListener('click', closeMobileMenuOnClickOutside);

    // Scroll event listeners
    window.addEventListener('scroll', () => {
        updateActiveNavLink();
        updateNavbarBackground();
        handleScrollAnimations();
        handleParallaxEffect();
    });

    // Initial calls
    updateActiveNavLink();
    updateNavbarBackground();
    handleScrollAnimations();


    // Add loading animation
    document.body.classList.add('loaded');

    // Initialize any additional features
    console.log('Portfolio website initialized successfully!');

    // Preload hero image
    const heroImage = document.querySelector('.profile-image');
    if (heroImage) {
        heroImage.addEventListener('load', () => {
            heroImage.style.opacity = '1';
        });
    }
});

// Handle scroll animations
function handleScrollAnimations() {
    // This function is called on scroll to trigger any scroll-based animations
    // Currently handled by IntersectionObserver, but kept for compatibility
}

// Handle window resize
window.addEventListener('resize', () => {
    // Close mobile menu on resize
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu && mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
    }

    // Recalculate tooltip positions
    hideTooltip();
});

// Add intersection observer for better performance
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};


// Observe elements after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // 👁️ Start observing animated elements
    const observeElements = document.querySelectorAll('.stat-item, .timeline-item, .project-card, .skill-category, .service-card');
    observeElements.forEach(el => observer.observe(el));

    // 🤖 Initialize the chatbot
    new PortfolioChatbot();
});


// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    // Close mobile menu with Escape key
    if (e.key === 'Escape') {
        const mobileMenu = document.getElementById('mobileMenu');
        if (mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
        }
        hideTooltip();
    }
});

// Console welcome message
console.log('%c👋 Welcome to Arnav Sharma\'s Portfolio!', 'color: #3b82f6; font-size: 16px; font-weight: bold;');
console.log('%cInterested in the code? Check out the source on GitHub!', 'color: #64748b; font-size: 14px;');