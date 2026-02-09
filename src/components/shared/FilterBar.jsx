import { X, SlidersHorizontal, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectOption } from '@/components/ui/select'
import { GENRES, LANGUAGES, RATING_OPTIONS, MOVIE_STATUS_OPTIONS } from '@/utils/constants'

export function FilterBar({
    filters,
    onFilterChange,
    onClearFilters,
    genres: apiGenres,
    languages: apiLanguages,
    searchQuery = '',
    onSearchChange
}) {
    const hasActiveFilters = filters.genre || filters.language || filters.rating || filters.status || searchQuery

    // Use API data if available, otherwise fallback to constants
    const genreList = apiGenres?.length > 0 ? apiGenres : GENRES.map((g, i) => ({ id: g, name: g }))
    const languageList = apiLanguages?.length > 0 ? apiLanguages : LANGUAGES.map((l, i) => ({ id: l, name: l }))

    const handleGenreChange = (e) => {
        onFilterChange({ ...filters, genre: e.target.value })
    }

    const handleLanguageChange = (e) => {
        onFilterChange({ ...filters, language: e.target.value })
    }

    const handleRatingChange = (e) => {
        onFilterChange({ ...filters, rating: e.target.value })
    }

    const handleStatusChange = (e) => {
        onFilterChange({ ...filters, status: e.target.value })
    }

    const handleSearchChange = (e) => {
        if (onSearchChange) {
            onSearchChange(e.target.value)
        }
    }

    return (
        <div className="glass-effect rounded-xl p-4 md:p-6 border border-white/10">
            <div className="flex items-center gap-2 mb-4">
                <SlidersHorizontal className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">Filter Movies</h3>
            </div>

            {/* Search Bar */}
            {onSearchChange && (
                <div className="mb-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search movies..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="pl-10 bg-secondary/50 border-white/10 focus:border-primary"
                        />
                    </div>
                </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                {/* Genre Filter */}
                <div className="flex-1">
                    <label className="text-xs text-muted-foreground mb-1.5 block">Genre</label>
                    <Select
                        value={filters.genre}
                        onChange={handleGenreChange}
                        placeholder="All Genres"
                        className="w-full"
                    >
                        {genreList.map((genre) => (
                            <SelectOption
                                key={genre.id || genre}
                                value={genre.id || genre}
                            >
                                {genre.name || genre}
                            </SelectOption>
                        ))}
                    </Select>
                </div>

                {/* Language Filter */}
                <div className="flex-1">
                    <label className="text-xs text-muted-foreground mb-1.5 block">Language</label>
                    <Select
                        value={filters.language}
                        onChange={handleLanguageChange}
                        placeholder="All Languages"
                        className="w-full"
                    >
                        {languageList.map((language) => (
                            <SelectOption
                                key={language.id || language}
                                value={language.id || language}
                            >
                                {language.name || language}
                            </SelectOption>
                        ))}
                    </Select>
                </div>

                {/* Rating Filter */}
                <div className="flex-1">
                    <label className="text-xs text-muted-foreground mb-1.5 block">Rating</label>
                    <Select
                        value={filters.rating}
                        onChange={handleRatingChange}
                        placeholder="All Ratings"
                        className="w-full"
                    >
                        {RATING_OPTIONS.map((option) => (
                            <SelectOption key={option.value} value={option.value}>
                                {option.label}
                            </SelectOption>
                        ))}
                    </Select>
                </div>

                {/* Status Filter */}
                <div className="flex-1">
                    <label className="text-xs text-muted-foreground mb-1.5 block">Status</label>
                    <Select
                        value={filters.status || ''}
                        onChange={handleStatusChange}
                        placeholder="All Status"
                        className="w-full"
                    >
                        {MOVIE_STATUS_OPTIONS.map((option) => (
                            <SelectOption key={option.value} value={option.value}>
                                {option.label}
                            </SelectOption>
                        ))}
                    </Select>
                </div>

                {/* Clear Filters Button */}
                <div className="flex items-end">
                    <Button
                        variant="outline"
                        size="default"
                        onClick={onClearFilters}
                        disabled={!hasActiveFilters}
                        className="gap-2 w-full sm:w-auto"
                    >
                        <X className="h-4 w-4" />
                        <span className="hidden sm:inline">Clear</span>
                    </Button>
                </div>
            </div>

            {/* Active Filters Count */}
            {hasActiveFilters && (
                <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-sm text-muted-foreground">
                        <span className="text-primary font-medium">
                            {[filters.genre, filters.language, filters.rating, filters.status, searchQuery].filter(Boolean).length}
                        </span>{' '}
                        filter{[filters.genre, filters.language, filters.rating, filters.status, searchQuery].filter(Boolean).length > 1 ? 's' : ''} applied
                    </p>
                </div>
            )}
        </div>
    )
}
