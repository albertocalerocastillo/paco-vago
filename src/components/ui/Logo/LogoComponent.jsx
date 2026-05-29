/**
 * Sello / logo de Paco Vago.
 * @param {number} size   - Tamaño en px (cuadrado).
 * @param {'light'|'dark'} variant - 'light' (sobre fondo claro) o 'dark' (sobre fondo oscuro).
 */
export default function LogoComponent({ size = 48, variant = 'light', className = '' }) {
  const aro = variant === 'dark' ? '#d97706' : '#b45309';
  const texto = variant === 'dark' ? '#fbbf24' : '#b45309';
  const inicial = variant === 'dark' ? '#fafaf9' : '#78350f';
  const hoja = variant === 'dark' ? '#fde68a' : '#78350f';
  const aceituna = variant === 'dark' ? '#fbbf24' : '#b45309';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      className={className}
      role="img"
      aria-label="Paco Vago · Puerta de Sevilla, Carmona · desde 1924"
    >
      <defs>
        <path id="logoTop" d="M 38,100 A 62,62 0 0 1 162,100" />
        <path id="logoBot" d="M 35,100 A 65,65 0 0 0 165,100" />
      </defs>

      {/* Círculos */}
      <circle cx="100" cy="100" r="94" fill="none" stroke={aro} strokeWidth="1.5" />
      <circle cx="100" cy="100" r="87" fill="none" stroke={aro} strokeWidth="4" />

      {/* Texto curvado */}
      <text fontFamily="Georgia, serif" fontSize="16" fontWeight="bold" letterSpacing="4" fill={texto} textAnchor="middle">
        <textPath href="#logoTop" startOffset="50%">PACO · VAGO</textPath>
      </text>
      <text fontFamily="Georgia, serif" fontSize="9.5" letterSpacing="1.5" fill={texto} textAnchor="middle">
        <textPath href="#logoBot" startOffset="50%">PUERTA DE SEVILLA · CARMONA</textPath>
      </text>

      {/* Estrellas laterales */}
      <g fill={texto}>
        <path d="M11,93 L12.8,98.2 L18,100 L12.8,101.8 L11,107 L9.2,101.8 L4,100 L9.2,98.2 Z" />
        <path d="M189,93 L190.8,98.2 L196,100 L190.8,101.8 L189,107 L187.2,101.8 L182,100 L187.2,98.2 Z" />
      </g>

      {/* Iniciales */}
      <text x="100" y="98" fontFamily="Georgia, serif" fontSize="46" fontWeight="bold" fill={inicial} textAnchor="middle">PV</text>

      {/* Rama de olivo */}
      <g>
        <path d="M70,116 Q100,122 130,116" fill="none" stroke={aro} strokeWidth="1.6" />
        <g fill={hoja}>
          <ellipse cx="76"  cy="114" rx="5.5" ry="2.4" transform="rotate(-30 76 114)" />
          <ellipse cx="86"  cy="118" rx="5.5" ry="2.4" transform="rotate(-15 86 118)" />
          <ellipse cx="95"  cy="120" rx="5.5" ry="2.4" transform="rotate(-6 95 120)" />
          <ellipse cx="105" cy="120" rx="5.5" ry="2.4" transform="rotate(6 105 120)" />
          <ellipse cx="114" cy="118" rx="5.5" ry="2.4" transform="rotate(15 114 118)" />
          <ellipse cx="124" cy="114" rx="5.5" ry="2.4" transform="rotate(30 124 114)" />
        </g>
        <g fill={aceituna}>
          <circle cx="91" cy="122" r="2.2" />
          <circle cx="109" cy="122" r="2.2" />
        </g>
      </g>

      {/* Año */}
      <text x="100" y="140" fontFamily="Georgia, serif" fontSize="18" fontWeight="bold" letterSpacing="3" fill={inicial} textAnchor="middle">1924</text>
    </svg>
  );
}
