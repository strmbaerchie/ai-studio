import React, { useState, useMemo, useEffect }from ´react´;
import RecipeCard from ´./components/RecipeCard´;
import { ALL_RECIPES } from ´./data/recipes´;
import { Category, Recipe, ShoppingItem } from './types';
import Header from './components/Header';
import RecipeCard from './components/RecipeCard';
import { scaleQuantity, formatQuantity } from './utils';
import { 
  ChevronLeft, 
  Users, 
  Timer, 
  Dumbbell, 
  Scale, 
  Droplet, 
  Plus, 
  Trash2, 
  Dice5,
  Star,
  Search,
  Flame,
  ShoppingCart,
  Heart,
  RefreshCw
} from 'lucide-react';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'home' | 'detail' | 'shopping' | 'favorites'>('home');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [portions, setPortions] = useState(2);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Persistenz
  useEffect(() => {
    const savedFavs = localStorage.getItem('cook_favs');
    const savedList = localStorage.getItem('cook_list');
    if (savedFavs) setFavorites(JSON.parse(savedFavs));
    if (savedList) setShoppingList(JSON.parse(savedList));
  }, []);

  useEffect(() => {
    localStorage.setItem('cook_favs', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('cook_list', JSON.stringify(shoppingList));
  }, [shoppingList]);

  const shuffleInCategory = (cat: Category) => {
    const catRecipes = ALL_RECIPES.filter(r => r.kategorie === cat);
    // Vermeide das gleiche Rezept zweimal hintereinander wenn möglich
    let random;
    do {
      random = catRecipes[Math.floor(Math.random() * catRecipes.length)];
    } while (catRecipes.length > 1 && random.id === selectedRecipe?.id);
    
    setSelectedRecipe(random);
    setSelectedCategory(cat);
    setCurrentPage('detail');
    window.scrollTo(0, 0);
  };

  const surpriseMe = () => {
    const random = ALL_RECIPES[Math.floor(Math.random() * ALL_RECIPES.length)];
    setSelectedRecipe(random);
    setSelectedCategory(null);
    setCurrentPage('detail');
    window.scrollTo(0, 0);
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const addToShoppingList = (recipe: Recipe) => {
    const newItems: ShoppingItem[] = recipe.zutaten.map(z => ({
      ...z,
      menge_basis: scaleQuantity(z.menge_basis, recipe.portionen_basis, portions, z.einheit),
      recipeId: recipe.id,
      recipeTitle: recipe.titel,
      checked: false
    }));
    setShoppingList(prev => [...prev, ...newItems]);
    alert('Zutaten hinzugefügt!');
  };

  const filteredSearch = useMemo(() => {
    if (!searchQuery) return [];
    return ALL_RECIPES.filter(r => 
      r.titel.toLowerCase().includes(searchQuery.toLowerCase()) || 
      r.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery]);

  const renderHome = () => (
    <div className="max-w-5xl mx-auto p-4 space-y-12 pb-24">
      <section className="text-center py-12">
        <h2 className="font-serif text-5xl mb-6 text-slate-900 italic leading-tight">Hungrig?<br/>Wähle eine Kategorie.</h2>
        <div className="relative max-w-lg mx-auto mb-8">
          <input 
            type="text"
            placeholder="Oder suche nach Rezepten..."
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white shadow-sm border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        </div>
        
        <button 
          onClick={surpriseMe}
          className="bg-white text-slate-700 px-8 py-4 rounded-2xl font-bold shadow-sm border border-stone-200 hover:shadow-md transition-all flex items-center gap-3 mx-auto"
        >
          <Dice5 className="text-amber-600" size={24} />
          Einfach irgendwas Leckeres!
        </button>
      </section>

      {searchQuery && (
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          <h3 className="font-bold text-lg mb-4 text-slate-800">Suchergebnisse</h3>
          {filteredSearch.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSearch.map(r => (
                <RecipeCard key={r.id} recipe={r} onClick={() => { setSelectedRecipe(r); setSelectedCategory(null); setCurrentPage('detail'); }} />
              ))}
            </div>
          ) : (
            <p className="text-slate-400 italic">Keine Treffer gefunden.</p>
          )}
        </section>
      )}

      {!searchQuery && (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-amber-50 p-8 rounded-[40px] flex flex-col justify-center">
            <h3 className="font-serif text-3xl mb-4">Wusstest du schon?</h3>
            <p className="text-slate-600 leading-relaxed mb-6">
              Unsere Kategorien schlagen dir jedes Mal etwas Neues vor. Klick oben einfach auf ein Icon und lass dich inspirieren. 
            </p>
            <div className="flex gap-2">
              <span className="bg-white px-3 py-1 rounded-full text-xs font-bold text-amber-700 shadow-sm">Über 200 Rezepte</span>
              <span className="bg-white px-3 py-1 rounded-full text-xs font-bold text-amber-700 shadow-sm">Intelligente Skalierung</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {ALL_RECIPES.slice(10, 14).map(r => (
              <div key={r.id} onClick={() => { setSelectedRecipe(r); setCurrentPage('detail'); }} className="aspect-square rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:scale-95 transition-transform">
                <img src={`https://picsum.photos/seed/${r.id}/300/300`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );

  const renderDetail = () => {
    if (!selectedRecipe) return null;
    const isFav = favorites.includes(selectedRecipe.id);

    return (
      <div className="max-w-3xl mx-auto bg-white min-h-screen shadow-lg pb-32 animate-in fade-in duration-500">
        <div className="relative h-64 sm:h-96 w-full overflow-hidden">
          <img 
            src={`https://picsum.photos/seed/${selectedRecipe.id}/800/600`} 
            alt={selectedRecipe.titel} 
            className="w-full h-full object-cover" 
          />
          <button 
            onClick={() => { setCurrentPage('home'); setSelectedCategory(null); }}
            className="absolute top-4 left-4 bg-white/90 backdrop-blur p-2 rounded-full shadow-md z-10"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={() => toggleFavorite(selectedRecipe.id)}
            className="absolute top-4 right-4 bg-white/90 backdrop-blur p-2 rounded-full shadow-md text-amber-600 z-10"
          >
            <Star size={24} fill={isFav ? "currentColor" : "none"} />
          </button>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        <div className="p-6 sm:p-10 -mt-10 relative bg-white rounded-t-[40px] space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
               <span className="text-xs uppercase tracking-widest text-amber-600 font-bold">{selectedRecipe.kategorie}</span>
               <span className="w-1 h-1 rounded-full bg-stone-300" />
               <span className="text-xs text-slate-400"># {selectedRecipe.id}</span>
            </div>
            <h2 className="font-serif text-4xl text-slate-900 mb-4 leading-tight">{selectedRecipe.titel}</h2>
            <div className="flex flex-wrap gap-4 text-slate-600">
              <div className="flex items-center gap-2 bg-stone-100 px-4 py-2 rounded-full text-sm font-medium">
                <Timer size={18} className="text-amber-600" />
                <span>{selectedRecipe.zeiten.gesamt_min} Min.</span>
              </div>
              <div className="flex items-center gap-1 bg-stone-100 px-3 py-2 rounded-full">
                <Users size={18} className="text-amber-600 mr-1" />
                {[2,3,4].map(p => (
                  <button 
                    key={p} 
                    onClick={() => setPortions(p)}
                    className={`w-7 h-7 rounded-full text-xs font-bold transition-all ${portions === p ? 'bg-amber-600 text-white shadow-sm' : 'hover:bg-stone-200'}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-stone-50 rounded-3xl border border-stone-100">
            <div className="text-center">
              <Flame size={20} className="mx-auto text-amber-500 mb-1" />
              <div className="text-sm font-bold">{selectedRecipe.naehrwerte_pro_portion.kcal}</div>
              <div className="text-[10px] uppercase text-slate-400 font-bold">kcal</div>
            </div>
            <div className="text-center border-l border-stone-200">
              <Dumbbell size={20} className="mx-auto text-blue-500 mb-1" />
              <div className="text-sm font-bold">{selectedRecipe.naehrwerte_pro_portion.protein}g</div>
              <div className="text-[10px] uppercase text-slate-400 font-bold">Protein</div>
            </div>
            <div className="text-center border-l border-stone-200">
              <Scale size={20} className="mx-auto text-green-500 mb-1" />
              <div className="text-sm font-bold">{selectedRecipe.naehrwerte_pro_portion.carbs}g</div>
              <div className="text-[10px] uppercase text-slate-400 font-bold">Carbs</div>
            </div>
            <div className="text-center border-l border-stone-200">
              <Droplet size={20} className="mx-auto text-orange-400 mb-1" />
              <div className="text-sm font-bold">{selectedRecipe.naehrwerte_pro_portion.fat}g</div>
              <div className="text-[10px] uppercase text-slate-400 font-bold">Fett</div>
            </div>
          </section>

          <section>
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-serif text-2xl">Zutaten</h3>
              <button 
                onClick={() => addToShoppingList(selectedRecipe)}
                className="text-xs bg-amber-50 text-amber-700 px-3 py-2 rounded-xl font-bold flex items-center gap-1 hover:bg-amber-100 transition-colors"
              >
                <Plus size={14} /> Liste
              </button>
            </div>
            <ul className="space-y-3">
              {selectedRecipe.zutaten.map((z, idx) => {
                const scaled = scaleQuantity(z.menge_basis, selectedRecipe.portionen_basis, portions, z.einheit);
                return (
                  <li key={idx} className="flex items-center gap-4 pb-3 border-b border-stone-50 last:border-0">
                    <div className="w-5 h-5 rounded-full border-2 border-stone-200 flex-shrink-0" />
                    <span className="font-bold min-w-[65px] text-amber-700">
                      {formatQuantity(scaled)} {z.einheit}
                    </span>
                    <span className="text-slate-600 flex-grow">{z.name}</span>
                  </li>
                );
              })}
            </ul>
          </section>

          <section>
            <h3 className="font-serif text-2xl mb-6">Zubereitung</h3>
            <div className="space-y-8">
              {selectedRecipe.schritte.map((schritt, idx) => (
                <div key={idx} className="flex gap-5">
                  <div className="flex-shrink-0 w-8 h-8 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                    {idx + 1}
                  </div>
                  <p className="text-slate-700 leading-relaxed pt-1 text-lg">{schritt}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sticky Action Bar for Category Randomizer */}
        {selectedCategory && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-md">
            <button 
              onClick={() => shuffleInCategory(selectedCategory)}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl shadow-2xl flex items-center justify-center gap-3 font-bold hover:scale-[1.02] active:scale-95 transition-all group"
            >
              <RefreshCw size={22} className="group-active:rotate-180 transition-transform duration-500" />
              Nächstes {selectedCategory}-Rezept
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderShoppingList = () => (
    <div className="max-w-2xl mx-auto p-4 pb-24">
      <div className="flex justify-between items-center mb-8">
        <h2 className="font-serif text-3xl">Einkaufsliste</h2>
        {shoppingList.length > 0 && (
          <button 
            onClick={() => { if(confirm('Liste leeren?')) setShoppingList([]); }}
            className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
          >
            <Trash2 size={24} />
          </button>
        )}
      </div>

      {shoppingList.length === 0 ? (
        <div className="text-center py-20 text-slate-300">
          <ShoppingCart size={64} className="mx-auto mb-4 opacity-10" />
          <p className="font-medium">Noch nichts zu kaufen. Such dir ein Rezept aus!</p>
        </div>
      ) : (
        <div className="bg-white rounded-[32px] shadow-sm border border-stone-200 overflow-hidden">
          {shoppingList.map((item, idx) => (
            <div 
              key={idx} 
              className={`flex items-center gap-4 p-5 border-b border-stone-50 last:border-0 ${item.checked ? 'bg-stone-50' : ''}`}
            >
              <input 
                type="checkbox" 
                checked={item.checked}
                onChange={() => {
                  const newList = [...shoppingList];
                  newList[idx].checked = !newList[idx].checked;
                  setShoppingList(newList);
                }}
                className="w-6 h-6 accent-amber-600 rounded-lg cursor-pointer" 
              />
              <div className="flex-grow">
                <p className={`font-bold text-lg ${item.checked ? 'line-through text-slate-300' : 'text-slate-800'}`}>
                  {formatQuantity(item.menge_basis)} {item.einheit} {item.name}
                </p>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Für: {item.recipeTitle}</p>
              </div>
              <button 
                onClick={() => setShoppingList(prev => prev.filter((_, i) => i !== idx))}
                className="text-stone-300 hover:text-red-500 transition-colors"
              >
                <Plus className="rotate-45" size={24} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderFavorites = () => {
    const favRecipes = ALL_RECIPES.filter(r => favorites.includes(r.id));
    return (
      <div className="max-w-5xl mx-auto p-4 pb-24">
        <h2 className="font-serif text-3xl mb-8">Deine Favoriten</h2>
        {favRecipes.length === 0 ? (
          <div className="text-center py-20 text-slate-300">
            <Heart size={64} className="mx-auto mb-4 opacity-10" />
            <p className="font-medium">Deine Lieblingsrezepte erscheinen hier.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favRecipes.map(r => (
              <RecipeCard key={r.id} recipe={r} onClick={() => { setSelectedRecipe(r); setSelectedCategory(null); setCurrentPage('detail'); }} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <Header 
        onNav={(p) => { setCurrentPage(p); setSelectedCategory(null); setSearchQuery(''); }} 
        onCategorySelect={shuffleInCategory}
        currentPage={currentPage} 
        selectedCategory={selectedCategory}
      />
      
      <main>
        {currentPage === 'home' && renderHome()}
        {currentPage === 'detail' && renderDetail()}
        {currentPage === 'shopping' && renderShoppingList()}
        {currentPage === 'favorites' && renderFavorites()}
      </main>
    </div>
  );
};

export default App;
