import type { ActionArgs, LoaderArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Form, NavLink, useCatch, useLoaderData } from '@remix-run/react';
import invariant from 'tiny-invariant';
import { deleteProject, getProject } from '~/models/project.server';
import * as paths from '~/paths';
import { requireUserId } from '~/session.server';

export async function loader({ request, params }: LoaderArgs) {
	const userId = await requireUserId(request);
	invariant(params.projectId, 'projectId not found');

	const project = await getProject({ userId, id: params.projectId });
	if (!project) {
		throw redirect('/tasks/inbox');
	}
	return json({ project });
}

export async function action({ request, params }: ActionArgs) {
	const userId = await requireUserId(request);
	invariant(params.projectId, 'projectId not found');

	await deleteProject({ userId, id: params.projectId });

	return redirect('/tasks/inbox');
}

export default function ProjectDetailsPage() {
	const data = useLoaderData<typeof loader>();

	return (
		<div>
			<div className="flex items-center">
				<h3 className="text-2xl font-bold">{data.project.title}</h3>

				<Form method="post" className="ml-8">
					<button
						type="submit"
						className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400">
						Delete
					</button>
				</Form>
			</div>

			<p className="py-6">{data.project.notes}</p>
			<p>Done: {data.project.done ? 'Done' : 'Not done'}</p>
			<p>When: {data.project.when}</p>
			<p>When date: {data.project.whenDate}</p>

			<hr className="my-4" />

			<ol>
				{data.project.tasks.map((task) => (
					<li key={task.id}>
						<NavLink
							className={({ isActive }) => `block border-b p-4 text-xl ${isActive ? 'bg-white' : ''}`}
							to={paths.task({ taskId: task.id })}>
							📝 {task.title}
						</NavLink>
					</li>
				))}
			</ol>
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
