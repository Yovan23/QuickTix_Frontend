import { X, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectOption } from '@/components/ui/select'
import { GENRES, LANGUAGES, RATING_OPTIONS } from '@/utils/constants'

export function FilterBar({ filters, onFilterChange, onClearFilters }) {
    const hasActiveFilters = filters.genre || filters.language || filters.rating

    const handleGenreChange = (e) => {
        onFilterChange({ ...filters, genre: e.target.value })
    }

    const handleLanguageChange = (e) => {
        onFilterChange({ ...filters, language: e.target.value })
    }

    const handleRatingChange = (e) => {
        onFilterChange({ ...filters, rating: e.target.value })
    }

    return (
        <div className="glass-effect rounded-xl p-4 md:p-6 border border-white/10">
            <div className="flex items-center gap-2 mb-4">
                <SlidersHorizontal className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground">Filter Movies</h3>
            </div>

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
                        {GENRES.map((genre) => (
                            <SelectOption key={genre} value={genre}>
                                {genre}
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
                        {LANGUAGES.map((language) => (
                            <SelectOption key={language} value={language}>
                                {language}
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
                            {[filters.genre, filters.language, filters.rating].filter(Boolean).length}
                        </span>{' '}
                        filter{[filters.genre, filters.language, filters.rating].filter(Boolean).length > 1 ? 's' : ''} applied
                    </p>
                </div>
            )}
        </div>
    )
}
