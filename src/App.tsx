import { useMemo, useState } from 'react'
import './App.css'

type Allergy = 'Gluten' | 'Peanuts' | 'Dairy' | 'Eggs' | 'Soy' | 'Shellfish'

type Restaurant = {
  id: string
  name: string
  neighborhood: string
  cuisine: string
  safeFor: Allergy[]
  notes: string
}

const ALLERGIES: Allergy[] = [
  'Gluten',
  'Peanuts',
  'Dairy',
  'Eggs',
  'Soy',
  'Shellfish',
]

const RESTAURANTS: Restaurant[] = [
  {
    id: 'green-table',
    name: 'Green Table Kitchen',
    neighborhood: 'Downtown',
    cuisine: 'American',
    safeFor: ['Gluten', 'Peanuts', 'Dairy', 'Eggs'],
    notes: 'Dedicated allergen prep station and separate grill tools.',
  },
  {
    id: 'river-thai',
    name: 'River Thai House',
    neighborhood: 'Riverside',
    cuisine: 'Thai',
    safeFor: ['Peanuts', 'Dairy', 'Shellfish'],
    notes: 'Offers custom curry bases and peanut-free wok option.',
  },
  {
    id: 'casa-luna',
    name: 'Casa Luna',
    neighborhood: 'Midtown',
    cuisine: 'Mexican',
    safeFor: ['Gluten', 'Dairy', 'Soy'],
    notes: 'Corn-only tortillas and dairy-free sauce substitutions.',
  },
  {
    id: 'harbor-grill',
    name: 'Harbor Grill',
    neighborhood: 'Old Port',
    cuisine: 'Seafood',
    safeFor: ['Gluten', 'Peanuts', 'Eggs', 'Soy'],
    notes: 'Separate fryer for gluten-free sides; shellfish cross-contact warning.',
  },
  {
    id: 'olive-and-oak',
    name: 'Olive & Oak',
    neighborhood: 'University',
    cuisine: 'Mediterranean',
    safeFor: ['Gluten', 'Peanuts', 'Dairy', 'Eggs', 'Soy', 'Shellfish'],
    notes: 'Menu is fully tagged with allergen-safe dishes.',
  },
]

function App() {
  const [query, setQuery] = useState('')
  const [selectedAllergies, setSelectedAllergies] = useState<Allergy[]>([])

  const filteredRestaurants = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return RESTAURANTS.filter((restaurant) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        restaurant.name.toLowerCase().includes(normalizedQuery) ||
        restaurant.neighborhood.toLowerCase().includes(normalizedQuery) ||
        restaurant.cuisine.toLowerCase().includes(normalizedQuery)

      const safeForSelectedAllergies = selectedAllergies.every((allergy) =>
        restaurant.safeFor.includes(allergy),
      )

      return matchesQuery && safeForSelectedAllergies
    })
  }, [query, selectedAllergies])

  const toggleAllergy = (allergy: Allergy) => {
    setSelectedAllergies((current) =>
      current.includes(allergy)
        ? current.filter((item) => item !== allergy)
        : [...current, allergy],
    )
  }

  return (
    <main className="app">
      <header className="hero">
        <p className="eyebrow">Allergy-safe dining</p>
        <h1>Find restaurants you can trust</h1>
        <p>
          Filter local spots by allergy support so you can quickly find safer
          options for gluten, peanuts, dairy, and more.
        </p>
      </header>

      <section className="filters" aria-label="Restaurant filters">
        <label className="search" htmlFor="search-restaurants">
          Search
          <input
            id="search-restaurants"
            type="search"
            value={query}
            placeholder="Search by name, cuisine, or neighborhood"
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>

        <fieldset>
          <legend>Allergies to avoid</legend>
          <div className="allergy-grid">
            {ALLERGIES.map((allergy) => (
              <label key={allergy}>
                <input
                  type="checkbox"
                  checked={selectedAllergies.includes(allergy)}
                  onChange={() => toggleAllergy(allergy)}
                />
                <span>{allergy}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </section>

      <section className="results" aria-live="polite">
        <p className="result-summary">
          {filteredRestaurants.length} restaurant
          {filteredRestaurants.length === 1 ? '' : 's'} matched
        </p>

        {filteredRestaurants.length === 0 ? (
          <article className="empty-state">
            No restaurants match the selected allergies right now.
          </article>
        ) : (
          <ul>
            {filteredRestaurants.map((restaurant) => (
              <li key={restaurant.id}>
                <article className="restaurant-card">
                  <div className="restaurant-header">
                    <div>
                      <h2>{restaurant.name}</h2>
                      <p>
                        {restaurant.cuisine} · {restaurant.neighborhood}
                      </p>
                    </div>
                    <span className="badge">Allergy-aware</span>
                  </div>

                  <p className="notes">{restaurant.notes}</p>

                  <p className="safe-for">
                    Safe for: {restaurant.safeFor.join(', ')}
                  </p>
                </article>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}

export default App
