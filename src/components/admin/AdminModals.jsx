import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Loader2 } from 'lucide-react';

// Age Rating enum values from backend
const AGE_RATINGS = [
    { value: 'U', label: 'U - Universal' },
    { value: 'UA', label: 'UA - Parental Guidance' },
    { value: 'A', label: 'A - Adult' },
    { value: 'PG', label: 'PG - Parental Guidance Suggested' },
    { value: 'R', label: 'R - Restricted' },
    { value: 'PG13', label: 'PG13 - Parents Strongly Cautioned' },
    { value: 'NC17', label: 'NC17 - Adults Only' },
    { value: 'NR', label: 'NR - Not Rated' },
    { value: 'U_A_13_PLUS', label: 'UA 13+ - Parental Guidance 13+' }
];

// Movie Status enum values from backend
const MOVIE_STATUSES = [
    { value: 'UPCOMING', label: 'Upcoming' },
    { value: 'RUNNING', label: 'Running' },
    { value: 'ENDED', label: 'Ended' }
];

/**
 * Modal Overlay Component
 */
const ModalOverlay = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-card border border-border rounded-xl shadow-2xl w-full max-w-md mx-4 p-6 animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-foreground">{title}</h3>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                        <X className="h-5 w-5 text-muted-foreground" />
                    </button>
                </div>

                {children}
            </div>
        </div>
    );
};

/**
 * City Form Modal
 * Create/Edit city with name, state, and country (as per backend DTO)
 * Note: Backend uses name, state, country - NOT pincode
 */
export function CityFormModal({ isOpen, onClose, onSubmit, initialData = null }) {
    const [name, setName] = useState('');
    const [state, setState] = useState('');
    const [country, setCountry] = useState('India');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (initialData) {
            setName(initialData.name || '');
            setState(initialData.state || '');
            setCountry(initialData.country || 'India');
        } else {
            setName('');
            setState('');
            setCountry('India');
        }
        setError(null);
    }, [initialData, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            setError('City name is required');
            return;
        }
        if (!state.trim()) {
            setError('State is required');
            return;
        }
        if (!country.trim()) {
            setError('Country is required');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await onSubmit({
                name: name.trim(),
                state: state.trim(),
                country: country.trim()
            });
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to save city');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ModalOverlay
            isOpen={isOpen}
            onClose={onClose}
            title={initialData ? 'Edit City' : 'Add New City'}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                        {error}
                    </div>
                )}

                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">City Name *</label>
                    <Input
                        placeholder="e.g., Mumbai"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={loading}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">State *</label>
                    <Input
                        placeholder="e.g., Maharashtra"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        disabled={loading}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Country *</label>
                    <Input
                        placeholder="e.g., India"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        disabled={loading}
                    />
                </div>

                <div className="flex gap-3 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={loading}
                        className="flex-1"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            initialData ? 'Update City' : 'Add City'
                        )}
                    </Button>
                </div>
            </form>
        </ModalOverlay>
    );
}

/**
 * Language Form Modal
 * Create language with name and code
 */
export function LanguageFormModal({ isOpen, onClose, onSubmit, initialData = null }) {
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (initialData) {
            setName(initialData.name || '');
            setCode(initialData.code || '');
        } else {
            setName('');
            setCode('');
        }
        setError(null);
    }, [initialData, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            setError('Language name is required');
            return;
        }
        if (!code.trim()) {
            setError('Language code is required');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await onSubmit(name.trim(), code.trim().toLowerCase());
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to save language');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ModalOverlay
            isOpen={isOpen}
            onClose={onClose}
            title={initialData ? 'Edit Language' : 'Add New Language'}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                        {error}
                    </div>
                )}

                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Language Name *</label>
                    <Input
                        placeholder="e.g., Hindi"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={loading}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Language Code *</label>
                    <Input
                        placeholder="e.g., hi"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        maxLength={5}
                        disabled={loading}
                    />
                    <p className="text-xs text-muted-foreground">2-5 character code (e.g., en, hi, ta)</p>
                </div>

                <div className="flex gap-3 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={loading}
                        className="flex-1"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            initialData ? 'Update Language' : 'Add Language'
                        )}
                    </Button>
                </div>
            </form>
        </ModalOverlay>
    );
}

/**
 * Genre Form Modal
 * Create genre with name
 */
export function GenreFormModal({ isOpen, onClose, onSubmit, initialData = null }) {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (initialData) {
            setName(initialData.name || '');
        } else {
            setName('');
        }
        setError(null);
    }, [initialData, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            setError('Genre name is required');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await onSubmit(name.trim());
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to save genre');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ModalOverlay
            isOpen={isOpen}
            onClose={onClose}
            title={initialData ? 'Edit Genre' : 'Add New Genre'}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                        {error}
                    </div>
                )}

                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Genre Name *</label>
                    <Input
                        placeholder="e.g., Action, Comedy, Drama"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={loading}
                    />
                </div>

                <div className="flex gap-3 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={loading}
                        className="flex-1"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            initialData ? 'Update Genre' : 'Add Genre'
                        )}
                    </Button>
                </div>
            </form>
        </ModalOverlay>
    );
}

