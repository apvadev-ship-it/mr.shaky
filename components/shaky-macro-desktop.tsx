"use client";
import { useState } from 'react';
import { ArrowLeft, ArrowRight, BarChart3, CalendarDays, ChefHat, Dumbbell, Flame, Footprints, Info, Leaf, Plus, Ruler, Scale as ScaleIcon, Sofa, Target, Trophy, Utensils, Droplet, Drumstick, Wheat } from 'lucide-react';
import { money, products } from '@/lib/demo-data';
import { useShaky } from '@/components/shaky-store';

const GOALS = [
  { id: 'loss', icon: Flame, name: 'Perder grasa', copy: 'Déficit calórico', factor: .85, catalog: 'Pérdida de grasa' },
  { id: 'maintain', icon: ScaleIcon, name: 'Mantener peso', copy: 'Equilibrio calórico', factor: 1, catalog: 'Mantenimiento' },
  { id: 'gain', icon: Dumbbell, name: 'Ganar masa muscular', copy: 'Superávit calórico', factor: 1.15, catalog: 'Ganancia muscular' },
];

const PACE = [
  { id: 'slow', label: 'Suave', copy: '0.25 kg por semana' },
  { id: 'moderate', label: 'Moderado', copy: '0.5 kg por semana' },
  { id: 'fast', label: 'Rápido', copy: '0.75 kg por semana' },
];

const ACTIVITY = [
  { id: 'sedentary', icon: Sofa, name: 'Sedentario', copy: 'Poco o ningún ejercicio', factor: 1.2 },
  { id: 'light', icon: Footprints, name: 'Ligera', copy: '1–3 días a la semana', factor: 1.375 },
  { id: 'moderate', icon: Dumbbell, name: 'Moderada', copy: '3–5 días a la semana', factor: 1.55 },
  { id: 'high', icon: Trophy, name: 'Alta', copy: '6–7 días a la semana', factor: 1.725 },
  { id: 'veryhigh', icon: Flame, name: 'Muy alta', copy: 'Entrenamiento intenso diario', factor: 1.9 },
];

const FEATURES = [
  { icon: Target, text: 'Resultados personalizados' },
  { icon: BarChart3, text: 'Método científico (Mifflin–St Jeor)' },
  { icon: Utensils, text: 'Ideal para planificar tus comidas' },
  { icon: Leaf, text: 'Basado en tus metas reales' },
];

/** Calculadora de macros en escritorio: formulario a la izquierda,
 *  resultados y recomendaciones a la derecha. */
