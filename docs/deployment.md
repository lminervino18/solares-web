# Publicar la web en Vercel con un dominio de DonWeb

Guía paso a paso. Al terminar vas a tener:

- La web publicada en Vercel.
- Un deploy automático en cada push a `main`.
- Tu dominio de DonWeb apuntando al sitio, con HTTPS.

No hace falta tarjeta de crédito: el plan gratuito de Vercel alcanza de sobra para
este sitio.

## Antes de empezar

Necesitás:

- La cuenta de GitHub donde está el repositorio.
- El dominio ya comprado en DonWeb y acceso a su panel.
- Unos 20 minutos, más el tiempo de propagación del DNS.

Este proyecto ya está listo para Vercel:

- `vercel.json` tiene el rewrite a `index.html` que necesita una SPA. Sin eso,
  entrar directo a `/goles` daría 404.
- El build **no necesita ninguna clave**. No lee `CLOUDINARY_URL` ni contacta a
  Cloudinary.
- Vite no tiene `base` configurado, que es lo correcto para un dominio propio.

---

## Parte 1 — Publicar en Vercel

### 1. Crear la cuenta

Entrá a <https://vercel.com/signup> y elegí **Continue with GitHub**. Autorizá el
acceso.

Usar GitHub para registrarte es lo que después permite el deploy automático.

### 2. Importar el repositorio

1. En el dashboard, **Add New… → Project**.
2. Buscá `solares-web` en la lista.
3. Si no aparece, hacé clic en **Adjust GitHub App Permissions** y dale acceso al
   repositorio.
4. **Import**.

### 3. Revisar la configuración del build

Vercel detecta Vite solo. Verificá que diga:

| Campo            | Valor           |
| ---------------- | --------------- |
| Framework Preset | Vite            |
| Build Command    | `npm run build` |
| Output Directory | `dist`          |
| Install Command  | `npm install`   |

Si algo no coincide, corregilo a mano.

### 4. Cargar la variable de entorno

**Esto es importante y es fácil de saltear.**

Abrí **Environment Variables** y agregá:

| Name            | Value                       |
| --------------- | --------------------------- |
| `VITE_SITE_URL` | `https://tu-dominio.com.ar` |

Poné ya el dominio final, aunque todavía no lo hayas conectado.

¿Por qué importa? Esa variable genera la etiqueta `canonical` y el `og:url`. Sin
ella, cuando compartas un link por WhatsApp o Instagram la previsualización sale
incompleta, y Google no sabe cuál es la dirección oficial de cada página.

**No agregues `CLOUDINARY_URL` acá.** Esa clave es sólo para tu computadora. Si la
cargás en Vercel con el prefijo `VITE_`, el secreto termina publicado dentro del
código de la web.

### 5. Deploy

Clic en **Deploy** y esperá un par de minutos.

Vercel te da una dirección tipo `solares-web.vercel.app`. Abrila y revisá que
funcione: navegá a Campeonatos, Goles, y recargá la página estando adentro de una
sección (eso prueba que el rewrite anda).

---

## Parte 2 — Deploy automático en cada commit

**Ya está funcionando.** No hay que configurar nada.

Al importar desde GitHub, Vercel deja instalada la integración. A partir de ahora:

| Qué hacés              | Qué pasa                                            |
| ---------------------- | --------------------------------------------------- |
| `git push` a `main`    | Deploy a producción, en tu dominio                  |
| `git push` a otra rama | Deploy de _preview_, con una URL propia para probar |
| Abrís un Pull Request  | Vercel comenta el link del preview                  |

Para comprobarlo: hacé cualquier cambio, commit y push. En la pestaña
**Deployments** vas a ver el build arrancando solo.

### Si un deploy falla

Entrá al deploy que falló y leé el log. La causa más común es que el código no
compila. Para adelantarte, antes de pushear corré:

```bash
npm run validate
```

Es lo mismo que hace Vercel, más el chequeo de formato. Si pasa local, pasa allá.

---

## Parte 3 — Conectar el dominio de DonWeb

El orden importa: **primero se agrega el dominio en Vercel** y recién después se
tocan los DNS en DonWeb. Vercel te dice exactamente qué cargar.

