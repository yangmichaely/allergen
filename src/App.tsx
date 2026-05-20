import { useMemo, useState } from 'react'
import './App.css'

type Allergy = 'Gluten' | 'Peanuts' | 'Dairy' | 'Soy'
type Severity = 'Intolerance' | 'Allergy'
type SafetyStatus = 'Safe' | 'Unsafe' | 'Caution'

type UserProfile = {
  allergies: Allergy[]
  severity: Severity
}

type Food = {
  id: string
  name: string
  korean: string
  category: string
  safetyStatus: Record<Allergy, SafetyStatus>
  explanation: string
  hiddenDangers: string[]
}

type Ingredient = {
  name: string
  korean: string
  warnings: string
}

type Stall = {
  id: string
  name: string
  korean: string
  location: string
  neighborhood: string
  specialties: string[]
  verified: boolean
  lastVerified: string
  communityRating: number
  reviews: number
}

const ALLERGIES: Allergy[] = ['Gluten', 'Peanuts', 'Dairy', 'Soy']

const FOODS: Food[] = [
  {
    id: 'tteok-plain',
    name: 'Plain Rice Cakes',
    korean: '떡',
    category: 'Tteok (Rice Cakes)',
    safetyStatus: {
      Gluten: 'Safe',
      Peanuts: 'Safe',
      Dairy: 'Safe',
      Soy: 'Caution',
    },
    explanation: 'Rice cakes are naturally gluten-free, peanut-free, and dairy-free. Check sauce for soy content.',
    hiddenDangers: ['Soy sauce in sauce', 'Gochujang contains wheat as fermentation base'],
  },
  {
    id: 'oksusu',
    name: 'Corn on the Cob',
    korean: '옥수수',
    category: 'Vegetables & Grains',
    safetyStatus: {
      Gluten: 'Safe',
      Peanuts: 'Safe',
      Dairy: 'Safe',
      Soy: 'Safe',
    },
    explanation: 'Naturally free of all four target allergens. Usually just boiled or grilled.',
    hiddenDangers: [],
  },
  {
    id: 'bam',
    name: 'Roasted Chestnuts',
    korean: '밤',
    category: 'Snacks',
    safetyStatus: {
      Gluten: 'Safe',
      Peanuts: 'Safe',
      Dairy: 'Safe',
      Soy: 'Safe',
    },
    explanation: 'Naturally safe for all four allergens. Roasted plain or with minimal seasoning.',
    hiddenDangers: [],
  },
  {
    id: 'gyeran-bbang',
    name: 'Egg Bread',
    korean: '계란빵',
    category: 'Baked Goods',
    safetyStatus: {
      Gluten: 'Caution',
      Peanuts: 'Safe',
      Dairy: 'Caution',
      Soy: 'Safe',
    },
    explanation: 'Contains eggs as main ingredient. Wheat batter is typical; some vendors use egg-safe alternatives.',
    hiddenDangers: ['Dairy butter in filling', 'Wheat flour batter', 'May contain gluten binder'],
  },
  {
    id: 'tteokbokki',
    name: 'Spicy Rice Cakes',
    korean: '떡볶이',
    category: 'Tteok (Rice Cakes)',
    safetyStatus: {
      Gluten: 'Caution',
      Peanuts: 'Safe',
      Dairy: 'Safe',
      Soy: 'Caution',
    },
    explanation: 'Rice cake base is safe, but gochujang sauce contains wheat. Broth often contains soy.',
    hiddenDangers: ['Gochujang (wheat fermentation base)', 'Soy-based broth', 'Wheat thickeners'],
  },
  {
    id: 'japchae',
    name: 'Glass Noodles',
    korean: '잡채',
    category: 'Noodles & Starches',
    safetyStatus: {
      Gluten: 'Safe',
      Peanuts: 'Safe',
      Dairy: 'Safe',
      Soy: 'Caution',
    },
    explanation: 'Sweet potato starch noodles are naturally gluten-free. Sauce typically contains soy sauce.',
    hiddenDangers: ['Soy sauce in sauce', 'Ask for tamari version for gluten-free'],
  },
  {
    id: 'gimbap',
    name: 'Korean Rice Rolls',
    korean: '김밥',
    category: 'Rice & Rolls',
    safetyStatus: {
      Gluten: 'Caution',
      Peanuts: 'Caution',
      Dairy: 'Caution',
      Soy: 'Unsafe',
    },
    explanation: 'Rice and seaweed safe, but fillings vary widely. Often contains soy-based imitation crab and soy sauce.',
    hiddenDangers: ['Imitation crab (soy)', 'Soy sauce on rice', 'Processed ingredients may contain allergens'],
  },
  {
    id: 'korean-fried-chicken',
    name: 'Korean Fried Chicken',
    korean: '치킨',
    category: 'Meat & Proteins',
    safetyStatus: {
      Gluten: 'Unsafe',
      Peanuts: 'Safe',
      Dairy: 'Caution',
      Soy: 'Unsafe',
    },
    explanation: 'Battered in wheat flour and marinated in soy sauce. Some sauces contain dairy.',
    hiddenDangers: ['Wheat flour batter', 'Soy sauce marinade', 'Possible dairy in specialty coatings', 'Cross-contamination in shared fryer'],
  },
  {
    id: 'hotteok',
    name: 'Sweet Pancake (Plain)',
    korean: '호떡',
    category: 'Baked Goods',
    safetyStatus: {
      Gluten: 'Unsafe',
      Peanuts: 'Safe',
      Dairy: 'Caution',
      Soy: 'Safe',
    },
    explanation: 'Traditional wheat flour dough. Can be made with dairy-free filling, but most contain brown sugar and butter.',
    hiddenDangers: ['Wheat flour dough', 'Butter in filling', 'May contain dairy'],
  },
  {
    id: 'hotteok-peanut',
    name: 'Sweet Pancake (Peanut Filling)',
    korean: '호떡 (땅콩)',
    category: 'Baked Goods',
    safetyStatus: {
      Gluten: 'Unsafe',
      Peanuts: 'Unsafe',
      Dairy: 'Caution',
      Soy: 'Safe',
    },
    explanation: 'UNSAFE for peanut allergies - contains peanuts directly in filling.',
    hiddenDangers: ['Direct peanut allergen', 'Wheat flour dough', 'Possible dairy'],
  },
  {
    id: 'odeng',
    name: 'Fish Cakes',
    korean: '오뎅',
    category: 'Soups & Broths',
    safetyStatus: {
      Gluten: 'Caution',
      Peanuts: 'Safe',
      Dairy: 'Safe',
      Soy: 'Caution',
    },
    explanation: 'Fish cake may contain wheat binder. Usually cooked in soy-based broth.',
    hiddenDangers: ['Wheat as binder in cake', 'Soy sauce in broth', 'Cross-contact with shellfish'],
  },
  {
    id: 'ramyeon',
    name: 'Instant Noodles',
    korean: '라면',
    category: 'Noodles & Starches',
    safetyStatus: {
      Gluten: 'Unsafe',
      Peanuts: 'Safe',
      Dairy: 'Safe',
      Soy: 'Unsafe',
    },
    explanation: 'Wheat-based noodles. Broth and seasoning packet contain soy.',
    hiddenDangers: ['Wheat noodles', 'Soy in seasoning packet', 'MSG and additives'],
  },
  {
    id: 'tanghulu',
    name: 'Candied Fruit Skewer',
    korean: '탕후루',
    category: 'Snacks',
    safetyStatus: {
      Gluten: 'Safe',
      Peanuts: 'Safe',
      Dairy: 'Safe',
      Soy: 'Safe',
    },
    explanation: 'Typically just fruit and hard candy coating. Verify preparation method.',
    hiddenDangers: [],
  },
  {
    id: 'bungeo-ppang',
    name: 'Fish Pastry (Red Bean)',
    korean: '붕어빵',
    category: 'Baked Goods',
    safetyStatus: {
      Gluten: 'Unsafe',
      Peanuts: 'Safe',
      Dairy: 'Safe',
      Soy: 'Safe',
    },
    explanation: 'Wheat-based pastry with red bean filling. Cream-filled varieties contain dairy.',
    hiddenDangers: ['Wheat pastry', 'Possible dairy in cream filling'],
  },
]

