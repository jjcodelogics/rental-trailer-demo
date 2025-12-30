# Projectbeschrijving: Texas Tough Rentals - Trailer Verhuurplatform

> **Portfolio project voor technische recruiters en loopbaanadviseurs**  
> Deze beschrijving is bedoeld om mijn vaardigheidsniveau en passende functierichting realistisch te kunnen inschatten.

---

## Projectsamenvatting

**Opdracht:** Website bouwen voor een trailer verhuurbedrijf dat online aanbiedingen wil tonen, offertes wil laten berekenen, en verhuurboekingen via formulieren wil afhandelen met geautomatiseerde e-mailnotificaties.

**Waarom dit project:**
- Klant had geen technische kennis en wilde een snelle, professioneel ogende website zonder maandelijkse CMS-kosten
- Vereiste functionaliteit: prijscalculator op basis van afstand/duur, contactformulieren, directe e-mailintegratie
- Behoefte aan mobiel-vriendelijke website (veel klanten zoeken vanaf telefoon tijdens bouwprojecten)

**Project outcome:**
- Volledige custom website (geen templates) met serverless backend
- Werkende prijsberekeningssysteem gebaseerd op postcode/afstand
- Geautomatiseerde e-mailnotificaties voor klant en bedrijfseigenaar
- Volledig responsive design geoptimaliseerd voor mobiel, tablet, desktop

---

## Mijn rol en verantwoordelijkheden

**Wat ik volledig zelf heb gedaan:**

### Planning & Requirements
- Klantgesprekken gevoerd om zakelijke vereisten in kaart te brengen
- Prijsstructuur (per dag, afstand, extra diensten) vertaald naar technische logica
- Bepaald welke tech stack realistisch was gezien budget/onderhoudbaarheid

### Frontend Development
- Alle HTML-pagina's gebouwd met semantische markup (SEO-vriendelijk)
- Volledig responsive design met Tailwind CSS (mobile-first approach)
- JavaScript componenten geschreven voor:
  - Mobiele navigatie met hamburger menu
  - Datumpicker voor verhuurperiodes (Flatpickr integratie)
  - Interactieve prijscalculator met real-time berekeningen
  - FAQ accordion
  - Back-to-top functionaliteit
  - Formulier validatie aan clientzijde

### Backend Development
- Serverless API endpoints gebouwd met Vercel Functions
- Formulier processing met dubbele validatie (client + server)
- Integratie met Brevo API voor transactionele e-mails
- Geocoding implementatie met OpenStreetMap Nominatim API
- Afstandsberekening met Haversine formule voor bezorgtarieven
- Rate limiting op basis van IP-adres tegen spam (5 requests per uur)

### Performance & Optimalisatie
- Alle afbeeldingen geconverteerd naar WebP formaat (60% groottereductie)
- Build pipeline geconfigureerd met Vite
- Code splitting en lazy loading toegepast
- Font loading geoptimaliseerd met preconnect/preload
- Vercel Analytics en Speed Insights geïntegreerd

### SEO & Standards
- Meta tags, Open Graph, en Twitter Cards geconfigureerd
- Structured data (Schema.org JSON-LD) voor LocalBusiness
- Sitemap.xml automatisch gegenereerd via script
- robots.txt en toegankelijkheidsstandaarden (ARIA labels)

### DevOps & Deployment
- Git repository opgezet met .gitignore en commit structuur
- Environment variables beheer voor API keys
- Vercel deployment pipeline geconfigureerd
- Documentatie geschreven (README, API docs, deployment guide)

**Wat ik NIET heb gedaan:**
- Design kwam grotendeels van klant (ik heb dit vertaald naar werkende code)
- Geen backend database (bewust gekozen voor serverless + e-mail omdat klant geen booking management nodig had)
- Geen unit tests geschreven (time/budget constraint)

---

## Technische stack & tools

