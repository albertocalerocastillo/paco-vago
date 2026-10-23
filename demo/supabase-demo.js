/**
 * Supabase de mentira para el modo demo del panel (ver vite.demo.config.js).
 *
 * - Sesión iniciada sin contraseña.
 * - Categorías y productos: se LEEN de la web real con la clave pública (lo
 *   mismo que ve cualquier visitante), para que el diseño se pruebe con datos
 *   de verdad. Nunca se escribe en la base de datos real.
 * - Pedidos y desistimientos: inventados.
 * - Todo cambio (guardar, borrar, marcar enviado, subir foto) se queda en
 *   memoria y se pierde al recargar.
 */

const URL_SB = import.meta.env.VITE_SUPABASE_URL;
const CLAVE = import.meta.env.VITE_SUPABASE_ANON_KEY;

const hace = (horas) => new Date(Date.now() - horas * 3600e3).toISOString();

const tablas = {
  categorias: null, // se carga de la web real
  pedidos: [
    {
      id: 101, referencia: 'PV-DEMO01', estado: 'pagado', email: 'maria.garcia@example.com',
      nombre: 'María García López', telefono: '+34600111222',
      direccion: { calle: 'Calle Real 12', piso: '2º A', cp: '41001', localidad: 'Sevilla', provincia: 'Sevilla' },
      lineas: [
        { nombre: 'AOVE de Carmona 5 L', cantidad: 1, precio: 35, importe: 35 },
        { nombre: 'Gildas Lopyleo de fuet · 6 uds', cantidad: 2, precio: 10.75, importe: 21.5 },
      ],
      subtotal: 56.5, porte: 18, total: 74.5, peso_total: 6.5,
      quiere_factura: true, nif: '12345678Z', nota: 'Si no estoy, dejadlo en el bar de abajo.',
      creado_en: hace(2), pagado_en: hace(2), enviado_en: null,
    },
    {
      id: 102, referencia: 'PV-DEMO02', estado: 'pagado', email: 'antonio.ruiz@example.com',
      nombre: 'Antonio Ruiz', telefono: '+34600333444',
      direccion: { calle: 'Calle Prim 5', piso: '', cp: '41410', localidad: 'Carmona', provincia: 'Sevilla' },
      lineas: [{ nombre: 'Gildas de anchoa Lotamar · 15 uds', cantidad: 1, precio: 17.95, importe: 17.95 }],
      subtotal: 17.95, porte: 0, total: 17.95, peso_total: 0.85,
      quiere_factura: false, nif: null, nota: null,
      creado_en: hace(5), pagado_en: hace(5), enviado_en: null,
    },
    {
      id: 103, referencia: 'PV-DEMO03', estado: 'revisar', email: 'listillo@example.com',
      nombre: 'Pedro Listillo', telefono: '+34600555666',
      direccion: { calle: 'Avenida de la Constitución 1', piso: '', cp: '41410', localidad: 'Sevilla', provincia: 'Sevilla' },
      lineas: [{ nombre: 'AOVE de Carmona 2 L', cantidad: 2, precio: 16.5, importe: 33 }],
      subtotal: 33, porte: 0, total: 33, peso_total: 4.6,
      quiere_factura: false, nif: null, nota: null,
      creado_en: hace(20), pagado_en: hace(20), enviado_en: null,
    },
    {
      id: 104, referencia: 'PV-DEMO04', estado: 'enviado', email: 'lucia@example.com',
      nombre: 'Lucía Fernández', telefono: '+34600777888',
      direccion: { calle: 'Calle Mayor 33', piso: '1º', cp: '28013', localidad: 'Madrid', provincia: 'Madrid' },
      lineas: [{ nombre: 'AOVE de Carmona 1 L', cantidad: 3, precio: 8.5, importe: 25.5 }],
      subtotal: 25.5, porte: 6.5, total: 32, peso_total: 3,
      quiere_factura: false, nif: null, nota: null,
      creado_en: hace(72), pagado_en: hace(72), enviado_en: hace(48),
    },
  ],
  desistimientos: [
    {
      id: 201, referencia: 'DS-DEMO01', pedido_ref: 'PV-DEMO04', pedido_id: 104,
      nombre: 'Lucía Fernández', email: 'lucia@example.com',
      productos: 'Una de las tres botellas de 1 L', comentario: 'Me llegó una de más.',
      estado: 'recibido', creado_en: hace(10), tramitado_en: null,
      pedidos: { referencia: 'PV-DEMO04', total: 32, email: 'lucia@example.com' },
    },
  ],
};

