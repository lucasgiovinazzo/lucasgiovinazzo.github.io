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

// Línea naranja al hacer scroll (estilos en css/tw-input.css)
window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', scrollY > 50));

// Mobile menu: abre/cierra y anima el hamburger vía .open
function setMenu(open) {
    mobileMenu?.classList.toggle('hidden', !open);
    navToggle?.classList.toggle('open', open);
}

navToggle?.addEventListener('click', () => setMenu(mobileMenu.classList.contains('hidden')));
navLinks.forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) setMenu(false);
});

// Smooth scroll: nativo (html.scroll-smooth + scroll-padding-top en css/tw-input.css)

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

highlightNavLink();