### Core Technologies
- **HTML5** - Semantische markup, accessibility features
- **CSS3 / Tailwind CSS 3.4** - Utility-first framework, custom theme configuratie
- **JavaScript (ES6+)** - Modules, async/await, modern syntax (geen framework)
- **Vite 7.2** - Build tool, development server, hot module replacement

### Backend & APIs
- **Node.js 16+** - Runtime voor serverless functions
- **Vercel Functions** - Serverless architecture (geen server management)
- **Brevo API** - Transactionele e-mails (klantbevestiging + owner notificatie)
- **OpenStreetMap Nominatim** - Geocoding service (gratis, geen API key vereist)

### Validation & Data Processing
- **Zod 3.22** - Schema validatie en input sanitization (type-safe zonder TypeScript)
- **Haversine formula** - Geografische afstandsberekening (eigen implementatie)

### Development Tools
- **Git** - Version control
- **npm** - Package manager
- **PostCSS + Autoprefixer** - CSS processing
- **Imagemin + imagemin-webp** - Afbeelding optimalisatie script

### Monitoring & Analytics
- **Vercel Analytics** - User behavior tracking
- **Vercel Speed Insights** - Core Web Vitals monitoring

### Deployment
- **Vercel** - Hosting platform met automatische deployments bij Git push

---

## Belangrijkste technische uitdagingen en oplossingen

### 1. Prijscalculator met afstandsgebaseerde tarieven

**Uitdaging:**  
Klant wilde dynamische prijzen op basis van: (1) verhuurperiode met tiers (1 dag, 2-6, 7-29, 30+), (2) afstand tussen bedrijf en klant voor bezorgkosten, (3) extra diensten zoals dumpen.

**Mijn oplossing:**
- Geocoding API integratie om postcode om te zetten naar coördinaten
- Haversine formule geïmplementeerd om "vogelvlucht" afstand te berekenen
- Pricing logic: binnen 20 mijl vast tarief ($75), daarboven $3.50/mijl
- Rate tiers in JavaScript constanten, makkelijk aanpasbaar voor klant
- Real-time berekening zonder page reload

**Code snippet (vereenvoudigd):**
```javascript
// Haversine distance calculation
const R = 3958.8; // Earth radius in miles
const dLat = (lat2 - lat1) * Math.PI / 180;
const dLon = (lon2 - lon1) * Math.PI / 180;
const a = Math.sin(dLat/2) * Math.sin(dLat/2) + ...;
const distance = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
```

**Technisch leerpunt:**  
Geocoding APIs hebben rate limits en kunnen onnauwkeurig zijn. Ik heb error handling toegevoegd voor ongeldige postcodes en fallback messaging wanneer API niet beschikbaar is.

---

### 2. Formulier validatie op twee niveaus

**Uitdaging:**  
Formulieren moeten veilig zijn (XSS protection), gebruiksvriendelijk (direct feedback), en betrouwbaar (server-side check als backup).

**Mijn oplossing:**
- **Client-side:** Zod schema's voor validatie voordat submit (snelle feedback)
- **Server-side:** Dezelfde Zod schema's hergebruikt in API handler (security)
- Input sanitization automatisch via Zod (trim, lowercase email, etc.)
- Custom error messages in het Nederlands voor gebruikers
- Accessible error messaging met ARIA attributen

**Voorbeeld schema:**
```javascript
const trailerInquirySchema = z.object({
  fullName: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().regex(/^\(\d{3}\) \d{3}-\d{4}$/),
  // ... more fields
});
```

**Technisch leerpunt:**  
Door Zod schemas te delen tussen client en server (ESM modules), voorkom je code duplication en inconsistenties. Dit werkt alleen met moderne build tools zoals Vite.

---

### 3. Rate limiting zonder database

**Uitdaging:**  
Spam-bescherming nodig, maar geen database beschikbaar in serverless setup.

**Mijn oplossing:**
- In-memory Map object om IP-adressen en timestamps bij te houden
- 1-uur sliding window: max 5 requests per IP
- Automatische cleanup van oude entries om memory leaks te voorkomen
- 429 status code teruggeven bij rate limit overschrijding

