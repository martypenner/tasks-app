import { TrashIcon } from '@heroicons/react/outline';
import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Form, NavLink, useLoaderData } from '@remix-run/react';
import { getDeletedTasks, permaDeleteAllDeletedTasks } from '~/models/task.server';
import { requireUserId } from '~/session.server';

export async function loader({ request }: LoaderArgs) {
	const userId = await requireUserId(request);
	const taskListItems = await getDeletedTasks({ userId });
	return json({ taskListItems });
}

export async function action({ request }: ActionArgs) {
	const userId = await requireUserId(request);
	const stuff = await permaDeleteAllDeletedTasks({ userId });
	console.log(stuff);
	return json({});
}

export default function InboxPage() {
	const data = useLoaderData<typeof loader>();

	return (
		<div className="h-full w-80 border-r">
			{data.taskListItems.length === 0 ? (
				<TrashIcon className="p-4" />
			) : (
				<>
					<Form method="post">
						<button type="submit" className="block p-4 text-blue-500">
							Empty trash
						</button>
					</Form>
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
				</>
			)}
		</div>
	);
}
