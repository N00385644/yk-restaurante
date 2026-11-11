/**
 * CONFIGURACIÓN CENTRAL — RESTAURANTE YK
 * ============================================================
 * Toda la información comercial del negocio vive en este archivo.
 * Para actualizar la web solo edita los valores de aquí.
 *
 * DATOS PENDIENTES POR CONFIRMAR:
 * - Números de información y delivery (whatsapp incluido).
 * - Dirección exacta y referencia del local.
 *
 * NOTA: el menú se muestra sin imágenes, tal como lo pidió el cliente.
 */
window.SITE_CONFIG = {
  restaurante: {
    nombre: "YK",
    eslogan: "Sazón casera de 7 a 3.",
    descripcionCorta: "Desayunos, menú del día y platos a la carta. Delivery a domicilio.",
    descripcionLarga: "En YK empezamos temprano con caldos, panes y avena; al mediodía servimos el menú del día y platos a la carta. Atendemos todos los días de 7:00 a.m. a 3:00 p.m. y llevamos tu pedido a domicilio.",
    ciudad: "",
    direccion: "",
    referencia: "",
    indicacionesEntrada: "",
    gps: null,
    // Números de la empresa: completa ambos para activar llamadas y WhatsApp.
    telefonoInfo: "",
    telefonoDelivery: "",
    telefono: "",
    telefonoLink: "",
    // WhatsApp con código de país, sin + ni espacios. Ej: "51987654321".
    // Si queda vacío, la web muestra los pedidos como "por confirmar".
    whatsapp: "",
    email: "",
    horarios: [
      { dias: "Lunes a domingo", horas: "7:00 a.m. – 3:00 p.m." }
    ],
    modalidades: ["local", "delivery"],
    metodosPago: [],
    redes: {},
    logoTexto: "YK",
    coloresNota: "Terracota, crema y dorado"
  },

  whatsappMensajes: {
    general: "¡Hola! Vi la página web de YK y quisiera consultar por el menú.",
    pedidoIntro: "¡Hola! Quisiera hacer un pedido desde la web de YK:"
  },

  // El cliente pidió el menú sin imágenes.
  imagenesProvisionales: false,

  categorias: [
    { id: "todos", nombre: "Todo" },
    { id: "desayunos", nombre: "Desayunos", descripcion: "Desde las 7:00 a.m." },
    { id: "entradas", nombre: "Entradas del menú", descripcion: "Incluidas con el menú del día." },
    { id: "segundos", nombre: "Segundos", descripcion: "Opciones de S/ 7 y S/ 8." },
    { id: "carta", nombre: "A la carta", descripcion: "Platos especiales y a pedido." },
    { id: "bebidas", nombre: "Bar y bebidas", descripcion: "Precios a consultar en el local." }
  ],

  menu: [
    /* ---------------- DESAYUNOS ---------------- */
    { id: "d-caldo-pata", categoria: "desayunos", nombre: "Caldo de pata", precio: 10, disponible: true },
    { id: "d-caldo-gallina", categoria: "desayunos", nombre: "Caldo de gallina", precio: 8, disponible: true },
    { id: "d-caldo-verde", categoria: "desayunos", nombre: "Caldo verde", precio: 7, disponible: true },
    { id: "d-avena", categoria: "desayunos", nombre: "Avena sola", descripcion: "La taza.", precio: 1.5, disponible: true },
    { id: "d-cafe", categoria: "desayunos", nombre: "Café", precio: 1, disponible: true },
    { id: "d-pan-huevo", categoria: "desayunos", nombre: "Pan con huevo", precio: 1.5, disponible: true },
    { id: "d-pan-queso", categoria: "desayunos", nombre: "Pan con queso", precio: 1.5, disponible: true },
    { id: "d-pan-jamon", categoria: "desayunos", nombre: "Pan con jamón", precio: 1.5, disponible: true },
    { id: "d-pan-palta", categoria: "desayunos", nombre: "Pan con palta", precio: 1.5, disponible: true },

    /* ---------------- ENTRADAS DEL MENÚ ---------------- */
    { id: "e-fruta", categoria: "entradas", nombre: "Ensalada de fruta", precio: 0, precioTexto: "Incluida", disponible: true },
    { id: "e-sopa", categoria: "entradas", nombre: "Sopa de casa", precio: 0, precioTexto: "Incluida", disponible: true },
    { id: "e-ocopa", categoria: "entradas", nombre: "Ocopa", precio: 0, precioTexto: "Incluida", disponible: true },
    { id: "e-huancaina", categoria: "entradas", nombre: "Papa a la huancaína", precio: 0, precioTexto: "Incluida", disponible: true },
    { id: "e-tamales", categoria: "entradas", nombre: "Tamales", precio: 0, precioTexto: "Incluida", disponible: true },
    { id: "e-filete", categoria: "entradas", nombre: "Ensalada de filete", precio: 0, precioTexto: "Incluida", disponible: true },

    /* ---------------- SEGUNDOS S/ 7 ---------------- */
    { id: "s-seco-cordero", categoria: "segundos", nombre: "Seco de cordero", precio: 7, disponible: true },
    { id: "s-cabrito", categoria: "segundos", nombre: "Cabrito a la norteña", precio: 7, disponible: true },
    { id: "s-estofado", categoria: "segundos", nombre: "Estofado de pollo", precio: 7, disponible: true },
    { id: "s-guiso-pollo", categoria: "segundos", nombre: "Guiso de pollo", precio: 7, disponible: true },
    { id: "s-tallarin-pollo", categoria: "segundos", nombre: "Tallarín con pollo", precio: 7, disponible: true },
    { id: "s-adobo", categoria: "segundos", nombre: "Adobo de chancho", precio: 7, disponible: true },
    { id: "s-chaufa", categoria: "segundos", nombre: "Arroz chaufa", precio: 7, disponible: true },
    { id: "s-patita-mani", categoria: "segundos", nombre: "Patita de chancho con maní", precio: 7, disponible: true },
    { id: "s-trucha", categoria: "segundos", nombre: "Trucha frita", descripcion: "Entera: S/ 14.", precio: 7, disponible: true },

    /* ---------------- SEGUNDOS S/ 8 ---------------- */
    { id: "s-tallarin-saltado", categoria: "segundos", nombre: "Tallarín saltado", precio: 8, disponible: true },
    { id: "s-lomo", categoria: "segundos", nombre: "Lomo saltado", precio: 8, disponible: true },
    { id: "s-chuleta", categoria: "segundos", nombre: "Chuleta frita", descripcion: "También en porción de S/ 15.", precio: 8, disponible: true },
    { id: "s-milanesa", categoria: "segundos", nombre: "Milanesa", precio: 8, disponible: true },
    { id: "s-broaster", categoria: "segundos", nombre: "Broaster", precio: 8, disponible: true },

    /* ---------------- A LA CARTA ---------------- */
    { id: "c-ceviche", categoria: "carta", nombre: "Ceviche de trucha", descripcion: "La fuente.", precio: 25, disponible: true },
    { id: "c-bistec", categoria: "carta", nombre: "Bistec a la pobre", descripcion: "También en porción de S/ 15.", precio: 8, disponible: true },
    { id: "c-cuy-entero", categoria: "carta", nombre: "Cuy entero", precio: 60, disponible: true, etiqueta: "A pedido" },
    // Precio tal como lo proporcionó el cliente; confirmar si el medio cuy es S/ 10 o S/ 30.
    { id: "c-cuy-medio", categoria: "carta", nombre: "Medio cuy", precio: 10, disponible: true, etiqueta: "A pedido" },
    { id: "c-cuy-cuarto", categoria: "carta", nombre: "Cuarto de cuy", precio: 15, disponible: true, etiqueta: "A pedido" },
    { id: "c-patada", categoria: "carta", nombre: "Patada (guiso de pato)", descripcion: "Guiso de pato.", precio: null, disponible: true, etiqueta: "A pedido" },
    { id: "c-chuletas", categoria: "carta", nombre: "Chuletas con papa nativa", precio: 15, disponible: true },

    /* ---------------- BAR Y BEBIDAS ---------------- */
    { id: "b-gaseosas", categoria: "bebidas", nombre: "Gaseosas", descripcion: "Coca-Cola, Inca Kola, Fanta y Sprite.", precio: null, disponible: true },
    { id: "b-frugos", categoria: "bebidas", nombre: "Frugos del Valle", descripcion: "Jugos y néctares.", precio: null, disponible: true },
    { id: "b-energizantes", categoria: "bebidas", nombre: "Energizantes", descripcion: "Power, Volt y Sporet.", precio: null, disponible: true },
    { id: "b-cervezas", categoria: "bebidas", nombre: "Cervezas", precio: null, disponible: true },
    { id: "b-pisco", categoria: "bebidas", nombre: "Pisco", precio: null, disponible: true },
    { id: "b-whisky", categoria: "bebidas", nombre: "Whisky", precio: null, disponible: true }
  ],

  faq: [
    { p: "¿Cuál es el horario de atención?", r: "Atendemos todos los días de 7:00 a.m. a 3:00 p.m." },
    { p: "¿Cuánto cuesta el menú del día?", r: "Los segundos del menú están entre S/ 7 y S/ 8. El menú incluye entrada. También hay platos a la carta de S/ 12 y S/ 15." },
    { p: "¿Qué incluye el menú del día?", r: "Incluye una entrada y un segundo. Consulta las entradas y segundos disponibles en la sección Menú." },
    { p: "¿Hacen delivery?", r: "Sí. Contamos con delivery a domicilio. Coordina tu pedido por WhatsApp." },
    { p: "¿Aceptan platos a pedido?", r: "Sí. El cuy y la patada se preparan a pedido; consulta disponibilidad y tiempo de preparación." },
    { p: "¿Qué bebidas ofrecen?", r: "Gaseosas, Frugos del Valle, energizantes y licores como cervezas, pisco y whisky." },
    { p: "¿Tienen promociones?", r: "No contamos con promociones por el momento." },
    { p: "¿Qué métodos de pago aceptan?", r: "Consulta los métodos de pago al momento de hacer tu pedido." },
    { p: "¿Cuáles son los números de información y delivery?", r: "Los números de atención están pendientes de confirmación por el negocio." }
  ],

  resenas: []
};
