# Prototipo Exportaciones DIAN

Prototipo estático (HTML/CSS/JS sin dependencias ni build) del flujo de
exportaciones asistido por agentes.

## Flujo

El recorrido arranca en el login:

```
index.html (login)  ->  f00-ingreso.html (NIT y mandato)  ->  indice.html (catálogo de flujos)
                                                                  |
                                                                  +-> f01 … f37 (pantallas)
```

- `index.html` — pantalla de acceso. Es el punto de entrada del sitio; no
  valida credenciales, cualquier envío avanza a `f00-ingreso.html`.
- `f00-ingreso.html` — selección de NIT, mandato y certificado.
- `indice.html` — catálogo buscable de las 37 pantallas.
- `f01` … `f37` — pantallas del flujo.
- `estilos.css`, `app.js` — estilos y comportamiento compartidos (tema,
  pestañas, colapso chat/canvas).
- `_plantilla-shell.html` — plantilla base para nuevas pantallas, no se enlaza.
- `index-all.html`, `index-mockups.html` — índices heredados.

## Publicación

GitHub Pages sirve la raíz del repositorio en la rama `main` mediante el
workflow `.github/workflows/pages.yml` (Settings → Pages → Source: GitHub
Actions). El archivo `.nojekyll` evita que Jekyll ignore los archivos que
empiezan por guion bajo.

## Desarrollo local

```sh
python3 -m http.server 8000
```

Luego abre <http://localhost:8000/>.
