import { useMemo, useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  SlidersHorizontal,
  ArrowUpDown,
  RotateCcw,
  X,
  LayoutGrid,
  List,
  ArrowRight,
  BookOpen,
  Tag
} from 'lucide-react'
import PageHero from '../components/PageHero'
import BookCover from '../components/BookCover'
import BooksSidebar, { SORT_OPTIONS, PRICE_PRESETS } from '../components/BooksSidebar'
import { Reveal, Stagger, StaggerItem } from '../components/Motion'
import { useBooks } from '../hooks/useContent'

export default function Books() {
  const books = useBooks()
  const [searchParams, setSearchParams] = useSearchParams()

  // Primary filter states
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || 'All')
  const [selectedYear, setSelectedYear] = useState(searchParams.get('year') || 'All')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All')
  const [selectedPricePreset, setSelectedPricePreset] = useState('all')
  const [sortBy, setSortBy] = useState('featured')
  const [viewMode, setViewMode] = useState('grid') // 'grid' | 'list'
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  // Only include active and published books that do not require CMS setup
  const publishedBooks = useMemo(() => {
    return books.filter((b) => {
      if (b.status && (b.status === 'draft' || b.status === 'inactive' || b.status === 'archived')) return false
      if (b.needsCmsSetup) return false
      return true
    })
  }, [books])

  // Highest price in current dataset
  const highestPrice = useMemo(() => {
    if (!publishedBooks.length) return 1200
    const prices = publishedBooks.map((b) => b.price || 600)
    return Math.max(...prices, 1000)
  }, [publishedBooks])

  const [maxPrice, setMaxPrice] = useState(1200)

  // Sync maxPrice when highestPrice loads
  useEffect(() => {
    if (highestPrice > 0) setMaxPrice(highestPrice)
  }, [highestPrice])

  // Sync from URL search params
  useEffect(() => {
    const qParam = searchParams.get('q')
    const catParam = searchParams.get('category')
    const typeParam = searchParams.get('type')
    const yearParam = searchParams.get('year')
    if (qParam !== null) setQuery(qParam)
    if (catParam !== null) setSelectedCategory(catParam)
    if (typeParam !== null) setSelectedType(typeParam)
    if (yearParam !== null) setSelectedYear(yearParam)
  }, [searchParams])

  // Aggregate available book types and counts
  const bookTypes = useMemo(() => {
    const counts = {}
    publishedBooks.forEach((b) => {
      const t = b.type || 'Monograph'
      counts[t] = (counts[t] || 0) + 1
    })
    return Object.entries(counts).map(([type, count]) => ({ type, count }))
  }, [publishedBooks])

  // Aggregate available publication years and counts
  const years = useMemo(() => {
    const counts = {}
    publishedBooks.forEach((b) => {
      const y = b.year
      if (y) counts[y] = (counts[y] || 0) + 1
    })
    return Object.entries(counts)
      .map(([year, count]) => ({ year: Number(year), count }))
      .sort((a, b) => b.year - a.year)
  }, [publishedBooks])

  // Aggregate available categories and counts
  const categoriesWithCounts = useMemo(() => {
    const counts = {}
    publishedBooks.forEach((b) => {
      const c = b.category
      if (c) counts[c] = (counts[c] || 0) + 1
    })
    return Object.entries(counts).map(([category, count]) => ({ category, count }))
  }, [publishedBooks])

  // Filter & Sort Logic
  const filteredAndSorted = useMemo(() => {
    const q = query.toLowerCase().trim()
    const preset = PRICE_PRESETS.find((p) => p.id === selectedPricePreset)

    const list = publishedBooks.filter((book) => {

      // 1. Text Search
      if (q) {
        const authorsStr = Array.isArray(book.authors) ? book.authors.join(' ') : (book.authors || '')
        const keywordsStr = Array.isArray(book.keywords) ? book.keywords.join(' ') : (book.keywords || '')
        const text = `${book.title || ''} ${book.subtitle || ''} ${authorsStr} ${keywordsStr} ${book.isbn || ''} ${book.category || ''} ${book.type || ''}`.toLowerCase()
        if (!text.includes(q)) return false
      }

      // 2. Book Type
      const bookType = book.type || 'Monograph'
      if (selectedType !== 'All' && bookType !== selectedType) return false

      // 3. Publication Year
      if (selectedYear !== 'All' && String(book.year) !== selectedYear) return false

      // 4. Category / Discipline
      if (selectedCategory !== 'All' && book.category !== selectedCategory) return false

      // 5. Price Preset Filter
      const price = book.price ?? 550
      if (preset && preset.id !== 'all') {
        if (price < preset.min || price > preset.max) return false
      }

      // 6. Max Price Slider
      if (price > maxPrice) return false

      return true
    })

    // Sort Publications
    list.sort((a, b) => {
      const priceA = a.price ?? 550
      const priceB = b.price ?? 550
      const yearA = a.year ?? 0
      const yearB = b.year ?? 0

      switch (sortBy) {
        case 'price-asc':
          return priceA - priceB
        case 'price-desc':
          return priceB - priceA
        case 'year-desc':
          return yearB - yearA
        case 'year-asc':
          return yearA - yearB
        case 'title-asc':
          return a.title.localeCompare(b.title)
        case 'featured':
        default:
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
      }
    })

    return list
  }, [
    books,
    query,
    selectedType,
    selectedYear,
    selectedCategory,
    selectedPricePreset,
    maxPrice,
    sortBy
  ])

  // Reset all filters
  const resetFilters = () => {
    setQuery('')
    setSelectedType('All')
    setSelectedYear('All')
    setSelectedCategory('All')
    setSelectedPricePreset('all')
    setMaxPrice(highestPrice)
    setSortBy('featured')
    setSearchParams({})
  }

  // Active filters count for badges
  const activeCount =
    (query ? 1 : 0) +
    (selectedType !== 'All' ? 1 : 0) +
    (selectedYear !== 'All' ? 1 : 0) +
    (selectedCategory !== 'All' ? 1 : 0) +
    (selectedPricePreset !== 'all' || maxPrice < highestPrice ? 1 : 0) +
    (sortBy !== 'featured' ? 1 : 0)

  return (
    <>
      <PageHero
        eyebrow="Publication Catalogue"
        subtitle="Peer-Reviewed Scholarly Books"
        title="Books for inquiry, teaching, and public knowledge."
        body="Explore scholarly monographs, edited collections, reference texts, and university publications across research, technology, sustainability, and society."
      />

      <section className="min-h-screen bg-diu-paper py-10 lg:py-16">
        <div className="container-shell">
          
          {/* Main Container: Sidebar + Content */}
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
            
            {/* Books Sidebar (Desktop Sticky + Mobile Slide-over) */}
            <BooksSidebar
              query={query}
              setQuery={setQuery}
              selectedType={selectedType}
              setSelectedType={setSelectedType}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedPricePreset={selectedPricePreset}
              setSelectedPricePreset={setSelectedPricePreset}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              highestPrice={highestPrice}
              sortBy={sortBy}
              setSortBy={setSortBy}
              bookTypes={bookTypes}
              years={years}
              categories={categoriesWithCounts}
              totalCount={books.length}
              filteredCount={filteredAndSorted.length}
              onReset={resetFilters}
              isOpen={isMobileSidebarOpen}
              onClose={() => setIsMobileSidebarOpen(false)}
            />

            {/* Main Content Area */}
            <main className="flex-1">
              {/* Top Controls Toolbar */}
              <div className="mb-6 flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                
                {/* Mobile Filter Button + Results Count */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsMobileSidebarOpen(true)}
                    className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-diu-navy shadow-sm transition-all duration-200 hover:border-diu-blue hover:text-diu-blue hover:-translate-y-0.5 active:translate-y-0 lg:hidden"
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    <span>Filter & Sort</span>
                    {activeCount > 0 && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-diu-blue text-[10px] text-white">
                        {activeCount}
                      </span>
                    )}
                  </button>

                  <div className="text-xs text-slate-500">
                    Showing <strong className="font-semibold text-diu-navy">{filteredAndSorted.length}</strong> of{' '}
                    {books.length} publications
                  </div>
                </div>

                {/* Desktop Sort Dropdown & View Mode Switcher */}
                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
                    <span className="text-xs text-slate-500">Sort by:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="focus-ring rounded-full border border-slate-200 bg-diu-paper px-3 py-1.5 text-xs font-medium text-diu-navy outline-none focus:border-diu-blue"
                    >
                      {SORT_OPTIONS.map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Grid / List View Toggle */}
                  <div className="hidden items-center rounded-full border border-slate-200 bg-diu-paper p-1 sm:flex">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`rounded-full p-2 transition-all ${
                        viewMode === 'grid'
                          ? 'bg-white text-diu-blue shadow-sm'
                          : 'text-slate-400 hover:text-slate-700'
                      }`}
                      title="Grid View"
                      aria-label="Grid View"
                    >
                      <LayoutGrid className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`rounded-full p-2 transition-all ${
                        viewMode === 'list'
                          ? 'bg-white text-diu-blue shadow-sm'
                          : 'text-slate-400 hover:text-slate-700'
                      }`}
                      title="List View"
                      aria-label="List View"
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Active Filter Badges */}
              {activeCount > 0 && (
                <div className="mb-6 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-slate-400">Active filters:</span>

                  {query && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs text-diu-blue">
                      <span>Search: "{query}"</span>
                      <button onClick={() => setQuery('')} className="rounded-full p-0.5 hover:bg-blue-100 transition active:scale-90" aria-label="Clear search">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}

                  {selectedType !== 'All' && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs text-diu-blue">
                      <span>Type: {selectedType}</span>
                      <button onClick={() => setSelectedType('All')} className="rounded-full p-0.5 hover:bg-blue-100 transition active:scale-90" aria-label="Clear type filter">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}

                  {selectedYear !== 'All' && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs text-diu-blue">
                      <span>Year: {selectedYear}</span>
                      <button onClick={() => setSelectedYear('All')} className="rounded-full p-0.5 hover:bg-blue-100 transition active:scale-90" aria-label="Clear year filter">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}

                  {selectedCategory !== 'All' && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs text-diu-blue">
                      <span>Discipline: {selectedCategory}</span>
                      <button onClick={() => setSelectedCategory('All')} className="rounded-full p-0.5 hover:bg-blue-100 transition active:scale-90" aria-label="Clear discipline filter">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}

                  {selectedPricePreset !== 'all' && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs text-diu-blue">
                      <span>
                        Price:{' '}
                        {PRICE_PRESETS.find((p) => p.id === selectedPricePreset)?.label || `≤ ৳${maxPrice}`}
                      </span>
                      <button
                        onClick={() => {
                          setSelectedPricePreset('all')
                          setMaxPrice(highestPrice)
                        }}
                        className="rounded-full p-0.5 hover:bg-blue-100 transition active:scale-90"
                        aria-label="Clear price filter"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}

                  {sortBy !== 'featured' && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs text-slate-600">
                      <span>Sorted: {SORT_OPTIONS.find((s) => s.id === sortBy)?.label}</span>
                      <button onClick={() => setSortBy('featured')} className="rounded-full p-0.5 hover:bg-slate-200 transition active:scale-90" aria-label="Reset sort">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}

                  <button
                    onClick={resetFilters}
                    className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50/80 px-3.5 py-1 text-xs font-semibold text-diu-red shadow-sm transition-all duration-200 hover:bg-red-100 hover:shadow hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>Clear all</span>
                  </button>
                </div>
              )}

              {/* Book Grid / List View */}
              {filteredAndSorted.length > 0 ? (
                viewMode === 'grid' ? (
                  <Stagger className="grid gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
                    {filteredAndSorted.map((book) => (
                      <StaggerItem key={book.slug}>
                        <Link
                          to={`/books/${book.slug}`}
                          className="group flex h-full flex-col overflow-hidden rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-diu-blue/30 hover:shadow-editorial"
                        >
                          {/* Book Cover */}
                          <div className="mx-auto w-full max-w-[240px] py-2">
                            <BookCover book={book} />
                          </div>

                          {/* Book Metadata */}
                          <div className="mt-5 flex flex-1 flex-col border-t border-slate-100 pt-4">
                            <div className="flex items-center justify-between gap-2 text-[10px] font-bold uppercase tracking-wider">
                              <span className="truncate text-diu-blue">{book.category}</span>
                              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-slate-600">
                                {book.year}
                              </span>
                            </div>

                            <h2 className="mt-2.5 font-serif text-xl font-bold leading-snug text-diu-navy transition group-hover:text-diu-blue">
                              {book.title}
                            </h2>

                            <p className="mt-1 text-xs text-slate-500 line-clamp-1">
                              {Array.isArray(book.authors) ? book.authors.join(', ') : (book.authors || 'DIU Press Author')}
                            </p>

                            {/* Price & Type Footer Bar */}
                            <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4 text-xs">
                              <div className="flex items-center gap-1.5 font-bold text-diu-navy">
                                <Tag className="h-3.5 w-3.5 text-diu-green" />
                                <span className="text-base text-diu-navy">
                                  {book.price ? `৳${book.price}` : 'Open Access'}
                                </span>
                              </div>

                              <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[10px] font-semibold text-slate-600">
                                {book.type || 'Monograph'}
                              </span>
                            </div>
                          </div>
                        </Link>
                      </StaggerItem>
                    ))}
                  </Stagger>
                ) : (
                  /* List View */
                  <div className="space-y-4">
                    {filteredAndSorted.map((book) => (
                      <Link
                        key={book.slug}
                        to={`/books/${book.slug}`}
                        className="group flex flex-col gap-6 rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm transition-all duration-300 hover:border-diu-blue/30 hover:shadow-editorial sm:flex-row sm:items-center"
                      >
                        <div className="w-[120px] shrink-0 self-center sm:self-start">
                          <BookCover book={book} />
                        </div>

                        <div className="flex flex-1 flex-col">
                          <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-wider">
                            <span className="text-diu-blue">{book.category}</span>
                            <span className="text-slate-300">•</span>
                            <span className="text-slate-500">{book.year}</span>
                            <span className="text-slate-300">•</span>
                            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-slate-600">
                              {book.type || 'Monograph'}
                            </span>
                            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-slate-600">
                              {book.format || 'Paperback'}
                            </span>
                          </div>

                          <h2 className="mt-2 font-serif text-2xl font-bold leading-snug text-diu-navy transition group-hover:text-diu-blue">
                            {book.title}
                          </h2>

                          <p className="mt-1 text-xs font-medium text-slate-600">
                            By {Array.isArray(book.authors) ? book.authors.join(', ') : (book.authors || 'DIU Press Author')}
                          </p>

                          <p className="mt-2.5 text-xs leading-relaxed text-slate-500 line-clamp-2">
                            {book.description || book.abstract}
                          </p>

                          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                            <div className="flex items-center gap-1.5 font-bold text-diu-navy">
                              <Tag className="h-4 w-4 text-diu-green" />
                              <span className="text-lg">
                                {book.price ? `৳${book.price}` : 'Open Access'}
                              </span>
                            </div>

                            <span className="flex items-center gap-1 text-xs font-semibold text-diu-blue">
                              View Publication <ArrowRight className="h-3.5 w-3.5" />
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )
              ) : (
                /* Empty state */
                <Reveal>
                  <div className="rounded-xl border border-slate-200 bg-white px-6 py-20 text-center shadow-sm">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-diu-blue">
                      <BookOpen className="h-7 w-7" />
                    </div>
                    <h3 className="mt-5 font-serif text-3xl font-semibold text-diu-navy">
                      No publications match your criteria
                    </h3>
                    <p className="mx-auto mt-2.5 max-w-md text-sm text-slate-500">
                      Try adjusting or resetting your type, year, or price filters to see more results from the
                      catalogue.
                    </p>
                    <button
                      onClick={resetFilters}
                      className="mt-6 inline-flex items-center gap-2 rounded-full border border-diu-navy bg-diu-navy px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white shadow-md transition-all duration-300 hover:bg-diu-blue hover:border-diu-blue hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>Reset all filters</span>
                    </button>
                  </div>
                </Reveal>
              )}
            </main>
          </div>
        </div>
      </section>
    </>
  )
}
