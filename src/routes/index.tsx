import { createFileRoute } from '@tanstack/react-router';
import { useRef, useState } from 'react';
import { Flame, MessageCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CalculatorForm } from '@/components/calculator/calculator-form';
import { CalculatorResults } from '@/components/calculator/calculator-results';
import type { Person } from '@/lib/calculator';
export const Route = createFileRoute('/')({
  head: () => ({ meta: [
    { title: 'Calculadora para perder grasa | German Galera Coaching' },
    { name: 'description', content: 'Estima tus calorías y macronutrientes para perder grasa con German Galera Coaching. Compara tres estrategias y ajusta tu proteína y grasas.' },
    { property: 'og:title', content: 'Calculadora para perder grasa | German Galera Coaching' },
    { property: 'og:description', content: 'Calcula tu metabolismo basal, mantenimiento y macronutrientes con tres estrategias orientativas para perder grasa.' },
    { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' },
  ] }), component: Index,
});
function Index() {
  const [person,setPerson] = useState<Person | null>(null); const [version,setVersion] = useState(0); const resultsRef = useRef<HTMLDivElement>(null);
  function calculate(value: Person) { setPerson(value); setVersion(v => v + 1); requestAnimationFrame(() => requestAnimationFrame(() => resultsRef.current?.scrollIntoView({behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',block:'start'}))); }
  return <><header className="brand-header"><img src="/logo-german.png" alt="German Galera Coaching" className="brand-logo" /><p className="brand-name">GERMAN GALERA COACHING</p></header>
    <main><div className="page-intro"><div className="intro-badge"><Flame size={13} />PÉRDIDA DE GRASA EFECTIVA</div><h1>CALCULADORA PARA<span>PERDER GRASA</span></h1><p className="intro-copy">Descubre cuántas calorías y macronutrientes necesitas para perder grasa según tu cuerpo y nivel de actividad.</p><p className="intro-note">Obtén tres estrategias diferentes según la velocidad con la que quieras realizar tu definición.</p></div>
    <div className="page-content"><CalculatorForm onCalculate={calculate} />{person && <div ref={resultsRef} className="results" aria-live="polite"><CalculatorResults key={version} person={person} /></div>}
    <section className="cta"><h2>¿QUIERES PERDER GRASA <span>SIN IR A CIEGAS?</span></h2><p>Una calculadora puede darte un punto de partida, pero lo que determina el resultado es saber cómo ajustar alimentación y entrenamiento según tu evolución.</p><Button className="cta-button" asChild><a href="https://wa.link/06wmkd" target="_blank" rel="noopener noreferrer"><MessageCircle />Quiero ayuda personalizada<ArrowRight /></a></Button><small>Habla directamente conmigo.</small></section></div></main>
    <footer className="page-content"><div className="disclaimer"><p>Los resultados de esta calculadora son estimaciones basadas en ecuaciones predictivas (Harris-Benedict revisada, 1984) y factores de actividad. El gasto energético real puede variar entre individuos. Utiliza los resultados como punto de partida y ajusta la ingesta según la evolución real de tu peso, medidas, rendimiento y adherencia. Esta herramienta proporciona estimaciones orientativas y no sustituye una valoración individual realizada por un profesional sanitario o de la nutrición.</p><p className="footer-brand">GERMAN GALERA COACHING</p></div></footer></>;
}
