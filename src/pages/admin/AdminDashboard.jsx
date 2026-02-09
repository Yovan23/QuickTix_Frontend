import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ErrorMessage } from '@/components/shared/ErrorMessage';
import { RefreshCw } from 'lucide-react';

// Tab components
import { Tab } from '@/components/admin/shared';
import {
    OverviewTab,
    MoviesTab,
    PendingOwnersTab,
    TheatresTab,
    CitiesTab,
    LanguagesTab,
    GenresTab
} from '@/components/admin/tabs';

// Modals
import {
    CityFormModal,
    LanguageFormModal,
    GenreFormModal,
    MovieFormModal
} from '@/components/admin/AdminModals';

// API services
import {
    getMovies,
    createMovie,
    updateMovie,
    deleteMovie,
    getGenres,
    getLanguages,
    getCities,
    createCity,
    updateCity,
    deleteCity,
    createLanguage,
    updateLanguage,
    deleteLanguage,
    createGenre,
    updateGenre,
    deleteGenre
} from '@/api/services/catalogueService';
import {
    getPendingOwners,
    approveOwner,
    rejectOwner,
    getAllTheatres,
    deleteTheatre
} from '@/api/services/theatreService';

export function AdminDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();

    // Valid tabs list
    const validTabs = ['overview', 'movies', 'pending', 'theatres', 'cities', 'languages', 'genres'];

    // Initialize tab from URL or default to 'overview'
    const initialTab = searchParams.get('tab') || 'overview';
    const [activeTab, setActiveTab] = useState(
        validTabs.includes(initialTab) ? initialTab : 'overview'
    );
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Scroll to top on page load
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    // Update URL when tab changes
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setSearchParams({ tab });
        window.scrollTo(0, 0);
    };

    // Data states
    const [stats, setStats] = useState({ movies: 0, theatres: 0, pendingOwners: 0, cities: 0 });
    const [movies, setMovies] = useState([]);
    const [pendingOwners, setPendingOwners] = useState([]);
    const [theatres, setTheatres] = useState([]);
    const [genres, setGenres] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [cities, setCities] = useState([]);

    // Modal states
    const [showCityModal, setShowCityModal] = useState(false);
    const [showLanguageModal, setShowLanguageModal] = useState(false);
    const [showGenreModal, setShowGenreModal] = useState(false);
    const [showMovieModal, setShowMovieModal] = useState(false);
    const [editingMovie, setEditingMovie] = useState(null);
    const [editingCity, setEditingCity] = useState(null);
    const [editingLanguage, setEditingLanguage] = useState(null);
    const [editingGenre, setEditingGenre] = useState(null);

    // Action states
    const [actionLoading, setActionLoading] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch dashboard data
    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const [moviesRes, genresRes, languagesRes, citiesRes] = await Promise.all([
                getMovies({ page: 0, size: 100 }),
                getGenres(),
                getLanguages(),
                getCities(),
            ]);

            const moviesList = moviesRes?.content || moviesRes || [];
            setMovies(Array.isArray(moviesList) ? moviesList : []);
            setGenres(Array.isArray(genresRes) ? genresRes : []);
            setLanguages(Array.isArray(languagesRes) ? languagesRes : []);
            setCities(Array.isArray(citiesRes) ? citiesRes : []);

            try {
                const [pendingRes, theatresRes] = await Promise.all([
                    getPendingOwners(),
                    getAllTheatres(),
                ]);
                setPendingOwners(Array.isArray(pendingRes) ? pendingRes : []);
                setTheatres(Array.isArray(theatresRes) ? theatresRes : []);
                setStats({
                    movies: moviesList.length,
                    theatres: (theatresRes || []).length,
                    pendingOwners: (pendingRes || []).length,
                    cities: (citiesRes || []).length,
                });
            } catch (adminErr) {
                console.log('[AdminDashboard] Admin-only fetch failed:', adminErr);
                setStats({ movies: moviesList.length, theatres: 0, pendingOwners: 0, cities: (citiesRes || []).length });
            }
        } catch (err) {
            console.error('[AdminDashboard] Error:', err);
            setError(err.response?.data?.message || err.message || 'Failed to load dashboard');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Handler functions
    const handleApproveOwner = async (ownerId) => {
        try {
            setActionLoading(`approve-${ownerId}`);
            await approveOwner(ownerId);
            setPendingOwners((prev) => prev.filter((o) => o.ownerId !== ownerId));
            setStats((prev) => ({ ...prev, pendingOwners: prev.pendingOwners - 1 }));
        } catch (err) {
            console.error('Approve error:', err);
            alert('Failed to approve owner: ' + (err.response?.data?.message || err.message));
        } finally {
            setActionLoading(null);
        }
    };

    const handleRejectOwner = async (ownerId) => {
        const reason = prompt('Enter rejection reason:');
        if (!reason) return;

        try {
            setActionLoading(`reject-${ownerId}`);
            await rejectOwner(ownerId, reason);
            setPendingOwners((prev) => prev.filter((o) => o.ownerId !== ownerId));
            setStats((prev) => ({ ...prev, pendingOwners: prev.pendingOwners - 1 }));
        } catch (err) {
            console.error('Reject error:', err);
            alert('Failed to reject owner: ' + (err.response?.data?.message || err.message));
        } finally {
            setActionLoading(null);
        }
    };

    const handleDeleteMovie = async (movieId) => {
        if (!confirm('Are you sure you want to delete this movie?')) return;

        try {
            setActionLoading(`delete-${movieId}`);
            await deleteMovie(movieId);
            setMovies((prev) => prev.filter((m) => m.id !== movieId));
            setStats((prev) => ({ ...prev, movies: prev.movies - 1 }));
        } catch (err) {
            console.error('Delete error:', err);
            alert('Failed to delete movie: ' + (err.response?.data?.message || err.message));
        } finally {
            setActionLoading(null);
        }
    };

    const handleSaveCity = async (cityData) => {
        if (editingCity) {
            const result = await updateCity(editingCity.id, cityData);
            setCities((prev) => prev.map((c) => c.id === editingCity.id ? (result.data || result) : c));
        } else {
            const result = await createCity(cityData);
            setCities((prev) => [...prev, result.data || result]);
            setStats((prev) => ({ ...prev, cities: prev.cities + 1 }));
        }
        setEditingCity(null);
    };

    const handleDeleteCity = async (cityId) => {
        if (!confirm('Are you sure you want to delete this city?')) return;
        try {
            setActionLoading(`delete-city-${cityId}`);
            await deleteCity(cityId);
            setCities((prev) => prev.filter((c) => c.id !== cityId));
            setStats((prev) => ({ ...prev, cities: prev.cities - 1 }));
        } catch (err) {
            console.error('Delete city error:', err);
            alert('Failed to delete city: ' + (err.response?.data?.message || err.message));
        } finally {
            setActionLoading(null);
        }
    };

    const handleSaveLanguage = async (name, code) => {
        if (editingLanguage) {
            const result = await updateLanguage(editingLanguage.id, name, code);
            setLanguages((prev) => prev.map((l) => l.id === editingLanguage.id ? (result.data || result) : l));
        } else {
            const result = await createLanguage(name, code);
            setLanguages((prev) => [...prev, result.data || result]);
        }
        setEditingLanguage(null);
    };

    const handleDeleteLanguage = async (langId) => {
        if (!confirm('Are you sure you want to delete this language?')) return;
        try {
            setActionLoading(`delete-lang-${langId}`);
            await deleteLanguage(langId);
            setLanguages((prev) => prev.filter((l) => l.id !== langId));
        } catch (err) {
            console.error('Delete language error:', err);
            alert('Failed to delete language: ' + (err.response?.data?.message || err.message));
        } finally {
            setActionLoading(null);
        }
    };

    const handleSaveGenre = async (name) => {
        if (editingGenre) {
            const result = await updateGenre(editingGenre.id, name);
            setGenres((prev) => prev.map((g) => g.id === editingGenre.id ? (result.data || result) : g));
        } else {
            const result = await createGenre(name);
            setGenres((prev) => [...prev, result.data || result]);
        }
        setEditingGenre(null);
    };

    const handleDeleteGenre = async (genreId) => {
        if (!confirm('Are you sure you want to delete this genre?')) return;
        try {
            setActionLoading(`delete-genre-${genreId}`);
            await deleteGenre(genreId);
            setGenres((prev) => prev.filter((g) => g.id !== genreId));
        } catch (err) {
            console.error('Delete genre error:', err);
            alert('Failed to delete genre: ' + (err.response?.data?.message || err.message));
        } finally {
            setActionLoading(null);
        }
    };

    const handleSaveMovie = async (formData, movieId) => {
        if (movieId) {
            const result = await updateMovie(movieId, formData);
            setMovies((prev) => prev.map((m) => m.id === movieId ? (result.data || result) : m));
        } else {
            const result = await createMovie(formData);
            setMovies((prev) => [...prev, result.data || result]);
            setStats((prev) => ({ ...prev, movies: prev.movies + 1 }));
        }
        setEditingMovie(null);
    };

    const handleDeleteTheatre = async (theatreId) => {
        if (!confirm('Are you sure you want to delete this theatre? This will remove all screens and shows.')) return;

        try {
            setActionLoading(`delete-theatre-${theatreId}`);
            await deleteTheatre(theatreId);
            setTheatres((prev) => prev.filter((t) => (t.theatreId || t.id) !== theatreId));
            setStats((prev) => ({ ...prev, theatres: prev.theatres - 1 }));
        } catch (err) {
            console.error('Delete theatre error:', err);
            alert('Failed to delete theatre: ' + (err.response?.data?.message || err.message));
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) {
        return <LoadingSpinner fullScreen text="Loading dashboard..." />;
    }

    if (error) {
        return <ErrorMessage fullScreen title="Dashboard Error" message={error} onRetry={fetchData} />;
    }

    return (
        <div className="min-h-screen pt-20 pb-10 px-4 container">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gradient">Admin Dashboard</h1>
                    <p className="text-muted-foreground mt-1">
                        Welcome back, {user?.name || user?.username || 'Admin'}
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={fetchData} className="gap-2">
                        <RefreshCw className="h-4 w-4" />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-8 flex-wrap">
                <Tab active={activeTab === 'overview'} onClick={() => handleTabChange('overview')}>
                    Overview
                </Tab>
                <Tab active={activeTab === 'movies'} onClick={() => handleTabChange('movies')}>
                    Movies ({movies.length})
                </Tab>
                <Tab active={activeTab === 'pending'} onClick={() => handleTabChange('pending')}>
                    Pending Approvals ({pendingOwners.length})
                </Tab>
                <Tab active={activeTab === 'theatres'} onClick={() => handleTabChange('theatres')}>
                    Theatres ({theatres.length})
                </Tab>
                <Tab active={activeTab === 'cities'} onClick={() => handleTabChange('cities')}>
                    Cities ({cities.length})
                </Tab>
                <Tab active={activeTab === 'languages'} onClick={() => handleTabChange('languages')}>
                    Languages ({languages.length})
                </Tab>
                <Tab active={activeTab === 'genres'} onClick={() => handleTabChange('genres')}>
                    Genres ({genres.length})
                </Tab>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
                <OverviewTab
                    stats={stats}
                    genres={genres}
                    onTabChange={handleTabChange}
                />
            )}

            {activeTab === 'movies' && (
                <MoviesTab
                    movies={movies}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    onAddMovie={() => setShowMovieModal(true)}
                    onEditMovie={(movie) => {
                        setEditingMovie(movie);
                        setShowMovieModal(true);
                    }}
                    onDeleteMovie={handleDeleteMovie}
                    actionLoading={actionLoading}
                />
            )}

            {activeTab === 'pending' && (
                <PendingOwnersTab
                    pendingOwners={pendingOwners}
                    onApprove={handleApproveOwner}
                    onReject={handleRejectOwner}
                    actionLoading={actionLoading}
                />
            )}

            {activeTab === 'theatres' && (
                <TheatresTab
                    theatres={theatres}
                    onDelete={handleDeleteTheatre}
                    actionLoading={actionLoading}
                />
            )}

            {activeTab === 'cities' && (
                <CitiesTab
                    cities={cities}
                    onAdd={() => setShowCityModal(true)}
                    onEdit={(city) => {
                        setEditingCity(city);
                        setShowCityModal(true);
                    }}
                    onDelete={handleDeleteCity}
                    actionLoading={actionLoading}
                />
            )}

            {activeTab === 'languages' && (
                <LanguagesTab
                    languages={languages}
                    onAdd={() => setShowLanguageModal(true)}
                    onEdit={(lang) => {
                        setEditingLanguage(lang);
                        setShowLanguageModal(true);
                    }}
                    onDelete={handleDeleteLanguage}
                    actionLoading={actionLoading}
                />
            )}

            {activeTab === 'genres' && (
                <GenresTab
                    genres={genres}
                    onAdd={() => setShowGenreModal(true)}
                    onEdit={(genre) => {
                        setEditingGenre(genre);
                        setShowGenreModal(true);
                    }}
                    onDelete={handleDeleteGenre}
                    actionLoading={actionLoading}
                />
            )}

            {/* Modals */}
            <CityFormModal
                isOpen={showCityModal}
                onClose={() => {
                    setShowCityModal(false);
                    setEditingCity(null);
                }}
                onSave={handleSaveCity}
                editingCity={editingCity}
            />

            <LanguageFormModal
                isOpen={showLanguageModal}
                onClose={() => {
                    setShowLanguageModal(false);
                    setEditingLanguage(null);
                }}
                onSave={handleSaveLanguage}
                editingLanguage={editingLanguage}
            />

            <GenreFormModal
                isOpen={showGenreModal}
                onClose={() => {
                    setShowGenreModal(false);
                    setEditingGenre(null);
                }}
                onSave={handleSaveGenre}
                editingGenre={editingGenre}
            />

            <MovieFormModal
                isOpen={showMovieModal}
                onClose={() => {
                    setShowMovieModal(false);
                    setEditingMovie(null);
                }}
                onSave={handleSaveMovie}
                editingMovie={editingMovie}
                genres={genres}
                languages={languages}
            />
        </div>
    );
}
