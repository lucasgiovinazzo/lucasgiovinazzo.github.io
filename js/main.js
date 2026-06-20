/**
 * PORTFOLIO - LUCAS GIOVINAZZO
 * Main JavaScript File
 */

// =============================================
// NAVBAR
// =============================================

const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');
const navLinks = document.querySelectorAll('.nav-link');

// Navbar scroll effect - Muestra línea naranja cuando haces scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.borderBottomColor = 'rgba(245, 158, 11, 0.2)'; // Amber/naranja
    } else {
        navbar.style.borderBottomColor = 'rgba(255, 255, 255, 0.05)';
    }
});

// Mobile menu toggle
navToggle?.addEventListener('click', () => {
    mobileMenu?.classList.toggle('hidden');

    // Animate hamburger
    const spans = navToggle.querySelectorAll('span');
    if (!mobileMenu?.classList.contains('hidden')) {
        spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
    } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '1';
        spans[2].style.transform = '';
    }
});

// Close mobile menu on link click
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu?.classList.add('hidden');
        const spans = navToggle?.querySelectorAll('span');
        if (spans) {
            spans[0].style.transform = '';
            spans[1].style.opacity = '1';
            spans[2].style.transform = '';
        }
    });
});

// Close mobile menu on outside click
document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target) && !mobileMenu?.classList.contains('hidden')) {
        mobileMenu?.classList.add('hidden');
        const spans = navToggle?.querySelectorAll('span');
        if (spans) {
            spans[0].style.transform = '';
            spans[1].style.opacity = '1';
            spans[2].style.transform = '';
        }
    }
});

// =============================================
// SMOOTH SCROLL
// =============================================

navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            const navHeight = navbar.offsetHeight;
            const targetPosition = targetSection.offsetTop - navHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Hero scroll button
const heroScroll = document.querySelector('.hero-scroll a');
heroScroll?.addEventListener('click', function(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetSection = document.querySelector(targetId);

    if (targetSection) {
        const navHeight = navbar.offsetHeight;
        const targetPosition = targetSection.offsetTop - navHeight;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
});

// =============================================
// ACTIVE NAV LINK ON SCROLL
// =============================================

const sections = document.querySelectorAll('section[id]');

function highlightNavLink() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            navLink?.classList.add('active');
        }
    });
}

window.addEventListener('scroll', highlightNavLink);

// =============================================
// CONTACTO FORM
// =============================================

const contactForm = document.getElementById('contactForm');

contactForm?.addEventListener('submit', function(e) {
    e.preventDefault();

    // Get form data
    const formData = {
        nombre: document.getElementById('nombre').value,
        email: document.getElementById('email').value,
        mensaje: document.getElementById('mensaje').value
    };

    // Crear el mailto link
    const subject = encodeURIComponent(`Consulta de ${formData.nombre}`);
    const body = encodeURIComponent(
        `Nombre: ${formData.nombre}\n` +
        `Email: ${formData.email}\n\n` +
        `Mensaje:\n${formData.mensaje}`
    );

    const mailtoLink = `mailto:lucas.giovinazzo@hotmail.com?subject=${subject}&body=${body}`;

    // Abrir cliente de email
    window.location.href = mailtoLink;

    // Opcional: Limpiar formulario
    setTimeout(() => {
        contactForm.reset();
    }, 1000);

    // Opcional: Mostrar mensaje de confirmación
    alert('Se abrirá tu cliente de email para enviar el mensaje.');
});

// =============================================
// SCROLL ANIMATIONS (Fade In)
// =============================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const fadeInElements = document.querySelectorAll(
    '.proyecto-card, .skill-category, .contacto-item, .proyecto-card-small'
);

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

fadeInElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    fadeInObserver.observe(el);
});

// =============================================
// COPY EMAIL TO CLIPBOARD
// =============================================

// Funcionalidad opcional: Click en email para copiar
const emailLinks = document.querySelectorAll('a[href^="mailto:lucas.giovinazzo"]');

