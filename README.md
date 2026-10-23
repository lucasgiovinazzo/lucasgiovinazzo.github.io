# lucasgiovinazzo.com

Mi portfolio personal: proyectos, casos de estudio y contacto.

**Sitio:** https://lucasgiovinazzo.com

Sitio estático publicado con GitHub Pages. La home es HTML, CSS y JavaScript sin build: escenas con scroll continuo animadas con GSAP + ScrollTrigger, partículas y lluvia de código en canvas 2D. Con movimiento reducido o sin JavaScript se ve como una página normal.

## Desarrollo local

Servir la carpeta y abrir `http://localhost:8000`:

```bash
python -m http.server 8000
```

Los casos de estudio usan Tailwind. Si cambian sus estilos:

```bash
npx tailwindcss@3.4.17 -i css/tw-input.css -o css/tw.css --minify
```

Cada push a `main` se publica automáticamente.

## Estructura

- `index.html`: home con las seis escenas
- `css/portfolio.css` y `js/portfolio.js`: estilos y animación de la home
- `proyectos/`: casos de estudio
- `css/tw-input.css`: estilos fuente de los casos (el `tw.css` compilado no se edita a mano)

© 2026 Lucas Giovinazzo. Todos los derechos reservados.
