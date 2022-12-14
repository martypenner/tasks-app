import { Dialog, Menu, Transition } from '@headlessui/react';
import {
	ArchiveBoxIcon,
	Bars3Icon,
	BellIcon,
	CalendarIcon,
	InboxIcon,
	NewspaperIcon,
	RectangleStackIcon,
	TrashIcon,
	XMarkIcon,
} from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';
import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Link, NavLink, Outlet, useLoaderData } from '@remix-run/react';
import { Fragment, useState } from 'react';
import { SSRProvider } from 'react-aria';
import RadialProgress from '~/components/RadialProgress';
import Search from '~/components/Search';
import { getAreas } from '~/models/area.server';
import type { Project } from '~/models/project.server';
import { getProjectsWithoutAreas } from '~/models/project.server';
import { getTaskListItemsByWhen } from '~/models/task.server';
import * as paths from '~/paths';

function sortByCreatedTime(a: Pick<Project, 'createdAt'>, b: Pick<Project, 'createdAt'>) {
	return b.createdAt!.getTime() - a.createdAt!.getTime();
}

export async function loader({ request }: LoaderArgs) {
	const taskListItems = await getTaskListItemsByWhen({ when: 'inbox' });
	const projects = (await getProjectsWithoutAreas()).sort(sortByCreatedTime);
	const areas = (await getAreas()).sort(sortByCreatedTime);
	return json({ taskListItems, projects, areas });
}

const navigation = [
	{ name: 'Inbox', href: paths.inbox({}), icon: InboxIcon, itemClass: 'mb-4', iconClass: 'text-blue-500' },
	{ name: 'Today', href: paths.today({}), icon: StarIcon, iconClass: 'text-yellow-500' },
	{ name: 'Upcoming', href: paths.upcoming({}), icon: CalendarIcon, iconClass: 'text-red-500' },
	{ name: 'Anytime', href: paths.anytime({}), icon: RectangleStackIcon, iconClass: 'text-teal-600' },
	{ name: 'Someday', href: paths.someday({}), icon: ArchiveBoxIcon, itemClass: 'mb-4', iconClass: 'text-amber-100' },
	{ name: 'Logbook', href: paths.logbook({}), icon: NewspaperIcon, iconClass: 'text-green-600' },
	{ name: 'Trash', href: paths.trash({}), icon: TrashIcon, iconClass: 'text-zinc-100' },
];
const userNavigation = [
	{ name: 'Your Profile', href: '#' },
	{ name: 'Settings', href: '#' },
	{ name: 'Sign out', href: '/logout' },
];

