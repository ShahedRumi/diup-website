import { useState } from 'react'
import {
  SlidersHorizontal,
  X,
  RotateCcw,
  Search,
  ArrowUpDown,
  BookMarked,
  Calendar,
  Tag,
  Layers,
  ChevronDown
} from 'lucide-react'

export const SORT_OPTIONS = [
  { id: 'featured', label: 'Featured / Recommended' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
  { id: 'year-desc', label: 'Year: Newest First' },
  { id: 'year-asc', label: 'Year: Oldest First' },
  { id: 'title-asc', label: 'Title: A to Z' }
]

export const PRICE_PRESETS = [
  { id: 'all', label: 'All Prices', min: 0, max: Infinity },
  { id: 'under-500', label: 'Under ৳500', min: 0, max: 500 },
  { id: '500-750', label: '৳500 – ৳750', min: 500, max: 750 },
  { id: '750-1000', label: '৳750 – ৳1000', min: 750, max: 1000 },
  { id: 'above-1000', label: 'Above ৳1000', min: 1000, max: Infinity }
]

export default function BooksSidebar({
  query,
  setQuery,
  selectedType,
  setSelectedType,
  selectedYear,
  setSelectedYear,
  selectedCategory,
  setSelectedCategory,
  selectedPricePreset,
  setSelectedPricePreset,
  maxPrice,
  setMaxPrice,
  highestPrice = 1200,
  sortBy,
  setSortBy,
  bookTypes = [],
  years = [],
  categories = [],
  totalCount = 0,
  filteredCount = 0,
  onReset,
  isOpen = false,
  onClose = () => {}
}) {
  const [collapsedSections, setCollapsedSections] = useState({
    search: false,
    sort: false,
    type: false,
    price: false,
    year: false,
    category: false
  })

  const toggleSection = (section) => {
    setCollapsedSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const activeFiltersCount =
    (query ? 1 : 0) +
    (selectedType !== 'All' ? 1 : 0) +
    (selectedYear !== 'All' ? 1 : 0) +
    (selectedCategory !== 'All' ? 1 : 0) +
    (selectedPricePreset !== 'all' || maxPrice < highestPrice ? 1 : 0) +
    (sortBy !== 'featured' ? 1 : 0)

  const content = (
    <div className="space-y-6">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-diu-blue" />
          <h2 className="font-serif text-xl font-bold text-diu-navy">Filters & Sorting</h2>
        </div>
        {activeFiltersCount > 0 && (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-diu-blue shadow-sm transition-all duration-200 hover:bg-blue-100 hover:shadow hover:-translate-y-0.5 active:translate-y-0"
            title="Reset all filters"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* 1. Quick Search */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
          <span className="flex items-center gap-1.5">
            <Search className="h-3.5 w-3.5 text-diu-blue" /> Search Titles
          </span>
        </div>
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Title, author, keyword..."
            className="focus-ring h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-8 text-xs text-diu-navy outline-none placeholder:text-slate-400 focus:border-diu-blue"
          />
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 2. Sort Options */}
      <div className="border-t border-slate-200 pt-5">
        <button
          onClick={() => toggleSection('sort')}
          className="flex w-full items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-700"
        >
          <span className="flex items-center gap-1.5">
            <ArrowUpDown className="h-3.5 w-3.5 text-diu-blue" /> Sort Publications
          </span>
          <ChevronDown
            className={`h-4 w-4 text-slate-400 transition-transform ${
              collapsedSections.sort ? '-rotate-90' : ''
            }`}
          />
        </button>

        {!collapsedSections.sort && (
          <div className="mt-3 space-y-1.5">
            {SORT_OPTIONS.map((option) => (
              <label
                key={option.id}
                className={`flex cursor-pointer items-center justify-between rounded-md px-2.5 py-2 text-xs transition ${
                  sortBy === option.id
                    ? 'bg-blue-50 font-semibold text-diu-blue'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="sortBy"
                    value={option.id}
                    checked={sortBy === option.id}
                    onChange={() => setSortBy(option.id)}
                    className="h-3.5 w-3.5 accent-diu-blue"
                  />
                  <span>{option.label}</span>
                </div>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* 3. Book Type Filter */}
      <div className="border-t border-slate-200 pt-5">
        <button
          onClick={() => toggleSection('type')}
          className="flex w-full items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-700"
        >
          <span className="flex items-center gap-1.5">
            <BookMarked className="h-3.5 w-3.5 text-diu-green" /> Book Type / Format
          </span>
          <ChevronDown
            className={`h-4 w-4 text-slate-400 transition-transform ${
              collapsedSections.type ? '-rotate-90' : ''
            }`}
          />
        </button>

        {!collapsedSections.type && (
          <div className="mt-3 space-y-1.5">
            <button
              onClick={() => setSelectedType('All')}
              className={`flex w-full items-center justify-between rounded-full px-3.5 py-1.5 text-xs transition ${
                selectedType === 'All'
                  ? 'bg-diu-navy font-semibold text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>All Types</span>
              <span className={`text-[10px] ${selectedType === 'All' ? 'text-white/80' : 'text-slate-400'}`}>
                {totalCount}
              </span>
            </button>
            {bookTypes.map(({ type, count }) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`flex w-full items-center justify-between rounded-full px-3.5 py-1.5 text-xs transition ${
                  selectedType === type
                    ? 'bg-diu-navy font-semibold text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>{type}</span>
                <span className={`text-[10px] ${selectedType === type ? 'text-white/80' : 'text-slate-400'}`}>
                  {count}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 4. Price Filter */}
      <div className="border-t border-slate-200 pt-5">
        <button
          onClick={() => toggleSection('price')}
          className="flex w-full items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-700"
        >
          <span className="flex items-center gap-1.5">
            <Tag className="h-3.5 w-3.5 text-amber-600" /> Price Filter
          </span>
          <ChevronDown
            className={`h-4 w-4 text-slate-400 transition-transform ${
              collapsedSections.price ? '-rotate-90' : ''
            }`}
          />
        </button>

        {!collapsedSections.price && (
          <div className="mt-3 space-y-3">
            {/* Price Presets */}
            <div className="grid grid-cols-2 gap-1.5">
              {PRICE_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => {
                    setSelectedPricePreset(preset.id)
                    if (preset.max !== Infinity) {
                      setMaxPrice(preset.max)
                    } else {
                      setMaxPrice(highestPrice)
                    }
                  }}
                  className={`rounded-full border px-3 py-1.5 text-center text-[11px] font-medium transition ${
                    selectedPricePreset === preset.id
                      ? 'border-diu-blue bg-blue-50 text-diu-blue shadow-sm'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Price Range Slider */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Maximum Price:</span>
                <strong className="font-semibold text-diu-navy">৳{maxPrice}</strong>
              </div>
              <input
                type="range"
                min="300"
                max={highestPrice}
                step="50"
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(Number(e.target.value))
                  setSelectedPricePreset('custom')
                }}
                className="mt-2.5 h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-diu-blue"
              />
              <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400">
                <span>৳300</span>
                <span>৳{highestPrice}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 5. Publication Year Filter */}
      <div className="border-t border-slate-200 pt-5">
        <button
          onClick={() => toggleSection('year')}
          className="flex w-full items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-700"
        >
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-diu-blue" /> Publication Year
          </span>
          <ChevronDown
            className={`h-4 w-4 text-slate-400 transition-transform ${
              collapsedSections.year ? '-rotate-90' : ''
            }`}
          />
        </button>

        {!collapsedSections.year && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            <button
              onClick={() => setSelectedYear('All')}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] ${
                selectedYear === 'All'
                  ? 'bg-diu-blue text-white shadow-sm'
                  : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              All Years
            </button>
            {years.map(({ year, count }) => (
              <button
                key={year}
                onClick={() => setSelectedYear(String(year))}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] ${
                  selectedYear === String(year)
                    ? 'bg-diu-blue text-white shadow-sm'
                    : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                {year} <span className="opacity-70">({count})</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 6. Discipline / Category Filter */}
      <div className="border-t border-slate-200 pt-5">
        <button
          onClick={() => toggleSection('category')}
          className="flex w-full items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-700"
        >
          <span className="flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-diu-green" /> Discipline
          </span>
          <ChevronDown
            className={`h-4 w-4 text-slate-400 transition-transform ${
              collapsedSections.category ? '-rotate-90' : ''
            }`}
          />
        </button>

        {!collapsedSections.category && (
          <div className="mt-3 space-y-1">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`flex w-full items-center justify-between rounded-full px-3 py-1.5 text-xs transition hover:-translate-y-0.5 active:translate-y-0 ${
                selectedCategory === 'All'
                  ? 'bg-diu-navy font-semibold text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>All Disciplines</span>
              <span className={`text-[10px] ${selectedCategory === 'All' ? 'text-white/80' : 'text-slate-400'}`}>
                {totalCount}
              </span>
            </button>
            {categories.map(({ category, count }) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`flex w-full items-center justify-between rounded-full px-3 py-1.5 text-xs transition hover:-translate-y-0.5 active:translate-y-0 ${
                  selectedCategory === category
                    ? 'bg-diu-navy font-semibold text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span className="truncate pr-2 text-left">{category}</span>
                <span className={`shrink-0 text-[10px] ${selectedCategory === category ? 'text-white/80' : 'text-slate-400'}`}>
                  {count}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Active Count Summary */}
      <div className="rounded-lg bg-diu-paper p-3 text-center text-xs text-slate-500">
        Showing <strong className="text-diu-navy">{filteredCount}</strong> of {totalCount} titles
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:block lg:w-72 xl:w-80 shrink-0">
        <div className="sticky top-28 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          {content}
        </div>
      </aside>

      {/* Mobile Drawer (Responsive slide-over) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Slide-over panel */}
          <div className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-3">
              <span className="font-serif text-lg font-bold text-diu-navy">Filter Catalogue</span>
              <button
                onClick={onClose}
                className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition active:scale-95"
                aria-label="Close filters"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {content}

            <div className="mt-8 border-t border-slate-200 pt-4">
              <button
                onClick={onClose}
                className="w-full rounded-full bg-diu-navy py-3.5 text-center text-sm font-semibold text-white shadow-md transition-all duration-300 hover:bg-blue-900 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
              >
                Apply Filters ({filteredCount})
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
