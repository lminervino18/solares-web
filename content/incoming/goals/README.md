# Videos de goles

Acá se copian los videos de goles nuevos. No hace falta tocar código.

## 1. Elegir F8 o F5

La modalidad la define **la carpeta**, nunca el nombre del archivo:

- Gol de fútbol 8 → carpeta `f8`
- Gol de fútbol 5 → carpeta `f5`

Los goles de F8 y F5 no se mezclan nunca.

Formatos de video aceptados: `.mp4`, `.mov`, `.m4v`, `.webm`, `.avi`, `.mkv`.

## 2. Nombrar el archivo

El nombre tiene tres partes separadas por **dos guiones bajos** (`__`):

```text
torneo__goleador__loquequieras.mp4
```

Ejemplos:

```text
apertura-2026__lorenzo-minervino__gol-01.mp4
apertura-2026__lorenzo-minervino__gol-02.mp4
clausura-2025__santiago-penonori__tiro-libre.mp4
amistoso__agus-lorenzo__clip-a.mov
pretemporada-2026__martin-perez__segundo-tiempo.mp4
clausura-2023__en-contra__gol-01.mp4
```

### Primera parte: el torneo

Va el nombre del campeonato en minúscula, sin acentos y con guiones en lugar de
espacios. Por ejemplo `Apertura 2026` se escribe `apertura-2026`.

Tiene que coincidir con un campeonato cargado en la planilla, en esa misma
modalidad. Es la misma palabra que aparece en la dirección de la web después de
`torneo=`.

Para los goles que no son de un campeonato oficial:

- Amistosos → `amistoso` o `amistoso-2024`
- Pretemporada → `pretemporada` o `pretemporada-2026`

Estos dos no se buscan como campeonatos: aparecen sólo en la página de Goles, con
su propio filtro, y nunca dentro de un campeonato.

### Segunda parte: el goleador

El nombre del jugador en minúscula, sin acentos y con guiones:
`lorenzo-minervino`, `santiago-penonori`.

Los acentos se recuperan solos. `santiago-penonori` se muestra como
`Santiago Peñoñori`.

Si el gol fue en contra, poné `en-contra`. Se muestra como `En contra` y no se le
asigna a ningún jugador.

### Tercera parte: la que quieras

Sirve sólo para que dos archivos no se llamen igual. Puede ser un número, una
palabra o una fecha: `gol-01`, `tiro-libre`, `2026-03-14`.

**Esta parte no se muestra nunca en la web** y no es el número del gol.

### Archivos viejos

Los videos que ya estaban cargados usan el formato anterior
(`Apertura_2026-Lorenzo_Minervino-0.mp4`) y se siguen leyendo igual. No hay que
renombrarlos. Los archivos nuevos usan el formato de arriba.

## 3. Subir los goles

```bash
npm run goals:inspect      # clasifica y arma un informe, no sube nada
npm run goals:upload:dry   # muestra exactamente qué se subiría, no sube nada
npm run goals:upload       # sube y actualiza el manifiesto
npm run goals:verify       # comprueba que lo subido está publicado
```

Empezá siempre por `goals:inspect` y leé el informe.

Si algún archivo aparece como **unresolved** o **ambiguous**, es porque el nombre
no se pudo interpretar. Revisá la ortografía del torneo y del goleador. Si el
nombre es correcto pero raro, se resuelve con un alias o con un override:

- Un apellido mal escrito que se repite → alias en
  `src/features/goals/data/goal-scorer-aliases.ts`.
- Un archivo suelto imposible de interpretar → override en
  `scripts/goals/goals-source-overrides.ts`.

`goals:upload:dry` no sube nada: sólo lista lo que haría. Usalo siempre antes de
la subida real.

La subida se puede cortar y retomar. Los goles ya subidos no se vuelven a subir:
cada gol se identifica por el contenido del archivo, no por su nombre. Renombrar
un archivo no lo duplica.

## 4. Publicar

```bash
npm run validate
```

Después hacé commit del manifiesto y push.

## Qué se sube a Git y qué no

**Se sube:**

- `src/features/goals/data/generated/goals.manifest.json`, que es lo único que lee
  la web.

**No se sube nunca:**

- Los videos de esta carpeta. Los originales quedan sólo en tu computadora y
  ningún script los borra, los renombra ni los modifica.
- El archivo `.env.local` con la credencial de Cloudinary.

## Borrar un gol

1. Marcalo con `skip: true` y un motivo en `scripts/goals/goals-source-overrides.ts`.
2. `npm run goals:inspect`
3. `npm run goals:prune` para ver qué quedó publicado de más, y
   `npm run goals:prune:apply` para borrarlo de Cloudinary.
4. `npm run goals:upload` para rehacer el manifiesto.

El video local nunca se borra, así que la decisión siempre se puede revertir.
