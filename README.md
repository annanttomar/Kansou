# Kansou - Manga Search Engine

A beautiful and modern manga search engine built with Next.js, powered by the AniList GraphQL API.

## Features

- 🔍 **Advanced Search**: Search manga by title, author, or keywords
- 🏷️ **Genre Filtering**: Filter by multiple genres (Action, Adventure, Comedy, Drama, Fantasy, Horror, Mystery, Romance, Sci-Fi, Slice of Life, Supernatural, Thriller)
- 📚 **Format Filtering**: Filter by manga format (Manga, Novel, One Shot)
- 📊 **Status Filtering**: Filter by publication status (Finished, Releasing, Not Yet Released, Cancelled, Hiatus)
- ⭐ **Rating Display**: Shows average scores and popularity rankings
- 📱 **Responsive Design**: Beautiful interface that works on all devices
- ⚡ **Real-time Search**: Instant search results with debounced input
- 🎨 **Modern UI**: Clean, intuitive design with smooth animations

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **API**: AniList GraphQL API
- **Deployment**: Ready for Vercel, Netlify, or any Next.js hosting

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd kansou
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
kansou/
├── app/
│   ├── api/
│   │   └── search/
│   │       └── route.ts          # API route for manga search
│   ├── globals.css               # Global styles with Tailwind
│   ├── layout.tsx                # Root layout component
│   └── page.tsx                  # Main search page
├── package.json                  # Dependencies and scripts
├── tailwind.config.js           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
└── README.md                    # This file
```

## API Endpoints

### GET /api/search

Search for manga with optional filters.

**Query Parameters:**
- `q` (string): Search query for title/author/keywords
- `genres` (string): Comma-separated list of genres
- `formats` (string): Comma-separated list of formats
- `status` (string): Comma-separated list of statuses

**Example:**
```
GET /api/search?q=naruto&genres=Action,Adventure&formats=MANGA&status=FINISHED
```

## Features in Detail

### Search Interface
- Large, prominent search bar with search icon
- Real-time search with 500ms debounce
- Clear visual feedback during loading states

### Filter System
- Collapsible filter panel
- Multiple selection for genres, formats, and status
- Visual indicators for active filters
- Clear all filters functionality

### Manga Cards
- High-quality cover images with fallback
- Title in English or Romaji
- Truncated descriptions
- Rating display with star icon
- Publication date and format
- Genre tags (showing first 3 + count)
- Status badges with color coding
- Popularity ranking

### Responsive Design
- Mobile-first approach
- Grid layout that adapts to screen size
- Touch-friendly interface
- Optimized for all device types

## Customization

### Styling
The app uses Tailwind CSS with a custom color scheme. You can modify the colors in `tailwind.config.js`:

```javascript
colors: {
  primary: {
    50: '#fef7ee',
    100: '#fdedd6',
    // ... more shades
  }
}
```

### Search Results
Modify the number of results by changing the `perPage` parameter in the GraphQL query in `app/api/search/route.ts`.

### Filters
Add or remove genres, formats, and statuses by modifying the arrays in `app/page.tsx`.

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Netlify
1. Build the project: `npm run build`
2. Deploy the `.next` folder to Netlify

### Other Platforms
Any platform that supports Next.js can host this application.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- [AniList](https://anilist.co/) for providing the manga data API
- [Next.js](https://nextjs.org/) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Lucide](https://lucide.dev/) for the beautiful icons

---

Built with ❤️ for manga enthusiasts everywhere by Anant. 