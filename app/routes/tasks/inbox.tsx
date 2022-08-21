import { InboxIcon } from '@heroicons/react/outline';
import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Link, NavLink, useLoaderData } from '@remix-run/react';
import { getTaskListItemsByWhen } from '~/models/task.server';
import { requireUserId } from '~/session.server';

export async function loader({ request }: LoaderArgs) {
	const userId = await requireUserId(request);
	const taskListItems = await getTaskListItemsByWhen({ userId, when: 'inbox' });
	return json({ taskListItems });
}

export default function InboxPage() {
	const data = useLoaderData<typeof loader>();

	return (
		<div className="h-full w-80 border-r">
			<Link to="../new" className="block p-4 text-xl text-blue-500">
				+ New task
			</Link>

			<hr />

			{data.taskListItems.length === 0 ? (
				<InboxIcon className="p-4" />
			) : (
				<ol>
					{data.taskListItems.map((task) => (
						<li key={task.id}>
							<NavLink
								className={({ isActive }) => `block border-b p-4 text-xl ${isActive ? 'bg-white' : ''}`}
								to={`../${task.id}`}>
								📝 {task.title}
							</NavLink>
						</li>
					))}
				</ol>
			)}
		</div>
	);
}
