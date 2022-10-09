import type { LoaderArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Form, useCatch, useLoaderData, useLocation } from '@remix-run/react';
import invariant from 'tiny-invariant';
import * as paths from '~/paths';

import { getTask } from '~/models/task.server';
import { requireUserId } from '~/session.server';

export async function loader({ request, params }: LoaderArgs) {
	const userId = await requireUserId(request);
	invariant(params.taskId, 'taskId not found');

	const task = await getTask({ userId, id: params.taskId });
	if (!task) {
		throw redirect(paths.inbox({}));
	}
	return json({ task });
}

export default function TaskDetailsPage() {
	const data = useLoaderData<typeof loader>();
	const location = useLocation();

	return (
		<div>
			<div className="flex items-center">
				<h3 className="text-2xl font-bold">{data.task.title}</h3>

				<Form method="post" className="ml-8" action={paths.updateTaskStatus({})}>
					<input type="hidden" name="taskId" value={data.task.id} />
					<input type="hidden" name="status" value={data.task.status === 'completed' ? 'in-progress' : 'completed'} />
					<input type="hidden" name="redirectTo" value={location.pathname} />

					<button
						type="submit"
						className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
						name="intent"
						value={data.task.status === 'completed' ? 'markTaskAsIncomplete' : 'markTaskAsComplete'}>
						{data.task.status === 'completed' ? 'Mark as not done' : 'Complete'}
					</button>
				</Form>
				<Form method="post" className="ml-2" action={paths.updateTaskStatus({})}>
					<input type="hidden" name="taskId" value={data.task.id} />
					<input type="hidden" name="status" value={data.task.status === 'cancelled' ? 'in-progress' : 'cancelled'} />
					<input type="hidden" name="redirectTo" value={location.pathname} />

					<button
						type="submit"
						className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
						name="intent"
						value={data.task.status === 'completed' ? 'markTaskAsIncomplete' : 'markTaskAsCancelled'}>
						{data.task.status === 'cancelled' ? 'Mark as not done' : 'Cancel'}
					</button>
				</Form>

				{data.task.deleted == null && (
					<Form method="post" className="ml-2" action={paths.deleteTask({})}>
						<input type="hidden" name="taskId" value={data.task.id} />

						<button
							type="submit"
							className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400">
							Delete
						</button>
					</Form>
				)}
			</div>

			<p className="py-6">{data.task.notes}</p>
			<p>Status: {data.task.status}</p>
			<p>When: {data.task.when}</p>
			<p>When date: {data.task.whenDate}</p>
			<p>Completed on: {data.task.completedDate}</p>
		</div>
	);
}

export function ErrorBoundary({ error }: { error: Error }) {
	console.error(error);

	return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary() {
	const caught = useCatch();

	if (caught.status === 404) {
		return <div>Task not found</div>;
	}

	throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
