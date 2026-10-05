import { useState, type FormEvent } from 'react';
import { Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { ACTIVITIES, type Person } from '@/lib/calculator';
export function Choice({ label, value, onChange }: { label: string; value: boolean | null; onChange: (value: boolean) => void }) {
  return <div><div className="field-label">{label}</div><div className="two-grid">{[true, false].map(v => <Button key={String(v)} variant="outline" type="button" className="choice" data-active={value === v} aria-pressed={value === v} onClick={() => onChange(v)}>{v ? 'Sí' : 'No'}</Button>)}</div></div>;
}
export function CalculatorForm({ onCalculate }: { onCalculate: (person: Person) => void }) {
  const [sex, setSex] = useState<Person['sex'] | null>(null);
  const [age, setAge] = useState(''); const [weight, setWeight] = useState(''); const [height, setHeight] = useState('');
  const [activity, setActivity] = useState(''); const [strength, setStrength] = useState<boolean | null>(null); const [pregnant, setPregnant] = useState<boolean | null>(null);
  const [error, setError] = useState('');
  const selectedActivity = ACTIVITIES.find(a => a.id === activity);
  function submit(event: FormEvent) {
    event.preventDefault();
    if (!sex || !activity || strength === null || (sex === 'female' && pregnant === null)) { setError('Completa todos los campos y selecciona las opciones antes de calcular.'); return; }
    const person = { sex, age: Number(age), weight: Number(weight), height: Number(height), activity, strength, pregnant: sex === 'female' && pregnant === true };
    if (!age || !weight || !height || ![person.age,person.weight,person.height].every(Number.isFinite) || person.age < 1 || person.age > 100 || person.weight < 25 || person.weight > 300 || person.height < 100 || person.height > 250) { setError('Introduce una edad entre 1 y 100 años, un peso entre 25 y 300 kg y una altura entre 100 y 250 cm.'); return; }
    setError(''); onCalculate(person);
  }
  return <form className="calculator-form form-stack" onSubmit={submit} noValidate>
    <div><div className="field-label">Sexo</div><div className="two-grid">{(['male','female'] as const).map(v => <Button key={v} type="button" variant="outline" className="choice" data-active={sex === v} aria-pressed={sex === v} onClick={() => setSex(v)}>{v === 'male' ? 'Hombre' : 'Mujer'}</Button>)}</div></div>
    <div className="measure-grid">{[{id:'age',label:'Edad (años)',value:age,set:setAge,placeholder:'30',min:1,max:100,step:'1'},{id:'weight',label:'Peso (kg)',value:weight,set:setWeight,placeholder:'75',min:25,max:300,step:'0.1'},{id:'height',label:'Altura (cm)',value:height,set:setHeight,placeholder:'178',min:100,max:250,step:'0.1'}].map(f => <div key={f.id}><label className="field-label" htmlFor={f.id}>{f.label}</label><input id={f.id} className="number-input" type="number" inputMode="decimal" min={f.min} max={f.max} step={f.step} placeholder={f.placeholder} value={f.value} onChange={e => f.set(e.target.value)} required /></div>)}</div>
    <div><label className="field-label" htmlFor="activity">Nivel de actividad física</label><Select value={activity} onValueChange={setActivity}><SelectTrigger id="activity" className="activity-trigger" data-selected={Boolean(activity)}><SelectValue placeholder="Selecciona tu nivel de actividad">{selectedActivity && <span>{selectedActivity.label}<span className="activity-detail">{selectedActivity.description}</span></span>}</SelectValue></SelectTrigger><SelectContent>{ACTIVITIES.map(a => <SelectItem className="activity-option" value={a.id} key={a.id}>{a.label}<span className="activity-detail">{a.description}</span></SelectItem>)}</SelectContent></Select></div>
    <Choice label="¿Realizas entrenamiento de fuerza?" value={strength} onChange={setStrength} />
    {sex === 'female' && <Choice label="¿Estás embarazada o en periodo de lactancia?" value={pregnant} onChange={setPregnant} />}
    {error && <p className="form-error" role="alert">{error}</p>}
    <Button type="submit" className="calculate-button"><Calculator />Calcular mis calorías</Button>
  </form>;
}
