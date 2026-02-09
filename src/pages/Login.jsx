import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';
import { loginSchema } from '@/lib/validations/auth';
import { Button } from '@/components/ui/button';
import { FormInput } from '@/components/ui/form-input';
import { Ticket, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

/**
 * Login page with Zod validation and react-hook-form
 */
export function Login() {
    const [successMessage] = useState(null);
    const { login, loading, error: authError } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Get redirect path and any messages from state
    const from = location.state?.from?.pathname;
    const stateMessage = location.state?.message;

    // React Hook Form with Zod resolver
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data) => {
        const result = await login(data.email, data.password);

        if (result.success) {
            const user = result.user;

            // Determine redirect based on user role
            // Admin and Theatre Owner always go to their dashboard
            let targetPath = '/';

            if (user.roles?.includes('ADMIN')) {
                targetPath = '/admin/dashboard';
            } else if (user.roles?.includes('THEATRE_OWNER')) {
                targetPath = '/theater/dashboard';
            } else if (from) {
                // Regular users go back to where they came from
                targetPath = from;
            }

            navigate(targetPath, { replace: true });
        }
    };

    const isDisabled = loading || isSubmitting;

    return (
        <div className="min-h-screen flex items-center justify-center pt-20 pb-10 px-4">
            <div className="w-full max-w-md space-y-8 glass-effect p-8 rounded-2xl border border-white/10">
                {/* Header */}
                <div className="flex flex-col items-center justify-center text-center space-y-2">
                    <div className="p-3 rounded-xl bg-primary/20">
                        <Ticket className="h-8 w-8 text-primary" />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-white">
                        Welcome back
                    </h2>
                    <p className="text-muted-foreground">
                        Enter your credentials to access your account
                    </p>
                </div>

                {/* Success Message from Registration */}
                {(stateMessage || successMessage) && (
                    <div className="flex items-center gap-2 text-sm text-green-500 bg-green-500/10 p-3 rounded-lg border border-green-500/20">
                        <CheckCircle className="h-4 w-4 flex-shrink-0" />
                        {stateMessage || successMessage}
                    </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <div className="space-y-4">
                        {/* Email Field */}
                        <FormInput
                            label="Email"
                            type="email"
                            placeholder="Enter your email"
                            error={errors.email?.message}
                            disabled={isDisabled}
                            {...register('email')}
                        />

                        {/* Password Field */}
                        <FormInput
                            label="Password"
                            type="password"
                            placeholder="Enter your password"
                            error={errors.password?.message}
                            disabled={isDisabled}
                            {...register('password')}
                        />
                    </div>

                    {/* API Error Message */}
                    {authError && (
                        <div className="flex items-center gap-2 text-sm text-red-500 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                            <AlertCircle className="h-4 w-4 flex-shrink-0" />
                            {authError}
                        </div>
                    )}

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        disabled={isDisabled}
                    >
                        {isDisabled ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Signing in...
                            </>
                        ) : (
                            'Sign in'
                        )}
                    </Button>

                    {/* Register Link */}
                    <div className="text-center text-sm text-muted-foreground">
                        <p>
                            Don't have an account?{' '}
                            <Link
                                to="/register"
                                className="text-primary hover:underline font-medium"
                            >
                                Create one
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
