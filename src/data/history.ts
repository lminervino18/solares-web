import type { HistoryChapter, HistoryPhoto } from '@/types/history'

import photo0Jpg from '@/assets/solares/history/photo-0.jpg'
import photo0Webp from '@/assets/solares/history/photo-0.webp'
import photo1Jpg from '@/assets/solares/history/photo-1.jpg'
import photo1Webp from '@/assets/solares/history/photo-1.webp'
import photo2Jpg from '@/assets/solares/history/photo-2.jpg'
import photo2Webp from '@/assets/solares/history/photo-2.webp'
import photo3Jpg from '@/assets/solares/history/photo-3.jpg'
import photo3Webp from '@/assets/solares/history/photo-3.webp'
import photo4Jpg from '@/assets/solares/history/photo-4.jpg'
import photo4Webp from '@/assets/solares/history/photo-4.webp'
import photo5Jpg from '@/assets/solares/history/photo-5.jpg'
import photo5Webp from '@/assets/solares/history/photo-5.webp'
import photo6Jpg from '@/assets/solares/history/photo-6.jpg'
import photo6Webp from '@/assets/solares/history/photo-6.webp'
import photo7Jpg from '@/assets/solares/history/photo-7.jpg'
import photo7Webp from '@/assets/solares/history/photo-7.webp'
import photo8Jpg from '@/assets/solares/history/photo-8.jpg'
import photo8Webp from '@/assets/solares/history/photo-8.webp'
import photo9Jpg from '@/assets/solares/history/photo-9.jpg'
import photo9Webp from '@/assets/solares/history/photo-9.webp'
import photo10Jpg from '@/assets/solares/history/photo-10.jpg'
import photo10Webp from '@/assets/solares/history/photo-10.webp'

