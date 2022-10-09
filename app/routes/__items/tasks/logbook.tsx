import { InboxIcon } from '@heroicons/react/24/outline';
import type { LoaderArgs, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { NavLink, useLoaderData } from '@remix-run/react';
import { Fragment } from 'react';
import TaskView from '~/components/TaskView';
import { getCompletedProjects } from '~/models/project.server';
import { getCompletedTasks } from '~/models/task.server';
import * as paths from '~/paths';
import { requireUserId } from '~/session.server';

export const meta: MetaFunction = () => ({
	title: 'Logbook',
});

export async function loader({ request }: LoaderArgs) {
	const userId = await requireUserId(request);
	const taskListItems = (await getCompletedTasks({ userId }))
		// Filter out tasks in completed projects. Was easier to do it here than in the query.
		.filter((task) => task.Project == null || task.Project?.completedDate == null)
		.map((task) => ({ ...task, isProject: false }));
	const projects = (await getCompletedProjects({ userId })).map((project) => ({ ...project, isProject: true }));

	// For future
	// const items = [...taskListItems, ...projects].sort((a, b) => b.completed!.getTime() - a.completed!.getTime());

	const items = [...taskListItems, ...projects];

	return json({ items });
}

export default function InboxPage() {
	const data = useLoaderData<typeof loader>();

	return (
		<Fragment>
			{data.items.length === 0 ? (
				<InboxIcon className="p-4" />
			) : (
				<ol>
					{data.items.map((taskOrProject) => (
						<li key={taskOrProject.id}>
							{taskOrProject.isProject ? (
								<NavLink
									className={({ isActive }) => `block border-b p-4 text-xl ${isActive ? 'bg-white' : ''}`}
									to={paths.project({ projectId: taskOrProject.id })}>
									📝 {taskOrProject.title}
								</NavLink>
							) : (
								// @ts-expect-error: ts is confused
								<TaskView task={taskOrProject} />
							)}
						</li>
					))}
				</ol>
			)}
		</Fragment>
	);
}
