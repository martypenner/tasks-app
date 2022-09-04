import { InboxIcon } from '@heroicons/react/24/outline';
import type { LoaderArgs, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { NavLink, useLoaderData } from '@remix-run/react';
import NewTask from '~/components/NewTask';
import { getTaskListItemsByWhen } from '~/models/task.server';
import * as paths from '~/paths';
import { requireUserId } from '~/session.server';

export const meta: MetaFunction = () => ({
	title: 'Upcoming',
});

export async function loader({ request }: LoaderArgs) {
	const userId = await requireUserId(request);
	const taskListItems = await getTaskListItemsByWhen({ userId, when: 'specificDate' });
	return json({ taskListItems });
}

export default function InboxPage() {
	const data = useLoaderData<typeof loader>();

	return (
		<>
			<NewTask key={data.taskListItems.length} defaultWhen="specificDate" />

			{data.taskListItems.length === 0 ? (
				<InboxIcon className="p-4" />
			) : (
				<ol>
					{data.taskListItems.map((task) => (
						<li key={task.id}>
							<NavLink
								className={({ isActive }) => `block border-b p-4 text-xl ${isActive ? 'bg-white' : ''}`}
								to={paths.task({ taskId: task.id })}>
								📝 {task.title}
							</NavLink>
						</li>
					))}
				</ol>
			)}
		</>
	);
}