export const historyPhotos: Record<string, HistoryPhoto> = {
  'photo-0': {
    id: 'photo-0',
    src: photo0Jpg,
    webp: photo0Webp,
    width: 1179,
    height: 975,
    alt: 'Plantel juvenil de Solares con camiseta naranja posando con un trofeo en una cancha de césped, en un día soleado.',
  },
  'photo-1': {
    id: 'photo-1',
    src: photo1Jpg,
    webp: photo1Webp,
    width: 1179,
    height: 766,
    alt: 'Plantel de Solares con camiseta roja y blanca sosteniendo una bandera naranja de la escuela de entrenamiento, en una cancha de césped.',
  },
  'photo-2': {
    id: 'photo-2',
    src: photo2Jpg,
    webp: photo2Webp,
    width: 1280,
    height: 719,
    alt: 'Dos planteles juveniles posando juntos en una cancha de tierra antes de un partido, uno con camiseta naranja y otro con camiseta blanca y azul.',
  },
  'photo-3': {
    id: 'photo-3',
    src: photo3Jpg,
    webp: photo3Webp,
    width: 1280,
    height: 853,
    alt: 'Plantel de Solares con camiseta blanca, negra y naranja posando en una cancha de fútbol techada durante la noche.',
  },
  'photo-4': {
    id: 'photo-4',
    src: photo4Jpg,
    webp: photo4Webp,
    width: 1179,
    height: 1045,
    alt: 'Plantel de Solares con camiseta violeta y celeste posando en una cancha sintética durante la noche.',
  },
  'photo-5': {
    id: 'photo-5',
    src: photo5Jpg,
    webp: photo5Webp,
    width: 1179,
    height: 870,
    alt: 'Plantel adulto de Solares con camiseta violeta y celeste posando en una cancha sintética iluminada de noche.',
  },
  'photo-6': {
    id: 'photo-6',
    src: photo6Jpg,
    webp: photo6Webp,
    width: 1179,
    height: 1070,
    alt: 'Plantel adulto de Solares con camiseta violeta numerada posando en una cancha sintética de noche.',
  },
  'photo-7': {
    id: 'photo-7',
    src: photo7Jpg,
    webp: photo7Webp,
    width: 1179,
    height: 1061,
    alt: 'Jugadores y allegados de Solares sosteniendo la bandera del equipo con el lema Toro en mi rodeo y torazo en rodeo ajeno, celebrando en una cancha sintética.',
  },
  'photo-8': {
    id: 'photo-8',
    src: photo8Jpg,
    webp: photo8Webp,
    width: 960,
    height: 1280,
    alt: 'Plantel de Solares Buenos Aires celebrando junto a la bandera del equipo, con un trofeo y una bota de oro, en una cancha sintética.',
  },
  'photo-9': {
    id: 'photo-9',
    src: photo9Jpg,
    webp: photo9Webp,
    width: 1600,
    height: 1066,
    alt: 'Plantel de Solares posando frente al arco con camiseta violeta y celeste, en una cancha de césped iluminada de noche.',
  },
  'photo-10': {
    id: 'photo-10',
    src: photo10Jpg,
    webp: photo10Webp,
    width: 1600,
    height: 1200,
    alt: 'Plantel de Solares celebrando de noche con un trofeo y una bandera blanca que dice Campeón 2021 junto al escudo del equipo.',
  },
}
export const historyChapters: readonly HistoryChapter[] = [
  {
    id: 'todo-empezo-en-un-barrio',
    title: 'Todo empezó en un barrio',
    blocks: [
      {
        type: 'paragraph',
        text: 'Solares nació en Cipolletti, Río Negro, durante los primeros días de abril de 2014. En ese momento no había camisetas, cancha fija, torneo ni una estructura detrás. Solamente existía la intención de un grupo de chicos del barrio que quería formar un equipo y jugar al fútbol.',
      },
      {
        type: 'paragraph',
        text: 'La iniciativa comenzó con apenas cinco jugadores. Como no alcanzaban para completar un equipo, empezaron a reclutar amigos, compañeros del colegio y conocidos de todos lados. Poco a poco, aquella idea que parecía un tanto improvisada empezó a tomar forma.',
      },
      {
        type: 'paragraph',
        text: 'El sábado 12 de abril de 2014 se realizó el primer entrenamiento de la historia de Solares. Hubo una pelota, dos conos y muchas ganas. No hacía falta más. Ese día todavía nadie podía imaginar hasta dónde llegaría el club, pero se trató del primer paso necesario para poner en marcha su historia oficial.',
      },
    ],
  },
  {
    id: 'los-primeros-partidos',
    title: 'Los primeros partidos',
    blocks: [
      {
        type: 'paragraph',
        text: 'A finales de ese mismo mes llegó el primer amistoso. El rival fue San Pablo y el partido tuvo lugar en una cancha de fútbol 8 del complejo Duronia. Solares, que tenía apenas diez jugadores, se encontró frente a un equipo mucho más numeroso y experimentado.',
      },
      {
        type: 'paragraph',
        text: 'El saldo fue una derrota inapelable por 4 a 0. Sin embargo, el resultado fue lo menos importante: por primera vez, el equipo había entrado a una cancha con su propio nombre.',
      },
      {
        type: 'paragraph',
        text: 'A partir de ese encuentro se sumó una persona encargada de organizar los entrenamientos, y así el grupo empezó a reunirse todos los sábados a las dos de la tarde en la plaza de Los Tordos. Ahí se trabajaba, se aprendía y se construía una identidad a la que todavía le faltaba rodaje, pero le sobraba compromiso.',
      },
      {
        type: 'paragraph',
        text: 'Dos semanas después, Solares volvió a enfrentar a San Pablo, esta vez en cancha de once. El Toro Violeta (que aún no se percibía como tal) volvió a perder, esta vez por 4 a 1, pero se dio el gusto de celebrar el primer gol de su historia, obra de Santiago Campitelli.',
      },
    ],
  },
  {
    id: 'la-primera-victoria',
    title: 'La primera victoria y el salto a la competencia',
    blocks: [
      {
        type: 'paragraph',
        text: 'El plantel siguió creciendo. Unos dos meses después de aquel sábado de abril llegó el tercer amistoso, frente a Pillmatún, y la primera victoria de su historia para Solares, que se impuso por 2 a 1.',
      },
      {
        type: 'paragraph',
        text: 'Ese triunfo confirmó que el equipo podía competir. Después llegaron nuevos amistosos contra distintos clubes y equipos de Cipolletti. Cada partido servía para ganar experiencia, sumar jugadores y fortalecer al grupo.',
      },
      {
        type: 'paragraph',
        text: 'El siguiente paso fue ingresar por primera vez a una competencia oficial: la Liga Municipal.',
      },
      {
        type: 'paragraph',
        text: 'En aquel torneo, Solares ganó cuatro partidos, empató uno y perdió tres. La campaña terminó en los cuartos de final, con una derrota por 3 a 0 frente a Los Humildes. El equipo todavía estaba lejos de su mejor versión, pero ya había dejado de ser solamente un equipo de amigos.',
      },
      {
        type: 'paragraph',
        text: 'Durante ese mismo período, los entrenamientos se trasladaron de la plaza de Los Tordos a Canchas González. El año terminó con una comida compartida frente al Parque Rosauer. Habían pasado apenas unos meses desde aquel primer entrenamiento bajo el sol de otoño, pero Solares ya había escrito el preámbulo de su historia.',
      },
      { type: 'figure', photoId: 'photo-1' },
    ],
  },
  {
    id: 'un-equipo-que-no-paraba-de-crecer',
    title: 'Un equipo que no paraba de crecer',
    blocks: [
      {
        type: 'paragraph',
        text: 'En 2015 comenzó una nueva etapa. Alrededor del equipo se desarrolló J.E.M, una escuela de entrenamiento que reunía jugadores de distintos clubes y tenía a Solares como una de sus bases principales.',
      },
      {
        type: 'paragraph',
        text: 'La pretemporada se realizó en las canchas de Confluencia y, más adelante, Duronia se convirtió en el lugar habitual de entrenamiento.',
      },
      {
        type: 'paragraph',
        text: 'El crecimiento fue enorme. De aquel pequeño puñado inicial, Solares pasó a reunir cerca de cuarenta jugadores. Esta expansión permitió presentar dos categorías en la Liga Municipal y ampliar el proyecto mucho más allá de lo que se había imaginado durante el primer año.',
      },
      {
        type: 'paragraph',
        text: 'Una de esas divisiones consiguió buenos resultados y estuvo cerca de avanzar en un torneo clasificatorio. En un triangular decisivo, Solares empató frente a Los Humildes y luego ganó 5 a 0 su siguiente partido. La clasificación se escapó solamente por diferencia de gol.',
      },
      {
        type: 'paragraph',
        text: 'Aunque no alcanzó para avanzar, aquella campaña dejó la certeza de que Solares ya podía competir de igual a igual contra cualquiera.',
      },
    ],
  },
  {
    id: 'la-camiseta-naranja',
    title: 'La camiseta naranja y una campaña inolvidable',
    blocks: [
      { type: 'figure', photoId: 'photo-0' },
      {
        type: 'paragraph',
        text: 'Durante el Torneo Clausura de 2015 apareció una de las camisetas más recordadas de la historia del equipo: la camiseta naranja.',
      },
      {
        type: 'paragraph',
        text: 'El campeonato comenzó con un empate sin goles frente a Los Humildes. Después de aquel partido, Solares encadenó catorce victorias consecutivas. Su principal rival también ganó todos sus encuentros, por lo que ambos equipos terminaron igualados y tuvieron que definir el título en un mano a mano por la gloria.',
      },
      {
        type: 'paragraph',
        text: 'Solares comenzó ganando 1 a 0 y se fue al entretiempo en ventaja. En la segunda mitad, dos goles en contra cambiaron el desarrollo de la final y dejaron al equipo sin el campeonato.',
      },
      {
        type: 'paragraph',
        text: 'La derrota fue dolorosa, pero quedó grabada como el cierre de una de las primeras grandes demostraciones competitivas de Solares.',
      },
      {
        type: 'paragraph',
        text: 'En aquella etapa también se produjo uno de los viajes más importantes de la institución: Solares fue a Buenos Aires para jugar contra Vélez. La experiencia reunió a jugadores de Solares y de otros equipos, y representó un hito que hasta poco tiempo atrás parecía imposible para un proyecto que había nacido con dos conos y una pelota.',
      },
      { type: 'figure', photoId: 'photo-2' },
    ],
  },
  {
    id: 'la-pausa',
    title: 'La pausa',
    blocks: [
      {
        type: 'paragraph',
        text: 'El año 2016 comenzó con nuevas expectativas. Solares disputó la Game Cup y llegó hasta los cuartos de final. Más tarde inició una nueva edición de la Liga Municipal con cuatro victorias consecutivas y una buena diferencia de gol.',
      },
      {
        type: 'paragraph',
        text: 'Entre esos resultados se puede destacar un triunfo por 3 a 0 frente a Los Humildes y otro por 2 a 1 contra uno de los rivales más difíciles del torneo.',
      },
      {
        type: 'paragraph',
        text: 'El equipo atravesaba uno de sus mejores momentos, pero una serie de lluvias e inundaciones provocó la suspensión de varias fechas. Finalmente, el campeonato quedó interrumpido.',
      },
      {
        type: 'paragraph',
        text: 'Con el paso del tiempo, aquella etapa de Solares en el fútbol 11 llegó a su fin. El equipo dejó de competir y la historia entró en un punto muerto.',
      },
      {
        type: 'paragraph',
        text: 'Pero el corazón de Solares seguía latiendo.',
      },
    ],
  },
  {
    id: 'el-renacimiento',
    title: 'El renacimiento',
    blocks: [
      {
        type: 'paragraph',
        text: 'En 2018, Agus Lorenzo decidió recuperar el equipo. Para hacerlo contó con Lorenzo Minervino, quien se convirtió en una pieza fundamental de la nueva etapa.',
      },
      {
        type: 'paragraph',
        text: 'Solares volvió a competir por torneos, primero en Perilli (fútbol 7) y luego en Rayada (fútbol 8). Durante los años siguientes participó de distintas competencias, formó nuevos grupos y recuperó esa costumbre de encontrarse semana a semana alrededor de una cancha.',
      },
      {
        type: 'paragraph',
        text: 'El grupo, claro, ya no era el mismo de 2014. Habían cambiado los jugadores, los torneos y los lugares. No obstante, la esencia era la misma: un grupo de amigos que se juntaba para jugar, competir y defender el escudo de Solares.',
      },
      { type: 'gallery', photoIds: ['photo-3', 'photo-4', 'photo-9', 'photo-10'] },
    ],
  },
  {
    id: 'de-cipolletti-a-buenos-aires',
    title: 'De Cipolletti a Buenos Aires',
    blocks: [
      {
        type: 'paragraph',
        text: 'En 2022, Lorenzo Minervino se trasladó a Capital Federal para estudiar. Ese viaje abrió una nueva etapa para el club.',
      },
      {
        type: 'paragraph',
        text: 'Solares pasó a dividirse en dos equipos, separados por más de 1000 kilómetros pero hermanados por sus raíces: Solares Cipolletti y Solares Buenos Aires.',
      },
      {
        type: 'paragraph',
        text: 'Lorenzo Minervino fundó la nueva sede en Capital Federal, inscribió al equipo en un torneo de fútbol 8 y comenzó a reunir jugadores para volver a construir un plantel desde el principio.',
      },
      {
        type: 'paragraph',
        text: 'El desafío se parecía mucho al de 2014. Otra ciudad, otras canchas y nuevas personas, pero con la intención intacta de convertir un grupo de conocidos en algo mucho más grande.',
      },
      {
        type: 'paragraph',
        text: 'Esta página está centrada principalmente en la historia y la actualidad de Solares Buenos Aires, pero nada de lo que sucede hoy puede entenderse sin recordar el barrio, los primeros amistosos, la plaza de Los Tordos, las tardes en Duronia, la camiseta naranja y todos los que alguna vez formaron parte del camino.',
      },
      {
        type: 'paragraph',
        text: 'Solares nació en Cipolletti y encontró una nueva casa en Buenos Aires.',
      },
      {
        type: 'paragraph',
        text: 'La ciudad cambió. La historia siguió adelante. El alma sigue siendo la misma.',
      },
      { type: 'gallery', photoIds: ['photo-5', 'photo-6', 'photo-7', 'photo-8'] },
    ],
  },
]
