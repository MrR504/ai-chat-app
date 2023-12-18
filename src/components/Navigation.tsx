import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { Button } from './ui/button';
import Link from 'next/link';
import { Bot, MessageSquareText } from 'lucide-react';
import { ModeToggle } from './ModeToggle';

const navbarLinks = [
	{
		id: 1,
		href: "/",
		label: (
			<Button variant="ghost" className='font-bold' >
				<Bot className="mr-2 h-[1fr] w-[1fr]" /> AI-CHAT
			</Button>),
	},
	{
		id: 2,
		href: "/chat",
		label: (
			<Button variant="ghost" className='font-medium ' >
				<MessageSquareText className="mr-2 h-4 w-4" /> Chat
			</Button>),
	}
];

const Navbar = () => {
	return (
		<div className='flex'>
			{navbarLinks.map((item) => (
				<NavigationMenuItem key={item.id}>
					<Link href={item.href} className='pe-2'>
						{item.label}
					</Link>
				</NavigationMenuItem>
			))}
		</div>
	);
};

export default function Navigation() {
	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className='container px-2 grid grid-cols-[auto_1fr_auto] sm:grid-cols-[1fr_auto] h-14 items-center'>
				<NavigationMenu className='hidden md:flex'>
					<Navbar />
				</NavigationMenu>
				<ModeToggle />
			</div>
		</header>
	);
};