export default function App() {
	const data = useLoaderData<typeof loader>();
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [isDarkMode, setIsDarkMode] = useState(
		typeof localStorage === 'undefined'
			? false
			: localStorage.theme === 'dark' ||
					(!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
	);

	function toggleDarkMode() {
		if (isDarkMode) {
			document.documentElement.classList.remove('dark');
			localStorage.theme = 'light';
		} else {
			document.documentElement.classList.add('dark');
			localStorage.theme = 'dark';
		}

		setIsDarkMode((mode) => !mode);
	}

	return (
		<SSRProvider>
			<Transition.Root show={sidebarOpen} as={Fragment}>
				<Dialog as="div" className="relative z-40 md:hidden" onClose={setSidebarOpen}>
					<Transition.Child
						as={Fragment}
						enter="transition-opacity ease-linear duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="transition-opacity ease-linear duration-300"
						leaveFrom="opacity-100"
						leaveTo="opacity-0">
						<div className="fixed inset-0 bg-opacity-75" />
					</Transition.Child>

					<div className="fixed inset-0 z-40 flex">
						<Transition.Child
							as={Fragment}
							enter="transition ease-in-out duration-300 transform"
							enterFrom="-translate-x-full"
							enterTo="translate-x-0"
							leave="transition ease-in-out duration-300 transform"
							leaveFrom="translate-x-0"
							leaveTo="-translate-x-full">
							<Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-white pt-5 pb-4 dark:bg-gray-800">
								<Transition.Child
									as={Fragment}
									enter="ease-in-out duration-300"
									enterFrom="opacity-0"
									enterTo="opacity-100"
									leave="ease-in-out duration-300"
									leaveFrom="opacity-100"
									leaveTo="opacity-0">
									<div className="absolute top-0 right-0 -mr-12 pt-2">
										<button
											type="button"
											className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
											onClick={() => setSidebarOpen(false)}>
											<span className="sr-only">Close sidebar</span>
											<XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
										</button>
									</div>
								</Transition.Child>

								<div className="h-0 flex-1 overflow-y-auto">
									<nav className="px-2">
										{navigation.map((item) => (
											<NavLink
												key={item.name}
												to={item.href}
												className={({ isActive }) =>
													`${
														isActive ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
													} ${item.itemClass} group flex items-center rounded-md px-2 py-1 text-sm font-medium`
												}>
												{({ isActive }) => (
													<Fragment>
														<item.icon
															className={`${isActive ? 'text-gray-500' : 'group-hover:text-gray-500'} ${
																item.iconClass
															} mr-4 h-6 w-6 flex-shrink-0`}
															aria-hidden="true"
														/>

														{item.name}
													</Fragment>
												)}
											</NavLink>
										))}
									</nav>
								</div>
							</Dialog.Panel>
						</Transition.Child>
						<div className="w-14 flex-shrink-0">{/* Dummy element to force sidebar to shrink to fit close icon */}</div>
					</div>
				</Dialog>
			</Transition.Root>

			{/* Static sidebar for desktop */}
			<div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
				{/* Sidebar component, swap this element with another sidebar if you like */}
				<div className="flex min-h-0 flex-1 flex-col">
					<div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
						<nav className="mt-5 flex-1 px-2">
							{/* todo: react aria useGridList */}
							{navigation.map((item) => (
								<NavLink
									key={item.name}
									to={item.href}
									className={({ isActive }) =>
										`${isActive ? 'bg-gray-900 text-white' : 'hover:bg-gray-700 hover:text-white'} ${
											item.itemClass
										} group flex items-center rounded-md px-2 py-1 text-sm font-medium`
									}>
									{({ isActive }) => (
										<Fragment>
											<item.icon
												className={`${isActive ? '' : 'group-hover:text-gray-300'} ${
													item.iconClass
												} mr-3 h-6 w-6 flex-shrink-0`}
												aria-hidden="true"
											/>
											{item.name}
										</Fragment>
									)}
								</NavLink>
							))}

							<div className="flex flex-col justify-between">
								<div className="my-6 mt-4">
									<ol>
										{data.projects.length > 0 &&
											data.projects.map((project) => (
												<li key={project.id}>
													<NavLink
														className={({ isActive }) =>
															`${
																isActive ? 'bg-gray-900 text-white' : 'hover:bg-gray-700 hover:text-white'
															} group flex items-center rounded-md px-2 py-2 text-sm font-medium`
														}
														to={paths.project({ projectId: project.id })}>
														<RadialProgress
															progress={
																(project.tasks.filter((task) => task.completedDate != null).length /
																	project.tasks.length) *
																100
															}
														/>
														{project.title}
													</NavLink>
												</li>
											))}

										{data.areas.length > 0 &&
											data.areas.map((area) => (
												<li key={area.id} className="my-4">
													<NavLink
														className={({ isActive }) =>
															`${
																isActive ? 'bg-gray-900 text-white' : 'hover:bg-gray-700 hover:text-white'
															} group flex items-center rounded-md px-2 py-2 text-sm font-medium`
														}
														to={paths.area({ areaId: area.id })}>
														<RectangleStackIcon className="mr-3 h-6 w-6" />
														{area.title}
													</NavLink>

													<ol>
														{area.project.map((project) => (
															<li key={project.id}>
																<NavLink
																	className={({ isActive }) =>
																		`${
																			isActive ? 'bg-gray-900 text-white' : 'hover:bg-gray-700 hover:text-white'
																		} group flex items-center rounded-md px-2 py-2 text-sm font-medium`
																	}
																	to={paths.project({ projectId: project.id })}>
																	<RadialProgress
																		progress={
																			(project.tasks.filter((task) => task.completedDate != null).length /
																				project.tasks.length) *
																			100
																		}
																	/>
																	{project.title}
																</NavLink>
															</li>
														))}
													</ol>
												</li>
											))}
									</ol>
								</div>

								<div>
									<Link
										to={paths.newProject({})}
										className="block py-2 hover:bg-gray-700 hover:text-white group-hover:text-gray-300">
										+ New project
									</Link>
									<Link
										to={paths.newArea({})}
										className="block py-2 hover:bg-gray-700 hover:text-white group-hover:text-gray-300">
										+ New area
									</Link>
								</div>
							</div>
						</nav>
					</div>
				</div>
			</div>

			<div className="md:pl-64">
				<div className="mx-auto flex max-w-4xl flex-col md:px-8 xl:px-0">
					<div className="sticky top-0 z-10 flex h-16 flex-shrink-0 border-b border-gray-200">
						<button
							type="button"
							className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
							onClick={() => setSidebarOpen(true)}>
							<span className="sr-only">Open sidebar</span>
							<Bars3Icon className="h-6 w-6" aria-hidden="true" />
						</button>
						<div className="flex flex-1 items-center justify-end gap-3 bg-gray-100 px-4 dark:bg-gray-800 md:px-0">
							<button
								type="button"
								aria-label="Toggle Dark Mode"
								className="ml-1 flex h-9 w-9 items-center justify-center rounded-lg bg-yellow-400 ring-yellow-400 transition-all hover:ring-2 dark:bg-yellow-800"
								onClick={toggleDarkMode}>
								{isDarkMode ? (
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										className="h-5 w-5 text-gray-800 dark:text-gray-200">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
									</svg>
								) : (
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										className="h-5 w-5 text-gray-800 dark:text-yellow-100">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
									</svg>
								)}
							</button>

							<button
								type="button"
								className="rounded-full p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
								<span className="sr-only">View notifications</span>
								<BellIcon className="h-6 w-6" aria-hidden="true" />
							</button>

							{/* Profile dropdown */}
							<Menu as="div" className="relative">
								<div>
									<Menu.Button className="flex max-w-xs items-center rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
										<span className="sr-only">Open user menu</span>
										<img
											className="h-8 w-8 rounded-full"
											src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
											alt=""
										/>
									</Menu.Button>
								</div>
								<Transition
									as={Fragment}
									enter="transition ease-out duration-100"
									enterFrom="transform opacity-0 scale-95"
									enterTo="transform opacity-100 scale-100"
									leave="transition ease-in duration-75"
									leaveFrom="transform opacity-100 scale-100"
									leaveTo="transform opacity-0 scale-95">
									<Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-gray-100 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
										{userNavigation.map((item) => (
											<Menu.Item key={item.name}>
												{({ active }) => (
													<Link
														to={item.href}
														className={`${active ? 'bg-gray-200' : ''} block py-2 px-4 text-sm text-gray-700`}>
														{item.name}
													</Link>
												)}
											</Menu.Item>
										))}
									</Menu.Items>
								</Transition>
							</Menu>
						</div>
					</div>

					<div className="flex-1">
						<div className="px-4 pb-6 sm:px-6 md:px-0">
							<div className="flex h-full flex-col">
								<main className="h-full p-6">
									<Search />
									<Outlet />
								</main>
							</div>
						</div>
					</div>
				</div>
			</div>
		</SSRProvider>
	);
}