/**
 * Movie Form Modal
 * Create/Edit movie matching backend CreateMovieRequest DTO:
 * - title, description, durationMinutes, releaseDate
 * - rating (BigDecimal 0-5), ageRating (enum), status (enum)
 * - genreIds, languageIds, cast, crew
 * - poster & background images
 */
export function MovieFormModal({ isOpen, onClose, onSubmit, initialData = null, genres = [], languages = [] }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        durationMinutes: '',
        releaseDate: '',
        rating: '',
        ageRating: 'UA',
        status: 'UPCOMING',
        genreIds: [],
        languageIds: [],
        cast: '',
        crew: ''
    });
    const [posterFile, setPosterFile] = useState(null);
    const [backgroundFile, setBackgroundFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (initialData) {
            // Map genre names to IDs (backend returns genres as Set<String>)
            let mappedGenreIds = [];
            if (initialData.genreIds && Array.isArray(initialData.genreIds)) {
                mappedGenreIds = initialData.genreIds;
            } else if (initialData.genres && Array.isArray(initialData.genres)) {
                // genres is Set<String> of genre names, map to IDs
                mappedGenreIds = initialData.genres
                    .map(genreName => {
                        const found = genres.find(g => g.name === genreName || g.name === genreName?.name);
                        return found ? found.id : null;
                    })
                    .filter(id => id !== null);
            }

            // Map language names to IDs (backend returns languages as Set<String>)
            let mappedLanguageIds = [];
            if (initialData.languageIds && Array.isArray(initialData.languageIds)) {
                mappedLanguageIds = initialData.languageIds;
            } else if (initialData.languages && Array.isArray(initialData.languages)) {
                // languages is Set<String> of language names, map to IDs
                mappedLanguageIds = initialData.languages
                    .map(langName => {
                        const found = languages.find(l => l.name === langName || l.name === langName?.name);
                        return found ? found.id : null;
                    })
                    .filter(id => id !== null);
            }

            setFormData({
                title: initialData.title || '',
                description: initialData.description || '',
                durationMinutes: initialData.durationMinutes || '',
                releaseDate: initialData.releaseDate?.split('T')[0] || '',
                rating: initialData.rating || '',
                ageRating: initialData.ageRating || 'UA',
                status: initialData.status || 'UPCOMING',
                genreIds: mappedGenreIds,
                languageIds: mappedLanguageIds,
                cast: Array.isArray(initialData.cast) ? initialData.cast.join(', ') : '',
                crew: Array.isArray(initialData.crew) ? initialData.crew.join(', ') : ''
            });
        } else {
            setFormData({
                title: '',
                description: '',
                durationMinutes: '',
                releaseDate: '',
                rating: '',
                ageRating: 'UA',
                status: 'UPCOMING',
                genreIds: [],
                languageIds: [],
                cast: '',
                crew: ''
            });
        }
        setPosterFile(null);
        setBackgroundFile(null);
        setError(null);
    }, [initialData, isOpen, genres, languages]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const toggleArrayItem = (field, id) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].includes(id)
                ? prev[field].filter(i => i !== id)
                : [...prev[field], id]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            setError('Movie title is required');
            return;
        }
        if (!formData.description.trim()) {
            setError('Description is required');
            return;
        }
        if (!formData.durationMinutes) {
            setError('Duration is required');
            return;
        }
        if (!formData.releaseDate) {
            setError('Release date is required');
            return;
        }
        if (!formData.rating || formData.rating < 0 || formData.rating > 5) {
            setError('Rating is required (0-5)');
            return;
        }
        if (formData.genreIds.length === 0) {
            setError('At least one genre is required');
            return;
        }
        if (formData.languageIds.length === 0) {
            setError('At least one language is required');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const submitData = new FormData();

            // Parse cast and crew from comma-separated strings to arrays
            const castArray = formData.cast.trim()
                ? formData.cast.split(',').map(s => s.trim()).filter(s => s)
                : [];
            const crewArray = formData.crew.trim()
                ? formData.crew.split(',').map(s => s.trim()).filter(s => s)
                : [];

            // Build movie data matching CreateMovieRequest DTO
            const movieData = {
                title: formData.title.trim(),
                description: formData.description.trim(),
                durationMinutes: parseInt(formData.durationMinutes),
                releaseDate: formData.releaseDate,
                rating: parseFloat(formData.rating),
                ageRating: formData.ageRating,
                status: formData.status,
                genreIds: formData.genreIds,
                languageIds: formData.languageIds,
                cast: castArray,
                crew: crewArray
            };
            submitData.append('data', JSON.stringify(movieData));

            // Add files if present
            if (posterFile) {
                submitData.append('poster', posterFile);
            }
            if (backgroundFile) {
                submitData.append('background', backgroundFile);
            }

            await onSubmit(submitData, initialData?.id);
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to save movie');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ModalOverlay
            isOpen={isOpen}
            onClose={onClose}
            title={initialData ? 'Edit Movie' : 'Add New Movie'}
        >
            <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                        {error}
                    </div>
                )}

                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Title *</label>
                    <Input
                        placeholder="Movie title"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        disabled={loading}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Description *</label>
                    <textarea
                        placeholder="Movie description"
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        disabled={loading}
                        className="w-full min-h-[80px] px-3 py-2 rounded-lg bg-background border border-input text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Duration (min) *</label>
                        <Input
                            type="number"
                            placeholder="120"
                            min="1"
                            value={formData.durationMinutes}
                            onChange={(e) => handleInputChange('durationMinutes', e.target.value)}
                            disabled={loading}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Rating (0-5) *</label>
                        <Input
                            type="number"
                            placeholder="4.5"
                            min="0"
                            max="5"
                            step="0.1"
                            value={formData.rating}
                            onChange={(e) => handleInputChange('rating', e.target.value)}
                            disabled={loading}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Age Rating *</label>
                        <select
                            value={formData.ageRating}
                            onChange={(e) => handleInputChange('ageRating', e.target.value)}
                            disabled={loading}
                            className="w-full h-10 px-3 rounded-lg bg-background border border-input text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            {AGE_RATINGS.map(ar => (
                                <option key={ar.value} value={ar.value}>{ar.label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Status</label>
                        <select
                            value={formData.status}
                            onChange={(e) => handleInputChange('status', e.target.value)}
                            disabled={loading}
                            className="w-full h-10 px-3 rounded-lg bg-background border border-input text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            {MOVIE_STATUSES.map(ms => (
                                <option key={ms.value} value={ms.value}>{ms.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Release Date *</label>
                    <Input
                        type="date"
                        value={formData.releaseDate}
                        onChange={(e) => handleInputChange('releaseDate', e.target.value)}
                        disabled={loading}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Genres * (select at least one)</label>
                    <div className="flex flex-wrap gap-2">
                        {genres.map(genre => (
                            <button
                                key={genre.id}
                                type="button"
                                onClick={() => toggleArrayItem('genreIds', genre.id)}
                                className={`px-3 py-1 text-xs rounded-full border transition-colors ${formData.genreIds.includes(genre.id)
                                    ? 'bg-primary text-primary-foreground border-primary'
                                    : 'bg-muted/30 text-muted-foreground border-border hover:border-primary'
                                    }`}
                                disabled={loading}
                            >
                                {genre.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Languages * (select at least one)</label>
                    <div className="flex flex-wrap gap-2">
                        {languages.map(lang => (
                            <button
                                key={lang.id}
                                type="button"
                                onClick={() => toggleArrayItem('languageIds', lang.id)}
                                className={`px-3 py-1 text-xs rounded-full border transition-colors ${formData.languageIds.includes(lang.id)
                                    ? 'bg-primary text-primary-foreground border-primary'
                                    : 'bg-muted/30 text-muted-foreground border-border hover:border-primary'
                                    }`}
                                disabled={loading}
                            >
                                {lang.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Cast</label>
                    <Input
                        placeholder="Actor 1, Actor 2, Actor 3"
                        value={formData.cast}
                        onChange={(e) => handleInputChange('cast', e.target.value)}
                        disabled={loading}
                    />
                    <p className="text-xs text-muted-foreground">Comma-separated list of cast members</p>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Crew</label>
                    <Input
                        placeholder="Director, Producer, etc."
                        value={formData.crew}
                        onChange={(e) => handleInputChange('crew', e.target.value)}
                        disabled={loading}
                    />
                    <p className="text-xs text-muted-foreground">Comma-separated list of crew members</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Poster Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setPosterFile(e.target.files?.[0] || null)}
                            disabled={loading}
                            className="w-full text-xs file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-primary file:text-primary-foreground"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Background Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setBackgroundFile(e.target.files?.[0] || null)}
                            disabled={loading}
                            className="w-full text-xs file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-primary file:text-primary-foreground"
                        />
                    </div>
                </div>

                <div className="flex gap-3 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={loading}
                        className="flex-1"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            initialData ? 'Update Movie' : 'Add Movie'
                        )}
                    </Button>
                </div>
            </form>
        </ModalOverlay>
    );
}
