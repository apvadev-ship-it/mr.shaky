"use client";
import { useEffect, useState } from 'react';

/** La hora actual como estado, no leida en cada render.
 *  Ademas de mantener el render puro, hace que el corte de "30 minutos de
 *  anticipacion" se refresque solo mientras la pagina sigue abierta. */
export function useNow(everyMs = 60000) {
  // Arranca en 0 en servidor y cliente para que la hidratacion coincida, y
  // toma la hora real al montar.
  const [now, setNow] = useState(0);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), everyMs);
    return () => clearInterval(id);
  }, [everyMs]);
  return now;
}
