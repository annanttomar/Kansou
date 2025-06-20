'use client'

import React, { useState, useEffect } from 'react'
import { Search, Filter, BookOpen, Star, Calendar, Loader2, X, Users, Sun, Moon, Link as LinkIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { MangaCardSkeleton } from './components/manga-card-skeleton'
import { ScrollToTopButton } from './components/scroll-to-top'

interface Manga {
  id: number
  siteUrl: string
  title: {
    english: string | null
    romaji: string
    native: string | null
  }
  coverImage: {
    large: string
    medium: string
  }
  description: string
  averageScore: number
  popularity: number
  genres: string[]
  format: string
  status: string
  startDate: {
    year: number
    month: number
    day: number
  }
}

const genres = [
  'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 
  'Mystery', 'Romance', 'Sci-Fi', 'Slice of Life', 'Supernatural', 'Thriller'
]

const formats = ['MANGA', 'NOVEL', 'ONE_SHOT']
const statuses = ['FINISHED', 'RELEASING', 'NOT_YET_RELEASED', 'CANCELLED', 'HIATUS']

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [mangas, setMangas] = useState<Manga[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [selectedFormats, setSelectedFormats] = useState<string[]>([])
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [selectedManga, setSelectedManga] = useState<Manga | null>(null)
  const { theme, setTheme } = useTheme()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    searchManga() // Initial load
  }, [])

  const searchManga = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchQuery.trim()) params.append('q', searchQuery.trim())
      if (selectedGenres.length > 0) params.append('genres', selectedGenres.join(','))
      if (selectedFormats.length > 0) params.append('formats', selectedFormats.join(','))
      if (selectedStatuses.length > 0) params.append('status', selectedStatuses.join(','))

      // Always fetch, even if params is empty (to get default recommendations)
      const response = await fetch(`/api/search?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setMangas(data)
      } else {
        setMangas([])
      }
    } catch (error) {
      setMangas([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!isMounted) return

    const debouncedSearch = setTimeout(() => {
      searchManga()
    }, 500)

    return () => clearTimeout(debouncedSearch)
  }, [searchQuery, selectedGenres, selectedFormats, selectedStatuses])

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    )
  }

  const toggleFormat = (format: string) => {
    setSelectedFormats(prev => 
      prev.includes(format) 
        ? prev.filter(f => f !== format)
        : [...prev, format]
    )
  }

  const toggleStatus = (status: string) => {
    setSelectedStatuses(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status)
        : [...prev, status]
    )
  }

  const clearFilters = () => {
    setSelectedGenres([])
    setSelectedFormats([])
    setSelectedStatuses([])
    setSearchQuery('')
  }

  const handleGoHome = () => {
    clearFilters()
    setSelectedManga(null)
    searchManga()
  }

  const formatDate = (date: { year: number; month: number; day: number }) => {
    if (!date.year) return 'Unknown'
    return `${date.month || '??'}/${date.day || '??'}/${date.year}`
  }

  const truncateDescription = (description: string, maxLength: number = 150) => {
    if (!description) return 'No description available'
    const strippedDescription = description.replace(/<[^>]+>/g, '') // Strip HTML tags
    return strippedDescription.length > maxLength
      ? strippedDescription.substring(0, maxLength) + '...'
      : strippedDescription
  }

  const renderThemeToggler = () => {
    if (!isMounted) {
      return <div className="h-9 w-9" /> // Placeholder for SSR
    }

    return (
      <button
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="Toggle theme"
      >
        {theme === 'light' ? (
          <Moon className="h-5 w-5" />
        ) : (
          <Sun className="h-5 w-5" />
        )}
      </button>
    )
  }

  const isSearching = searchQuery.trim().length > 0 || selectedGenres.length > 0 || selectedFormats.length > 0 || selectedStatuses.length > 0;

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800/50 backdrop-blur-sm shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button onClick={handleGoHome} className="flex items-center space-x-3 group">
              <BookOpen className="h-8 w-8 text-primary-600 group-hover:text-primary-700 transition-colors" />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50 group-hover:text-primary-600 dark:group-hover:text-primary-500 transition-colors">Kansou</h1>
              <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full hidden sm:block">
                Manga Search
              </span>
            </button>
            <div className="flex items-center space-x-2">
              {renderThemeToggler()}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Search Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search for manga by title, author, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input pl-12 pr-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-50 border-gray-200 dark:border-gray-700 focus:border-primary-500 dark:focus:border-primary-500"
            />
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 animate-slide-up">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Genres */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-3">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {genres.map((genre) => (
                    <button
                      key={genre}
                      onClick={() => toggleGenre(genre)}
                      className={`filter-button ${selectedGenres.includes(genre) ? 'active' : ''} dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600 dark:[&.active]:bg-primary-500 dark:[&.active]:text-white dark:[&.active]:border-primary-500`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>

              {/* Formats */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-3">Formats</h3>
                <div className="flex flex-wrap gap-2">
                  {formats.map((format) => (
                    <button
                      key={format}
                      onClick={() => toggleFormat(format)}
                      className={`filter-button ${selectedFormats.includes(format) ? 'active' : ''} dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600 dark:[&.active]:bg-primary-500 dark:[&.active]:text-white dark:[&.active]:border-primary-500`}
                    >
                      {format.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-3">Status</h3>
                <div className="flex flex-wrap gap-2">
                  {statuses.map((status) => (
                    <button
                      key={status}
                      onClick={() => toggleStatus(status)}
                      className={`filter-button ${selectedStatuses.includes(status) ? 'active' : ''} dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600 dark:[&.active]:bg-primary-500 dark:[&.active]:text-white dark:[&.active]:border-primary-500`}
                    >
                      {status.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        <div className="space-y-6">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 12 }).map((_, index) => (
                <MangaCardSkeleton key={index} />
              ))}
            </div>
          ) : !loading && mangas.length === 0 && isSearching ? (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-50 mb-2">No manga found</h3>
              <p className="text-gray-600 dark:text-gray-400">Try adjusting your search terms or filters</p>
            </div>
          ) : !loading && mangas.length > 0 && (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
                  {isSearching ? `Found ${mangas.length} manga` : 'Top Picks For You'}
                </h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {mangas.map((manga, index) => (
                  <div
                    key={manga.id}
                    className="manga-card bg-white dark:bg-gray-800 flex flex-col justify-between overflow-hidden cursor-pointer animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
                  >
                    <div onClick={() => setSelectedManga(manga)} className="flex-grow">
                      <div className="relative group">
                        <img
                          src={manga.coverImage.large}
                          alt={manga.title.english || manga.title.romaji}
                          className="w-full h-64 object-cover transition-all duration-300"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = 'https://via.placeholder.com/300x400?text=No+Image'
                          }}
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                        {manga.averageScore > 0 && (
                          <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-sm font-semibold flex items-center">
                            <Star className="h-3 w-3 mr-1 fill-current" />
                            {manga.averageScore / 10}
                          </div>
                        )}
                      </div>
                      
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-50 mb-2 line-clamp-2">
                          {manga.title.english || manga.title.romaji}
                        </h3>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-3">
                          {truncateDescription(manga.description)}
                        </p>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-3">
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {formatDate(manga.startDate)}
                          </span>
                          <span className="capitalize">{manga.format.toLowerCase().replace('_', ' ')}</span>
                        </div>
                        
                        <div className="flex flex-wrap gap-1 mb-3">
                          {manga.genres.slice(0, 3).map((genre) => (
                            <span
                              key={genre}
                              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
                            >
                              {genre}
                            </span>
                          ))}
                          {manga.genres.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full">
                              +{manga.genres.length - 3}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            manga.status === 'FINISHED' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' :
                            manga.status === 'RELEASING' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300' :
                            manga.status === 'HIATUS' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' :
                            'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                          }`}>
                            {manga.status.replace('_', ' ')}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            #{manga.popularity}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <a
                      href={manga.siteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="block p-3 bg-gray-50 dark:bg-gray-700/50 text-center text-sm font-medium text-primary-600 dark:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      View on AniList
                    </a>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <ScrollToTopButton />

      {selectedManga && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fade-in"
          onClick={() => setSelectedManga(null)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full relative animate-slide-up flex flex-col md:flex-row max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedManga(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 transition-colors z-10 p-1 bg-white/50 dark:bg-gray-900/50 rounded-full"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="md:w-1/3 flex-shrink-0">
              <img
                src={selectedManga.coverImage.large}
                alt={selectedManga.title.english || selectedManga.title.romaji}
                className="w-full h-full object-cover rounded-l-xl"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/300x400?text=No+Image';
                }}
              />
            </div>

            <div className="md:w-2/3 p-6 md:p-8 space-y-4 overflow-y-auto">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-50 pr-10">
                {selectedManga.title.english || selectedManga.title.romaji}
              </h2>
              {selectedManga.title.english && (
                <p className="text-lg text-gray-500 dark:text-gray-400 -mt-2">{selectedManga.title.romaji}</p>
              )}
              {selectedManga.title.native && (
                <p className="text-md text-gray-400 dark:text-gray-300">{selectedManga.title.native}</p>
              )}

              <div className="flex items-center space-x-6 pt-2 text-sm text-gray-700 dark:text-gray-200">
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  <span className="font-semibold text-lg">{selectedManga.averageScore > 0 ? selectedManga.averageScore / 10 : 'N/A'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  <span className="font-semibold text-lg">#{selectedManga.popularity}</span>
                </div>
              </div>

              <div className="prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 space-y-2" dangerouslySetInnerHTML={{ __html: selectedManga.description }} />

              <div className="pt-4 space-y-3">
                <div className="flex">
                  <strong className="w-24 text-gray-600 dark:text-gray-400">Format</strong>
                  <span className="dark:text-gray-200">{selectedManga.format.replace('_', ' ')}</span>
                </div>
                <div className="flex">
                  <strong className="w-24 text-gray-600 dark:text-gray-400">Status</strong>
                  <span className="dark:text-gray-200">{selectedManga.status.replace('_', ' ')}</span>
                </div>
                <div className="flex">
                  <strong className="w-24 text-gray-600 dark:text-gray-400">Start Date</strong>
                  <span className="dark:text-gray-200">{formatDate(selectedManga.startDate)}</span>
                </div>
                <div className="flex">
                  <strong className="w-24 text-gray-600 dark:text-gray-400">Genres</strong>
                  <div className="flex flex-wrap gap-2">
                    {selectedManga.genres.map((genre) => (
                      <span key={genre} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full">
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="pt-6">
                <a
                  href={selectedManga.siteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full px-4 py-3 font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-all duration-200"
                >
                  <LinkIcon className="h-4 w-4 mr-2" />
                  View on AniList
                </a>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  )
} 