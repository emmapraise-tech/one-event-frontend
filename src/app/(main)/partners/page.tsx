'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
	Building2, 
	Users, 
	ShieldCheck, 
	TrendingUp, 
	ChevronRight,
	Calendar,
	CheckCircle2
} from 'lucide-react';

export default function BecomeAPartnerPage() {
	return (
		<div className="flex flex-col min-h-screen bg-white">
			{/* Hero Section */}
			<section className="relative pt-20 pb-24 md:pt-32 md:pb-40 overflow-hidden">
				<div className="absolute top-0 left-0 w-full h-full bg-brand-blue-soft/30 -z-10" />
				<div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-brand-gold/10 blur-[120px] rounded-full -z-10" />
				<div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[30%] bg-brand-blue/10 blur-[100px] rounded-full -z-10" />
				
				<div className="container mx-auto px-4 md:px-6 relative z-10">
					<div className="max-w-4xl mx-auto text-center">
						<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-blue/5 border border-brand-blue/10 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
							<span className="h-2 w-2 rounded-full bg-brand-blue animate-pulse" />
							<span className="text-xs font-bold text-brand-blue uppercase tracking-widest">Partner with the best</span>
						</div>
						<h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-neutral-900 leading-[1.1] tracking-tight mb-8 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
							Empower Your <span className="text-brand-blue">Event Business</span> in Nigeria
						</h1>
						<p className="text-lg md:text-xl text-neutral-600 mb-10 leading-relaxed max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
							Join Nigeria's premium event marketplace. List your venues, connect with planners, and manage everything from a single, powerful dashboard.
						</p>
						<div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
							<Link href="/onboard-vendor">
								<Button size="lg" className="bg-brand-blue hover:bg-brand-blue-hover text-white px-10 h-14 rounded-2xl font-black text-lg shadow-xl shadow-blue-500/20 group">
									Get Started Now
									<ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
								</Button>
							</Link>
							<Link href="#how-it-works">
								<Button size="lg" variant="ghost" className="text-neutral-600 hover:bg-neutral-100 px-8 h-14 rounded-2xl font-bold text-lg">
									Learn More
								</Button>
							</Link>
						</div>
					</div>
				</div>
			</section>

			{/* Benefit Cards */}
			<section className="py-24 bg-white">
				<div className="container mx-auto px-4 md:px-6">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
						{[
							{
								icon: Building2,
								title: "List Event Centers",
								desc: "Perfect for hall owners and venue managers looking to increase their occupancy rates.",
								color: "bg-blue-50 text-brand-blue"
							},
							{
								icon: Users,
								title: "Reach More Clients",
								desc: "Get instantly exposed to thousands of event planners and coordinators across Nigeria.",
								color: "bg-amber-50 text-brand-gold"
							},
							{
								icon: ShieldCheck,
								title: "Secure Payments",
								desc: "Our escrow system ensures you get paid promptly for every booking you complete.",
								color: "bg-emerald-50 text-emerald-600"
							},
							{
								icon: TrendingUp,
								title: "Scale Efficiency",
								desc: "Automate inquiries and bookings, giving you more time to focus on your operations.",
								color: "bg-purple-50 text-purple-600"
							}
						].map((item, i) => (
							<div key={i} className="p-8 rounded-[32px] border border-neutral-100 bg-neutral-50/30 hover:bg-white hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
								<div className={`h-14 w-14 rounded-2xl ${item.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
									<item.icon className="h-7 w-7" />
								</div>
								<h3 className="text-xl font-bold text-neutral-900 mb-3">{item.title}</h3>
								<p className="text-neutral-500 text-sm leading-relaxed">{item.desc}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* How it Works */}
			<section id="how-it-works" className="py-24 bg-neutral-50/50 relative overflow-hidden">
				<div className="container mx-auto px-4 md:px-6">
					<div className="text-center max-w-3xl mx-auto mb-16">
						<h2 className="text-3xl md:text-5xl font-black text-neutral-900 mb-6">Simple Steps to Success</h2>
						<p className="text-neutral-500">We've built One Event to be the most intuitive platform for event industry professionals.</p>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
						{/* Vertical connector line for desktop */}
						<div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-neutral-200 -translate-y-1/2 -z-10" />
						
						{[
							{
								step: "01",
								title: "Create Profile",
								desc: "Sign up and build your professional business profile with your credentials."
							},
							{
								step: "02",
								title: "Add Listings",
								desc: "Upload photos, descriptions, and pricing for your venues or services."
							},
							{
								step: "03",
								title: "Accept Bookings",
								desc: "Receive booking requests directly and get paid through our secure system."
							}
						].map((item, i) => (
							<div key={i} className="bg-white p-10 rounded-[40px] shadow-sm border border-neutral-100 flex flex-col items-center text-center relative">
								<div className="h-12 w-12 rounded-full bg-brand-blue text-white flex items-center justify-center font-black text-lg mb-6 shadow-lg shadow-blue-500/20">
									{item.step}
								</div>
								<h3 className="text-2xl font-bold text-neutral-900 mb-4">{item.title}</h3>
								<p className="text-neutral-500 leading-relaxed">{item.desc}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Testimonial / Social Proof */}
			<section className="py-24 bg-white overflow-hidden">
				<div className="container mx-auto px-4 md:px-6">
					<div className="bg-brand-blue rounded-[48px] p-8 md:p-16 relative overflow-hidden lg:flex items-center gap-12">
						<div className="absolute top-0 right-0 w-full h-full bg-linear-to-br from-white/10 to-transparent -z-0" />
						<div className="lg:w-1/2 relative z-10">
							<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold uppercase tracking-widest mb-6">
								Partner Success
							</div>
							<h2 className="text-3xl md:text-4xl font-black text-white mb-6 leading-tight">
								"One Event tripled our venue bookings in Lagos within just 6 months."
							</h2>
							<div className="flex items-center gap-4">
								<div className="h-12 w-12 rounded-full bg-neutral-200 border-2 border-white/20" />
								<div>
									<p className="font-bold text-white">Chidi Okafor</p>
									<p className="text-blue-200 text-sm">Manager, Grand Palace Hall</p>
								</div>
							</div>
						</div>
						<div className="hidden lg:grid lg:w-1/2 grid-cols-2 gap-4 relative z-10">
							<div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl mt-8">
								<Calendar className="h-8 w-8 text-brand-gold mb-4" />
								<p className="text-2xl font-black text-white">150+</p>
								<p className="text-blue-100 text-sm italic">Bookings Managed</p>
							</div>
							<div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl">
								<CheckCircle2 className="h-8 w-8 text-emerald-400 mb-4" />
								<p className="text-2xl font-black text-white">4.9/5</p>
								<p className="text-blue-100 text-sm italic">Partner Satisfaction</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-24 text-center">
				<div className="container mx-auto px-4 md:px-6">
					<div className="max-w-3xl mx-auto">
						<h2 className="text-4xl md:text-5xl font-black text-neutral-900 mb-8 tracking-tight">Ready to showcase your space?</h2>
						<p className="text-lg text-neutral-500 mb-12 leading-relaxed">
							Join hundreds of successful partners across Nigeria who trust One Event for their business growth.
						</p>
						<Link href="/onboard-vendor">
							<Button size="lg" className="bg-brand-gold hover:bg-brand-gold-hover text-white px-12 h-16 rounded-2xl font-black text-xl shadow-2xl shadow-amber-500/20 transition-all hover:scale-105">
								Become a Partner Now
							</Button>
						</Link>
						<p className="mt-8 text-sm text-neutral-400 font-medium">
							Have questions? <Link href="/contact" className="text-brand-blue hover:underline">Chat with our partner support</Link>
						</p>
					</div>
				</div>
			</section>
		</div>
	);
}
