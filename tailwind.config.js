// Build: npx tailwindcss@3.4.17 -i css/tw-input.css -o css/tw.css --minify
module.exports = {
    content: ['./index.html', './proyectos/*.html', './js/*.js'],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
        },
    },
};
