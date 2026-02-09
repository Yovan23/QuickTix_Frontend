import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';
import { registerSchema } from '@/lib/validations/auth';
import { Button } from '@/components/ui/button';
import { FormInput } from '@/components/ui/form-input';
import { Ticket, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

/**
 * Registration page with Zod validation and react-hook-form
 */
export function Register() {
    const [successMessage, setSuccessMessage] = useState('');
    const { register: authRegister, loading, error: authError } = useAuth();
    const navigate = useNavigate();

    // React Hook Form with Zod resolver
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            password: '',
            confirmPassword: '',
        },
    });

    const onSubmit = async (data) => {
        setSuccessMessage('');

        const result = await authRegister({
            name: data.name,
            email: data.email,
            password: data.password,
            phone: data.phone,
        });

        if (result.success) {
            setSuccessMessage(result.message || 'Registration successful! Redirecting to login...');
            setTimeout(() => {
                navigate('/login', {
                    state: { message: 'Registration successful! Please login with your credentials.' },
                });
            }, 2000);
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
                        Create Account
                    </h2>
                    <p className="text-muted-foreground">
                        Join QuickTix and start booking movies
                    </p>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
                    {/* Name Field */}
                    <FormInput
                        label="Full Name"
                        type="text"
                        placeholder="Enter your full name"
                        error={errors.name?.message}
                        disabled={isDisabled}
                        required
                        {...register('name')}
                    />

                    {/* Email Field */}
                    <FormInput
                        label="Email"
                        type="email"
                        placeholder="Enter your email"
                        error={errors.email?.message}
                        disabled={isDisabled}
                        required
                        {...register('email')}
                    />

                    {/* Phone Field */}
                    <FormInput
                        label="Phone Number"
                        type="tel"
                        placeholder="Enter your 10-digit phone number"
                        error={errors.phone?.message}
                        disabled={isDisabled}
                        required
                        {...register('phone')}
                    />

                    {/* Password Field */}
                    <FormInput
                        label="Password"
                        type="password"
                        placeholder="Create a password (min 6 characters)"
                        error={errors.password?.message}
                        disabled={isDisabled}
                        required
                        {...register('password')}
                    />

                    {/* Confirm Password Field */}
                    <FormInput
                        label="Confirm Password"
                        type="password"
                        placeholder="Confirm your password"
                        error={errors.confirmPassword?.message}
                        disabled={isDisabled}
                        required
                        {...register('confirmPassword')}
                    />

                    {/* Success Message */}
                    {successMessage && (
                        <div className="flex items-center gap-2 text-sm text-green-500 bg-green-500/10 p-3 rounded-lg border border-green-500/20">
                            <CheckCircle className="h-4 w-4 flex-shrink-0" />
                            {successMessage}
                        </div>
                    )}

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
                                Creating Account...
                            </>
                        ) : (
                            'Create Account'
                        )}
                    </Button>

                    {/* Login Link */}
                    <div className="text-center text-sm text-muted-foreground">
                        <p>
                            Already have an account?{' '}
                            <Link
                                to="/login"
                                className="text-primary hover:underline font-medium"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