export function MacroDesktop({ go }: { go: (r: string) => void }) {
  const { add } = useShaky();
  const [age, setAge] = useState(25);
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(170);
  const [sex, setSex] = useState<'male' | 'female'>('male');
  const [goal, setGoal] = useState('loss');
  const [pace, setPace] = useState('moderate');
  const [activity, setActivity] = useState('moderate');
  const [period, setPeriod] = useState<'day' | 'week'>('day');
  const [error, setError] = useState('');
  const [result, setResult] = useState<null | { energy: number; protein: number; carbs: number; fat: number }>(null);

  const compute = () => {
    if (age < 18 || age > 80 || weight < 35 || weight > 250 || height < 130 || height > 220) {
      setError('Revisa edad (18–80), peso (35–250 kg) y estatura (130–220 cm).');
      setResult(null);
      return;
    }
    const g = GOALS.find(x => x.id === goal)!;
    const a = ACTIVITY.find(x => x.id === activity)!;
    // Mifflin–St Jeor, el mismo método que anuncia la página.
    const resting = 10 * weight + 6.25 * height - 5 * age + (sex === 'male' ? 5 : -161);
    const paceShift = goal === 'maintain' ? 1 : pace === 'slow' ? 0.5 : pace === 'fast' ? 1.5 : 1;
    const delta = (g.factor - 1) * paceShift;
    const energy = Math.round((resting * a.factor * (1 + delta)) / 10) * 10;
    if (energy < 1200) {
      setError('Esta estimación requiere revisión profesional: no mostramos metas por debajo de 1200 kcal.');
      setResult(null);
      return;
    }
    setError('');
    setResult({
      energy,
      protein: Math.round(energy * .30 / 4),
      carbs: Math.round(energy * .40 / 4),
      fat: Math.round(energy * .30 / 9),
    });
  };

  const factor = period === 'week' ? 7 : 1;
  const show = (n: number) => Math.round(n * factor).toLocaleString('es-CO');
  const picks = products.filter(p => p.goals.includes(GOALS.find(g => g.id === goal)!.catalog)).slice(0, 3);

  return (
    <section className="md">
      {/* Misma estructura que el menú: título sobre el negro, el derretido
          y el contenido sobre el crema. */}
      <div className="sect-top">
        <div className="sect-top-inner md-head">
          <div>
            <button type="button" className="sect-back" onClick={() => go('inicio')}><ArrowLeft size={20} aria-hidden="true" />Volver</button>
            <h1 className="sect-title">Calcula tus <em>Macros</em></h1>
            <p className="sect-lead">Conoce cuántas calorías, proteínas, carbohidratos y grasas debes consumir según tu objetivo y estilo de vida.</p>
            <ul className="md-features">
              {FEATURES.map(({ icon: Icon, text }) => <li key={text}><Icon size={20} aria-hidden="true" />{text}</li>)}
            </ul>
          </div>
          <img className="md-head-photo" src="/assets/bowl-hero.webp" alt="" aria-hidden="true" />
        </div>
      </div>

      <div className="sect-light">
        <span className="sect-drip" aria-hidden="true" />
        <div className="wrap md-grid">
        <div className="md-main">
          <div className="md-form">
            <section className="md-step">
              <header><span>1</span><div><h2>Tu información personal</h2><p>Ingresa tus datos para un cálculo preciso.</p></div><Info size={18} aria-hidden="true" /></header>
              <div className="md-inputs">
                <label><span>Edad</span><span className="md-input"><CalendarDays size={18} aria-hidden="true" /><input type="number" min={18} max={80} value={age} onChange={e => setAge(Number(e.target.value))} /><i>años</i></span></label>
                <label><span>Peso</span><span className="md-input"><ScaleIcon size={18} aria-hidden="true" /><input type="number" min={35} max={250} value={weight} onChange={e => setWeight(Number(e.target.value))} /><i>kg</i></span></label>
                <label><span>Estatura</span><span className="md-input"><Ruler size={18} aria-hidden="true" /><input type="number" min={130} max={220} value={height} onChange={e => setHeight(Number(e.target.value))} /><i>cm</i></span></label>
                <div className="md-sex">
                  <span>Sexo</span>
                  <div role="radiogroup" aria-label="Sexo para la fórmula">
                    <button type="button" role="radio" aria-checked={sex === 'male'} className={sex === 'male' ? 'chosen' : ''} onClick={() => setSex('male')}>Masculino</button>
                    <button type="button" role="radio" aria-checked={sex === 'female'} className={sex === 'female' ? 'chosen' : ''} onClick={() => setSex('female')}>Femenino</button>
                  </div>
                </div>
              </div>
            </section>

            <section className="md-step">
              <header><span>2</span><div><h2>Tu objetivo</h2><p>Selecciona el objetivo que mejor se adapte a ti.</p></div><Info size={18} aria-hidden="true" /></header>
              <div className="md-goals">
                <div className="md-goal-cards" role="radiogroup" aria-label="Objetivo">
                  {GOALS.map(({ id, icon: Icon, name, copy }) => (
                    <button type="button" role="radio" aria-checked={goal === id} key={id} className={'md-card' + (goal === id ? ' chosen' : '')} onClick={() => setGoal(id)}>
                      <Icon size={26} aria-hidden="true" />
                      <span><strong>{name}</strong>{copy}</span>
                    </button>
                  ))}
                </div>
                <label className="md-pace">
                  <span>Ritmo del objetivo</span>
                  <select value={pace} disabled={goal === 'maintain'} onChange={e => setPace(e.target.value)}>
                    {PACE.map(p => <option key={p.id} value={p.id}>{p.label} · {p.copy}</option>)}
                  </select>
                </label>
              </div>
            </section>

            <section className="md-step">
              <header><span>3</span><div><h2>Tu nivel de actividad física</h2><p>Selecciona el nivel que mejor describa tu rutina diaria.</p></div><Info size={18} aria-hidden="true" /></header>
              <div className="md-activity" role="radiogroup" aria-label="Nivel de actividad">
                {ACTIVITY.map(({ id, icon: Icon, name, copy }) => (
                  <button type="button" role="radio" aria-checked={activity === id} key={id} className={'md-card' + (activity === id ? ' chosen' : '')} onClick={() => setActivity(id)}>
                    <Icon size={24} aria-hidden="true" />
                    <span><strong>{name}</strong>{copy}</span>
                  </button>
                ))}
              </div>
            </section>

            {error && <p className="md-error">{error}</p>}
            <button type="button" className="md-submit" onClick={compute}>
              <BarChart3 size={22} aria-hidden="true" />Calcular mis macros <ArrowRight size={22} aria-hidden="true" />
            </button>
          </div>
        </div>

        <aside className="md-aside" aria-label="Tus resultados">
          <div className="md-results">
            <header>
              <span className="md-results-icon"><BarChart3 size={24} /></span>
              <div><h2>Tus resultados</h2><p>Basado en el método Mifflin–St Jeor</p></div>
              <div className="md-period" role="radiogroup" aria-label="Periodo">
                <button type="button" role="radio" aria-checked={period === 'day'} className={period === 'day' ? 'chosen' : ''} onClick={() => setPeriod('day')}>Por día</button>
                <button type="button" role="radio" aria-checked={period === 'week'} className={period === 'week' ? 'chosen' : ''} onClick={() => setPeriod('week')}>Por semana</button>
              </div>
            </header>

            {result ? (
              <>
                <div className="md-cards">
                  <div className="md-kcal">
                    <Flame size={28} aria-hidden="true" />
                    <span>Calorías {period === 'day' ? 'diarias' : 'semanales'}</span>
                    <strong>{show(result.energy)}</strong>
                    <small>kcal</small>
                    <span className="md-tag">{GOALS.find(g => g.id === goal)!.copy}</span>
                  </div>
                  <div className="md-macro md-macro-protein">
                    <Drumstick size={20} aria-hidden="true" />
                    <span>Proteínas</span><strong>{show(result.protein)} g</strong>
                    <small>30% ({show(result.protein * 4)} kcal)</small>
                  </div>
                  <div className="md-macro md-macro-carbs">
                    <Wheat size={20} aria-hidden="true" />
                    <span>Carbohidratos</span><strong>{show(result.carbs)} g</strong>
                    <small>40% ({show(result.carbs * 4)} kcal)</small>
                  </div>
                  <div className="md-macro md-macro-fat">
                    <Droplet size={20} aria-hidden="true" />
                    <span>Grasas</span><strong>{show(result.fat)} g</strong>
                    <small>30% ({show(result.fat * 9)} kcal)</small>
                  </div>
                </div>

                <div className="md-split" aria-hidden="true">
                  <i className="md-seg-protein" style={{ width: '30%' }} />
                  <i className="md-seg-carbs" style={{ width: '40%' }} />
                  <i className="md-seg-fat" style={{ width: '30%' }} />
                </div>
                <ul className="md-legend">
                  <li><i className="md-seg-protein" />Proteínas <b>30%</b></li>
                  <li><i className="md-seg-carbs" />Carbohidratos <b>40%</b></li>
                  <li><i className="md-seg-fat" />Grasas <b>30%</b></li>
                </ul>
              </>
            ) : (
              <p className="md-pending">Completa tus datos y pulsa «Calcular mis macros» para ver tu estimación.</p>
            )}

            <p className="md-note">
              <Info size={17} aria-hidden="true" />
              Los valores son una estimación basada en la fórmula Mifflin–St Jeor y pueden variar según tu metabolismo individual. No sustituye la consulta con un profesional.
            </p>
          </div>

          <div className="md-recos">
            <header>
              <span className="md-recos-icon"><ChefHat size={24} /></span>
              <div><h2>Recomendaciones para ti</h2><p>Alimentos del menú que se ajustan a tus macros diarios.</p></div>
            </header>
            <ul>
              {picks.map(p => (
                <li key={p.id}>
                  <img src={p.image} alt="" aria-hidden="true" />
                  <div className="md-reco-body">
                    <strong>{p.name}</strong>
                    <span className="md-reco-macros">
                      <i>P: {p.protein}g</i><i>C: {p.carbs}g</i><i>G: {p.fat}g</i>
                    </span>
                    <p>{p.description}</p>
                    <span className="md-reco-foot">
                      <b>{money(p.price)}</b>
                      <button type="button" aria-label={'Agregar ' + p.name} onClick={() => add(p.id)}><Plus size={20} /></button>
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>
        </div>
      </div>
    </section>
  );
}
