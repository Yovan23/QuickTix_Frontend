import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ErrorMessage } from '@/components/shared/ErrorMessage';
import LayoutBuilder from '@/components/owner/LayoutBuilder';
import { RefreshCw, LayoutGrid } from 'lucide-react';

// Theater components
import {
    TheatresView,
    ScreensView,
    ShowsView,
    DeleteConfirmModal,
    AddTheatreModal,
    AddScreenModal,
    AddShowModal,
    groupShowsByDate
} from '@/components/theater';

// API services
import {
    getTheatresByOwner,
    getScreensByTheatre,
    createTheatre,
    createScreen,
    updateTheatreStatus,
    updateScreenStatus,
    getOwnerByUserId,
    registerAsOwner,
    deleteTheatre
} from '@/api/services/theatreService';
import { getCities, getMovies } from '@/api/services/catalogueService';
import { createLayout, getLayoutsByOwner, deleteLayout } from '@/api/services/layoutService';
import { createShow, getShowsByTheatre } from '@/api/services/showSeatService';

export function TheaterOwnerDashboard() {
    const { user, isTheatreOwner } = useAuth();
    const navigate = useNavigate();

    // View state
    const [currentView, setCurrentView] = useState('theatres'); // 'theatres' | 'screens' | 'shows'
    const [selectedTheatre, setSelectedTheatre] = useState(null);
    const [selectedScreen, setSelectedScreen] = useState(null);

    // Data states
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [ownerRecord, setOwnerRecord] = useState(null);
    const [theatres, setTheatres] = useState([]);
    const [screens, setScreens] = useState([]);
    const [shows, setShows] = useState([]);
    const [layouts, setLayouts] = useState([]);
    const [cities, setCities] = useState([]);
    const [movies, setMovies] = useState([]);

    // Modal states
    const [showAddTheatre, setShowAddTheatre] = useState(false);
    const [showAddScreen, setShowAddScreen] = useState(false);
    const [showAddShow, setShowAddShow] = useState(false);
    const [showAddLayout, setShowAddLayout] = useState(false);
    const [deleteTheatreConfirm, setDeleteTheatreConfirm] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [showFormErrors, setShowFormErrors] = useState({});

    // User ID from JWT
    const userId = user?.userId || user?.id;
    const ownerId = ownerRecord?.ownerId || ownerRecord?.id;

    // Group shows by date (memoized)
    const groupedShows = useMemo(() => {
        return groupShowsByDate(shows);
    }, [shows]);

    // ============================================
    // DATA FETCHING
    // ============================================

    useEffect(() => {
        if (!isTheatreOwner && !loading) {
            navigate('/become-partner');
        }
    }, [isTheatreOwner, loading, navigate]);

    const fetchData = useCallback(async () => {
        if (!userId || !isTheatreOwner) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // Fetch cities
            const citiesRes = await getCities();
            setCities(Array.isArray(citiesRes) ? citiesRes : []);

            // Fetch movies
            const moviesRes = await getMovies({ page: 0, size: 100 });
            const moviesList = moviesRes?.content || moviesRes || [];
            setMovies(Array.isArray(moviesList) ? moviesList : []);

            // Fetch owner record
            const ownerRes = await getOwnerByUserId(userId);
            setOwnerRecord(ownerRes);
            const fetchedOwnerId = ownerRes?.ownerId || ownerRes?.id;

            if (fetchedOwnerId) {
                // Fetch theatres
                const theatresRes = await getTheatresByOwner(fetchedOwnerId);
                setTheatres(Array.isArray(theatresRes) ? theatresRes : []);

                // Fetch layouts
                try {
                    const layoutsRes = await getLayoutsByOwner(userId);
                    setLayouts(Array.isArray(layoutsRes) ? layoutsRes : []);
                } catch {
                    setLayouts([]);
                }
            }
        } catch (err) {
            console.error('[Dashboard] Error:', err);
            setError(err.response?.data?.message || err.message || 'Failed to load dashboard');
        } finally {
            setLoading(false);
        }
    }, [userId, isTheatreOwner]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const fetchScreens = useCallback(async (theatreId) => {
        try {
            const screensRes = await getScreensByTheatre(theatreId);
            const screensData = screensRes?.data || screensRes || [];
            setScreens(Array.isArray(screensData) ? screensData : []);
        } catch {
            setScreens([]);
        }
    }, []);

    const fetchShows = useCallback(async (theatreId) => {
        try {
            const showsRes = await getShowsByTheatre(theatreId);
            const showsData = showsRes?.data || showsRes || [];
            setShows(Array.isArray(showsData) ? showsData : []);
        } catch {
            setShows([]);
        }
    }, []);

    // ============================================
    // NAVIGATION HANDLERS
    // ============================================

    const handleSelectTheatre = (theatre, view = 'screens') => {
        setSelectedTheatre(theatre);
        setCurrentView(view);
        if (view === 'screens') {
            fetchScreens(theatre.theatreId);
        } else if (view === 'shows') {
            fetchShows(theatre.theatreId);
            fetchScreens(theatre.theatreId);
        }
    };

    const handleBackToTheatres = () => {
        setCurrentView('theatres');
        setSelectedTheatre(null);
        setSelectedScreen(null);
    };

    // ============================================
    // CRUD HANDLERS
    // ============================================

    const handleCreateTheatre = async (form) => {
        try {
            setActionLoading(true);
            const theatreData = {
                name: form.name.trim(),
                address: form.address.trim(),
                cityId: parseInt(form.cityId),
                ownerId: ownerId
            };
            const response = await createTheatre(theatreData);
            const newTheatre = response?.data || response;
            setTheatres(prev => [...prev, newTheatre]);
            setShowAddTheatre(false);
        } catch (err) {
            alert('Failed to create theatre: ' + (err.response?.data?.message || err.message));
        } finally {
            setActionLoading(false);
        }
    };

    const handleCreateScreen = async (form) => {
        if (!selectedTheatre) return;
        try {
            setActionLoading(true);
            const screenData = {
                theatreId: selectedTheatre.theatreId,
                name: form.name.trim(),
                capacity: form.capacity ? parseInt(form.capacity) : null
            };
            const response = await createScreen(screenData);
            const newScreen = response?.data || response;
            setScreens(prev => [...prev, newScreen]);
            setShowAddScreen(false);
        } catch (err) {
            alert('Failed to create screen: ' + (err.response?.data?.message || err.message));
        } finally {
            setActionLoading(false);
        }
    };

    const handleCreateShow = async (form) => {
        if (!selectedTheatre || !selectedScreen) return;

        try {
            setActionLoading(true);
            const formatDateTimeForBackend = (dateTimeLocal) => {
                if (!dateTimeLocal) return null;
                return dateTimeLocal + ':00';
            };

            const showPayload = {
                movieId: parseInt(form.movieId),
                theatreId: selectedTheatre.theatreId,
                screenId: selectedScreen.screenId,
                layoutId: form.layoutId,
                startTime: formatDateTimeForBackend(form.startTime),
                endTime: form.endTime ? formatDateTimeForBackend(form.endTime) : null,
                pricing: {
                    silver: form.pricing.silver.toString(),
                    gold: form.pricing.gold.toString(),
                    platinum: form.pricing.platinum.toString(),
                    diamond: form.pricing.diamond.toString()
                },
                language: form.language,
                format: form.format,
                notes: form.notes || null
            };

            const response = await createShow(showPayload);
            const newShow = response?.data || response;
            setShows(prev => [...prev, newShow]);
            setShowAddShow(false);
            setSelectedScreen(null);
        } catch (err) {
            setShowFormErrors({ submit: err.response?.data?.message || err.message || 'Failed to create show' });
        } finally {
            setActionLoading(false);
        }
    };

    const handleToggleTheatreStatus = async (theatre) => {
        const newStatus = theatre.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        try {
            setActionLoading(true);
            await updateTheatreStatus({ theatreId: theatre.theatreId, status: newStatus });
            setTheatres(prev => prev.map(t => t.theatreId === theatre.theatreId ? { ...t, status: newStatus } : t));
        } catch (err) {
            alert('Failed to update status');
        } finally {
            setActionLoading(false);
        }
    };

    const handleToggleScreenStatus = async (screen) => {
        const newStatus = screen.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        try {
            setActionLoading(true);
            await updateScreenStatus({ screenId: screen.screenId, status: newStatus });
            setScreens(prev => prev.map(s => s.screenId === screen.screenId ? { ...s, status: newStatus } : s));
        } catch (err) {
            alert('Failed to update status');
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteTheatre = async () => {
        if (!deleteTheatreConfirm) return;
        try {
            setActionLoading(true);
            await deleteTheatre(deleteTheatreConfirm.theatreId);
            setTheatres(prev => prev.filter(t => t.theatreId !== deleteTheatreConfirm.theatreId));
            setDeleteTheatreConfirm(null);
        } catch (err) {
            alert('Failed to delete theatre: ' + (err.response?.data?.message || err.message));
        } finally {
            setActionLoading(false);
        }
    };

    const handleLayoutCreated = (newLayout) => {
        setLayouts(prev => [...prev, newLayout]);
        setShowAddLayout(false);
    };

    // ============================================
    // LOADING/ERROR STATES
    // ============================================

    if (loading) {
        return <LoadingSpinner fullScreen text="Loading dashboard..." />;
    }

    if (error) {
        return <ErrorMessage fullScreen title="Dashboard Error" message={error} onRetry={fetchData} />;
    }

    if (!isTheatreOwner) {
        return <LoadingSpinner fullScreen text="Redirecting..." />;
    }

    // ============================================
    // RENDER
    // ============================================

    return (
        <div className="min-h-screen pt-20 pb-10 px-4 container">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gradient">Theatre Owner Dashboard</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your theatres, screens, and shows
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        onClick={() => setShowAddLayout(true)}
                        className="gap-2"
                    >
                        <LayoutGrid className="h-4 w-4" />
                        Create Layout
                    </Button>
                    <Button variant="outline" onClick={fetchData} className="gap-2">
                        <RefreshCw className="h-4 w-4" />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            {currentView === 'theatres' && (
                <TheatresView
                    theatres={theatres}
                    cities={cities}
                    onAddTheatre={() => setShowAddTheatre(true)}
                    onManageScreens={(theatre) => handleSelectTheatre(theatre, 'screens')}
                    onViewShows={(theatre) => handleSelectTheatre(theatre, 'shows')}
                    onToggleStatus={handleToggleTheatreStatus}
                    onDeleteTheatre={(theatre) => setDeleteTheatreConfirm(theatre)}
                    actionLoading={actionLoading}
                />
            )}

            {currentView === 'screens' && selectedTheatre && (
                <ScreensView
                    theatre={selectedTheatre}
                    screens={screens}
                    onBack={handleBackToTheatres}
                    onAddScreen={() => setShowAddScreen(true)}
                    onToggleStatus={handleToggleScreenStatus}
                    onAddShow={(screen) => {
                        setSelectedScreen(screen);
                        setShowFormErrors({});
                        setShowAddShow(true);
                    }}
                    actionLoading={actionLoading}
                />
            )}

            {currentView === 'shows' && selectedTheatre && (
                <ShowsView
                    theatre={selectedTheatre}
                    groupedShows={groupedShows}
                    movies={movies}
                    screens={screens}
                    onBack={handleBackToTheatres}
                    onManageScreens={() => setCurrentView('screens')}
                />
            )}

            {/* Modals */}
            <AddTheatreModal
                isOpen={showAddTheatre}
                onClose={() => setShowAddTheatre(false)}
                onSubmit={handleCreateTheatre}
                cities={cities}
                loading={actionLoading}
            />

            <AddScreenModal
                isOpen={showAddScreen}
                onClose={() => setShowAddScreen(false)}
                onSubmit={handleCreateScreen}
                theatreName={selectedTheatre?.name || ''}
                loading={actionLoading}
            />

            <AddShowModal
                isOpen={showAddShow}
                onClose={() => {
                    setShowAddShow(false);
                    setSelectedScreen(null);
                }}
                onSubmit={handleCreateShow}
                screenName={selectedScreen?.name || ''}
                movies={movies}
                layouts={layouts}
                loading={actionLoading}
                errors={showFormErrors}
            />

            <DeleteConfirmModal
                isOpen={!!deleteTheatreConfirm}
                onClose={() => setDeleteTheatreConfirm(null)}
                onConfirm={handleDeleteTheatre}
                title="Delete Theatre"
                itemName={deleteTheatreConfirm?.name}
                warningMessage={`Deleting "${deleteTheatreConfirm?.name}" will permanently remove all its screens and shows.`}
                loading={actionLoading}
            />

            {/* Layout Builder Modal */}
            {showAddLayout && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddLayout(false)} />
                    <div className="relative bg-background border border-white/10 rounded-xl w-full max-w-6xl mx-4 max-h-[90vh] overflow-y-auto p-6">
                        <LayoutBuilder
                            onSuccess={handleLayoutCreated}
                            onBack={() => setShowAddLayout(false)}
                            createdBy={userId}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
