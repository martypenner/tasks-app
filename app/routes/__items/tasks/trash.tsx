import { TrashIcon } from '@heroicons/react/outline';
import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Form, NavLink, useLoaderData } from '@remix-run/react';
import invariant from 'tiny-invariant';
import { getDeletedProjects } from '~/models/project.server';
import { getDeletedTasks } from '~/models/task.server';
import { permaDeleteAllDeletedItems } from '~/models/trash.server';
import { requireUserId } from '~/session.server';

export async function loader({ request }: LoaderArgs) {
	const userId = await requireUserId(request);
	const taskListItems = await getDeletedTasks({ userId });
	const projects = await getDeletedProjects({ userId });
	invariant(
		[...taskListItems, ...projects].every((item) => item.deleted != null),
		'items must be deleted'
	);

	const items = [...taskListItems, ...projects].sort((a, b) => b.deleted!.getTime() - a.deleted!.getTime());
	return json({ items });
}

export async function action({ request }: ActionArgs) {
	const userId = await requireUserId(request);
	await permaDeleteAllDeletedItems({ userId });
	return json({});
}

export default function InboxPage() {
	const data = useLoaderData<typeof loader>();

	return (
		<div className="h-full w-80 border-r">
			{data.items.length === 0 ? (
				<TrashIcon className="p-4" />
			) : (
				<>
					<Form method="post">
						<button type="submit" className="block p-4 text-blue-500">
							Empty trash
						</button>
					</Form>
					<ol>
						{data.items.map((task) => (
							<li key={task.id}>
								<NavLink
									className={({ isActive }) => `block border-b p-4 text-xl ${isActive ? 'bg-white' : ''}`}
									to={`/tasks/${task.id}`}>
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
