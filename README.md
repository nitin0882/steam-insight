<div align="center">

# Steam Insight 🎮

**A comprehensive, modern Steam game discovery and review platform built with Next.js and TypeScript.**

_Explore thousands of Steam games with rich media content, detailed reviews, advanced search, user profiles, and progressive web app capabilities._

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/xiricks-projects/steam-insight)
[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-black?style=for-the-badge&logo=pwa)](https://web.dev/progressive-web-apps/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)

</div>

---

## ✨ Features

- **🔍 Advanced Search**: Intelligent game search with filtering by genre, price, rating, and release date
- **🎬 Rich Media**: Video trailers, screenshots, and media galleries for every game
- **⭐ Smart Ratings**: Combines Metacritic scores with Steam recommendation data
- **📊 Detailed Analytics**: Comprehensive game statistics and review breakdowns
- **🎯 Game Discovery**: Trending, popular, new releases, and top-rated game collections
- **🏆 Top Games Showcase**: Curated collection of highest-rated games with expert reviews
- **📱 Progressive Web App**: Installable on mobile devices with offline capabilities
- **🎭 Steam Awards**: Dynamic integration with Steam's community review awards system
- **👤 User Review Profiles**: Dedicated pages for Steam users' review histories
- **🔗 Unique Review IDs**: Stable, shareable identifiers for individual Steam reviews
- **📝 Individual Review Pages**: Deep-dive into specific reviews with full context and quality scoring
- **🎯 Review Collections**: Curated collections of high-quality community reviews
- **🎨 Smooth Animations**: Custom animation system for enhanced user experience
- **⚡ Performance Monitoring**: Real-time Core Web Vitals tracking
- **📱 Responsive Design**: Optimized for desktop and mobile experiences
- **🔄 Intelligent Caching**: 5-minute cache for API responses with smart invalidation

## 🚀 Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with shadcn/ui components
- **Language**: TypeScript for type safety
- **API Integration**: Steam API via steamapi package
- **State Management**: SWR for data fetching and caching
- **Animations**: Framer Motion and custom animate-ui system
- **Progressive Web App**: Next.js PWA with service worker
- **Performance**: Web Vitals monitoring and analytics
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **Deployment**: Vercel with analytics integration

## 🛠️ Installation & Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/xi-Rick/steam-insight.git
   cd steam-insight
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Environment Setup** (Optional)

   ```bash
   # Create .env.local file
   STEAM_API_KEY=your_steam_api_key_here
   ```

4. **Run the development server**

   ```bash
   pnpm dev
   # or
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
steam-insight/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── games/         # Steam game endpoints
│   │   │   ├── [id]/      # Individual game APIs (details, reviews, related)
│   │   │   ├── category/  # Category-based game browsing
│   │   │   ├── popular/   # Popular games endpoint
│   │   │   ├── trending/  # Trending games endpoint
│   │   │   ├── top-rated/ # Top-rated games endpoint
│   │   │   ├── new-releases/ # New release games endpoint
│   │   │   └── search/    # Game search functionality
│   │   └── reviews/       # Review ID system & endpoints
│   │       ├── [id]/      # Individual review APIs
│   │       ├── best/      # Best reviews collection
│   │       ├── ids/       # Review ID management
│   │       └── user/      # User review profiles
│   ├── game/[id]/         # Game detail pages
│   ├── reviews/           # Review system pages
│   │   ├── [id]/          # Individual review pages
│   │   └── user/[steamid]/ # User review profile pages
│   ├── categories/        # Game categories browsing
│   │   └── [category]/    # Category-specific pages
│   ├── search/            # Advanced search functionality
│   ├── top-games/         # Top-rated games showcase
│   └── sitemap.ts         # SEO sitemap generation
├── components/            # React components
│   ├── ui/               # shadcn/ui component library
│   ├── animate-ui/       # Custom animation system
│   ├── game-details.tsx  # Game detail view with media
│   ├── game-grid.tsx     # Game grid layout components
│   ├── reviews-grid.tsx  # Review grid with unique IDs
│   ├── search-section.tsx # Search interface with filters
│   ├── advanced-search-filters.tsx # Advanced filtering system
│   ├── floating-steam-awards.tsx # Steam awards animation
│   ├── performance-monitor.tsx # Web vitals tracking
│   ├── top-games-grid.tsx # Top games showcase
│   └── search-dialog.tsx # Enhanced search dialog
├── lib/                   # Utilities and API
│   ├── steam-api.ts      # Steam API integration
│   ├── review-id-utils.ts # Review ID generation & validation
│   ├── steam-awards-manifest.ts # Steam awards data
│   └── utils.ts          # Helper functions
├── hooks/                # Custom React hooks
│   ├── use-steam-games.ts # Game data fetching hooks
│   ├── use-best-reviews.ts # Review data hooks
│   ├── use-category-pagination.ts # Category pagination
│   ├── use-new-release-games.ts # New releases hook
│   ├── use-popular-games.ts # Popular games hook
│   ├── use-top-rated-games.ts # Top-rated games hook
│   ├── use-trending-games.ts # Trending games hook
│   └── use-user-reviews.ts # User reviews hook
└── public/               # Static assets
    ├── steam-awards/     # Steam award images
    └── [PWA assets]      # Progressive Web App files
```

## 🎮 Key Features Deep Dive

### Game Discovery

- **Popular Games**: Trending and most-played Steam games
- **Top-Rated Showcase**: Curated collection of highest-rated games with Metacritic integration
- **New Releases**: Latest game releases and upcoming titles
- **Trending Games**: Currently popular and rising games
- **Featured Games**: Steam's featured and promotional content
- **Category Browsing**: Organized game discovery by genres and tags
- **Advanced Search & Filter**: Multi-criteria filtering by genre, price, rating, and release date

### Rich Game Details

- **Media Gallery**: Video trailers with thumbnail previews and full-screen viewing
- **Screenshot Carousel**: High-resolution game screenshots with navigation
- **Comprehensive Info**: Developer, publisher, release date, pricing, and system requirements
- **Review Analytics**: Steam review breakdown with rating distribution and sentiment analysis
- **Related Games**: Intelligent game recommendations based on similar titles
- **Steam Awards Display**: Visual showcase of community review awards

### Advanced Review System

- **Unique Review IDs**: Every Steam review gets a stable, shareable identifier (`rv_[hash]`)
- **Individual Review Pages**: Rich, detailed pages for specific reviews with full context
- **Quality Scoring**: Algorithmic assessment of review quality based on length, votes, and author credibility
- **User Review Profiles**: Dedicated pages showcasing individual users' review histories
- **Review Collections**: Curated collections of high-quality reviews from experienced gamers
- **Steam Awards Integration**: Dynamic display of review awards and community recognition
- **Shareable Links**: Direct links to specific reviews for sharing and reference
- **Smart Filtering**: Sort reviews by helpfulness, recency, quality score, or humor

### Progressive Web App Features

- **Installable**: Add to home screen on mobile devices
- **Offline Support**: Core functionality works without internet connection
- **Push Notifications**: Stay updated with new releases and reviews
- **Native App Experience**: App-like interface and performance

### Performance & User Experience

- **Core Web Vitals Monitoring**: Real-time performance tracking and optimization
- **Intelligent Caching**: 5-minute cache for API responses with smart invalidation
- **Smooth Animations**: Custom animation system for enhanced interactions
- **Responsive Design**: Optimized for desktop, tablet, and mobile experiences
- **Error Boundaries**: Graceful error handling and fallbacks
- **Loading States**: Skeleton screens and progressive loading

## 🔧 API Endpoints

### Game Endpoints

- `GET /api/games/popular` - Popular games list with pagination
- `GET /api/games/featured` - Featured games from Steam
- `GET /api/games/trending` - Currently trending games
- `GET /api/games/top-rated` - Highest-rated games with Metacritic scores
- `GET /api/games/new-releases` - Latest game releases
- `GET /api/games/search` - Advanced game search with filters
- `GET /api/games/[id]` - Detailed game information
- `GET /api/games/[id]/reviews` - Game reviews with unique IDs and sorting
- `GET /api/games/[id]/related` - Related games recommendations
- `GET /api/games/category/[category]` - Games by specific category

### Review Endpoints

- `GET /api/reviews/best` - Best community reviews with unique IDs
- `GET /api/reviews/[id]` - Get specific review by unique ID
- `GET /api/reviews/ids` - List available review IDs with metadata
- `POST /api/reviews/ids` - Validate review ID formats
- `GET /api/reviews/user/[steamid]` - Get reviews by specific Steam user

### Example Usage

```bash
# Get top-rated games with Metacritic scores
curl "https://yourapp.com/api/games/top-rated?limit=20"

# Get reviews for a specific game with quality sorting
curl "https://yourapp.com/api/games/730/reviews?sort=quality&limit=10"

# Get a specific review by ID
curl https://yourapp.com/api/reviews/rv_a1b2c3d4e5f6g7h8

# Get reviews from a specific Steam user
curl "https://yourapp.com/api/reviews/user/76561198000000000?page=1&limit=10"

# Search games with advanced filters
curl "https://yourapp.com/api/games/search?q=action&genre=action&price_max=50&rating_min=4.0"
```

### Review URLs

- **API Access**: `/api/reviews/rv_a1b2c3d4e5f6g7h8`
- **Web Pages**: `/reviews/rv_a1b2c3d4e5f6g7h8`
- **User Profiles**: `/reviews/user/76561198000000000`

## 🆕 Recent Updates

### 🎮 Enhanced Game Discovery (Latest)

- **🏆 Top Games Collection**: Dedicated page showcasing the highest-rated Steam games with Metacritic integration
- **📱 Progressive Web App**: Full PWA support with offline capabilities, installable on mobile devices
- **🎭 Steam Awards Integration**: Dynamic floating awards animation and comprehensive award manifest system
- **👤 User Review Profiles**: Individual pages for Steam users showcasing their review history and contributions
- **🎨 Advanced Animations**: Custom animation system with Framer Motion for enhanced user experience
- **⚡ Performance Monitoring**: Real-time Core Web Vitals tracking and analytics integration
- **🔍 Enhanced Search Dialog**: Improved search interface with advanced filtering capabilities
- **📊 Category-Based Browsing**: Organized game discovery by specific genres and categories

### Review ID System (Previous)

- **🔗 Unique Review Identifiers**: Every Steam review now gets a stable, shareable ID (`rv_[hash]`)
- **📝 Individual Review Pages**: Deep-dive into specific reviews at `/reviews/[id]` with rich UI
- **🎯 Enhanced API**: New endpoints for review discovery, validation, and programmatic access
- **📊 Quality Scoring**: Algorithmic assessment of review quality and helpfulness
- **🔄 Smart Sorting**: Sort reviews by helpfulness, recency, quality score, or humor
- **🔗 Shareable Links**: Direct links to specific reviews for easy sharing and reference

### Key Benefits

- **Programmatic Access**: Easy integration for external systems and analytics
- **Stable References**: Review IDs remain consistent across app restarts
- **Rich Context**: Individual review pages include game info, author details, and community awards
- **Performance**: Intelligent caching and optimized API responses
- **Mobile-First**: Responsive design with PWA capabilities for on-the-go gaming discovery

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [Steam](https://store.steampowered.com/) for providing the game data and review system
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [Vercel](https://vercel.com/) for hosting and deployment

---

<div align="center">

**🚀 [Live Demo](https://steaminsight.vercel.app/) | 📖 [Documentation](#-installation--setup) | 🎮 [Features](#-features)**

_Built with ❤️ for the gaming community - Discover, review, and share your favorite Steam games_

</div>
