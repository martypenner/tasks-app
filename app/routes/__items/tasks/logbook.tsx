import { InboxIcon } from '@heroicons/react/24/outline';
import type { LoaderArgs, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { NavLink, useLoaderData } from '@remix-run/react';
import { getCompletedTasks } from '~/models/task.server';
import { requireUserId } from '~/session.server';

export const meta: MetaFunction = () => ({
	title: 'Logbook',
});

export async function loader({ request }: LoaderArgs) {
	const userId = await requireUserId(request);
	const taskListItems = (await getCompletedTasks({ userId }))
		// Filter out tasks in completed projects. Was easier to do it here than in the query.
		.filter((task) => !(task.Project?.done ?? false));
	return json({ taskListItems });
}

export default function InboxPage() {
	const data = useLoaderData<typeof loader>();

	return (
		<>
			{data.taskListItems.length === 0 ? (
				<InboxIcon className="p-4" />
			) : (
				<ol>
					{data.taskListItems.map((task) => (
						<li key={task.id}>
							<NavLink
								className={({ isActive }) => `block border-b p-4 text-xl ${isActive ? 'bg-white' : ''}`}
								to={`/tasks/${task.id}`}>
								📝 {task.title}
								{task.Project?.title && <div className="text-sm text-gray-600">{task.Project?.title}</div>}
							</NavLink>
						</li>
					))}
				</ol>
			)}
		</>
	);
}
