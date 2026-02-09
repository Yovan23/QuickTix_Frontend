import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Building, CheckCircle, Clock, ArrowRight, Star, TrendingUp, Users } from 'lucide-react';
import { registerAsOwner } from '@/api/services/theatreService';

export function BecomePartner() {
    const { user, isAuthenticated, isTheatreOwner } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(null);

    const userId = user?.userId || user?.id;

    // Redirect if already a theatre owner
    if (isTheatreOwner) {
        navigate('/theater/dashboard');
        return null;
    }

    const handleRegister = async () => {
        if (!isAuthenticated) {
            navigate('/login?redirect=/become-partner');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            await registerAsOwner({ userId });
            setSubmitted(true);
        } catch (err) {
            console.error('Register error:', err);
            setError(err.response?.data?.message || err.message || 'Failed to submit application');
        } finally {
            setLoading(false);
        }
    };

    // Success state
    if (submitted) {
        return (
            <div className="min-h-screen pt-20 pb-10 px-4 flex items-center justify-center">
                <div className="max-w-md w-full text-center">
                    <div className="inline-flex rounded-full bg-green-500/10 p-6 ring-1 ring-green-500/20 mb-6">
                        <CheckCircle className="h-16 w-16 text-green-500" />
                    </div>
                    <h1 className="text-3xl font-bold text-foreground mb-4">Application Submitted!</h1>
                    <p className="text-muted-foreground mb-8">
                        Thank you for your interest in becoming a QuickTix partner. Our team will review your
                        application and get back to you within 2-3 business days.
                    </p>
                    <div className="bg-secondary/30 backdrop-blur-sm border border-white/10 p-6 rounded-xl mb-8">
                        <div className="flex items-center gap-3 text-left">
                            <Clock className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                            <div>
                                <p className="font-medium text-foreground">Application Under Review</p>
                                <p className="text-sm text-muted-foreground">
                                    You'll be notified once your application is approved.
                                </p>
                            </div>
                        </div>
                    </div>
                    <Button onClick={() => navigate('/')} variant="outline" className="gap-2">
                        Back to Home
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-20 pb-10 px-4">
            <div className="container max-w-4xl">
                {/* Hero Section */}
                <div className="text-center py-12">
                    <div className="inline-flex rounded-full bg-primary/10 p-4 ring-1 ring-primary/20 mb-6">
                        <Building className="h-12 w-12 text-primary" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-4">
                        Partner with QuickTix
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Join India's fastest-growing movie ticketing platform and reach millions of movie lovers.
                    </p>
                </div>

                {/* Benefits Grid */}
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-secondary/30 backdrop-blur-sm border border-white/10 p-6 rounded-xl text-center">
                        <div className="inline-flex rounded-full bg-blue-500/10 p-3 mb-4">
                            <Users className="h-6 w-6 text-blue-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">Reach More Customers</h3>
                        <p className="text-sm text-muted-foreground">
                            Access our growing user base and increase your theatre's visibility.
                        </p>
                    </div>
                    <div className="bg-secondary/30 backdrop-blur-sm border border-white/10 p-6 rounded-xl text-center">
                        <div className="inline-flex rounded-full bg-green-500/10 p-3 mb-4">
                            <TrendingUp className="h-6 w-6 text-green-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">Boost Revenue</h3>
                        <p className="text-sm text-muted-foreground">
                            Optimize seat occupancy with our smart pricing and analytics tools.
                        </p>
                    </div>
                    <div className="bg-secondary/30 backdrop-blur-sm border border-white/10 p-6 rounded-xl text-center">
                        <div className="inline-flex rounded-full bg-yellow-500/10 p-3 mb-4">
                            <Star className="h-6 w-6 text-yellow-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">Easy Management</h3>
                        <p className="text-sm text-muted-foreground">
                            Manage screens, shows, and bookings from our intuitive dashboard.
                        </p>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="bg-gradient-to-r from-primary/20 to-purple-500/20 border border-primary/30 rounded-2xl p-8 md:p-12 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                        Ready to Get Started?
                    </h2>
                    <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                        Submit your application today and our team will reach out to help you get set up.
                        It's quick, easy, and free to join!
                    </p>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6 max-w-md mx-auto">
                            {error}
                        </div>
                    )}

                    {isAuthenticated ? (
                        <Button size="lg" onClick={handleRegister} disabled={loading} className="gap-2 px-8">
                            {loading ? (
                                <LoadingSpinner size="sm" />
                            ) : (
                                <>
                                    Apply Now
                                    <ArrowRight className="h-5 w-5" />
                                </>
                            )}
                        </Button>
                    ) : (
                        <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                Please login to submit your application
                            </p>
                            <Link to="/login?redirect=/become-partner">
                                <Button size="lg" className="gap-2 px-8">
                                    Login to Apply
                                    <ArrowRight className="h-5 w-5" />
                                </Button>
                            </Link>
                        </div>
                    )}

                    <p className="text-xs text-muted-foreground mt-6">
                        By applying, you agree to our <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-primary hover:underline">Partner Agreement</Link>.
                    </p>
                </div>
            </div>
        </div>
    );
}
