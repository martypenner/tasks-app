import type { LinksFunction, LoaderArgs, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';

import { getUser } from './session.server';
import tailwindStylesheetUrl from './styles/tailwind.css';

export const links: LinksFunction = () => {
	return [{ rel: 'stylesheet', href: tailwindStylesheetUrl }];
};

export const meta: MetaFunction = () => ({
	charset: 'utf-8',
	title: 'Tasks',
	viewport: 'width=device-width,initial-scale=1',
});

export async function loader({ request }: LoaderArgs) {
	return json({
		user: await getUser(request),
	});
}

export default function App() {
	return (
		<html
			lang="en"
			className={`h-full ${
				typeof localStorage !== 'undefined' &&
				(localStorage.theme === 'dark' ||
					(!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches))
					? 'dark'
					: ''
			}`}>
			<head>
				<Meta />
				<Links />
			</head>
			<body className="h-full bg-gray-100 text-black dark:bg-gray-800 dark:text-gray-300">
				<Outlet />
				<ScrollRestoration />
				<Scripts />
				<LiveReload />
			</body>
		</html>
	);
}
