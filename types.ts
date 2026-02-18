
export enum Category {
  SCHNELL = 'Schnell',
  LOW_CARB = 'Low Carb',
  PROTEINREICH = 'Proteinreich',
  KARTOFFEL = 'Kartoffelgerichte'
}

export type Unit = 'g' | 'ml' | 'EL' | 'TL' | 'Stück' | 'Dose' | 'Zehe' | 'Prise' | 'Pck' | 'Bund';

export interface Ingredient {
  name: string;
  menge_basis: number;
  einheit: Unit;
  optional?: boolean;
}

export interface Nutrients {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Recipe {
  id: string;
  titel: string;
  kategorie: Category;
  portionen_basis: number;
  zutaten: Ingredient[];
  schritte: string[];
  zeiten: {
    vorbereitung_min: number;
    kochen_min: number;
    gesamt_min: number;
  };
  tags: string[];
  naehrwerte_pro_portion: Nutrients;
  hinweise?: string;
  equipment?: string[];
  bild_url?: string;
}

export interface ShoppingItem extends Ingredient {
  recipeId: string;
  recipeTitle: string;
  checked: boolean;
}
