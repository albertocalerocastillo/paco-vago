import { createContext, useContext, useState, useEffect, useCallback } from 'react';

/**
 * Carrito de la tienda. Estado global (Context) que se guarda en localStorage,
 * así sobrevive a recargas. Solo se añaden productos CON precio.
 *
 * item: { id, nombre, precio, foto, cantidad }
 */
const CarritoContext = createContext(null);
const STORAGE_KEY = 'pacovago_carrito';

export function CarritoProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  });
  const [abierto, setAbierto] = useState(false); // panel lateral (mini-carrito)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* almacenamiento no disponible: el carrito vive solo en memoria */
    }
  }, [items]);

  const añadir = useCallback((producto, cantidad = 1) => {
    const id = producto.id ?? producto.nombre; // fallback por si no hay id (catálogo estático)
    setItems(prev => {
      const i = prev.findIndex(x => x.id === id);
      if (i >= 0) {
        const copia = [...prev];
        copia[i] = { ...copia[i], cantidad: copia[i].cantidad + cantidad };
        return copia;
      }
      return [...prev, { id, nombre: producto.nombre, precio: producto.precio, foto: producto.src, cantidad }];
    });
    setAbierto(true); // al añadir, abre el mini-carrito
  }, []);

  const cambiarCantidad = useCallback((id, cantidad) => {
    setItems(prev => prev.map(x => (x.id === id ? { ...x, cantidad: Math.max(1, cantidad) } : x)));
  }, []);

  const quitar = useCallback((id) => setItems(prev => prev.filter(x => x.id !== id)), []);
  const vaciar = useCallback(() => setItems([]), []);
  const abrirCarrito = useCallback(() => setAbierto(true), []);
  const cerrarCarrito = useCallback(() => setAbierto(false), []);

  const cantidadTotal = items.reduce((s, x) => s + x.cantidad, 0);
  const total = items.reduce((s, x) => s + (Number(x.precio) || 0) * x.cantidad, 0);

  return (
    <CarritoContext.Provider
      value={{ items, añadir, cambiarCantidad, quitar, vaciar, cantidadTotal, total, abierto, abrirCarrito, cerrarCarrito }}
    >
      {children}
    </CarritoContext.Provider>
  );
}

export function useCarrito() {
  const ctx = useContext(CarritoContext);
  if (!ctx) throw new Error('useCarrito debe usarse dentro de <CarritoProvider>');
  return ctx;
}