### 6. Agregar el dominio en Vercel

1. En tu proyecto: **Settings → Domains**.
2. Escribí tu dominio sin `www` (por ejemplo `solares.com.ar`) y **Add**.
3. **Agregá también `www.tu-dominio.com` como dominio aparte**, y configuralo para
   que redirija al dominio sin `www`.

> **No te saltees el paso 3.** Que el DNS de `www` resuelva no alcanza: Vercel
> emite el certificado HTTPS **sólo para los dominios que están en esta lista**. Si
> `www` no está agregado acá, quien lo escriba en el navegador va a ver la
> advertencia roja de "conexión no privada", aunque el dominio pelado ande
> perfecto. Se verifica así:
>
> ```bash
> curl -sI https://www.tu-dominio.com | head -1
> ```
>
> Si no devuelve una respuesta HTTP, falta el certificado.

Vercel va a mostrar los registros DNS que necesita, algo así:

| Tipo  | Nombre | Valor                  |
| ----- | ------ | ---------------------- |
| A     | `@`    | `76.76.21.21`          |
| CNAME | `www`  | `cname.vercel-dns.com` |

> **Copiá los valores que te muestra Vercel a vos, no los de esta tabla.** Vercel
> cambia las direcciones IP según el proyecto y la región. Esta tabla es sólo para
> que sepas qué forma tienen.

Dejá esa pantalla abierta.

### 7. Apuntar el dominio: dos caminos

Hay dos formas. **Elegí una sola.**

#### Camino A — Nameservers de Vercel (el que usa este sitio)

Vercel se encarga de todo el DNS. Es el más simple y el que menos se rompe.

En el panel de DonWeb, buscá la opción de **cambiar los DNS / nameservers** del
dominio y poné los que te da Vercel:

```text
ns1.vercel-dns.com
ns2.vercel-dns.com
```

Vercel crea los registros del sitio solo. La contra: si algún día usás el dominio
para mail o para otro servicio, esos registros los tenés que cargar en Vercel, no
en DonWeb.

> Este es el camino que está funcionando hoy en `solaresfutbol.com`.

#### Camino B — Registros A y CNAME en DonWeb

Dejás el DNS en DonWeb y sólo apuntás dos registros. Serví si querés seguir
manejando mail u otros subdominios desde DonWeb.

1. Entrá a tu panel de DonWeb e iniciá sesión.
2. Buscá tu dominio y entrá a la administración de **DNS** (según el panel puede
   aparecer como "Zona DNS", "Editor de zona" o "Administrar DNS").
3. Cargá los dos registros que te mostró Vercel.

**Registro A (el dominio sin www):**

- Tipo: `A`
- Nombre / Host: `@` (algunos paneles piden dejarlo vacío, o escribir el dominio
  completo)
- Valor / Apunta a: la IP que te dio Vercel
- TTL: dejá el que viene por defecto

**Registro CNAME (el www):**

- Tipo: `CNAME`
- Nombre / Host: `www`
- Valor / Apunta a: `cname.vercel-dns.com` (o el que te haya dado Vercel)
- TTL: por defecto

4. **Borrá o reemplazá los registros A y CNAME que ya existan** para `@` y `www`.
   Si DonWeb dejó apuntando el dominio a una página de "en construcción", ese
   registro viejo compite con el nuevo y el sitio carga cualquiera de los dos.

5. Guardá los cambios.

> ¿Por qué `A` para el dominio pelado y `CNAME` para `www`? Porque el estándar de
> DNS no permite un CNAME en la raíz del dominio. No es un capricho de Vercel ni
> de DonWeb.

### 8. Esperar la propagación

Volvé a Vercel, a **Settings → Domains**. El dominio va a pasar de
_Invalid Configuration_ a **Valid**.

Suele tardar entre 10 minutos y 2 horas. Puede llegar a 24 hs, aunque es raro.

Para chequear desde la terminal:

```bash
dig +short tu-dominio.com.ar
dig +short www.tu-dominio.com.ar
```

El primero tiene que devolver la IP de Vercel, el segundo el `cname.vercel-dns.com`.