emailLinks.forEach(link => {
    // Agregar tooltip visual cuando se hace hover
    link.title = 'Click para enviar email o copiar';

    // Doble click para copiar al clipboard
    link.addEventListener('dblclick', function(e) {
        e.preventDefault();
        const email = 'lucas.giovinazzo@hotmail.com';

        // Copiar al clipboard
        navigator.clipboard.writeText(email).then(() => {
            // Mostrar feedback visual
            const originalText = this.textContent;
            this.textContent = '✓ Email copiado!';
            this.style.color = '#10b981';

            setTimeout(() => {
                this.textContent = originalText;
                this.style.color = '';
            }, 2000);
        }).catch(err => {
            console.error('Error copiando email:', err);
        });
    });
});

// =============================================
// PERFORMANCE: Lazy Loading Images
// =============================================

// Si agregás imágenes después, este código las lazy-loadea
const images = document.querySelectorAll('img[data-src]');

const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
        }
    });
});

images.forEach(img => imageObserver.observe(img));

// =============================================
// UTILITIES
// =============================================

// Log de bienvenida en consola
console.log(
    '%c👋 Hola! Soy Lucas Giovinazzo',
    'color: #F59E0B; font-size: 24px; font-weight: bold;'
);
console.log(
    '%cDesarrollador Web Full-Stack',
    'color: #A1A1AA; font-size: 16px;'
);
console.log(
    '%cPortfolio desarrollado con HTML, Tailwind CSS y JavaScript',
    'color: #71717A; font-size: 12px;'
);

// =============================================
// INTERACTIVE GLOW - Sigue al mouse y cambia de color
// =============================================

const heroSection = document.querySelector('#hero');
const glowOrb = document.getElementById('glowOrb');
const glowShape = document.getElementById('glowShape');

if (heroSection && glowOrb && glowShape) {
    // Colores disponibles (SVG fill)
    const colors = [
        'rgba(245, 158, 11, 0.6)', // Amber
        'rgba(59, 130, 246, 0.6)',  // Blue
        'rgba(236, 72, 153, 0.6)',  // Pink
        'rgba(139, 92, 246, 0.6)',  // Purple
        'rgba(34, 197, 94, 0.6)'    // Green
    ];

    let currentColorIndex = 0;
    let targetX = 200; // Posición inicial izquierda
    let targetY = 200;
    let currentX = 200;
    let currentY = 200;
    let rotation = 0;
    let targetRotation = 0;

    // Establecer color inicial
    glowShape.style.fill = colors[currentColorIndex];

    function animate() {
        // Suavizar movimiento (lerp)
        currentX += (targetX - currentX) * 0.08;
        currentY += (targetY - currentY) * 0.08;
        rotation += (targetRotation - rotation) * 0.05;

        glowOrb.style.transform = `translate(${currentX - 300}px, ${currentY - 300}px) rotate(${rotation}deg)`;

        requestAnimationFrame(animate);
    }

    // Seguir al mouse (solo en el lado izquierdo)
    heroSection.addEventListener('mousemove', (e) => {
        const rect = heroSection.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Limitar al lado izquierdo (50% de la pantalla)
        if (mouseX < rect.width * 0.5) {
            targetX = mouseX;
            targetY = mouseY;

            // Rotar sutilmente basado en posición del mouse
            targetRotation = (mouseX / rect.width) * 30 - 15;
        }

        // Hacer el glow más grande cuando mueves el mouse
        glowOrb.style.width = '700px';
        glowOrb.style.height = '700px';
        glowOrb.style.filter = 'blur(70px)';
        glowOrb.style.opacity = '1';
    });

    // Volver a tamaño normal cuando sale el mouse
    heroSection.addEventListener('mouseleave', () => {
        targetX = 200;
        targetY = 200;
        targetRotation = 0;
        glowOrb.style.width = '600px';
        glowOrb.style.height = '600px';
        glowOrb.style.filter = 'blur(60px)';
        glowOrb.style.opacity = '0.8';
    });

    // Cambiar color al hacer click
    heroSection.addEventListener('click', (e) => {
        const rect = heroSection.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;

        // Solo cambiar color si haces click en el lado izquierdo
        if (mouseX < rect.width * 0.5) {
            currentColorIndex = (currentColorIndex + 1) % colors.length;
            glowShape.style.fill = colors[currentColorIndex];

            // Efecto de "pulso" al hacer click
            glowOrb.style.width = '850px';
            glowOrb.style.height = '850px';
            glowOrb.style.filter = 'blur(90px)';

            // Rotar 360 grados
            targetRotation += 360;

            setTimeout(() => {
                glowOrb.style.width = '700px';
                glowOrb.style.height = '700px';
                glowOrb.style.filter = 'blur(70px)';
            }, 200);
        }
    });

    // Iniciar animación
    animate();
}

