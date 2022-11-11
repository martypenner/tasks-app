import { InboxIcon } from '@heroicons/react/24/outline';
import type { LoaderArgs, MetaFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Fragment } from 'react';
import { List } from '~/components/List';
import NewTask from '~/components/NewTask';
import TaskView from '~/components/TaskView';
import { getTaskListItemsByWhen } from '~/models/task.server';

export const meta: MetaFunction = () => ({
	title: 'Upcoming',
});

export async function loader({ request }: LoaderArgs) {
	const taskListItems = await getTaskListItemsByWhen({ when: 'specificDate' });
	return json({ taskListItems });
}

export default function InboxPage() {
	const data = useLoaderData<typeof loader>();

	return (
		<Fragment>
			<NewTask key={data.taskListItems.length} defaultWhen="specificDate" />

			{data.taskListItems.length === 0 ? (
				<InboxIcon className="p-4" />
			) : (
				<List aria-label="List of upcoming tasks" items={data.taskListItems}>
					{(task) => (
						<List.Item textValue={task.title}>
							<TaskView task={task} />
						</List.Item>
					)}
				</List>
			)}
		</Fragment>
	);
}
