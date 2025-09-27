<div align="center">

# Steam Insight 🎮

**A modern, comprehensive Steam game discovery and review platform built with Next.js and TypeScript.**

_Explore thousands of Steam games with rich media content, detailed reviews, and intelligent search capabilities._

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/xiricks-projects/steam-insight)
[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

</div>

---

## ✨ Features

- **🔍 Advanced Search**: Intelligent game search with filtering by genre, price, and rating
- **🎬 Rich Media**: Video trailers, screenshots, and media galleries for every game
- **⭐ Smart Ratings**: Combines Metacritic scores with Steam recommendation data
- **📊 Detailed Analytics**: Comprehensive game statistics and review breakdowns
- **🎯 Game Discovery**: Trending, popular, and top-rated game collections
- **� Unique Review IDs**: Stable, shareable identifiers for individual Steam reviews
- **📝 Individual Review Pages**: Deep-dive into specific reviews with full context and quality scoring
- **🎯 Review Collections**: Curated collections of high-quality community reviews
- **�📱 Responsive Design**: Optimized for desktop and mobile experiences
- **⚡ Performance**: Fast loading with intelligent caching and optimization

## 🚀 Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with shadcn/ui components
- **Language**: TypeScript for type safety
- **API Integration**: Steam API via steamapi package
- **State Management**: SWR for data fetching and caching
- **Icons**: Lucide React
- **Deployment**: Vercel

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
│   │   └── reviews/       # Review ID system & endpoints
│   ├── game/[id]/         # Game detail pages
│   ├── reviews/[id]/      # Individual review pages
│   ├── search/            # Search functionality
│   └── categories/        # Game categories
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── game-details.tsx  # Game detail view
│   ├── game-grid.tsx     # Game grid layout
│   ├── reviews-grid.tsx  # Review grid with unique IDs
│   └── search-section.tsx # Search interface
├── lib/                   # Utilities and API
│   ├── steam-api.ts      # Steam API integration
│   ├── review-id-utils.ts # Review ID generation & validation
│   └── utils.ts          # Helper functions
└── hooks/                # Custom React hooks
    ├── use-steam-games.ts # Game data hooks
    └── use-best-reviews.ts # Review data hooks
```

## 🎮 Key Features Deep Dive

### Game Discovery

- **Popular Games**: Trending and most-played Steam games
- **Featured Games**: Steam's featured and promotional content
- **Search & Filter**: Advanced filtering by genre, price, rating, and release date
- **Categories**: Browse games by specific genres and tags

### Rich Game Details

- **Media Gallery**: Video trailers with thumbnail previews
- **Screenshot Carousel**: High-resolution game screenshots
- **Comprehensive Info**: Developer, publisher, release date, pricing
- **Review Analytics**: Steam review breakdown with rating distribution
- **Related Games**: Intelligent game recommendations

### Advanced Review System

- **Unique Review IDs**: Every Steam review gets a stable, shareable identifier (`rv_[hash]`)
- **Individual Review Pages**: Rich, detailed pages for specific reviews with full context
- **Quality Scoring**: Algorithmic assessment of review quality based on length, votes, and author credibility
- **Review Collections**: Curated collections of high-quality reviews from experienced gamers
- **Shareable Links**: Direct links to specific reviews for sharing and reference
- **Smart Filtering**: Sort reviews by helpfulness, recency, quality score, or humor

### Performance Optimizations

- **Intelligent Caching**: 5-minute cache for API responses
- **Image Optimization**: Next.js automatic image optimization
- **Lazy Loading**: Components and images load on demand
- **Error Boundaries**: Graceful error handling and fallbacks

## 🔧 API Endpoints

### Game Endpoints

- `GET /api/games/popular` - Popular games list
- `GET /api/games/featured` - Featured games
- `GET /api/games/trending` - Trending games
- `GET /api/games/top-rated` - Top-rated games
- `GET /api/games/search` - Search games
- `GET /api/games/[id]` - Game details
- `GET /api/games/[id]/reviews` - Game reviews with unique IDs and sorting

### Review Endpoints

- `GET /api/reviews/best` - Best community reviews with unique IDs
- `GET /api/reviews/[id]` - Get specific review by unique ID
- `GET /api/reviews/ids` - List available review IDs with metadata
- `POST /api/reviews/ids` - Validate review ID formats

### Example Review Usage

```bash
# Get a specific review
curl https://yourapp.com/api/reviews/rv_a1b2c3d4e5f6g7h8

# Get reviews for a game with quality sorting
curl "https://yourapp.com/api/games/730/reviews?sort=quality&limit=10"

# List available review IDs with metadata
curl "https://yourapp.com/api/reviews/ids?metadata=true&limit=20"
```

### Review URLs

- **API Access**: `/api/reviews/rv_a1b2c3d4e5f6g7h8`
- **Web Pages**: `/reviews/rv_a1b2c3d4e5f6g7h8`

## 🆕 Recent Updates

### Review ID System (Latest)

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

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## �🙏 Acknowledgments

- [Steam](https://store.steampowered.com/) for providing the game data
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [Vercel](https://vercel.com/) for hosting and deployment

---

<div align="center">

**🚀 [Live Demo](https://steaminsight.vercel.app/) | 📖 [Documentation](#-installation--setup) | 🎮 [Features](#-features)**

_Built with ❤️ for the gaming community_

</div>