// =============================================
// ROBOT CAT MASCOT (PIXEL ART SPRITES)
// =============================================

const robotCat = document.getElementById('robotCat');
const yarnBall = document.getElementById('yarnBall');

if (robotCat && yarnBall) {
    // Sprite sheet: 16×16px total, 3×3 grid = 9 frames
    let currentFrame = 0;
    let frameCounter = 0;
    const FPS = 6;
    const WALK_FRAMES = [0, 1, 2]; // Frames de caminar
    const SLEEP_ANIMATION = [6, 7, 8]; // Frames de animación al dormir (7, 8, 9 en numeración 1-indexed)

    // Estados del gato
    const STATE = {
        WALKING: 'walking',
        SLEEPING: 'sleeping',
        DRAGGED: 'dragged'
    };

    let currentState = STATE.WALKING;
    let stateTimer = Date.now() + Math.random() * 8000 + 5000; // 5-13 segundos caminando
    let walkDirection = Math.random() < 0.5 ? 1 : -1;

    let isDraggingCat = false;
    let isDraggingBall = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;

    // Física del gato
    let catVelocityY = 0;
    let catIsGrounded = true; // Empieza en el suelo
    let catGroundLevel = 0; // Nivel del suelo donde camina el gato
    let currentButton = null; // Botón actual sobre el que camina

    let ballX = 200;
    let ballY = window.innerHeight - 50;
    let ballVelocityY = 0;
    let ballVelocityX = 0;
    const GRAVITY = 0.5;
    const CAT_GRAVITY = 0.2; // Gravedad más lenta para el gato
    const BOUNCE = 0.6;
    const FRICTION = 0.95;
    const GROUND = 30;
    let lastBallY = ballY;

    // Actualizar frame del sprite (3x3 grid)
    function updateSprite() {
        const col = currentFrame % 3;
        const row = Math.floor(currentFrame / 3);
        const x = -col * 48;
        const y = -row * 48;
        robotCat.style.backgroundPosition = `${x}px ${y}px`;
    }

    function animateSprite() {
        frameCounter++;
        if (frameCounter >= Math.floor(60 / FPS)) {
            frameCounter = 0;

            if (currentState === STATE.WALKING) {
                // Ciclar entre frames de caminar
                let walkIndex = WALK_FRAMES.indexOf(currentFrame);
                walkIndex = (walkIndex + 1) % WALK_FRAMES.length;
                currentFrame = WALK_FRAMES[walkIndex];
            } else if (currentState === STATE.SLEEPING) {
                // Animar frames 6, 7 una vez y quedarse en 8
                if (currentFrame === SLEEP_ANIMATION[2]) {
                    // Ya está en el frame final (8), no animar más
                    return;
                }

                let sleepIndex = SLEEP_ANIMATION.indexOf(currentFrame);
                if (sleepIndex === -1) {
                    // Empezar desde el primer frame
                    currentFrame = SLEEP_ANIMATION[0];
                } else if (sleepIndex < 2) {
                    // Avanzar al siguiente frame
                    currentFrame = SLEEP_ANIMATION[sleepIndex + 1];
                }
                // Si ya llegó al frame 8, se queda ahí
            }

            updateSprite();
        }
    }

    function changeState() {
        // No cambiar estado mientras está cayendo
        if (!catIsGrounded) return;

        const now = Date.now();
        if (now < stateTimer) return;

        if (currentState === STATE.WALKING) {
            // Ir a dormir
            currentState = STATE.SLEEPING;
            currentFrame = SLEEP_ANIMATION[0];
            updateSprite();
            stateTimer = now + Math.random() * 8000 + 7000; // Duerme 7-15 segundos
        } else if (currentState === STATE.SLEEPING) {
            // Despertar y caminar
            currentState = STATE.WALKING;
            currentFrame = WALK_FRAMES[0];
            walkDirection = Math.random() < 0.5 ? 1 : -1; // Nueva dirección
            updateSprite();
            stateTimer = now + Math.random() * 8000 + 5000; // Camina 5-13 segundos
        }
    }

    function moveCat() {
        if (currentState !== STATE.WALKING || isDraggingCat || !catIsGrounded) return;

        const currentLeft = parseInt(robotCat.style.left) || 20;
        let newLeft = currentLeft + walkDirection * 1.5; // Velocidad de caminar

        // Cambiar dirección si llega al borde de la pantalla
        if (newLeft <= 5) {
            walkDirection = 1;
            newLeft = 5;
        } else if (newLeft >= window.innerWidth - 53) {
            walkDirection = -1;
            newLeft = window.innerWidth - 53;
        }

        // Mover el gato
        robotCat.style.left = newLeft + 'px';

        // SOLO verificar botones si está sobre uno actualmente
        if (currentButton) {
            const catRect = robotCat.getBoundingClientRect();
            const checkX = catRect.left + 24; // Centro del gato
            const checkY = catRect.bottom + 2;

            robotCat.style.visibility = 'hidden';
            const elementBelow = document.elementFromPoint(checkX, checkY);
            robotCat.style.visibility = 'visible';

            let buttonBelow = null;
            let el = elementBelow;
            while (el && el !== document.body) {
                if ((el.tagName === 'A' || el.tagName === 'BUTTON') && el.id !== 'navbar') {
                    const rect = el.getBoundingClientRect();
                    if (rect.top > 100) {
                        buttonBelow = el;
                        break;
                    }
                }
                el = el.parentElement;
            }

            if (buttonBelow) {
                // Hay botón debajo, actualizar currentButton
                currentButton = buttonBelow;
            } else {
                // No hay botón debajo, caer
                currentButton = null;
                catIsGrounded = false;
                catVelocityY = 0;
            }
        }

        // Flip horizontal según dirección
        if (walkDirection > 0) {
            robotCat.style.transform = 'scaleX(-1)';
        } else {
            robotCat.style.transform = 'scaleX(1)';
        }
    }

    robotCat.addEventListener('mousedown', (e) => {
        isDraggingCat = true;
        currentState = STATE.DRAGGED;
        currentButton = null; // Reset del botón
        catIsGrounded = false; // Podrá caer cuando lo sueltes
        robotCat.style.cursor = 'grabbing';
        const rect = robotCat.getBoundingClientRect();
        dragOffsetX = e.clientX - rect.left;
        dragOffsetY = e.clientY - rect.top;
        e.preventDefault();
    });

    yarnBall.addEventListener('mousedown', (e) => {
        isDraggingBall = true;
        yarnBall.style.cursor = 'grabbing';
        const rect = yarnBall.getBoundingClientRect();
        dragOffsetX = e.clientX - rect.left;
        dragOffsetY = e.clientY - rect.top;
        lastBallY = ballY;
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (isDraggingCat) {
            const newLeft = e.clientX - dragOffsetX;
            const newBottom = window.innerHeight - e.clientY - (48 - dragOffsetY);
            robotCat.style.left = Math.max(0, Math.min(window.innerWidth - 48, newLeft)) + 'px';
            robotCat.style.bottom = Math.max(0, Math.min(window.innerHeight - 48, newBottom)) + 'px';
        }

        if (isDraggingBall) {
            const newLeft = e.clientX - dragOffsetX;
            const newBottom = window.innerHeight - e.clientY - (30 - dragOffsetY);
            yarnBall.style.left = Math.max(0, Math.min(window.innerWidth - 30, newLeft)) + 'px';
            yarnBall.style.bottom = Math.max(GROUND, Math.min(window.innerHeight - 30, newBottom)) + 'px';

            const newBallX = parseInt(yarnBall.style.left);
            const newBallY = window.innerHeight - parseInt(yarnBall.style.bottom);
            ballVelocityX = (newBallX - ballX) * 0.3;
            ballVelocityY = (newBallY - lastBallY) * 0.3;
            lastBallY = newBallY;
            ballX = newBallX;
            ballY = newBallY;
        }
    });

    document.addEventListener('mouseup', (e) => {
        if (isDraggingCat) {
            isDraggingCat = false;
            robotCat.style.cursor = 'grab';

            // SIEMPRE empezar cayendo, luego la física detectará botones
            currentButton = null;
            catIsGrounded = false;
            catVelocityY = 0;
        }
        if (isDraggingBall) {
            isDraggingBall = false;
            yarnBall.style.cursor = 'grab';
        }
    });

    function animate() {
        // Física de la bola
        if (!isDraggingBall) {
            ballVelocityY += GRAVITY;
            ballY += ballVelocityY;
            ballX += ballVelocityX;
            ballVelocityX *= FRICTION;

            if (ballY <= GROUND) {
                ballY = GROUND;
                ballVelocityY *= -BOUNCE;
                if (Math.abs(ballVelocityY) < 0.5) ballVelocityY = 0;
            }

            if (ballX <= 15) {
                ballX = 15;
                ballVelocityX *= -BOUNCE;
            } else if (ballX >= window.innerWidth - 45) {
                ballX = window.innerWidth - 45;
                ballVelocityX *= -BOUNCE;
            }

            yarnBall.style.left = ballX + 'px';
            yarnBall.style.bottom = (window.innerHeight - ballY - 30) + 'px';
        }

        // Física del gato (gravedad)
        if (!isDraggingCat && !catIsGrounded) {
            catVelocityY += CAT_GRAVITY;
            const currentBottom = parseInt(robotCat.style.bottom) || 0;
            let newBottom = currentBottom - catVelocityY;

            // Mientras cae, verificar si pasa por un botón
            const catRect = robotCat.getBoundingClientRect();
            const checkX = catRect.left + 24;
            const checkY = catRect.bottom + 2;

            robotCat.style.visibility = 'hidden';
            const elementBelow = document.elementFromPoint(checkX, checkY);
            robotCat.style.visibility = 'visible';

            let buttonFound = null;
            let el = elementBelow;
            while (el && el !== document.body) {
                if ((el.tagName === 'A' || el.tagName === 'BUTTON') && el.id !== 'navbar') {
                    const rect = el.getBoundingClientRect();
                    if (rect.top > 100) { // No navbar
                        buttonFound = el;
                        break;
                    }
                }
                el = el.parentElement;
            }

            if (buttonFound) {
                // Encontró un botón mientras caía, detenerse sobre él
                currentButton = buttonFound;
                catIsGrounded = true;
                catVelocityY = 0;

                // 40% de probabilidad de dormir al caer
                if (Math.random() < 0.4) {
                    currentState = STATE.SLEEPING;
                    currentFrame = SLEEP_ANIMATION[0];
                    stateTimer = Date.now() + Math.random() * 8000 + 7000;
                } else {
                    currentState = STATE.WALKING;
                    currentFrame = WALK_FRAMES[0];
                    stateTimer = Date.now() + Math.random() * 8000 + 5000;
                }
                updateSprite();
                // Mantener la posición actual, no caer más
            } else if (newBottom <= 0) {
                // Llegó al suelo
                robotCat.style.bottom = '0px';
                catVelocityY = 0;
                catIsGrounded = true;
                catGroundLevel = 0;
                currentButton = null;

                // 40% de probabilidad de dormir al caer
                if (Math.random() < 0.4) {
                    currentState = STATE.SLEEPING;
                    currentFrame = SLEEP_ANIMATION[0];
                    stateTimer = Date.now() + Math.random() * 8000 + 7000;
                } else {
                    currentState = STATE.WALKING;
                    currentFrame = WALK_FRAMES[0];
                    stateTimer = Date.now() + Math.random() * 8000 + 5000;
                }
                updateSprite();
            } else {
                // Sigue cayendo
                robotCat.style.bottom = newBottom + 'px';
            }
        }

        // Comportamiento del gato
        if (!isDraggingCat) {
            changeState();
            moveCat();
            animateSprite();
        }

        requestAnimationFrame(animate);
    }

    updateSprite();
    animate();
}

// =============================================
// INITIALIZE
// =============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('✓ Portfolio cargado exitosamente');
    highlightNavLink(); // Iniciar highlight
});
