import { InboxIcon } from '@heroicons/react/outline';
import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Link, NavLink, useLoaderData } from '@remix-run/react';
import { getTodoListItems } from '~/models/todo.server';
import { requireUserId } from '~/session.server';

export async function loader({ request }: LoaderArgs) {
	const userId = await requireUserId(request);
	const todoListItems = await getTodoListItems({ userId });
	return json({ todoListItems });
}

export default function InboxPage() {
	const data = useLoaderData<typeof loader>();

	return (
		<div className="h-full w-80 border-r">
			<Link to="../new" className="block p-4 text-xl text-blue-500">
				+ New to-do
			</Link>

			<hr />

			{data.todoListItems.length === 0 ? (
				<InboxIcon className="p-4" />
			) : (
				<ol>
					{data.todoListItems.map((todo) => (
						<li key={todo.id}>
							<NavLink
								className={({ isActive }) => `block border-b p-4 text-xl ${isActive ? 'bg-white' : ''}`}
								to={`../${todo.id}`}>
								📝 {todo.title}
							</NavLink>
						</li>
					))}
				</ol>
			)}
		</div>
	);
}