**Code aanpak:**
```javascript
const rateLimits = new Map();
const clientIP = request.headers['x-forwarded-for'];
const now = Date.now();
const requests = rateLimits.get(clientIP) || [];
// Filter requests binnen laatste uur
const recentRequests = requests.filter(time => now - time < 3600000);
if (recentRequests.length >= 5) return 429;
```

**Beperking:**  
Dit werkt alleen voor korte periodes omdat serverless functions stateless zijn. Voor production met hoog verkeer zou Redis beter zijn, maar voor deze klant volstaat het.

---

### 4. Performance optimalisatie zonder framework

**Uitdaging:**  
Website moet snel laden, vooral op mobiel (veel klanten zijn bouwvakkers op locatie met matige verbinding).

**Mijn oplossingen:**
- **Afbeeldingen:** Alle JPG → WebP conversie (60% kleiner), lazy loading, responsive images met `<picture>` element
- **JavaScript:** Modular code splitting, geen grote libraries (Flatpickr is enige externe dependency), defer/async laden
- **CSS:** Tailwind purge voor ongebruikte styles, critical CSS inline in `<head>`
- **Fonts:** Preconnect + preload voor Google Fonts, font-display: swap
- **Build:** Vite tree-shaking, minification, Terser met console.log removal

**Meetbare resultaten:**
- First Contentful Paint: < 1.5s (target: < 2s)
- Total bundle size: ~150KB (target: < 200KB)
- Lighthouse score: 90+ voor performance
- 60% reductie in totale afbeelding grootte (van ~3.5MB naar ~1.4MB)

**Technisch leerpunt:**  
Modern Vanilla JavaScript met ES modules is vaak sneller dan frameworks voor kleinere sites. No framework !== oude code.

---

### 5. E-mail integratie met dubbele notificaties

**Uitdaging:**  
Bij elke boeking moeten zowel de klant als de bedrijfseigenaar een e-mail krijgen met verschillende inhoud.

**Mijn oplossing:**
- Brevo API integratie (gekozen omdat gratis tier voldoende was)
- Twee aparte e-mail templates in code (HTML + plain text fallback)
- Customer email: bevestiging met booking details en volgende stappen
- Owner email: volledige enquiry data voor follow-up
- Error handling: als 1 e-mail faalt, logt het de error maar faalt niet volledig

**API call voorbeeld:**
```javascript
await fetch('https://api.brevo.com/v3/smtp/email', {
  method: 'POST',
  headers: {
    'api-key': process.env.BREVO_API_KEY,
    'content-type': 'application/json'
  },
  body: JSON.stringify({
    sender: { email: SENDER_EMAIL },
    to: [{ email: customerEmail }],
    subject: 'Booking Confirmation',
    htmlContent: template
  })
});
```

**Technisch leerpunt:**  
Transactionele e-mail diensten hebben vaak strikte spam-preventie. Sender e-mail moet geverifieerd zijn en content mag geen spam-triggers bevatten (zoals "FREE!").

---

## Meetbare of observeerbare resultaten

### Performance Metrics
- **Laadtijd:** First Contentful Paint < 1.5s (gemeten met Lighthouse)
- **Bundle size:** 150KB gecomprimeerd (vs. ~500KB+ voor typische WordPress site)
- **Afbeelding optimalisatie:** 60% reductie in file size (3.5MB → 1.4MB)
- **Mobile usability:** 100% score in Google Mobile-Friendly Test

### Code Kwaliteit
- **Documentatie:** 100% van functies hebben JSDoc comments
- **Modulariteit:** 0 code duplication tussen pagina's (alles herbruikbaar)
- **Browser support:** Werkt in alle moderne browsers (Chrome, Firefox, Safari, Edge)
- **Toegankelijkheid:** Semantic HTML, ARIA labels, keyboard navigatie

