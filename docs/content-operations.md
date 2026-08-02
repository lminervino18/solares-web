# Cómo actualizar el contenido de la web

Guía para el administrador del sitio. Explica solamente las tareas habituales.

Todo lo que sigue se ejecuta desde la carpeta del proyecto, en una terminal.

## Resumen rápido

| Quiero...                     | Dónde se hace                     | Requiere clave |
| ----------------------------- | --------------------------------- | -------------- |
| Agregar un campeonato         | Google Sheets                     | No             |
| Agregar la foto de un plantel | `content/incoming/championships/` | No             |
| Agregar el logo de un torneo  | `content/incoming/championships/` | No             |
| Agregar goles                 | `content/incoming/goals/`         | Sí             |
| Revisar que esté todo bien    | `npm run content:check`           | No             |

## Agregar un campeonato sin imágenes

El campeonato aparece solo. No hay que tocar nada del proyecto.

1. Agregar la fila en la hoja de resumen de la planilla, en la modalidad que
   corresponda (F8 o F5).
2. Completar `Campeonato` con el nombre e incluir el año, por ejemplo
   `Apertura 2027`. Los demás campos (`Torneo`, `Resultado`, `Link Final`) son
   opcionales.
3. Cargar los partidos en la hoja de partidos de esa misma modalidad, escribiendo
   el mismo nombre exacto en la columna `Torneo`.
4. Recargar la web.

El campeonato aparece en Campeonatos, cuenta en Estadísticas y queda disponible
para asociarle goles. Si todavía no tiene foto ni logo, se muestra con carteles
que avisan que faltan. Nunca se usa la foto de otro campeonato.

La web consulta la planilla **en cada visita**, así que no hace falta publicar de
nuevo el sitio para que aparezca.

> Un campeonato que está sólo en la hoja de partidos y no en la de resumen no se
> publica: no se muestra en Campeonatos ni cuenta como título, pero sus partidos
> sí suman en las estadísticas. Se publica en cuanto se agrega la fila de resumen.

## Agregar imágenes a un campeonato

1. Averiguar el slug del campeonato: el nombre en minúscula, sin acentos y con
   guiones. `Apertura 2026` es `apertura-2026`.
2. Crear la carpeta:

   ```text
   content/incoming/championships/f8/apertura-2026/
   ```

   Usar `f8` o `f5` según la modalidad.

3. Copiar adentro `team-photo.jpg` (la foto del plantel) y `tournament-logo.png`
   (el logo del torneo). Los dos son opcionales.
4. Ejecutar:

   ```bash
   npm run championships:assets
   ```

5. Leer el informe. Si dice `error`, ese archivo no se copió: corregí lo que
   indica y volvé a ejecutar.
6. Validar y publicar:

   ```bash
   npm run validate
   ```

7. Commit y push.

Las imágenes son archivos del sitio: se ven online recién después de volver a
publicar la web.

El detalle completo está en `content/incoming/championships/README.md`.

## Agregar goles

Esto necesita la clave de Cloudinary en `.env.local`.

1. Copiar los videos en `content/incoming/goals/f8` o `content/incoming/goals/f5`,
   según la modalidad.
2. Renombrarlos con el formato `torneo__goleador__loquequieras.mp4`. Por ejemplo:

   ```text
   apertura-2026__lorenzo-minervino__gol-01.mp4
   ```

3. Ejecutar, en este orden:

   ```bash
   npm run goals:inspect      # clasifica, no sube nada
   npm run goals:upload:dry   # muestra qué se subiría, no sube nada
   npm run goals:upload       # sube de verdad
   npm run goals:verify       # comprueba que quedó todo publicado
   ```

   O todo junto con `npm run goals:sync`.

4. Validar y publicar:

   ```bash
   npm run validate
   ```

5. Commit del manifiesto y push.

Los goles ya subidos no se vuelven a subir. Si la subida se corta, se retoma
donde quedó. Los videos originales no se borran ni se modifican nunca.

El detalle completo está en `content/incoming/goals/README.md`.

## Revisar todo

```bash
npm run content:check
```

Revisa que el manifiesto de imágenes esté al día y clasifica los goles locales.
No sube nada, no borra nada y **no necesita ninguna clave**.

```bash
npm run content:sync
```

Hace todo el ciclo: actualiza la copia local de la planilla, procesa las imágenes
nuevas y sube los goles pendientes. **Necesita la clave de Cloudinary.**

```bash
npm run validate
```

Comprueba formato, tipos, lint, tests y build. No necesita ninguna clave ni
conexión a la planilla.

## Sobre la clave de Cloudinary

Vive en un archivo `.env.local` en la raíz del proyecto, con una sola línea:

```env
CLOUDINARY_URL=cloudinary://CLAVE:SECRETO@NOMBRE_DE_LA_CUENTA
```

Reglas:

- El archivo nunca se sube a Git.
- Nunca hay que ponerle el prefijo `VITE_`: eso publicaría el secreto dentro de la
  web.
- La web publicada no necesita la clave para nada. Sólo la usan los scripts de
  goles en tu computadora.

## Si algo sale mal

| Síntoma                                       | Qué hacer                                                              |
| --------------------------------------------- | ---------------------------------------------------------------------- |
| El campeonato no aparece                      | Revisar que esté en la hoja de **resumen**, no sólo en la de partidos  |
| Sale "Foto del plantel todavía no disponible" | Falta la imagen: seguir "Agregar imágenes a un campeonato"             |
| El script dice que el slug no existe          | Revisar la ortografía y la modalidad contra la planilla                |
| Un gol aparece como `unresolved`              | El nombre del archivo no se pudo interpretar: revisar torneo y jugador |
| Los partidos están cargados pero no suman     | Revisar que la columna `Torneo` tenga el nombre exacto del campeonato  |
