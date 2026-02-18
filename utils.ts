
import { Unit } from './types';

export const scaleQuantity = (amount: number, basePortions: number, targetPortions: number, unit: Unit): number => {
  const scaled = amount * (targetPortions / basePortions);
  
  switch (unit) {
    case 'g':
    case 'ml':
      if (scaled >= 50) return Math.round(scaled / 10) * 10;
      return Math.round(scaled / 5) * 5;
    case 'Stück':
    case 'Dose':
    case 'Zehe':
    case 'Bund':
      return Math.round(scaled * 2) / 2;
    case 'EL':
    case 'TL':
      return Math.round(scaled * 4) / 4;
    default:
      return scaled;
  }
};

export const formatQuantity = (amount: number): string => {
  if (amount === 0) return '';
  if (amount % 1 === 0) return amount.toString();
  
  const fractionMap: Record<number, string> = {
    0.25: '¼',
    0.5: '½',
    0.75: '¾',
  };
  
  const whole = Math.floor(amount);
  const remainder = amount - whole;
  
  if (fractionMap[remainder]) {
    return (whole > 0 ? whole : '') + fractionMap[remainder];
  }
  
  return amount.toFixed(1);
};

export const generateId = () => Math.random().toString(36).substr(2, 9);
