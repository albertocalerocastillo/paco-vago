import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { calcularPorte } from '../data/envios';

/**
 * Carrito de la tienda. Estado global (Context) que se guarda en localStorage,
 * así sobrevive a recargas. Solo se añaden productos con precio Y peso: sin
 * peso no se puede calcular el porte, así que esos se piden por WhatsApp.
 *
 * item: { id, nombre, precio, peso, foto, cantidad }
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
      return [...prev, { id, nombre: producto.nombre, precio: producto.precio, peso: producto.peso ?? null, foto: producto.src, cantidad }];
    });
  }, []);

  const cambiarCantidad = useCallback((id, cantidad) => {
    setItems(prev => prev.map(x => (x.id === id ? { ...x, cantidad: Math.max(1, cantidad) } : x)));
  }, []);

  const quitar = useCallback((id) => setItems(prev => prev.filter(x => x.id !== id)), []);
  const vaciar = useCallback(() => setItems([]), []);
  const abrirCarrito = useCallback(() => setAbierto(true), []);
  const cerrarCarrito = useCallback(() => setAbierto(false), []);

  const cantidadTotal = items.reduce((s, x) => s + x.cantidad, 0);
  const subtotal = items.reduce((s, x) => s + (Number(x.precio) || 0) * x.cantidad, 0);

  // Un carrito guardado antes de que existiera el peso puede traer artículos
  // sin él. En ese caso no inventamos un porte: se avisa y se pide por WhatsApp.
  const pesoDesconocido = items.some(x => !(Number(x.peso) > 0));
  const pesoTotal = items.reduce((s, x) => s + (Number(x.peso) || 0) * x.cantidad, 0);
  const porte = pesoDesconocido ? null : calcularPorte(pesoTotal);
  const total = subtotal + (porte ?? 0);

  return (
    <CarritoContext.Provider
      value={{
        items, añadir, cambiarCantidad, quitar, vaciar,
        cantidadTotal, subtotal, pesoTotal, pesoDesconocido, porte, total,
        abierto, abrirCarrito, cerrarCarrito,
      }}
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
