import { describe, expect, it } from 'vitest';
import { calculateBMR, calculateTDEE, calculateDeficit, calculateMacros, safetyMessage, isRestrictive, ACTIVITIES, STRATEGIES, type Person } from './calculator';
const man: Person = { sex:'male',age:30,weight:75,height:178,activity:'moderate',strength:true,pregnant:false };
describe('calculator', () => {
  it('uses revised Harris-Benedict for both sexes', () => {
    expect(calculateBMR(man)).toBeCloseTo(1777.049);
    expect(calculateBMR({...man,sex:'female'})).toBeCloseTo(1562.662);
    expect(calculateBMR({...man,strength:false})).toBe(calculateBMR(man));
  });
  it('applies each activity factor and deficit', () => {
    for (const activity of ACTIVITIES) {
      const tdee = calculateTDEE(calculateBMR(man),activity.id);
      expect(tdee).toBeCloseTo(calculateBMR(man)*activity.factor);
      for (const strategy of STRATEGIES) {
        const result = calculateDeficit(tdee,strategy.deficit);
        expect(result.target).toBe(Math.round(tdee*(1-strategy.deficit)/10)*10);
        expect(result.weekly).toBe(result.daily*7);
      }
    }
  });
  it('matches original calorie targets', () => {
    const tdee=calculateTDEE(calculateBMR(man),man.activity);
    expect(STRATEGIES.map(s=>calculateDeficit(tdee,s.deficit).target)).toEqual([2480,2200,2070]);
  });
  it('recalculates macros with accurate totals', () => {
    for (const protein of [1.6,1.8,2]) for (const fat of [.6,.7,.8]) {
      const macros=calculateMacros(2200,75,protein,fat);
      expect(macros.valid).toBe(true);
      expect(Math.abs(macros.total-2200)).toBeLessThanOrEqual(2);
    }
    expect(calculateMacros(2200,75,1.8,.7)).toMatchObject({protein:135,fat:53,carbs:296});
  });
  it('never generates negative carbohydrates', () => {
    expect(calculateMacros(500,150,2,.8)).toMatchObject({valid:false,carbs:0});
  });
  it('blocks minors and pregnancy/lactation', () => {
    expect(safetyMessage({...man,age:17})).toContain('adultos');
    expect(safetyMessage({...man,sex:'female',pregnant:true})).toContain('embarazo');
    expect(safetyMessage(man)).toBeNull();
  });
  it('screens relative low intake and underweight', () => {
    expect(isRestrictive(1000,1500,man,.5)).toBe(true);
    expect(isRestrictive(2200,calculateBMR(man),man,.5)).toBe(false);
    expect(isRestrictive(2000,1300,{...man,weight:45},.2)).toBe(true);
  });
});