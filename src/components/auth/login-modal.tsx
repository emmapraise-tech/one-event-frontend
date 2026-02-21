'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
	const { login, isLoggingIn, loginError } = useAuth();
	const [showPassword, setShowPassword] = useState(false);

	const form = useForm<LoginValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

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
				<DialogHeader>
					<DialogTitle className="text-2xl font-bold">Welcome back</DialogTitle>
					<DialogDescription>
						Enter your details to log in to your account and continue booking.
					</DialogDescription>
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

				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
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

					<div className="text-center text-xs text-neutral-500 mt-4">
						Don't have an account?{' '}
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