### 9. HTTPS

No hay que hacer nada. Cuando el DNS resuelve, Vercel emite el certificado solo y
renueva solo. Si tarda unos minutos después de validar el dominio, es normal.

### 10. Verificación final

Con el dominio andando, revisá:

- `https://tu-dominio.com.ar` abre el sitio.
- `https://www.tu-dominio.com.ar` redirige al anterior.
- `http://` redirige a `https://`.
- Entrar directo a `https://tu-dominio.com.ar/goles` funciona y no da 404.
- Compartir un link en WhatsApp muestra título y descripción.

Si lo último falla, revisá que `VITE_SITE_URL` esté cargada **y que hayas hecho un
deploy después de cargarla** (ver la sección siguiente).

---

## Qué necesita un deploy nuevo y qué no

Esto confunde seguido, así que conviene tenerlo claro:

| Cambio                               | ¿Necesita redeploy?                           |
| ------------------------------------ | --------------------------------------------- |
| Agregar un campeonato en la planilla | **No.** Aparece al recargar la web            |
| Cargar partidos o goleadores         | **No.** Igual que arriba                      |
| Foto de plantel o logo de torneo     | **Sí.** Son archivos del sitio                |
| Videos de goles                      | **Sí.** El manifiesto es un archivo del sitio |
| Cambiar `VITE_SITE_URL`              | **Sí.** Ver abajo                             |

### Las variables `VITE_` se congelan en el build

Una variable `VITE_*` no se lee cuando alguien visita la página: se incrusta en el
código **en el momento del build**. Si la cambiás en Vercel, el sitio publicado
sigue con el valor viejo hasta que se vuelva a construir.

Para forzarlo: **Deployments → el último → menú `···` → Redeploy**.

---

## Problemas frecuentes

| Síntoma                                        | Causa probable                                                              |
| ---------------------------------------------- | --------------------------------------------------------------------------- |
| `www` da "conexión no privada"                 | Falta agregar `www` como dominio en Vercel: sin eso no emite su certificado |
| El dominio muestra una página de DonWeb        | Quedó un registro A o CNAME viejo apuntando al hosting de DonWeb            |
| Vercel dice _Invalid Configuration_            | El DNS todavía no propagó, o el registro se cargó con el nombre equivocado  |
| `/goles` da 404 al entrar directo              | Falta el rewrite. Verificá que `vercel.json` esté commiteado                |
| El link compartido no muestra título ni imagen | Falta `VITE_SITE_URL`, o se cargó pero no se hizo redeploy                  |
| El deploy falla                                | Leé el log. Reproducilo local con `npm run validate`                        |
| Se ve el sitio viejo después de publicar       | Caché del navegador. Probá en ventana privada                               |

## La imagen que se ve al compartir

Cuando pasás un link por WhatsApp, Instagram o X, esas apps **no ejecutan el
JavaScript** del sitio: leen el HTML crudo y nada más. Por eso las etiquetas de la
tarjeta social están escritas directamente en `index.html`, no generadas por
React.

La imagen es `public/og-image.png` (1200×630) y se genera con:

```bash
npm run assets:og-image
```

Es una composición con el escudo, el nombre y el dominio: a propósito **no** es una
captura del sitio, porque en el celular la tarjeta se ve a unos 400 px de ancho y
el texto de una página resulta ilegible.

Si cambiás el dominio, actualizá las URLs absolutas de `og:url`, `og:image` y
`twitter:image` en `index.html`. Tienen que ser absolutas: una ruta relativa la
ignoran los crawlers.

Para probar cómo quedó, sin esperar a que alguien comparta el link:

- <https://developers.facebook.com/tools/debug/> (WhatsApp usa el mismo dato)
- <https://cards-dev.twitter.com/validator>

Las dos cachean. Si cambiaste la imagen y seguís viendo la vieja, usá el botón de
volver a leer (_Scrape Again_).

## Fijar la versión de Node (opcional)

Vercel elige una versión de Node por su cuenta. Si querés que sea siempre la misma
que usás local, entrá a **Settings → General → Node.js Version** y elegila. El
proyecto necesita Node 20.19 o superior.
