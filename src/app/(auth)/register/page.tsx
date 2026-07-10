'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterValues } from '@/lib/validations/auth';
import { useAuth } from '@/hooks/useAuth';
import { UserType } from '@/types/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useState, Suspense, useEffect } from 'react';
import { Separator } from '@/components/ui/separator';
import Script from 'next/script';

export default function RegisterPage() {
	return (
		<Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
			<RegisterForm />
		</Suspense>
	);
}

function RegisterForm() {
	const { register, isRegistering, registerError, loginWithGoogle, isLoggingInWithGoogle, googleLoginError } = useAuth();
	const [showPassword, setShowPassword] = useState(false);
	const [tokenClient, setTokenClient] = useState<any>(null);

	const form = useForm<RegisterValues>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			firstName: '',
			lastName: '',
			email: '',
			password: '',
			phone: '',
			type: UserType.CUSTOMER,
		},
	});

	const onSubmit = (data: RegisterValues) => {
		register(data);
	};

	const passwordValue = form.watch('password') || '';

	const requirements = [
		{ id: 'length', label: 'At least 8 characters', met: passwordValue.length >= 8 },
		{ id: 'uppercase', label: 'At least one uppercase letter', met: /[A-Z]/.test(passwordValue) },
		{ id: 'lowercase', label: 'At least one lowercase letter', met: /[a-z]/.test(passwordValue) },
		{ id: 'number', label: 'At least one number', met: /[0-9]/.test(passwordValue) },
		{ id: 'special', label: 'At least one special character', met: /[^A-Za-z0-9]/.test(passwordValue) },
	];

	const metCount = requirements.filter((req) => req.met).length;

	useEffect(() => {
		const initGoogle = () => {
			if (typeof window !== 'undefined' && window.google) {
				const client = window.google.accounts.oauth2.initTokenClient({
					client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
					scope: 'email profile openid',
					callback: (response: any) => {
						if (response.access_token) {
							loginWithGoogle(response.access_token);
						}
					},
				});
				setTokenClient(client);
			}
		};

		if (typeof window !== 'undefined' && window.google) {
			initGoogle();
		}
	}, []);

	const handleGoogleLogin = () => {
		if (tokenClient && process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
			tokenClient.requestAccessToken();
		} else {
			console.warn('Google client ID is not configured. Using mock token for testing.');
			loginWithGoogle('mock:register@example.com:Mock:GoogleUser');
		}
	};

	return (
		<div className="space-y-6">
			<Script
				src="https://accounts.google.com/gsi/client"
				strategy="afterInteractive"
				onLoad={() => {
					if (typeof window !== 'undefined' && window.google && !tokenClient) {
						const client = window.google.accounts.oauth2.initTokenClient({
							client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
							scope: 'email profile openid',
							callback: (response: any) => {
								if (response.access_token) {
									loginWithGoogle(response.access_token);
								}
							},
						});
						setTokenClient(client);
					}
				}}
			/>

			{/* Progress & Tabs */}
			<div className="space-y-6">
				<div className="flex border-b border-neutral-200">
					<Link
						href="/register"
						className="pb-3 px-1 border-b-2 border-brand-blue text-brand-blue font-semibold text-sm transition-colors"
					>
						Sign Up
					</Link>
					<Link
						href="/login"
						className="pb-3 px-4 border-b-2 border-transparent text-neutral-500 hover:text-neutral-700 font-medium text-sm transition-colors"
					>
						Log In
					</Link>
				</div>
			</div>

			{/* Header */}
			<div className="text-center md:text-left">
				<h2 className="text-3xl font-bold text-neutral-900 tracking-tight">
					Create your account
				</h2>
				<p className="text-neutral-500 mt-2 text-base">
					Sign up to start booking premium event venues.
				</p>
			</div>

			{/* Errors */}
			{registerError && (
				<div className="flex items-center gap-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
					<AlertCircle className="h-4 w-4" />
					<p>
						{(registerError as any)?.response?.data?.message ||
							'Something went wrong'}
					</p>
				</div>
			)}

			{googleLoginError && (
				<div className="flex items-center gap-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
					<AlertCircle className="h-4 w-4" />
					<p>
						{(googleLoginError as any)?.response?.data?.message ||
							'Google authentication failed'}
					</p>
				</div>
			)}

			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				{/* Inputs */}
				<div className="space-y-4">
					{/* First/Last Name & Phone Grid - Keeping to avoid validation errors but styling cleanly */}
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="firstName">First Name</Label>
							<Input
								id="firstName"
								placeholder="John"
								className="h-12 bg-neutral-50 border-neutral-200 focus:bg-white transition-all rounded-xl"
								{...form.register('firstName')}
							/>
							{form.formState.errors.firstName && (
								<p className="text-xs text-destructive">
									{form.formState.errors.firstName.message}
								</p>
							)}
						</div>
						<div className="space-y-2">
							<Label htmlFor="lastName">Last Name</Label>
							<Input
								id="lastName"
								placeholder="Doe"
								className="h-11"
								{...form.register('lastName')}
							/>
							{form.formState.errors.lastName && (
								<p className="text-xs text-destructive">
									{form.formState.errors.lastName.message}
								</p>
							)}
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="email">Email Address</Label>
						<Input
							id="email"
							type="email"
							placeholder="name@example.com"
							className="h-11"
							{...form.register('email')}
						/>
						{form.formState.errors.email && (
							<p className="text-xs text-destructive">
								{form.formState.errors.email.message}
							</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="phone">Phone Number</Label>
						<Input
							id="phone"
							type="tel"
							placeholder="+234..."
							className="h-11"
							{...form.register('phone')}
						/>
						{form.formState.errors.phone && (
							<p className="text-xs text-destructive">
								{form.formState.errors.phone.message}
							</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="password">Password</Label>
						<div className="relative">
							<Input
								id="password"
								type={showPassword ? 'text' : 'password'}
								placeholder="Create a password"
								className="h-11 pr-10"
								{...form.register('password')}
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute right-3 top-3 text-neutral-400 hover:text-neutral-600"
							>
								{showPassword ? (
									<EyeOff className="h-5 w-5" />
								) : (
									<Eye className="h-5 w-5" />
								)}
							</button>
						</div>
						{passwordValue.length > 0 && (
							<div className="mt-3 space-y-3 p-3 bg-neutral-50 rounded-xl border border-neutral-100 transition-all duration-300">
								{/* Strength Bar */}
								<div className="space-y-1">
									<div className="flex justify-between items-center text-xs">
										<span className="text-neutral-500 font-medium text-[11px]">Password strength</span>
										<span className={`text-[11px] font-semibold transition-colors duration-300 ${
											metCount <= 2 ? 'text-rose-500' : metCount <= 4 ? 'text-amber-500' : 'text-emerald-500'
										}`}>
											{metCount === 0 ? '' : metCount <= 2 ? 'Weak' : metCount <= 4 ? 'Medium' : 'Strong'}
										</span>
									</div>
									<div className="h-1 w-full bg-neutral-200 rounded-full overflow-hidden flex gap-1">
										{[1, 2, 3, 4, 5].map((index) => {
											let bgColor = 'bg-neutral-200';
											if (index <= metCount) {
												if (metCount <= 2) bgColor = 'bg-rose-500';
												else if (metCount <= 4) bgColor = 'bg-amber-500';
												else bgColor = 'bg-emerald-500';
											}
											return (
												<div
													key={index}
													className={`h-full flex-1 rounded-full transition-all duration-300 ${bgColor}`}
												/>
											);
										})}
									</div>
								</div>

								{/* Checklist */}
								<div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
									{requirements.map((req) => (
										<div
											key={req.id}
											className="flex items-center gap-2 text-neutral-600 transition-all duration-200"
										>
											<div className={`h-4 w-4 rounded-full flex items-center justify-center border transition-all duration-300 ${
												req.met 
													? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' 
													: 'border-neutral-300 text-neutral-400'
											}`}>
												{req.met ? (
													<svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
														<path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
													</svg>
												) : (
													<div className="h-1 w-1 bg-neutral-400 rounded-full" />
												)}
											</div>
											<span className={`text-[11px] transition-colors duration-300 ${req.met ? 'text-neutral-900 font-medium' : 'text-neutral-500'}`}>
												{req.label}
											</span>
										</div>
									))}
								</div>
							</div>
						)}
						{form.formState.errors.password && (
							<p className="text-xs text-destructive">
								{form.formState.errors.password.message}
							</p>
						)}
					</div>

					<div className="flex items-center space-x-2">
						<Checkbox id="remember" />
						<label
							htmlFor="remember"
							className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-neutral-600"
						>
							Remember me
						</label>
					</div>
				</div>

				<Button
					type="submit"
					className="w-full h-12 bg-brand-gold hover:bg-brand-gold-hover text-white rounded-xl font-bold shadow-lg shadow-amber-500/20 text-base"
					disabled={isRegistering}
				>
					{isRegistering ? 'Creating Account...' : 'Create Account'}
				</Button>

				<div className="relative">
					<div className="absolute inset-0 flex items-center">
						<span className="w-full border-t border-neutral-200" />
					</div>
					<div className="relative flex justify-center text-xs uppercase">
						<span className="bg-white px-2 text-neutral-400">
							Or continue with
						</span>
					</div>
				</div>

				<div className="w-full">
					<Button
						variant="outline"
						type="button"
						className="w-full h-11 border-neutral-200 text-neutral-700 hover:bg-neutral-50 rounded-xl"
						onClick={handleGoogleLogin}
						disabled={isLoggingInWithGoogle}
					>
						{isLoggingInWithGoogle ? (
							'Connecting with Google...'
						) : (
							<>
								<svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
									<path
										d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
										fill="#4285F4"
									/>
									<path
										d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
										fill="#34A853"
									/>
									<path
										d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z"
										fill="#FBBC05"
									/>
									<path
										d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
										fill="#EA4335"
									/>
								</svg>
								Google
							</>
						)}
					</Button>
				</div>

				<div className="text-center text-xs text-neutral-500">
					By clicking &quot;Create Account&quot;, you agree to our{' '}
					<Link href="#" className="underline hover:text-brand-blue">
						Terms of Service
					</Link>{' '}
					and{' '}
					<Link href="#" className="underline hover:text-brand-blue">
						Privacy Policy
					</Link>
					.
				</div>
			</form>
		</div>
	);
}
