import { Form, useLocation } from '@remix-run/react';
import type { Task } from '~/models/task.server';
import * as paths from '~/paths';

type Props = JSX.IntrinsicElements['div'] & {
	task: Omit<Task, 'whenDate' | 'completedDate' | 'createdAt' | 'updatedAt' | 'deleted'> & {
		whenDate: string | null;
		completedDate: string | null;
		deleted: string | null;
	};
};

export default function TaskView({ task, ...rest }: Props) {
	const location = useLocation();

	return (
		<div className={`block p-4 text-xl ${rest.className ?? ''}`}>
			<div className="flex items-center">
				<span>{task.title}</span>

				<Form method="post" className="ml-8" action={paths.updateTaskStatus({})}>
					<input type="hidden" name="taskId" value={task.id} />
					<input type="hidden" name="status" value={task.status === 'completed' ? 'in-progress' : 'completed'} />
					<input type="hidden" name="redirectTo" value={location.pathname} />

					<button
						type="submit"
						className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
						name="intent"
						value={task.status === 'completed' ? 'markTaskAsIncomplete' : 'markTaskAsComplete'}>
						{task.status === 'completed' ? 'Mark as not done' : 'Complete'}
					</button>
				</Form>
				<Form method="post" className="ml-2" action={paths.updateTaskStatus({})}>
					<input type="hidden" name="taskId" value={task.id} />
					<input type="hidden" name="status" value={task.status === 'cancelled' ? 'in-progress' : 'cancelled'} />
					<input type="hidden" name="redirectTo" value={location.pathname} />

					<button
						type="submit"
						className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
						name="intent"
						value={task.status === 'completed' ? 'markTaskAsIncomplete' : 'markTaskAsCancelled'}>
						{task.status === 'cancelled' ? 'Mark as not done' : 'Cancel'}
					</button>
				</Form>

				{task.deleted == null && (
					<Form method="post" className="ml-2" action={paths.deleteTask({})}>
						<input type="hidden" name="taskId" value={task.id} />
						<input type="hidden" name="redirectTo" value={location.pathname} />

						<button
							type="submit"
							className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400">
							Delete
						</button>
					</Form>
				)}
			</div>
		</div>
	);
}
