import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/auth.service';
import { LoginCredentials, RegisterData, User, UserType } from '@/types/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export function useAuth() {
	const queryClient = useQueryClient();
	const router = useRouter();
	const searchParams = useSearchParams();

	const {
		data: user,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['user'],
		queryFn: authService.getMe,
		retry: false,
		staleTime: Infinity, // User data doesn't change often
	});

	const loginMutation = useMutation({
		mutationFn: authService.login,
		onSuccess: (data) => {
			localStorage.setItem('token', data.access_token);
			queryClient.setQueryData(['user'], data.user);

			// Priority 1: Check for callbackUrl in search params
			const callbackUrl = searchParams.get('callbackUrl');

			if (callbackUrl) {
				router.push(callbackUrl);
				return;
			}

			// Priority 2: Default redirects
			if (data.user.type === UserType.CUSTOMER) {
				router.push('/');
			} else {
				router.push('/dashboard');
			}
		},
	});

	const registerMutation = useMutation({
		mutationFn: authService.register,
		onSuccess: (data) => {
			localStorage.setItem('token', data.access_token);
			queryClient.setQueryData(['user'], data.user);

			// Priority 1: Check for callbackUrl in search params
			const callbackUrl = searchParams.get('callbackUrl');

			if (callbackUrl) {
				router.push(callbackUrl);
				return;
			}

			// Priority 2: Default redirects
			if (data.user.type === UserType.CUSTOMER) {
				router.push('/');
			} else {
				router.push('/dashboard');
			}
		},
	});

	const logout = () => {
		authService.logout();
		queryClient.setQueryData(['user'], null);
		router.push('/login');
	};

	return {
		user,
		isLoading,
		isAuthenticated: !!user,
		login: loginMutation.mutate,
		isLoggingIn: loginMutation.isPending,
		loginError: loginMutation.error,
		register: registerMutation.mutate,
		isRegistering: registerMutation.isPending,
		registerError: registerMutation.error,
		logout,
	};
}
