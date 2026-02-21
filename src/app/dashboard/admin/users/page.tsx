'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/services/user.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Badge } from '@/components/ui/badge';
import {
	Loader2,
	Users,
	Shield,
	Mail,
	Phone,
	Calendar,
	MoreVertical,
	CheckCircle,
	XCircle,
} from 'lucide-react';
import { UserType } from '@/types/auth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export default function AdminUsersPage() {
	const {
		data: users,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['users'],
		queryFn: userService.findAll,
	});

	if (isLoading) {
		return (
			<div className="flex h-[60vh] items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
			</div>
		);
	}

	const safeUsers = Array.isArray(users) ? users : [];

	return (
		<div className="space-y-8 animate-in fade-in duration-500">
			{/* Admin Header */}
			<div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
				<div>
					<div className="flex items-center gap-2 mb-2">
						<div className="h-6 w-6 rounded-full bg-brand-blue-soft flex items-center justify-center">
							<Shield className="h-3 w-3 text-brand-blue" />
						</div>
						<span className="text-[10px] font-bold text-brand-blue uppercase tracking-widest">
							Access Management
						</span>
					</div>
					<h1 className="text-3xl font-black text-neutral-900 tracking-tight">
						User Directory
					</h1>
					<p className="text-neutral-500 mt-1 font-medium">
						Manage platform access, roles, and account statuses.
					</p>
				</div>
				<div className="bg-white px-6 py-3 rounded-2xl shadow-soft border border-neutral-100 flex items-center gap-8">
					<div className="text-center">
						<p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
							Customers
						</p>
						<p className="text-xl font-black text-neutral-900">
							{safeUsers.filter((u) => u.type === UserType.CUSTOMER).length}
						</p>
					</div>
					<div className="h-8 w-px bg-neutral-100" />
					<div className="text-center">
						<p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
							Vendors
						</p>
						<p className="text-xl font-black text-brand-blue">
							{safeUsers.filter((u) => u.type === UserType.VENDOR).length}
						</p>
					</div>
					<div className="h-8 w-px bg-neutral-100" />
					<div className="text-center">
						<p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
							Admins
						</p>
						<p className="text-xl font-black text-brand-blue">
							{safeUsers.filter((u) => u.type === UserType.ADMIN).length}
						</p>
					</div>
				</div>
			</div>

			<Card className="border-none shadow-soft rounded-[40px] overflow-hidden bg-white">
				<CardHeader className="p-8 border-b border-neutral-50">
					<div className="flex items-center justify-between">
						<div>
							<CardTitle className="text-lg font-black text-neutral-900">
								Registered Users
							</CardTitle>
							<p className="text-sm text-neutral-500 font-medium">
								Full list of all platform accounts
							</p>
						</div>
						<div className="flex gap-2">
							<Button
								variant="outline"
								className="rounded-xl border-neutral-100 font-bold h-10"
							>
								Export CSV
							</Button>
						</div>
					</div>
				</CardHeader>
				<CardContent className="p-0">
					{safeUsers.length === 0 ? (
						<div className="p-20 text-center">
							<EmptyState
								icon={<Users className="h-16 w-16" />}
								title="No users found"
								description="User accounts will appear here once users register on the platform."
							/>
						</div>
					) : (
						<div className="overflow-x-auto">
							<table className="w-full text-left">
								<thead>
									<tr className="bg-neutral-50/50">
										<th className="px-8 py-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
											User
										</th>
										<th className="px-8 py-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
											Role
										</th>
										<th className="px-8 py-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
											Contact
										</th>
										<th className="px-8 py-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
											Status
										</th>
										<th className="px-8 py-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
											Joined
										</th>
										<th className="px-8 py-4 text-right"></th>
									</tr>
								</thead>
								<tbody className="divide-y divide-neutral-50">
									{safeUsers.map((user) => (
										<tr
											key={user.id}
											className="group hover:bg-neutral-50/50 transition-colors"
										>
											<td className="px-8 py-5">
												<div className="flex items-center gap-4">
													<Avatar className="h-10 w-10 border border-neutral-100 shadow-sm">
														<AvatarImage src="" />
														<AvatarFallback className="bg-brand-blue-soft text-brand-blue font-bold text-xs uppercase">
															{user.firstName?.[0] || 'U'}
															{user.lastName?.[0] || 'S'}
														</AvatarFallback>
													</Avatar>
													<div>
														<p className="font-bold text-neutral-900 leading-none mb-1">
															{user.firstName || 'User'} {user.lastName || ''}
														</p>
														<p className="text-xs text-neutral-400 font-medium">
															ID: {user.id.slice(-6)}
														</p>
													</div>
												</div>
											</td>
											<td className="px-8 py-5">
												<Badge
													className={cn(
														'border-none font-bold text-[10px] uppercase px-3 py-1',
														user.type === UserType.ADMIN
															? 'bg-brand-blue text-white'
															: user.type === UserType.VENDOR
																? 'bg-blue-100 text-blue-700'
																: 'bg-neutral-100 text-neutral-600',
													)}
												>
													{user.type}
												</Badge>
											</td>
											<td className="px-8 py-5">
												<div className="space-y-1">
													<div className="flex items-center gap-2 text-sm font-medium text-neutral-600">
														<Mail className="h-3.5 w-3.5 opacity-50" />
														{user.email}
													</div>
													{user.phone && (
														<div className="flex items-center gap-2 text-xs text-neutral-400">
															<Phone className="h-3.5 w-3.5 opacity-50" />
															{user.phone}
														</div>
													)}
												</div>
											</td>
											<td className="px-8 py-5">
												<div className="flex items-center gap-2">
													{user.isActive ? (
														<div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase">
															<div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
															Active
														</div>
													) : (
														<div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-600 text-[10px] font-bold uppercase">
															<div className="h-1.5 w-1.5 rounded-full bg-red-500" />
															Suspended
														</div>
													)}
												</div>
											</td>
											<td className="px-8 py-5">
												<div className="flex items-center gap-2 text-sm text-neutral-500 font-medium">
													<Calendar className="h-3.5 w-3.5 opacity-50" />
													{new Date(
														user.createdAt || Date.now(),
													).toLocaleDateString('en-US', {
														month: 'short',
														year: 'numeric',
													})}
												</div>
											</td>
											<td className="px-8 py-5 text-right">
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button
															variant="ghost"
															size="icon"
															className="rounded-xl hover:bg-white border border-transparent hover:border-neutral-100"
														>
															<MoreVertical className="h-4 w-4 text-neutral-400" />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent
														align="end"
														className="w-48 rounded-xl shadow-soft border-neutral-100"
													>
														<DropdownMenuLabel>User Actions</DropdownMenuLabel>
														<DropdownMenuSeparator />
														<DropdownMenuItem className="gap-2 font-medium">
															<Mail className="h-4 w-4" /> Message User
														</DropdownMenuItem>
														<DropdownMenuItem className="gap-2 font-medium">
															<Calendar className="h-4 w-4" /> View Bookings
														</DropdownMenuItem>
														<DropdownMenuSeparator />
														{user.isActive ? (
															<DropdownMenuItem className="gap-2 font-medium text-red-600 focus:text-red-600 focus:bg-red-50">
																<XCircle className="h-4 w-4" /> Suspend Account
															</DropdownMenuItem>
														) : (
															<DropdownMenuItem className="gap-2 font-medium text-emerald-600 focus:text-emerald-600 focus:bg-emerald-50">
																<CheckCircle className="h-4 w-4" /> Reactivate
																Account
															</DropdownMenuItem>
														)}
													</DropdownMenuContent>
												</DropdownMenu>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
