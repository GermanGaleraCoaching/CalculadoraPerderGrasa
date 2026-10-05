export const ACTIVITIES = [
  { id: 'sedentary', label: 'Sedentario', description: 'Trabajo principalmente sentado y poco ejercicio.', factor: 1.2 },
  { id: 'light', label: 'Actividad ligera', description: 'Ejercicio ligero 1–3 días por semana.', factor: 1.375 },
  { id: 'moderate', label: 'Actividad moderada', description: 'Entrenamiento 3–5 días por semana.', factor: 1.55 },
  { id: 'high', label: 'Actividad alta', description: 'Entrenamiento intenso 6–7 días por semana.', factor: 1.725 },
  { id: 'very-high', label: 'Actividad muy alta', description: 'Entrenamiento muy frecuente y/o trabajo físicamente exigente.', factor: 1.9 },
];
export const STRATEGIES = [
  { id: 'slow', label: 'Pérdida lenta', deficit: .1, description: 'Déficit moderado y fácil de mantener. Recomendado si quieres priorizar rendimiento, hambre controlada y adherencia.' },
  { id: 'normal', label: 'Pérdida normal', deficit: .2, description: 'Un equilibrio entre velocidad de pérdida de grasa, rendimiento y sostenibilidad.' },
  { id: 'aggressive', label: 'Pérdida agresiva', deficit: .25, description: 'Una estrategia más exigente, con menor ingesta energética y potencialmente más hambre y peor rendimiento. No está pensada para mantenerse durante periodos prolongados sin seguimiento profesional.' },
] as const;
export const PROTEIN_OPTIONS = [1.6, 1.8, 2];
export const FAT_OPTIONS = [.6, .7, .8];
export type Person = { sex: 'male' | 'female'; age: number; weight: number; height: number; activity: string; strength: boolean; pregnant: boolean };
export const roundCalories = (value: number) => Math.round(value / 10) * 10;
export const formatNumber = (value: number) => value.toLocaleString('de-DE');
export function calculateBMR(person: Person) {
  return person.sex === 'male' ? 88.362 + 13.397 * person.weight + 4.799 * person.height - 5.677 * person.age : 447.593 + 9.247 * person.weight + 3.098 * person.height - 4.33 * person.age;
}
export function calculateTDEE(bmr: number, activity: string) {
  const level = ACTIVITIES.find(level => level.id === activity);
  if (!level) throw new Error('Selecciona tu nivel de actividad.');
  return bmr * level.factor;
}
export function calculateDeficit(tdee: number, deficit: number) {
  const target = roundCalories(tdee * (1 - deficit));
  const daily = roundCalories(tdee - target);
  return { target, daily, weekly: daily * 7, rate: daily * 7 / 7700 };
}
export function calculateMacros(target: number, weight: number, proteinRate: number, fatRate: number) {
  const protein = Math.round(weight * proteinRate);
  const fat = Math.round(weight * fatRate);
  const remaining = target - protein * 4 - fat * 9;
  const carbs = Math.max(0, Math.round(remaining / 4));
  return { protein, fat, carbs, valid: remaining >= 0, total: protein * 4 + fat * 9 + carbs * 4 };
}
export function safetyMessage(person: Person) {
  if (person.age < 18) return 'Esta calculadora está diseñada para adultos. Las necesidades energéticas durante el crecimiento requieren una valoración individual.';
  if (person.sex === 'female' && person.pregnant) return 'Durante el embarazo o la lactancia las necesidades energéticas requieren una valoración individual. Esta calculadora no está diseñada para esta situación.';
  return null;
}
// Relative screening, not a universal minimum calorie prescription.
export function isRestrictive(target: number, bmr: number, person: Person, rate: number) {
  return target < bmr * .9 || rate > person.weight * .01 || person.weight / (person.height / 100) ** 2 < 18.5;
}
export const LOW_INTAKE_WARNING = 'Este nivel de déficit podría ser demasiado agresivo para tus características. Considera utilizar una estrategia menos restrictiva o buscar asesoramiento individual.';
