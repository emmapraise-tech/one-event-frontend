'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface SidebarContextType {
	isCollapsed: boolean;
	toggleCollapse: () => void;
	isMobileOpen: boolean;
	toggleMobile: (open: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
	const [isCollapsed, setIsCollapsed] = useState(false); // Default expanded
	const [isMobileOpen, setIsMobileOpen] = useState(false);
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		// eslint-disable-next-line
		setIsMounted(true);
		// Load preference from local storage
		const stored = localStorage.getItem('sidebar-collapsed');
		if (stored) {
			setIsCollapsed(stored === 'true');
		}
	}, []);

	const toggleCollapse = () => {
		setIsCollapsed((prev) => {
			const newValue = !prev;
			localStorage.setItem('sidebar-collapsed', String(newValue));
			return newValue;
		});
	};

	const toggleMobile = (open: boolean) => {
		setIsMobileOpen(open);
	};

	// Avoid hydration mismatch by rendering nothing until mounted (or matching server default)
	// Here we just accept potential layout shift on first load for simplicity, or we could assume expanded by default
	// if (!isMounted) {
	// 	return <>{children}</>;
	// }

	return (
		<SidebarContext.Provider
			value={{
				isCollapsed,
				toggleCollapse,
				isMobileOpen,
				toggleMobile,
			}}
		>
			{children}
		</SidebarContext.Provider>
	);
}

export function useSidebar() {
	const context = useContext(SidebarContext);
	if (context === undefined) {
		throw new Error('useSidebar must be used within a SidebarProvider');
	}
	return context;
}