const INGREDIENTS: Ingredient[] = [
  {
    name: 'Gochujang',
    korean: '고추장',
    warnings: 'Red pepper paste - CONTAINS WHEAT/BARLEY as fermentation base. Not gluten-free unless specifically labeled.',
  },
  {
    name: 'Doenjang',
    korean: '된장',
    warnings: 'Fermented soybean paste - CONTAINS SOY and sometimes wheat. Major allergen.',
  },
  {
    name: 'Ganjang / Soy Sauce',
    korean: '간장',
    warnings: 'Standard soy sauce contains both GLUTEN and SOY. Only tamari is gluten-free.',
  },
  {
    name: 'Anchovy Broth',
    korean: '멸치 육수',
    warnings: 'Base for many soups. Contains fish/shellfish (separate allergen). Often combined with kelp broth.',
  },
  {
    name: 'Sesame Oil',
    korean: '참기름',
    warnings: 'Separate allergen not in the four target categories, but important to flag for sensitivity.',
  },
  {
    name: 'Myeolchi (Anchovies)',
    korean: '멸치',
    warnings: 'Common in broths and side dishes. Not in the four targets but major cross-contamination source.',
  },
]

const STALLS: Stall[] = [
  {
    id: 'seoul-stall-1',
    name: 'Myeongdong Tteokbokki Corner',
    korean: '명동 떡볶이 코너',
    location: 'Myeongdong Night Market, Seoul',
    neighborhood: 'Jung-gu',
    specialties: ['Tteokbokki', 'Rice cakes', 'Corn'],
    verified: true,
    lastVerified: '2026-05-15',
    communityRating: 4.2,
    reviews: 23,
  },
  {
    id: 'seoul-stall-2',
    name: 'Jongno Corn & Chestnut',
    korean: '종로 옥수수 밤 구이',
    location: 'Jongno Street Food Area, Seoul',
    neighborhood: 'Jongno-gu',
    specialties: ['Corn', 'Roasted chestnuts', 'Boiled eggs'],
    verified: true,
    lastVerified: '2026-05-18',
    communityRating: 4.7,
    reviews: 45,
  },
  {
    id: 'seoul-stall-3',
    name: 'Dongdaemun Hotteok Specialist',
    korean: '동대문 호떡 전문점',
    location: 'Dongdaemun Shopping District, Seoul',
    neighborhood: 'Jung-gu',
    specialties: ['Hotteok', 'Sweet pancakes'],
    verified: false,
    lastVerified: '2026-04-22',
    communityRating: 3.8,
    reviews: 12,
  },
  {
    id: 'busan-stall-1',
    name: 'Nampodong Pojangmacha Hub',
    korean: '남포동 포장마차 허브',
    location: 'Nampodong Night Market, Busan',
    neighborhood: 'Jung-gu, Busan',
    specialties: ['Odeng', 'Fish cakes', 'Tteokbokki', 'Mixed snacks'],
    verified: true,
    lastVerified: '2026-05-10',
    communityRating: 4.0,
    reviews: 34,
  },
  {
    id: 'busan-stall-2',
    name: 'Gwangbokro Tanghulu Vendor',
    korean: '광복로 탕후루 가게',
    location: 'Gwangbokro Street, Busan',
    neighborhood: 'Jung-gu, Busan',
    specialties: ['Tanghulu', 'Candied fruits', 'Dried fruits'],
    verified: true,
    lastVerified: '2026-05-16',
    communityRating: 4.5,
    reviews: 28,
  },
  {
    id: 'jeju-stall-1',
    name: 'Jeju Black Pork Grill',
    korean: '제주 흑돼지 구이',
    location: 'Jeju Traditional Market, Jeju',
    neighborhood: 'Jeju City',
    specialties: ['Grilled pork', 'Corn', 'Vegetables'],
    verified: true,
    lastVerified: '2026-05-14',
    communityRating: 4.3,
    reviews: 19,
  },
  {
    id: 'seoul-stall-4',
    name: 'Gangnam Gimbap & Kimbap Express',
    korean: '강남 김밥 익스프레스',
    location: 'Gangnam Street, Seoul',
    neighborhood: 'Gangnam-gu',
    specialties: ['Gimbap', 'Kimbap', 'Korean rice rolls'],
    verified: false,
    lastVerified: '2026-03-05',
    communityRating: 3.5,
    reviews: 8,
  },
  {
    id: 'incheon-stall-1',
    name: 'Incheon Fried Chicken Pojangmacha',
    korean: '인천 치킨 포장마차',
    location: 'Incheon Port Street, Incheon',
    neighborhood: 'Jung-gu, Incheon',
    specialties: ['Fried chicken', 'Beer snacks'],
    verified: true,
    lastVerified: '2026-05-12',
    communityRating: 4.1,
    reviews: 31,
  },
  {
    id: 'seoul-stall-5',
    name: 'Hongdae Tofu Bowl Kitchen',
    korean: '홍대 두부 덮밥 주방',
    location: 'Hongdae Food Street, Seoul',
    neighborhood: 'Mapo-gu',
    specialties: ['Tofu bowls', 'Rice plates', 'Vegetable mandu'],
    verified: true,
    lastVerified: '2026-05-17',
    communityRating: 4.6,
    reviews: 22,
  },
  {
    id: 'seoul-stall-6',
    name: 'Euljiro Skewer & Rice Cart',
    korean: '을지로 꼬치 밥차',
    location: 'Euljiro Alley, Seoul',
    neighborhood: 'Jung-gu',
    specialties: ['Grilled skewers', 'Corn', 'Rice cakes'],
    verified: false,
    lastVerified: '2026-04-30',
    communityRating: 3.9,
    reviews: 15,
  },
  {
    id: 'busan-stall-3',
    name: 'Gwangalli Fish Cake Cart',
    korean: '광안리 어묵 리어카',
    location: 'Gwangalli Beach Walk, Busan',
    neighborhood: 'Suyeong-gu, Busan',
    specialties: ['Odeng', 'Broth', 'Fish cakes'],
    verified: true,
    lastVerified: '2026-05-19',
    communityRating: 4.4,
    reviews: 37,
  },
  {
    id: 'jeonju-stall-2',
    name: 'Jeonju Bibimbap House',
    korean: '전주 비빔밥 집',
    location: 'Jeonju Hanok Village, Jeonju',
    neighborhood: 'Wansan-gu',
    specialties: ['Bibimbap', 'Rice bowls', 'Side dishes'],
    verified: true,
    lastVerified: '2026-05-13',
    communityRating: 4.8,
    reviews: 54,
  },
  {
    id: 'daegu-stall-1',
    name: 'Daegu Mandu Soup Shop',
    korean: '대구 만두 국밥집',
    location: 'Seomun Market Area, Daegu',
    neighborhood: 'Jung-gu, Daegu',
    specialties: ['Mandu soup', 'Noodle soup', 'Dumplings'],
    verified: false,
    lastVerified: '2026-04-18',
    communityRating: 3.7,
    reviews: 11,
  },
  {
    id: 'gwangju-stall-1',
    name: 'Gwangju Vegan Rice Stall',
    korean: '광주 비건 밥집',
    location: 'Asia Culture Center Market, Gwangju',
    neighborhood: 'Dong-gu, Gwangju',
    specialties: ['Rice bowls', 'Tofu', 'Fresh vegetables'],
    verified: true,
    lastVerified: '2026-05-11',
    communityRating: 4.5,
    reviews: 18,
  },
  {
    id: 'suwon-stall-1',
    name: 'Suwon Fried Snack Stand',
    korean: '수원 튀김 간식 노점',
    location: 'Suwon Station Market, Suwon',
    neighborhood: 'Paldal-gu',
    specialties: ['Fried snacks', 'Hotteok', 'Sweet buns'],
    verified: false,
    lastVerified: '2026-03-29',
    communityRating: 3.6,
    reviews: 9,
  },
  {
    id: 'jeju-stall-2',
    name: 'Jeju Citrus Dessert Cafe',
    korean: '제주 감귤 디저트 카페',
    location: 'Jeju Old Town, Jeju',
    neighborhood: 'Jeju City',
    specialties: ['Citrus desserts', 'Fruit cups', 'Tea'],
    verified: true,
    lastVerified: '2026-05-20',
    communityRating: 4.9,
    reviews: 26,
  },
]

