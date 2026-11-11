/**
 * MD. NAZIBUL ISLAM NAZIB — PORTFOLIO CORE SCRIPTS
 * Includes Interactive IDE Codebase Viewer, Clipboard Support, and Form Handling
 */

document.addEventListener('DOMContentLoaded', () => {

    // ===== 1. MOBILE NAVIGATION TOGGLE =====
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }

    // ===== 2. NAVBAR SCROLL EFFECT & ACTIVE LINK HIGHLIGHT =====
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY;

        // Navbar shadow
        if (navbar) {
            if (scrollPos > 30) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        // Active link highlighting
        const triggerPos = scrollPos + 120;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (triggerPos >= top && triggerPos < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });

        // Back to top visibility
        const backToTop = document.getElementById('backToTop');
        if (backToTop) {
            if (scrollPos > 400) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }
    }, { passive: true });

    // Back to top click
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ===== 3. PRINT RESUME ACTION =====
    const printBtn = document.getElementById('printResumeBtn');
    if (printBtn) {
        printBtn.addEventListener('click', () => {
            window.print();
        });
    }

    // ===== 4. COPY TO CLIPBOARD BUTTONS =====
    const copyBtns = document.querySelectorAll('.copy-btn');
    copyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const textToCopy = btn.getAttribute('data-clipboard');
            if (textToCopy) {
                navigator.clipboard.writeText(textToCopy).then(() => {
                    showToast(`Copied to clipboard: ${textToCopy}`, 'success');
                    const icon = btn.querySelector('i');
                    if (icon) {
                        icon.className = 'fas fa-check text-accent';
                        setTimeout(() => {
                            icon.className = 'far fa-copy';
                        }, 2000);
                    }
                }).catch(() => {
                    showToast('Failed to copy to clipboard', 'error');
                });
            }
        });
    });

    // ===== 5. CONTACT FORM HANDLING =====
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            // If running on Netlify with backend, allow native POST
            // But provide instant client-side feedback
            const isNetlify = window.location.hostname.includes('netlify.app') || window.location.protocol.startsWith('http');
            
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!name || !email || !message) {
                e.preventDefault();
                showToast('Please fill out all required fields.', 'error');
                return;
            }

            const submitBtn = document.getElementById('submitBtn');
            if (submitBtn) {
                const originalHtml = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                submitBtn.disabled = true;

                if (!isNetlify) {
                    // Local / file preview simulation
                    e.preventDefault();
                    setTimeout(() => {
                        showToast(`Thank you, ${name}! Your message has been sent.`, 'success');
                        contactForm.reset();
                        submitBtn.innerHTML = originalHtml;
                        submitBtn.disabled = false;
                    }, 1200);
                }
            }
        });
    }

    // ===== 6. TOAST NOTIFICATION UTILITY =====
    function showToast(message, type = 'info') {
        const existing = document.querySelector('.custom-toast-msg');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = `custom-toast-msg toast-${type}`;
        toast.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        `;

        Object.assign(toast.style, {
            position: 'fixed',
            bottom: '2.5rem',
            left: '50%',
            transform: 'translateX(-50%) translateY(20px)',
            background: type === 'success' ? '#0f172a' : '#1e293b',
            color: '#ffffff',
            border: `1px solid ${type === 'success' ? '#10b981' : '#3b82f6'}`,
            padding: '0.85rem 1.4rem',
            borderRadius: '9999px',
            fontSize: '0.88rem',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            zIndex: '99999',
            opacity: '0',
            transition: 'all 0.3s ease',
            pointerEvents: 'none'
        });

        document.body.appendChild(toast);

        requestAnimationFrame(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(-50%) translateY(0)';
        });

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-50%) translateY(20px)';
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    }

    // ===== 7. BUILT-IN INTERACTIVE IDE CODEBASE MODAL =====
    // Supports the user's explicit request: "i want too see the entire codebase like an IDE, where is the option"
    const ideModal = document.getElementById('ideModal');
    const openIdeBtns = [
        document.getElementById('openIdeBtnTop'),
        document.getElementById('openIdeBtnNav'),
        document.getElementById('openIdeBtnFooter'),
        document.getElementById('floatingIdeBtn')
    ].filter(Boolean);

    const ideCloseBtns = [
        document.getElementById('ideCloseBtn'),
        document.getElementById('ideCloseBtn2')
    ].filter(Boolean);

    const fileTreeItems = document.querySelectorAll('.ide-file-tree .file-item');
    const tabFileName = document.getElementById('tabFileName');
    const ideCodeDisplay = document.getElementById('ideCodeDisplay');
    const fileLineCount = document.getElementById('fileLineCount');
    const copyCodeBtn = document.getElementById('copyCodeBtn');

    // Code cache for all workspace files
    const workspaceCodeFiles = {
        'index.html': `<!-- MD. NAZIBUL ISLAM NAZIB — PORTFOLIO HTML -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Md. Nazibul Islam Nazib | BBA Student · Finance & Business Analytics</title>
    <!-- View full file in d:\\portfolio\\index.html -->
</head>
<body>
    <!-- Complete professional portfolio structure:
         1. Header & Hero (Md. Nazibul Islam Nazib, 2nd Year BBA, IUB)
         2. Profile & Career Direction ("Business Analytics, grounded in Finance")
         3. Professional Summary (Academic capability & structured analysis)
         4. Education (BBA at Independent University, Bangladesh)
         5. Tools & Skills (Excel, PowerPoint, Power BI, Finance & Analytics)
         6. Bangladesh Market Case Studies (Personal Finance, Retail Dashboard, Listed Company Analysis, Business Budget)
         7. Development Focus (Excel modeling, Power BI dashboards, precision communication)
         8. Contact & Netlify Forms (inazib51@gmail.com | 01603886526 | Bashundhara R/A)
    -->
</body>
</html>`,
        'css/style.css': `/* MD. NAZIBUL ISLAM NAZIB — PORTFOLIO CSS */
:root {
    --navy-950: #0a1128;
    --navy-900: #0f1c3f;
    --blue-500: #2563eb;
    --gold-500: #d97706;
    --bg-main: #ffffff;
    --bg-alt: #f8fafc;
    --font-sans: 'Plus Jakarta Sans', sans-serif;
    --font-heading: 'Space Grotesk', sans-serif;
    --font-mono: 'JetBrains Mono', monospace;
}

/* Complete styling rules including:
   - Modern corporate typography & color schemes
   - Responsive grid layouts (desktop, tablet, mobile)
   - Interactive IDE modal dark theme
   - Resume print mode (@media print)
   - Netlify & accessible form controls
*/`,
        'js/main.js': `// MD. NAZIBUL ISLAM NAZIB — PORTFOLIO SCRIPTS
document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile menu navigation
    // 2. Active section detection & navbar scroll behavior
    // 3. Print resume shortcut
    // 4. One-click copy for email (inazib51@gmail.com) and phone (01603886526)
    // 5. Netlify Form submission & feedback
    // 6. Interactive split-pane IDE codebase explorer
});`,
        'netlify.toml': `# Netlify configuration for MD. Nazibul Islam Nazib's Portfolio

