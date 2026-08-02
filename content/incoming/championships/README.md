# Fotos y logos de campeonatos

Acá se copian las imágenes nuevas de un campeonato. No hace falta tocar código.

## Antes que nada

El campeonato tiene que existir **primero** en la planilla de Google Sheets. Si no
está en la planilla, el script no lo va a reconocer y te va a avisar con un error.

## 1. Averiguar el slug del campeonato

El slug es el nombre del campeonato en minúscula, sin acentos y con guiones en
lugar de espacios.

| Nombre en la planilla | Slug            |
| --------------------- | --------------- |
| `Apertura 2026`       | `apertura-2026` |
| `Clausura 2025`       | `clausura-2025` |
| `Verano 2026`         | `verano-2026`   |

Si abrís el campeonato en la web, el slug también aparece en la dirección, después
de `torneo=`. Por ejemplo: `/campeonatos?torneo=apertura-2026`.

## 2. Elegir F8 o F5

Son dos torneos distintos aunque se llamen igual. Fijate en qué hoja de la planilla
está cargado el campeonato:

- Fútbol 8 → carpeta `f8`
- Fútbol 5 → carpeta `f5`

Un mismo nombre puede existir en las dos modalidades (por ejemplo `Apertura 2026`).
Son campeonatos diferentes y cada uno lleva su propia foto.

## 3. Crear la carpeta y copiar las imágenes

```text
content/incoming/championships/
├── f8/
│   └── apertura-2026/
│       ├── team-photo.jpg
│       └── tournament-logo.png
└── f5/
    └── clausura-2025/
        └── team-photo.jpg
```

Los nombres de archivo tienen que ser exactamente estos:

- `team-photo` — la foto grupal del plantel.
- `tournament-logo` — el logo del torneo.

La extensión puede ser `.jpg`, `.jpeg`, `.png`, `.webp`, `.avif` o `.tif`.

Los dos archivos son **opcionales**. Podés copiar sólo la foto, sólo el logo, o los
dos. Si falta alguno, el campeonato igual se muestra en la web con un cartel que
avisa que todavía no está disponible.

### Sobre la foto del plantel

La foto se publica completa, sin recortes: no se cortan caras nunca. Si querés
sacarle el techo, la red o un borde, recortala vos antes de copiarla acá.

### Sobre el logo del torneo

El logo es de la **liga**, no del campeonato. `Torneos Indiana`, `TdeA` y
`DePrimera` organizan varios campeonatos cada una, y todos comparten el mismo logo.

Por eso alcanza con cargar el logo una sola vez, en cualquier campeonato de esa
liga. El script te avisa a qué liga lo asoció. Si cargás dos logos distintos para
la misma liga en la misma corrida, te lo marca como error en vez de elegir uno.

El logo se convierte a PNG sin tocar el diseño: no se recorta, no se deforma, no se
le cambian los colores y no se le borra el fondo.

## 4. Ejecutar el script

```bash
npm run championships:assets
```

Te va a mostrar un informe con:

- `encoded` — lo que se generó.
- `skipped` — lo que ya estaba hecho y no se volvió a tocar.
- `note` — avisos, por ejemplo a qué liga se asoció un logo.
- `error` — lo que no se pudo procesar y por qué.

Si el script dice que un slug no existe, revisá la ortografía contra la planilla y
fijate que hayas usado la modalidad correcta. Mientras haya un error, ese archivo
**no se copia**: no se publica nada a medias.

Podés correrlo las veces que quieras. Si no cambió nada, no modifica ningún
archivo. Para regenerar una imagen que ya existía, usá `-- --force`.

## 5. Revisar y publicar

```bash
npm run validate
```

Después, revisá la web con `npm run dev` y, si está todo bien, hacé commit y push.

## Qué se sube a Git y qué no

**Se sube:**

- Las imágenes optimizadas que genera el script, en `src/assets/solares/championships/`.
- El manifiesto `src/features/championships/data/generated/championship-assets.manifest.json`.

**No se sube:**

- Nada de lo que copiaste en esta carpeta. Los originales quedan sólo en tu
  computadora. Guardalos aparte si te importan.

Las fotos y los logos son archivos del sitio: recién se ven online después de
volver a publicar la web. Los datos de la planilla, en cambio, se actualizan solos.