const PHRASE_CARDS = {
  Gluten: { korean: '밀 (글루텐)', question: '이 음식에 밀/글루텐 들어 있어요?' },
  Peanuts: { korean: '땅콩', question: '이 음식에 땅콩 들어 있어요?' },
  Dairy: { korean: '우유 (유제품)', question: '이 음식에 우유/유제품 들어 있어요?' },
  Soy: { korean: '대두', question: '이 음식에 대두/간장 들어 있어요?' },
}

function App() {
  const [hasCompleted, setHasCompleted] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [currentTab, setCurrentTab] = useState<'directory' | 'ingredients' | 'stalls' | 'phrase'>('directory')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const handleCompleteOnboarding = (allergies: Allergy[], severity: Severity) => {
    setUserProfile({ allergies, severity })
    setHasCompleted(true)
  }

  const filteredFoods = useMemo(() => {
    return FOODS.filter((food) => {
      const matchesSearch =
        searchQuery === '' ||
        food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        food.korean.includes(searchQuery) ||
        food.category.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory = selectedCategory === null || food.category === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory])

  const filteredStalls = useMemo(() => {
    return STALLS.filter((stall) => {
      return (
        searchQuery === '' ||
        stall.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stall.korean.includes(searchQuery) ||
        stall.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stall.specialties.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    })
  }, [searchQuery])

  const getSafetyBadge = (status: SafetyStatus) => {
    switch (status) {
      case 'Safe':
        return <span className="badge badge-safe">✓ Safe</span>
      case 'Caution':
        return <span className="badge badge-caution">⚠ Caution</span>
      case 'Unsafe':
        return <span className="badge badge-unsafe">✗ Unsafe</span>
    }
  }

  const categories = Array.from(new Set(FOODS.map((f) => f.category)))

  if (!hasCompleted || !userProfile) {
    return <OnboardingScreen onComplete={handleCompleteOnboarding} />
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>🥘 Korean Street Food Allergy Guide</h1>
          <p className="tagline">Navigate Korean street markets safely with your allergy profile</p>
          <button
            className="btn-settings"
            onClick={() => {
              setHasCompleted(false)
              setUserProfile(null)
            }}
          >
            Change Allergies
          </button>
        </div>
      </header>

      <div className="user-profile-banner">
        <div className="profile-info">
          <strong>Your Allergies:</strong> {userProfile.allergies.join(', ')}
        </div>
        <div className="profile-severity">
          <strong>Severity:</strong> {userProfile.severity}
        </div>
      </div>

      <nav className="tabs">
        <button
          className={`tab ${currentTab === 'directory' ? 'active' : ''}`}
          onClick={() => setCurrentTab('directory')}
        >
          🍱 Foods
        </button>
        <button
          className={`tab ${currentTab === 'ingredients' ? 'active' : ''}`}
          onClick={() => setCurrentTab('ingredients')}
        >
          🧪 Ingredients
        </button>
        <button
          className={`tab ${currentTab === 'stalls' ? 'active' : ''}`}
          onClick={() => setCurrentTab('stalls')}
        >
          🗺️ Stalls
        </button>
        <button
          className={`tab ${currentTab === 'phrase' ? 'active' : ''}`}
          onClick={() => setCurrentTab('phrase')}
        >
          💬 Phrase Card
        </button>
      </nav>

      {currentTab === 'directory' && (
        <DirectoryTab filteredFoods={filteredFoods} categories={categories} searchQuery={searchQuery} setSearchQuery={setSearchQuery} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} getSafetyBadge={getSafetyBadge} userProfile={userProfile} />
      )}

      {currentTab === 'ingredients' && <IngredientsTab />}

      {currentTab === 'stalls' && (
        <StallsTab filteredStalls={filteredStalls} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      )}

      {currentTab === 'phrase' && <PhraseCardTab userProfile={userProfile} />}
    </div>
  )
}

interface OnboardingScreenProps {
  onComplete: (allergies: Allergy[], severity: Severity) => void
}

function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [selectedAllergies, setSelectedAllergies] = useState<Allergy[]>([])
  const [severity, setSeverity] = useState<Severity>('Allergy')

  const toggleAllergy = (allergy: Allergy) => {
    setSelectedAllergies((current) =>
      current.includes(allergy) ? current.filter((a) => a !== allergy) : [...current, allergy],
    )
  }

  const handleStart = () => {
    if (selectedAllergies.length > 0) {
      onComplete(selectedAllergies, severity)
    }
  }

  return (
    <div className="onboarding">
      <div className="onboarding-container">
        <h1>🥘 Korean Street Food Allergy Guide</h1>
        <p className="onboarding-subtitle">
          Explore Korean street food safely with a personalized allergy profile
        </p>

        <section className="onboarding-section">
          <h2>Which allergies do you have?</h2>
          <p className="section-hint">Select all that apply</p>
          <div className="allergy-selection">
            {ALLERGIES.map((allergy) => (
              <label key={allergy} className="allergy-checkbox">
                <input
                  type="checkbox"
                  checked={selectedAllergies.includes(allergy)}
                  onChange={() => toggleAllergy(allergy)}
                />
                <span>{allergy}</span>
              </label>
            ))}
          </div>
        </section>

        <section className="onboarding-section">
          <h2>How severe are your allergies?</h2>
          <div className="severity-selection">
            <label className="severity-option">
              <input type="radio" value="Intolerance" checked={severity === 'Intolerance'} onChange={(e) => setSeverity(e.target.value as Severity)} />
              <div className="severity-content">
                <strong>Intolerance (Mild)</strong>
                <p>Uncomfortable symptoms but not life-threatening</p>
              </div>
            </label>
            <label className="severity-option">
              <input type="radio" value="Allergy" checked={severity === 'Allergy'} onChange={(e) => setSeverity(e.target.value as Severity)} />
              <div className="severity-content">
                <strong>Allergy (Medical)</strong>
                <p>Potential for anaphylaxis - requires caution</p>
              </div>
            </label>
          </div>
        </section>

        <div className="onboarding-disclaimer">
          <strong>⚠️ Medical Disclaimer:</strong> This app is a guide, not a substitute for medical advice. Always confirm
          ingredients with vendors and consult a healthcare provider.
        </div>

        <button className="btn-primary" onClick={handleStart} disabled={selectedAllergies.length === 0}>
          Start Exploring
        </button>
      </div>
    </div>
  )
}

interface DirectoryTabProps {
  filteredFoods: Food[]
  categories: string[]
  searchQuery: string
  setSearchQuery: (query: string) => void
  selectedCategory: string | null
  setSelectedCategory: (category: string | null) => void
  getSafetyBadge: (status: SafetyStatus) => React.ReactElement
  userProfile: UserProfile
}

function DirectoryTab({
  filteredFoods,
  categories,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  getSafetyBadge,
  userProfile,
}: DirectoryTabProps) {
  return (
    <section className="tab-content directory-tab">
      <div className="search-bar">
        <input
          type="search"
          placeholder="Search Korean foods..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="category-filter">
        <button
          className={`category-btn ${selectedCategory === null ? 'active' : ''}`}
          onClick={() => setSelectedCategory(null)}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {filteredFoods.length === 0 ? (
        <div className="empty-state">
          <p>No foods found matching your search.</p>
        </div>
      ) : (
        <div className="foods-grid">
          {filteredFoods.map((food) => (
            <article key={food.id} className="food-card">
              <div className="food-header">
                <div>
                  <h3>{food.name}</h3>
                  <p className="korean-name">{food.korean}</p>
                </div>
                <span className="category-tag">{food.category}</span>
              </div>

              <p className="food-explanation">{food.explanation}</p>

              <div className="allergen-grid">
                {userProfile.allergies.map((allergy) => (
                  <div key={allergy} className="allergen-item">
                    <span className="allergen-name">{allergy}</span>
                    {getSafetyBadge(food.safetyStatus[allergy])}
                  </div>
                ))}
              </div>

              {food.hiddenDangers.length > 0 && (
                <div className="hidden-dangers">
                  <strong>🚨 Hidden Dangers:</strong>
                  <ul>
                    {food.hiddenDangers.map((danger, idx) => (
                      <li key={idx}>{danger}</li>
                    ))}
                  </ul>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

function IngredientsTab() {
  return (
    <section className="tab-content ingredients-tab">
      <div className="disclaimer-banner">
        <strong>⚠️ Critical Information:</strong> Korean food labels sometimes fail to list wheat or allergen-containing
        ingredients like soy sauce. This decoder explains the hidden allergens in base ingredients.
      </div>

      <div className="ingredients-grid">
        {INGREDIENTS.map((ingredient) => (
          <article key={ingredient.korean} className="ingredient-card">
            <div className="ingredient-header">
              <h3>{ingredient.name}</h3>
              <span className="korean-term">{ingredient.korean}</span>
            </div>
            <p className="ingredient-warning">{ingredient.warnings}</p>
          </article>
        ))}
      </div>

      <div className="cross-contamination-warning">
        <h3>⚠️ Cross-Contamination Risk</h3>
        <p>
          Cross-contamination is significant in Asian cooking. Woks are traditionally not fully washed between uses,
          meaning even technically allergy-safe foods may be unsafe at certain stalls. Always ask vendors about
          preparation methods.
        </p>
      </div>
    </section>
  )
}

interface StallsTabProps {
  filteredStalls: Stall[]
  searchQuery: string
  setSearchQuery: (query: string) => void
}

function StallsTab({ filteredStalls, searchQuery, setSearchQuery }: StallsTabProps) {
  return (
    <section className="tab-content stalls-tab">
      <div className="search-bar">
        <input
          type="search"
          placeholder="Search stalls, markets, neighborhoods..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredStalls.length === 0 ? (
        <div className="empty-state">
          <p>No stalls found matching your search.</p>
        </div>
      ) : (
        <div className="stalls-list">
          {filteredStalls.map((stall) => (
            <article key={stall.id} className="stall-card">
              <div className="stall-header">
                <div>
                  <h3>{stall.name}</h3>
                  <p className="korean-name">{stall.korean}</p>
                  <p className="location">📍 {stall.location}</p>
                </div>
                <div className="stall-badges">
                  {stall.verified && <span className="badge-verified">✓ Verified</span>}
                  <span className="rating">⭐ {stall.communityRating.toFixed(1)}</span>
                </div>
              </div>

              <div className="stall-specialties">
                <strong>Specialties:</strong>
                <div className="specialty-tags">
                  {stall.specialties.map((specialty) => (
                    <span key={specialty} className="specialty-tag">
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              <div className="stall-meta">
                <span className="reviews">{stall.reviews} community reviews</span>
                <span className="last-verified">Last verified: {stall.lastVerified}</span>
              </div>

              <div className="stall-actions">
                <button className="btn-secondary">View Details</button>
                <button className="btn-secondary">Report Change</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

interface PhraseCardTabProps {
  userProfile: UserProfile
}

function PhraseCardTab({ userProfile }: PhraseCardTabProps) {
  const [selectedAllergy, setSelectedAllergy] = useState<Allergy | null>(userProfile.allergies[0] || null)

  return (
    <section className="tab-content phrase-tab">
      <div className="phrase-intro">
        <h2>Allergy Phrase Cards</h2>
        <p>Print or show these cards to vendors to ask about allergens in Korean</p>
      </div>

      <div className="allergy-selector">
        {userProfile.allergies.map((allergy) => (
          <button
            key={allergy}
            className={`allergy-btn ${selectedAllergy === allergy ? 'active' : ''}`}
            onClick={() => setSelectedAllergy(allergy)}
          >
            {allergy}
          </button>
        ))}
      </div>

      {selectedAllergy && (
        <div className="phrase-cards-container">
          {/* Severity Level Card */}
          <div className="phrase-card">
            <div className="card-title">Severity Level</div>
            <div className="card-content korean">
              {userProfile.severity === 'Allergy'
                ? '⚠️ 심각한 알레르기입니다. 응급실이 필요할 수 있습니다.'
                : '⚠️ 불내증입니다. 불편함을 느낍니다.'}
            </div>
          </div>

          {/* Main Question Card */}
          <div className="phrase-card primary">
            <div className="card-title">Ask About This Allergen</div>
            <div className="card-question">{PHRASE_CARDS[selectedAllergy].question}</div>
            <div className="card-content korean large">
              {PHRASE_CARDS[selectedAllergy].korean}
            </div>
          </div>

          {/* Confirmation Questions */}
          <div className="phrase-card">
            <div className="card-title">Confirm Preparation</div>
            <div className="card-content korean">
              • 접시를 다른 음식으로 세척했습니까? (Was the dish washed/prepared separately?)
              <br />• 같은 기름으로 요리했습니까? (Was it cooked in the same oil?)
            </div>
          </div>

          {/* Print/Share Button */}
          <div className="phrase-actions">
            <button className="btn-primary" onClick={() => window.print()}>
              🖨️ Print Card
            </button>
            <button className="btn-secondary" onClick={() => navigator.share?.({ title: 'Allergy Card', text: `I have a ${selectedAllergy} allergy` })}>
              📤 Share
            </button>
          </div>
        </div>
      )}

      {/* All Allergen Reference */}
      <div className="allergen-reference">
        <h3>Korean Allergen Names</h3>
        <div className="reference-grid">
          {(Object.entries(PHRASE_CARDS) as Array<[Allergy, typeof PHRASE_CARDS[Allergy]]>).map(([allergy, data]) => (
            <div key={allergy} className="reference-item">
              <strong>{allergy}:</strong>
              <span className="korean">{data.korean}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default App