[build]
  publish = "."

[[redirects]]
  from = "/index.html"
  to = "/"
  status = 301

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "/css/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/js/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"`
    };

    let activeFileName = 'index.html';

    function loadFileContent(fileName) {
        activeFileName = fileName;
        if (tabFileName) tabFileName.textContent = fileName;

        // Try to fetch real file if on HTTP server
        if (window.location.protocol.startsWith('http')) {
            fetch(fileName)
                .then(res => res.text())
                .then(text => {
                    displayCode(text);
                })
                .catch(() => {
                    displayCode(workspaceCodeFiles[fileName] || '// File empty or loading failed');
                });
        } else {
            // Local file mode: if index.html, grab outerHTML directly!
            if (fileName === 'index.html') {
                displayCode(document.documentElement.outerHTML);
            } else {
                displayCode(workspaceCodeFiles[fileName] || '// Select a file from the workspace');
            }
        }
    }

    function displayCode(codeText) {
        if (!ideCodeDisplay) return;
        ideCodeDisplay.textContent = codeText;
        const lines = codeText.split('\n').length;
        if (fileLineCount) {
            fileLineCount.textContent = `Lines: ${lines}`;
        }
    }

    // Open IDE Modal
    openIdeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (ideModal) {
                ideModal.classList.add('active');
                ideModal.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden';
                loadFileContent(activeFileName);
            }
        });
    });

    // Close IDE Modal
    function closeIde() {
        if (ideModal) {
            ideModal.classList.remove('active');
            ideModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
    }

    ideCloseBtns.forEach(btn => {
        btn.addEventListener('click', closeIde);
    });

    if (ideModal) {
        ideModal.addEventListener('click', (e) => {
            if (e.target === ideModal) {
                closeIde();
            }
        });
    }

    // Keyboard shortcut (Escape to close IDE)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && ideModal && ideModal.classList.contains('active')) {
            closeIde();
        }
    });

    // File tree item switching
    fileTreeItems.forEach(item => {
        item.addEventListener('click', () => {
            fileTreeItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            const targetFile = item.getAttribute('data-file');
            loadFileContent(targetFile);
        });
    });

    // Copy Code button in IDE
    if (copyCodeBtn) {
        copyCodeBtn.addEventListener('click', () => {
            if (ideCodeDisplay) {
                const code = ideCodeDisplay.textContent;
                navigator.clipboard.writeText(code).then(() => {
                    showToast(`Copied ${activeFileName} to clipboard!`, 'success');
                });
            }
        });
    }

    // ===== 8. PREMIUM SCROLL REVEAL ANIMATIONS =====
    // Adds subtle entrance motion without changing the portfolio content.
    const revealTargets = document.querySelectorAll(
        '.academic-card, .career-card, .dev-pillar-card, .market-case-card, ' +
        '.education-featured-card, .contact-detail-card, .metric-box, .analyst-card-inner, ' +
        '.info-card, .form-container-card, .integrity-card, .guidance-body'
    );

    revealTargets.forEach((el, index) => {
        el.classList.add('reveal-on-scroll');
        if (index % 3 === 1) el.classList.add('reveal-delay-1');
        if (index % 3 === 2) el.classList.add('reveal-delay-2');
    });

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.10,
        rootMargin: '0px 0px -40px 0px'
    });

    revealTargets.forEach(el => revealObserver.observe(el));

    // ===== 9. LIGHTWEIGHT HERO PARALLAX =====
    const hero = document.querySelector('.hero-section');
    if (hero && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        window.addEventListener('mousemove', (event) => {
            const x = (event.clientX / window.innerWidth - 0.5) * 10;
            const y = (event.clientY / window.innerHeight - 0.5) * 8;
            hero.style.setProperty('--hero-mx', `${x}px`);
            hero.style.setProperty('--hero-my', `${y}px`);
        }, { passive: true });
    }

});
