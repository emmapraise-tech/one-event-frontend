'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/hooks/useAuth';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import Script from 'next/script';
import { loginSchema } from '@/lib/validations/auth';
import type { LoginValues } from '@/lib/validations/auth';

interface LoginModalProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	onSuccess: () => void;
}

export function LoginModal({
	isOpen,
	onOpenChange,
	onSuccess,
}: LoginModalProps) {
	const {
		login,
		isLoggingIn,
		loginError,
		loginWithGoogle,
		isLoggingInWithGoogle,
		googleLoginError,
	} = useAuth();
	const [showPassword, setShowPassword] = useState(false);
	const [tokenClient, setTokenClient] = useState<any>(null);

	const form = useForm<LoginValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	useEffect(() => {
		const initGoogle = () => {
			if (typeof window !== 'undefined' && window.google) {
				const client = window.google.accounts.oauth2.initTokenClient({
					client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
					scope: 'email profile openid',
					callback: (response: any) => {
						if (response.access_token) {
							loginWithGoogle(
								{ token: response.access_token, redirectUrl: false },
								{
									onSuccess: () => {
										onOpenChange(false);
										onSuccess();
									},
								},
							);
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
			console.warn(
				'Google client ID is not configured. Using mock token for testing.',
			);
			loginWithGoogle(
				{
					token: 'mock:test-google@example.com:Mock:GoogleUser',
					redirectUrl: false,
				},
				{
					onSuccess: () => {
						onOpenChange(false);
						onSuccess();
					},
				},
			);
		}
	};

	const onSubmit = async (data: LoginValues) => {
		login(
			{ data, redirectUrl: false },
			{
				onSuccess: () => {
					onOpenChange(false);
					onSuccess();
				},
			},
		);
	};

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md w-11/12 rounded-xl">
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
										loginWithGoogle(
											{ token: response.access_token, redirectUrl: false },
											{
												onSuccess: () => {
													onOpenChange(false);
													onSuccess();
												},
											},
										);
									}
								},
							});
							setTokenClient(client);
						}
					}}
				/>

				<DialogHeader>
					<DialogTitle className="text-2xl font-bold">Welcome back</DialogTitle>
					{/* <DialogDescription>
						Enter your details to log in to your account and continue booking.
					</DialogDescription> */}
				</DialogHeader>

				{loginError && (
					<div className="flex items-center gap-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive mt-4">
						<AlertCircle className="h-4 w-4" />
						<p>
							{(loginError as any)?.response?.data?.message ||
								'Something went wrong. Please check your credentials.'}
						</p>
					</div>
				)}

				{googleLoginError && (
					<div className="flex items-center gap-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive mt-4">
						<AlertCircle className="h-4 w-4" />
						<p>
							{(googleLoginError as any)?.response?.data?.message ||
								'Google authentication failed'}
						</p>
					</div>
				)}

				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
					<div className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="email">Email Address</Label>
							<Input
								id="email"
								type="email"
								placeholder="name@example.com"
								className="h-11 bg-neutral-50 rounded-lg"
								{...form.register('email')}
							/>
							{form.formState.errors.email && (
								<p className="text-xs text-destructive">
									{form.formState.errors.email.message}
								</p>
							)}
						</div>

						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<Label htmlFor="password">Password</Label>
								<Link
									href="/login"
									className="text-xs text-brand-blue hover:underline"
								>
									Forgot password?
								</Link>
							</div>
							<div className="relative">
								<Input
									id="password"
									type={showPassword ? 'text' : 'password'}
									placeholder="Enter your password"
									className="h-11 bg-neutral-50 rounded-lg pr-10"
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
							{form.formState.errors.password && (
								<p className="text-xs text-destructive">
									{form.formState.errors.password.message}
								</p>
							)}
						</div>
					</div>

					<Button
						type="submit"
						className="w-full h-11 bg-brand-gold hover:bg-brand-gold-hover text-white rounded-lg font-bold shadow-md shadow-brand-gold/20"
						disabled={isLoggingIn}
					>
						{isLoggingIn ? 'Logging in...' : 'Log In'}
					</Button>

					<div className="relative my-3">
						<div className="absolute inset-0 flex items-center">
							<span className="w-full border-t border-neutral-200" />
						</div>
						<div className="relative flex justify-center text-xs uppercase">
							<span className="bg-white px-2 text-neutral-400">
								Or continue with
							</span>
						</div>
					</div>

					<Button
						variant="outline"
						type="button"
						className="w-full h-11 border-neutral-200 text-neutral-700 hover:bg-neutral-50 rounded-lg font-medium"
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

					<div className="text-center text-xs text-neutral-500 mt-4">
						Don&apos;t have an account?{' '}
						<Link
							href="/register"
							className="font-semibold text-brand-blue hover:underline"
						>
							Sign Up
						</Link>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
