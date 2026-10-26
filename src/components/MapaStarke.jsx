import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Punto } from './Tablero';
import { IconoPin } from './Iconos';
import { mapa as cfg, negocio } from '../data/starke';
import { useReloj } from '../lib/horario';
import { hora } from '../lib/util';

// =====================================================================
//  Mapa propio de Starke. No usa Google ni abre apps:
//  - mapa base: CARTO + OpenStreetMap (gratis, sin clave)
//  - "Cómo llegar": ruta de OSRM (servidor de FOSSGIS sobre OpenStreetMap), dibujada en el mismo mapa
//  Todo lo configurable está en src/data/starke.js -> mapa
// =====================================================================

const ESTILOS = {
  oscuro: { n: 'Oscuro', url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png' },
  claro: { n: 'Claro', url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png' },
  calles: { n: 'Calles', url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png' },
};

const MODOS = {
  auto: { n: 'En auto', url: 'https://routing.openstreetmap.de/routed-car/route/v1/driving/' },
  pie: { n: 'Caminando', url: 'https://routing.openstreetmap.de/routed-foot/route/v1/driving/' },
  bici: { n: 'En bici', url: 'https://routing.openstreetmap.de/routed-bike/route/v1/driving/' },
};

const CREDITOS_MAPA =
  '© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> · © <a href="https://carto.com/attributions" target="_blank" rel="noopener">CARTO</a>';

const pinHtml = (cartel) => `
<div class="pin-starke">
  <span class="pin-pulso"></span><span class="pin-pulso pin-pulso-2"></span>
  <div class="pin-cabeza">
    <svg viewBox="0 0 120 120" aria-hidden="true">
      <circle cx="60" cy="60" r="58" fill="#000"/>
      <g font-family="'Barlow Condensed','Arial Narrow',sans-serif" text-anchor="middle">
        <text x="60" y="55" font-size="43" font-weight="800" fill="#fff" letter-spacing="1.5">STA</text>
        <text x="60" y="88" font-size="43" font-weight="800" fill="#fff" letter-spacing="1.5">RKE</text>
        <text x="60" y="101" font-size="9.5" font-weight="700" fill="#e3131b" letter-spacing="3.2">FITNESS</text>
      </g>
    </svg>
  </div>
  ${cartel ? `<span class="pin-cartel">${cartel}</span>` : ''}
</div>`;

const YO = '<div class="pin-yo"><span></span></div>';
const refHtml = (r) => `<div class="pin-ref"><span>${r.icono || '•'}</span><b>${r.nombre}</b></div>`;

// ---------- utilidades ----------
const distanciaKm = (a, b) => {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const x = Math.sin(dLat / 2) ** 2 + Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
};
const km = (d) => (d < 1 ? `${Math.round((d * 1000) / 10) * 10} m` : `${d.toLocaleString('es-AR', { maximumFractionDigits: 1 })} km`);
const tiempo = (min) => (min < 60 ? `${Math.max(1, Math.round(min))} min` : `${Math.floor(min / 60)} h ${Math.round(min % 60)} min`);

const LADO = {
  left: 'a la izquierda', right: 'a la derecha', 'slight left': 'levemente a la izquierda', 'slight right': 'levemente a la derecha',
  'sharp left': 'cerrado a la izquierda', 'sharp right': 'cerrado a la derecha', straight: 'derecho', uturn: 'en U',
};

// Pasos de OSRM -> indicaciones en castellano
const indicacion = (s) => {
  const { type, modifier, exit } = s.maneuver;
  const en = s.name ? ` por ${s.name}` : '';
  if (type === 'depart') return `Salí${en}`;
  if (type === 'arrive') return `Llegaste a ${negocio.nombre}`;
  if (type === 'roundabout' || type === 'rotary') return `En la rotonda, tomá la ${exit || 1}ª salida${en}`;
  if (modifier === 'uturn') return `Pegá la vuelta${en}`;
  if (type === 'end of road') return `Al final de la calle, doblá ${LADO[modifier] || ''}${en}`;
  if (type === 'turn') return modifier === 'straight' ? `Seguí derecho${en}` : `Doblá ${LADO[modifier] || ''}${en}`;
  if (type === 'fork' || type === 'merge' || type === 'on ramp' || type === 'off ramp') return `Tomá ${LADO[modifier] || ''}${en}`;
  return `Seguí${en || ' derecho'}`;
};

// =====================================================================
export default function MapaStarke({ className = '', alto = 440, zoom = cfg.zoom, compacto = false, libre = false }) {
  const caja = useRef(null);
  const mapa = useRef(null);
  const capaBase = useRef(null);
  const capaRuta = useRef(null);
  const tarjeta = useRef(null);
  const yoPos = useRef(null);
  const [estilo, setEstilo] = useState(ESTILOS[cfg.estilo] ? cfg.estilo : 'oscuro');
  const [activo, setActivo] = useState(false);
  const [ruta, setRuta] = useState({ estado: 'nada', modo: cfg.ruta.modoInicial });
  const [verPasos, setVerPasos] = useState(false);
  const r = useReloj();
  const tactil = !libre && typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
  const { lat, lng } = negocio.ubicacion;
  const modos = cfg.ruta.modos.filter((m) => MODOS[m]);

  // ---------- crear el mapa ----------
  useEffect(() => {
    const m = L.map(caja.current, {
      center: [lat, lng],
      zoom,
      zoomControl: false,
      scrollWheelZoom: libre,
      dragging: !tactil,
      tap: false,
      attributionControl: false,
    });
    L.control.zoom({ position: 'topright', zoomInTitle: 'Acercar', zoomOutTitle: 'Alejar' }).addTo(m);
    L.control.attribution({ position: 'topright', prefix: false }).addTo(m);

    if (cfg.radio > 0) {
      L.circle([lat, lng], { radius: cfg.radio, color: cfg.color, weight: 1.5, dashArray: '6 8', fillColor: cfg.color, fillOpacity: 0.07, interactive: false }).addTo(m);
      L.circle([lat, lng], { radius: Math.min(150, cfg.radio / 2), color: cfg.color, weight: 0, fillColor: cfg.color, fillOpacity: 0.12, interactive: false }).addTo(m);
    }

    L.marker([lat, lng], {
      icon: L.divIcon({ className: '', html: pinHtml(cfg.cartel), iconSize: [70, 100], iconAnchor: [35, 92] }),
      title: negocio.nombre,
      keyboard: false,
      zIndexOffset: 1000,
    })
      .addTo(m)
      .on('click', () => m.flyTo([lat, lng], 17, { duration: 0.8 }));

    for (const ref of cfg.referencias || []) {
      L.marker([ref.lat, ref.lng], {
        icon: L.divIcon({ className: '', html: refHtml(ref), iconSize: null, iconAnchor: [14, 14] }),
        title: ref.nombre,
        keyboard: false,
      }).addTo(m);
    }

    // en compu, la ruedita hace zoom solo después de hacer clic en el mapa
    m.on('click', () => m.scrollWheelZoom.enable());
    if (!libre) m.on('mouseout', () => m.scrollWheelZoom.disable());

    mapa.current = m;
    // el pin queda arriba de la tarjeta de Starke (no tapado por ella)
    const centrar = () => {
      m.invalidateSize();
      if (capaRuta.current) return;
      m.setView([lat, lng], m.getZoom(), { animate: false });
      m.panBy([0, (tarjeta.current?.offsetHeight || 0) / 2], { animate: false });
    };
    centrar();
    const ro = new ResizeObserver(centrar);
    ro.observe(caja.current);
    return () => {
      ro.disconnect();
      m.remove();
      mapa.current = null;
      capaBase.current = null;
      capaRuta.current = null;
    };
  }, [lat, lng, zoom, tactil, libre]);

  // ---------- estilo del mapa ----------
  useEffect(() => {
    const m = mapa.current;
    if (!m) return;
    capaBase.current?.remove();
    capaBase.current = L.tileLayer(ESTILOS[estilo].url, { subdomains: 'abcd', maxZoom: 19, attribution: CREDITOS_MAPA }).addTo(m);
    capaBase.current.bringToBack();
  }, [estilo, lat, lng, zoom, tactil, libre]);

  // ---------- ruta ----------
  const ajustarVista = useCallback(() => {
    const m = mapa.current;
    if (!m || !capaRuta.current) return;
    const abajo = (tarjeta.current?.offsetHeight || 0) + 24;
    m.flyToBounds(capaRuta.current.getBounds(), { paddingTopLeft: [40, compacto ? 70 : 90], paddingBottomRight: [40, abajo], duration: 0.9, maxZoom: 17 });
  }, [compacto]);

  const dibujar = useCallback((puntos, recta = false) => {
    const m = mapa.current;
    if (!m) return;
    capaRuta.current?.remove();
    const g = L.featureGroup().addTo(m);
    if (!recta) L.polyline(puntos, { color: '#000', weight: 9, opacity: 0.55 }).addTo(g);
    L.polyline(
      puntos,
      recta ? { color: cfg.color, weight: 3, dashArray: '2 10', lineCap: 'round' } : { color: cfg.color, weight: 5, lineJoin: 'round' }
    ).addTo(g);
    L.marker(puntos[0], { icon: L.divIcon({ className: '', html: YO, iconSize: [22, 22], iconAnchor: [11, 11] }), keyboard: false, title: 'Vos' }).addTo(g);
    capaRuta.current = g;
  }, []);

  const calcular = useCallback(
    async (modo) => {
      const yo = yoPos.current;
      if (!yo) return;
      setRuta({ estado: 'calculando', modo });
      try {
        const url = `${MODOS[modo].url}${yo.lng},${yo.lat};${lng},${lat}?overview=full&geometries=geojson&steps=true`;
        const res = await fetch(url);
        const j = await res.json();
        const rt = j.routes?.[0];
        if (!res.ok || j.code !== 'Ok' || !rt) throw new Error('sin ruta');
        dibujar(rt.geometry.coordinates.map(([x, y]) => [y, x]));
        const pasos = rt.legs[0].steps.filter((s) => s.distance > 0 || s.maneuver.type === 'arrive');
        const calles = [...new Set(pasos.map((s) => s.name).filter(Boolean))].slice(0, 3);
        setRuta({
          estado: 'lista', modo, km: rt.distance / 1000, min: rt.duration / 60, calles,
          pasos: pasos.map((s) => ({ t: indicacion(s), d: s.distance })),
        });
      } catch {
        // sin internet o el servicio no respondió: línea recta y distancia
        dibujar([[yo.lat, yo.lng], [lat, lng]], true);
        setRuta({ estado: 'recta', modo, km: distanciaKm(yo, { lat, lng }) });
      }
    },
    [lat, lng, dibujar]
  );

  const empezar = () => {
    const modo = ruta.modo;
    if (yoPos.current) {
      if (cfg.ruta.activa) return calcular(modo);
    }
    if (!navigator.geolocation) return setRuta({ estado: 'sin-ubicacion', modo });
    setRuta({ estado: 'ubicando', modo });
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        yoPos.current = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        if (cfg.ruta.activa) calcular(modo);
        else {
          dibujar([[yoPos.current.lat, yoPos.current.lng], [lat, lng]], true);
          setRuta({ estado: 'recta', modo, km: distanciaKm(yoPos.current, { lat, lng }) });
        }
      },
      () => setRuta({ estado: 'sin-ubicacion', modo }),
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 }
    );
  };

  const borrar = () => {
    capaRuta.current?.remove();
    capaRuta.current = null;
    setVerPasos(false);
    setRuta((x) => ({ estado: 'nada', modo: x.modo }));
    mapa.current?.flyTo([lat, lng], zoom, { duration: 0.6 });
  };

  // al aparecer la ruta (o cambiar el tamaño de la tarjeta) se encuadra todo, sin que la tarjeta tape el camino
  useEffect(() => {
    if (ruta.estado === 'lista' || ruta.estado === 'recta') requestAnimationFrame(ajustarVista);
  }, [ruta.estado, ruta.modo, verPasos, ajustarVista]);

  useEffect(() => {
    const el = tarjeta.current;
    if (!el) return;
    let t;
    const ro = new ResizeObserver(() => {
      clearTimeout(t);
      t = setTimeout(() => capaRuta.current && ajustarVista(), 150);
    });
    ro.observe(el);
    return () => {
      ro.disconnect();
      clearTimeout(t);
    };
  }, [ajustarVista]);

  const activar = () => {
    setActivo(true);
    mapa.current?.dragging.enable();
  };

  const conRuta = ruta.estado === 'lista' || ruta.estado === 'recta';
  const cargando = ruta.estado === 'ubicando' || ruta.estado === 'calculando';
  const textoBoton =
    ruta.estado === 'ubicando' ? 'Buscando dónde estás…' : ruta.estado === 'calculando' ? 'Armando el camino…' : cfg.ruta.activa ? 'Cómo llegar' : '¿A cuánto estoy?';

  return (
    <div className={`relative isolate overflow-hidden border-2 border-[#2a2a2a] bg-[#0b0b0b] ${className}`} style={{ height: alto, '--pin': cfg.color }}>
      <div
        ref={caja}
        className={`mapa-starke estilo-${estilo} absolute inset-0 z-0`}
        data-lenis-prevent
        aria-label={`Mapa: ${negocio.nombre}, ${negocio.zona}`}
        role="region"
      />

      {estilo === 'oscuro' && <div className="pointer-events-none absolute inset-0 z-[400] shadow-[inset_0_0_120px_rgba(0,0,0,.85)]" aria-hidden="true" />}

      {/* estilos del mapa */}
      {cfg.elegirEstilo && (
        <div className="absolute left-2.5 top-2.5 z-[460] flex border-2 border-[#2a2a2a] bg-black/85 p-0.5" role="group" aria-label="Estilo del mapa">
          {Object.entries(ESTILOS).map(([k, e]) => (
            <button
              key={k}
              type="button"
              aria-pressed={estilo === k}
              onClick={() => setEstilo(k)}
              className={`relative isolate px-2.5 py-1 font-cond text-[13px] font-bold uppercase tracking-[.05em] transition-colors ${
                estilo === k ? 'text-white' : 'text-gris hover:text-white'
              }`}
            >
              {estilo === k && <motion.span layoutId={`estilo-${compacto ? 'c' : libre ? 'l' : 'n'}`} className="absolute inset-0 -z-10" style={{ background: cfg.color }} />}
              {e.n}
            </button>
          ))}
        </div>
      )}

      {/* en el celu, el mapa se mueve recién después de tocarlo (así no traba el scroll) */}
      <AnimatePresence>
        {tactil && !activo && (
          <motion.button type="button" onClick={activar} exit={{ opacity: 0 }} className="absolute inset-0 z-[450] grid place-items-center bg-black/25">
            <span className="bg-black/80 px-3 py-1.5 font-cond text-base font-bold uppercase tracking-[.05em]">Tocá para mover el mapa</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* tarjeta de Starke */}
      <div ref={tarjeta} className={`absolute z-[500] ${compacto ? 'inset-x-2 bottom-2' : 'bottom-3 left-3 right-3 md:right-auto md:w-[440px]'}`}>
        <motion.div layout className="border-2 border-[#2a2a2a] bg-black/90 p-3.5 backdrop-blur-sm" transition={{ duration: 0.3 }}>
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="tit text-[26px] leading-none">{negocio.nombre}</p>
              <p className="mt-0.5 truncate text-[13px] text-gris">
                {negocio.direccion ? `${negocio.direccion}, ` : ''}
                {negocio.zona}
              </p>
            </div>
            <span className="inline-flex flex-none items-center gap-1.5 border border-[#333] px-2 py-1 font-cond text-[13px] font-bold uppercase tracking-[.04em]">
              <Punto abierto={r.abierto} />
              {r.abierto ? `Hasta ${hora(r.cierra)}` : 'Cerrado'}
            </span>
          </div>
          {cfg.indicacion && <p className="mt-2 text-[14px] text-[#d6d6d6]">{cfg.indicacion}</p>}

          <AnimatePresence mode="wait" initial={false}>
            {!conRuta ? (
              <motion.div key="botones" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                {ruta.estado === 'sin-ubicacion' && (
                  <p className="mt-2.5 text-sm text-[#ffb3b3]">Activá la ubicación del celu (o permitila en el navegador) para ver el camino.</p>
                )}
                <div className="mt-3 flex flex-wrap gap-2">
                  {(cfg.ruta.activa || cfg.botones.distancia) && (
                    <button
                      type="button"
                      onClick={empezar}
                      disabled={cargando}
                      className="btn btn-chico min-h-[42px] flex-1 whitespace-nowrap px-3 text-base text-white disabled:opacity-70"
                      style={{ background: cfg.color, borderColor: cfg.color }}
                    >
                      <IconoPin width={18} height={18} />
                      {textoBoton}
                    </button>
                  )}
                  {cfg.botones.waze && (
                    <a className="btn btn-borde btn-chico min-h-[42px] whitespace-nowrap px-3 text-base" href={negocio.waze} target="_blank" rel="noopener">
                      Waze
                    </a>
                  )}
                  {cfg.botones.googleMaps && (
                    <a className="btn btn-borde btn-chico min-h-[42px] whitespace-nowrap px-3 text-base" href={negocio.comoLlegar} target="_blank" rel="noopener">
                      Google Maps
                    </a>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div key="ruta" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="mt-3">
                {ruta.estado === 'lista' ? (
                  <p className="flex flex-wrap items-baseline gap-x-2.5">
                    <b className="tit text-[34px] leading-none" style={{ color: cfg.color }}>
                      {tiempo(ruta.min)}
                    </b>
                    <span className="font-cond text-xl font-bold uppercase">{km(ruta.km)}</span>
                    <span className="text-[13px] text-gris">{MODOS[ruta.modo].n.toLowerCase()}</span>
                  </p>
                ) : (
                  <p className="text-sm">
                    Estás a{' '}
                    <b className="font-cond text-lg font-extrabold" style={{ color: cfg.color }}>
                      {km(ruta.km)}
                    </b>{' '}
                    en línea recta.
                    {cfg.ruta.activa && <span className="block text-[13px] text-gris">No pudimos armar el camino ahora. Probá de nuevo en un rato.</span>}
                  </p>
                )}
                {ruta.calles?.length > 0 && !compacto && <p className="mt-1 truncate text-[13px] text-[#cfcfcf]">Por {ruta.calles.join(', ')}</p>}

                {cfg.ruta.activa && modos.length > 1 && (
                  <div className="mt-2.5 grid gap-1.5" style={{ gridTemplateColumns: `repeat(${modos.length}, 1fr)` }} role="group" aria-label="Cómo vas">
                    {modos.map((m) => (
                      <button
                        key={m}
                        type="button"
                        aria-pressed={ruta.modo === m}
                        disabled={cargando}
                        onClick={() => ruta.modo !== m && calcular(m)}
                        className={`border-2 py-1.5 font-cond text-[15px] font-bold uppercase tracking-[.04em] transition-colors ${
                          ruta.modo === m ? 'text-white' : 'border-[#333] text-gris hover:text-white'
                        }`}
                        style={ruta.modo === m ? { borderColor: cfg.color, background: cfg.color } : undefined}
                      >
                        {MODOS[m].n}
                      </button>
                    ))}
                  </div>
                )}

                {cfg.ruta.indicaciones && ruta.estado === 'lista' && ruta.pasos?.length > 1 && (
                  <>
                    <button type="button" onClick={() => setVerPasos((v) => !v)} className="mt-2.5 text-[13px] font-semibold text-white underline underline-offset-2">
                      {verPasos ? 'Ocultar indicaciones' : `Ver indicaciones (${ruta.pasos.length} pasos)`}
                    </button>
                    <AnimatePresence initial={false}>
                      {verPasos && (
                        <motion.ol
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mt-2 max-h-[150px] overflow-auto border-t border-[#2a2a2a] pr-1 text-[13px]"
                          data-lenis-prevent
                        >
                          {ruta.pasos.map((p, i) => (
                            <li key={i} className="flex justify-between gap-3 border-b border-[#1d1d1d] py-1.5">
                              <span>
                                <b className="mr-1.5 font-cond" style={{ color: cfg.color }}>
                                  {i + 1}
                                </b>
                                {p.t}
                              </span>
                              {p.d > 0 && <span className="flex-none text-gris">{km(p.d / 1000)}</span>}
                            </li>
                          ))}
                        </motion.ol>
                      )}
                    </AnimatePresence>
                  </>
                )}

                <div className="mt-2.5 flex items-center justify-between gap-3">
                  <button type="button" onClick={borrar} className="whitespace-nowrap text-[13px] text-gris underline underline-offset-2 hover:text-white">
                    Borrar ruta
                  </button>
                  {ruta.estado === 'lista' && (
                    <span className="text-right text-[10px] leading-tight text-[#666]">
                      {compacto ? 'Ruta: OSRM · ©' : 'Ruta: OSRM · FOSSGIS · ©'}{' '}
                      <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener" className="underline">
                        OpenStreetMap
                      </a>{' '}
                      ·{' '}
                      <a href="https://www.openstreetmap.org/fixthemap" target="_blank" rel="noopener" className="underline">
                        corregir el mapa
                      </a>
                    </span>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