async function cargarCategorias() {
  if (tablas.categorias) return tablas.categorias;
  const cols = 'id,titulo,descripcion,tags,orden,productos(id,nombre,descripcion,foto,disponible,precio,peso,orden)';
  const r = await fetch(`${URL_SB}/rest/v1/categorias?select=${encodeURIComponent(cols)}&order=orden`, {
    headers: { apikey: CLAVE, Authorization: `Bearer ${CLAVE}` },
  });
  tablas.categorias = r.ok ? await r.json() : [];
  return tablas.categorias;
}

const todosLosProductos = () => (tablas.categorias || []).flatMap(c => c.productos || []);

/** Constructor de consultas mínimo: lo justo que usa el panel. */
function consulta(tabla) {
  let accion = 'select';
  let valores = null;
  const filtros = [];
  let uno = false;

  const q = {
    select() { return q; },
    order() { return q; },
    limit() { return q; },
    eq(col, val) { filtros.push(f => f[col] === val); return q; },
    in(col, vals) { filtros.push(f => vals.includes(f[col])); return q; },
    update(v) { accion = 'update'; valores = v; return q; },
    insert(v) { accion = 'insert'; valores = v; return q; },
    delete() { accion = 'delete'; return q; },
    single() { uno = true; return q; },
    maybeSingle() { uno = true; return q; },
    then(ok, ko) { return ejecutar().then(ok, ko); },
  };

  async function ejecutar() {
    await new Promise(r => setTimeout(r, 250)); // que se note el "Guardando…"
    if (tabla === 'categorias') {
      const cats = await cargarCategorias();
      if (accion === 'update') cats.filter(c => filtros.every(f => f(c))).forEach(c => Object.assign(c, valores));
      return { data: cats, error: null };
    }
    if (tabla === 'productos') {
      await cargarCategorias();
      if (accion === 'update') {
        todosLosProductos().filter(p => filtros.every(f => f(p))).forEach(p => Object.assign(p, valores));
        return { data: null, error: null };
      }
      if (accion === 'delete') return { data: null, error: null };
      if (accion === 'insert') {
        const nuevo = { id: Math.floor(Math.random() * 1e6), ...valores };
        return { data: uno ? nuevo : [nuevo], error: null };
      }
      return { data: todosLosProductos(), error: null };
    }
    const filas = tablas[tabla] || [];
    const elegidas = filas.filter(f => filtros.every(fn => fn(f)));
    if (accion === 'update') { elegidas.forEach(f => Object.assign(f, valores)); return { data: null, error: null }; }
    return { data: uno ? elegidas[0] ?? null : elegidas.map(f => ({ ...f })), error: null };
  }

  return q;
}

export const supabase = {
  from: consulta,
  auth: {
    getSession: async () => ({ data: { session: { user: { email: 'demo@pacovago.es' } } } }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
    signInWithPassword: async () => ({ error: null }),
    signOut: async () => { window.alert('Modo demo: no se cierra la sesión.'); },
  },
  storage: {
    from: () => ({
      upload: async () => { await new Promise(r => setTimeout(r, 600)); return { error: null }; },
      getPublicUrl: () => ({ data: { publicUrl: '/fotos/aceite.jpg' } }),
    }),
  },
};
