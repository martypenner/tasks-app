import { TrashIcon } from '@heroicons/react/24/outline';
import type { ActionArgs, LoaderArgs, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Form, NavLink, useLoaderData } from '@remix-run/react';
import invariant from 'tiny-invariant';
import { getDeletedProjects } from '~/models/project.server';
import { getDeletedTasks } from '~/models/task.server';
import { permaDeleteAllDeletedItems } from '~/models/trash.server';
import * as paths from '~/paths';
import { requireUserId } from '~/session.server';

export const meta: MetaFunction = () => ({
	title: 'Trash',
});

export async function loader({ request }: LoaderArgs) {
	const userId = await requireUserId(request);
	const taskListItems = (await getDeletedTasks({ userId })).map((task) => ({ ...task, isProject: false }));
	const projects = (await getDeletedProjects({ userId })).map((project) => ({ ...project, isProject: true }));
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
		<>
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
						{data.items.map((taskOrProject) => (
							<li key={taskOrProject.id}>
								<NavLink
									className={({ isActive }) => `block border-b p-4 text-xl ${isActive ? 'bg-white' : ''}`}
									to={
										taskOrProject.isProject
											? paths.project({ projectId: taskOrProject.id })
											: paths.task({ taskId: taskOrProject.id })
									}>
									📝 {taskOrProject.title}
								</NavLink>
							</li>
						))}
					</ol>
				</>
			)}
		</>
	);
}
