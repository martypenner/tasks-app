import { InboxIcon } from '@heroicons/react/24/outline';
import type { LoaderArgs, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Fragment } from 'react';
import NewTask from '~/components/NewTask';
import TaskView from '~/components/TaskView';
import { getTaskListItemsByWhen } from '~/models/task.server';
import { requireUserId } from '~/session.server';

export const meta: MetaFunction = () => ({
	title: 'Today',
});

export async function loader({ request }: LoaderArgs) {
	const userId = await requireUserId(request);
	const taskListItems = await getTaskListItemsByWhen({ userId, when: 'today' });
	return json({ taskListItems });
}

export default function InboxPage() {
	const data = useLoaderData<typeof loader>();

	return (
		<Fragment>
			<NewTask key={data.taskListItems.length} defaultWhen="today" />

			{data.taskListItems.length === 0 ? (
				<InboxIcon className="p-4" />
			) : (
				<ol>
					{data.taskListItems.map((task) => (
						<li key={task.id}>
							<TaskView task={task} />
						</li>
					))}
				</ol>
			)}
		</Fragment>
	);
}
