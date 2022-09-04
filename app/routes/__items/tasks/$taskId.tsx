import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Form, useCatch, useLoaderData } from '@remix-run/react';
import invariant from 'tiny-invariant';
import * as paths from '~/paths';

import { deleteTask, getTask, toggleTaskComplete } from '~/models/task.server';
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

	const data = await request.formData();
	const intent = data.get('intent');
	invariant(typeof intent === 'string', 'must provide an intent');

	if (intent === 'deleteTask') {
		await deleteTask({ userId, id: params.taskId });
		return redirect(paths.inbox({}));
	} else if (['markTaskAsComplete', 'markTaskAsIncomplete'].includes(intent)) {
		const done = data.get('done') ?? 'false';
		invariant(typeof done === 'string', 'must provide done');
		await toggleTaskComplete({ userId, id: params.taskId, done: JSON.parse(done) });
		return json({});
	}

	return json({});
}

export default function TaskDetailsPage() {
	const data = useLoaderData<typeof loader>();

	return (
		<div>
			<div className="flex items-center">
				<h3 className="text-2xl font-bold">{data.task.title}</h3>

				<Form method="post" className="ml-8">
					<input type="hidden" name="done" value={String(!data.task.done)} />

					<button
						type="submit"
						className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
						name="intent"
						value={data.task.done ? 'markTaskAsIncomplete' : 'markTaskAsComplete'}>
						{data.task.done ? 'Mark as not done' : 'Complete'}
					</button>
				</Form>

				{data.task.deleted == null && (
					<Form method="post" className="ml-2">
						<button
							type="submit"
							className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
							name="intent"
							value="deleteTask">
							Delete
						</button>
					</Form>
				)}
			</div>

			<p className="py-6">{data.task.notes}</p>
			<p>Done: {data.task.done ? 'Done' : 'Not done'}</p>
			<p>When: {data.task.when}</p>
			<p>When date: {data.task.whenDate}</p>
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
