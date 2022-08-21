import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Form, useCatch, useLoaderData } from '@remix-run/react';
import invariant from 'tiny-invariant';

import { deleteTask, getTask } from '~/models/task.server';
import { requireUserId } from '~/session.server';

export async function loader({ request, params }: LoaderArgs) {
	const userId = await requireUserId(request);
	invariant(params.taskId, 'taskId not found');

	const task = await getTask({ userId, id: params.taskId });
	if (!task) {
		throw redirect('/tasks/inbox');
	}
	return json({ task });
}

export async function action({ request, params }: ActionArgs) {
	const userId = await requireUserId(request);
	invariant(params.taskId, 'taskId not found');

	const task = await getTask({ userId, id: params.taskId });
	invariant(task, 'Task not found');

	await deleteTask(task);

	return redirect('/tasks/inbox');
}

export default function TaskDetailsPage() {
	const data = useLoaderData<typeof loader>();

	return (
		<div>
			<h3 className="text-2xl font-bold">{data.task.title}</h3>
			<p className="py-6">{data.task.notes}</p>
			<p>Done: {data.task.done ? 'Done' : 'Not done'}</p>
			<p>When: {data.task.when}</p>
			<p>When date: {data.task.whenDate}</p>
			<hr className="my-4" />
			<Form method="post">
				<button type="submit" className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400">
					Delete
				</button>
			</Form>
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