### Business Impact (feedback van klant)
- **Klantreacties:** Minder telefoontjes over prijzen (calculator werkt self-service)
- **Mobiel gebruik:** ~60% van traffic komt van mobiele devices (responsive design cruciaal)
- **E-mail automatisering:** Bespaart klant 30+ minuten per dag aan handmatige e-mails

### Onderhoudbaarheid
- **Zero downtime:** Serverless architecture betekent geen server maintenance
- **Kosten:** ~$0-5/maand hosting (Vercel free tier + Brevo free tier)
- **Updates:** Klant kan prijzen aanpassen via config file zonder developer nodig

---

## Skill-signalen: wat dit project bewijst

### ✅ Frontend Development (Medior niveau)
- **Responsive design:** Mobile-first development met modern CSS (Flexbox, Grid)
- **JavaScript competentie:** ES6+ syntax, async/await, module system, DOM manipulation
- **CSS frameworks:** Tailwind configuratie en custom theming
- **Web performance:** Concrete optimalisaties met meetbare impact
- **Accessibility:** Awareness van WCAG standaarden en implementatie

**Bewijs:** Deze skills zijn zichtbaar in de modulaire component structuur, performance metrics, en cross-device functionaliteit.

---

### ✅ Backend Development (Junior/Medior niveau)
- **Serverless architecture:** Begrijp hoe serverless functions werken en wanneer ze geschikt zijn
- **API integratie:** Meerdere third-party APIs (Brevo, Nominatim) succesvol geïntegreerd
- **Data validatie:** Schema-based validation met error handling
- **Security basics:** Input sanitization, rate limiting, environment variables
- **Asynchrone programming:** Promise handling, parallel API calls, error flows

**Bewijs:** Werkende API endpoints met productie-waardige error handling en security measures.

---

### ✅ Software Engineering Practices (Junior/Medior niveau)
- **Code organisatie:** Logische directory structuur, separation of concerns
- **Documentatie:** README, API docs, inline comments (recruiter kan code begrijpen)
- **Version control:** Git workflow met .gitignore, commit messages
- **Environment management:** Development vs. production configs
- **Build tools:** Vite configuratie, npm scripts, automation

**Bewijs:** Professionele repository structuur die andere developers kunnen overnemen.

---

### ✅ Web Standards & SEO (Junior/Medior niveau)
- **Semantic HTML:** Correct gebruik van `<header>`, `<nav>`, `<section>`, `<article>`
- **SEO fundamentals:** Meta tags, structured data, sitemap, robots.txt
- **Open Graph:** Social sharing optimization
- **Performance monitoring:** Vercel Analytics/Speed Insights integratie

**Bewijs:** Website scoort goed in Google Lighthouse en is vindbaarbaar voor zoekmachines.

---

### ✅ Problem Solving & Learning Agility
- **Zelfstandig leren:** Geocoding en Haversine formule waren nieuw, heb dit via documentatie uitgewerkt
- **Technische keuzes:** Bewuste afweging tussen serverless vs. traditional backend
- **Debugging:** API integratie troubleshooting (rate limits, CORS, authentication)
- **Requirements vertaling:** Zakelijke wensen omzetten naar technische implementatie

**Bewijs:** Project bevat features die niet in tutorials staan (custom pricing logic, distance calculation).

---

### ✅ Client Communication (Junior/Medior niveau)
- **Requirements gathering:** Klantgesprekken leiden tot functionele specs
- **Technical translation:** Technische beperkingen uitleggen in klant-vriendelijke taal
- **Expectation management:** Realistische scope en tijdlijnen communiceren
- **Documentation:** Deployment guides en maintenance docs voor niet-technische klant

**Bewijs:** Klant kan website onderhouden zonder continue developer support.

---

## Wat dit project NIET bewijst (eerlijkheid)

### ❌ Grote team ervaring
- Dit was een solo project, geen ervaring met pull requests, code reviews, of team workflows

