# 🥘 Korean Street Food Allergy Guide

A comprehensive React + TypeScript app designed for travelers with food allergies navigating Korean street markets. Explore safe Korean street foods, decode hidden allergens, find verified stalls, and generate printable allergy cards in Korean.

**Live Demo:** https://yangmichaely.github.io/allergen/

## Features

### 🍱 Safe Foods Directory
- 13+ Korean street foods with detailed allergen profiles
- Search by name (English & Korean) and filter by category
- Per-allergen safety status: Safe / Caution / Unsafe
- Hidden danger alerts for unexpected allergens

### 🧪 Danger Ingredient Decoder
- Explains critical Korean cooking ingredients
- Gochujang, doenjang, ganjang (soy sauce), and more
- Cross-contamination warnings
- Korean-English bilingual content

### 🗺️ Market Map (Community Stalls)
- 8+ verified Korean street food vendors
- Across Seoul, Busan, Incheon, and Jeju
- Community ratings and verification status
- Report changes and contribute

### 💬 Phrase Cards
- Printable/shareable allergy cards in Korean
- Ask vendors about specific allergens
- Confirmation questions for cross-contamination

### ⚙️ User Profile
- Select your allergies: Gluten, Peanuts, Dairy, Soy
- Choose severity level: Intolerance vs. Allergy
- Personalized app experience

## Target Allergies
- **Gluten** (밀) - wheat, gochujang, soy sauce
- **Peanuts** (땅콩) - less common in traditional Korean food
- **Dairy** (우유) - increasingly common in modern Korean desserts
- **Soy** (대두) - foundational to Korean cuisine

## Run Locally

```bash
npm install
npm run dev
```

Visit `http://localhost:5174` in your browser.

## Build for Production

```bash
npm run build
npm run preview
```

## Deploy to GitHub Pages

Automatic deployment is configured via GitHub Actions. Every push to `main` triggers a build and deploy to GitHub Pages using the official Pages workflow.

**To enable GitHub Pages:**

1. Go to your repository settings: https://github.com/yangmichaely/allergen/settings/pages
2. Under "Build and deployment":
   - **Source:** Select "GitHub Actions"
3. Save and wait for deployment to complete

The app will be live at: `https://yangmichaely.github.io/allergen/`

### Manual Deployment

To test the production build locally:

```bash
npm run build
npm run preview  # Test the build locally
```

Then push to the `main` branch - GitHub Actions will handle deployment automatically.

## Project Structure

```
src/
├── App.tsx          # Main app component with 5 core features
├── App.css          # Responsive styling (onboarding, tabs, cards)
├── main.tsx         # React entry point
└── index.css        # Global styles
```

## Key Data

**Foods:** 13 Korean street foods with detailed allergen profiles
**Ingredients:** 6 critical base ingredients with allergen warnings
**Stalls:** 8 filler restaurant/vendor entries across major Korean cities

## Tech Stack

- **Framework:** React 19.2
- **Language:** TypeScript
- **Build Tool:** Vite
- **Deployment:** GitHub Pages (via GitHub Actions)
- **Styling:** CSS Grid & Flexbox

## Medical Disclaimer

⚠️ **This app is a guide, not a medical device.** Always confirm ingredients with vendors and consult a healthcare provider. Users must verify all information with restaurant staff before consumption.

## Contributing

Found an issue? Have a restaurant to add? Create an issue or pull request!

## License

MIT

---

**Created for American travelers with food allergies exploring Korean street markets.**