### ❌ Testing expertise
- Geen unit tests, integration tests, of E2E tests geschreven (tijdsdruk + leerproces)

### ❌ Database design
- Geen database gebruikt, dus geen SQL/NoSQL ervaring getoond

### ❌ State management frameworks
- Geen React, Vue, of Angular (bewuste keuze voor vanilla JS bij kleine project)

### ❌ CI/CD pipelines
- Vercel doet automatische deployments, maar geen eigen pipeline gebouwd (GitHub Actions, Jenkins, etc.)

### ❌ Agile/Scrum ceremonies
- Geen sprints, standups, of retrospectives (solo werk)

---

## Functieniveau inschatting

Op basis van dit project ben ik geschikt voor:

### ✅ Sterk geschikt voor:
- **Junior Frontend Developer** - Kan zelfstandig responsive websites bouwen
- **Junior Full-Stack Developer** - Basiskennis backend + frontend
- **Web Developer** (junior/medior) - Breed inzetbaar voor kleinere projecten
- **WordPress/CMS Developer** (transitie rol) - Kan custom themes/plugins bouwen

### ⚠️ Met aanvullende training geschikt voor:
- **Medior Frontend Developer** - Zou frameworks (React/Vue) moeten leren
- **Medior Full-Stack Developer** - Database en testing skills ontwikkelen
- **DevOps Engineer** - Meer infrastructuur kennis nodig

### ❌ Nog niet geschikt voor:
- **Senior Developer** - Onvoldoende grote projecten en team lead ervaring
- **Solutions Architect** - Niet genoeg enterprise systemen ervaring
- **Technical Lead** - Geen team management ervaring

---

## Volgende stappen voor functiegroei

### Korte termijn (0-6 maanden)
1. **Testing leren:** Jest voor unit tests, Playwright voor E2E
2. **React fundamentals:** Meest gevraagde framework in vacatures
3. **Database basics:** PostgreSQL of MongoDB, relationele data modelling
4. **Git collaboration:** Open source contributie voor team workflow ervaring

### Middellange termijn (6-12 maanden)
5. **TypeScript:** Type-safe development (veel bedrijven migreren hierheen)
6. **API design:** RESTful best practices, authentication (JWT, OAuth)
7. **Cloud services:** AWS/Azure basics, containerization (Docker)
8. **Agile proces:** Volgen van Scrum training of certificering

### Lange termijn (1-2 jaar)
9. **System design:** Schaalbare architecturen, microservices
10. **Team leadership:** Code reviews, mentoring, sprint planning
11. **Performance engineering:** Advanced optimization, caching strategies
12. **Security:** OWASP Top 10, penetratie testing basics

---

## Voor recruiters: ideale match

**Dit profiel past bij vacatures met:**
- ✅ "Junior tot medior" niveau
- ✅ "Modern web development" stack
- ✅ "Self-starter" of "leergierig" in omschrijving
- ✅ "Fulltime" rol (geen freelance meer)
- ✅ "Team environment" (wil leren van seniors)
- ✅ Focus op "clean code" en "best practices"

**Red flags waar ik nog niet bij pas:**
- ❌ "5+ years enterprise experience"
- ❌ "Lead a team of developers"
- ❌ "Expert in React/Angular/Vue"
- ❌ "DevOps background required"
- ❌ "Large-scale distributed systems"

---

## Contactinformatie & Repository

**Live demo:** [Link indien gepubliceerd]  
**GitHub:** [Repository link]  
**Documentatie:** Volledige technical docs beschikbaar in `/docs` folder

**Beschikbaar voor:**
- Portfolio review gesprekken
- Live coding demonstratie van dit project
- Technische vragen over implementatie details
- Code walkthrough met technical interviewer

---

*Dit document is gemaakt als eerlijke, technisch accurate weergave van mijn vaardigheden voor loopbaanbegeleiding en recruitment doeleinden. Alle claims zijn verifieerbaar via de codebase.*
