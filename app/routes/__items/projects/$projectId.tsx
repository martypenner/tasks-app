import type { Heading, Task } from '@prisma/client';
import type { ActionArgs, LoaderArgs, MetaFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Form, NavLink, useCatch, useLoaderData } from '@remix-run/react';
import invariant from 'tiny-invariant';
import NewTask from '~/components/NewTask';
import { convertHeadingToProject, deleteProject, getProject } from '~/models/project.server';
import * as paths from '~/paths';
import { requireUserId } from '~/session.server';

// todo: figure out how to type this
export const meta: MetaFunction = ({ data }) => ({
	title: `${data.project.title}`,
});

export async function loader({ request, params }: LoaderArgs) {
	const userId = await requireUserId(request);
	invariant(params.projectId, 'projectId not found');

	const project = await getProject({ userId, id: params.projectId });
	if (!project) {
		throw redirect('/tasks/inbox');
	}

	// Initialize the map with the default "heading" so it's first in the order
	const groupedTasksByHeading = new Map<Heading | null, Task[]>([[null, []]]);
	for (const task of project.tasks) {
		groupedTasksByHeading.set(task.Heading, (groupedTasksByHeading.get(task.Heading) ?? []).concat(task));
	}

	return json({
		project,
		groupedTasks: Array.from(groupedTasksByHeading),
	});
}

export async function action({ request, params }: ActionArgs) {
	const userId = await requireUserId(request);
	invariant(params.projectId, 'projectId not found');

	const data = await request.formData();
	const intent = data.get('intent');
	invariant(typeof intent === 'string', 'must provide an intent');

	if (intent === 'deleteProject') {
		await deleteProject({ userId, id: params.projectId });
	} else if (intent === 'convertToProject') {
		const headingId = data.get('headingId');
		invariant(typeof headingId === 'string', 'headingId not found');

		const project = await convertHeadingToProject({ userId, id: headingId });
		return redirect(paths.project({ projectId: project.id }));
	}

	return redirect(paths.inbox({}));
}

export default function ProjectDetailsPage() {
	const data = useLoaderData<typeof loader>();

	return (
		<div>
			<div className="flex items-center">
				<h3 className="text-2xl font-bold">{data.project.title}</h3>

				{data.project.deleted == null && (
					<Form method="post" className="ml-8">
						<input type="hidden" name="projectId" value={data.project.id} />

						<button
							type="submit"
							className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
							name="intent"
							value="deleteProject">
							Delete
						</button>
					</Form>
				)}
			</div>

			<p className="py-6">{data.project.notes}</p>
			<p>Done: {data.project.done ? 'Done' : 'Not done'}</p>
			<p>When: {data.project.when}</p>
			<p>When date: {data.project.whenDate}</p>

			<hr className="my-4" />

			<NewTask key={data.project.tasks.length} defaultWhen="anytime" projectId={data.project.id} />

			<ol>
				{data.groupedTasks.map(([heading, tasks]) => (
					<li key={heading?.id ?? 'default'}>
						{heading != null && (
							<div className="mt-8 mb-4 flex items-center border-b-2 border-b-blue-500 pb-2">
								<h4 className="text-xl">{heading.title}</h4>

								<Form method="post" className="ml-8">
									<input type="hidden" name="headingId" value={heading.id} />

									<button
										type="submit"
										className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
										name="intent"
										value="convertToProject">
										Convert to project
									</button>
								</Form>
							</div>
						)}

						<ol>
							{tasks.map((task) => (
								<li key={task.id}>
									<NavLink
										className={({ isActive }) => `block p-4 text-xl ${isActive ? 'bg-white' : ''}`}
										to={paths.task({ taskId: task.id })}>
										📝 {task.title}
									</NavLink>
								</li>
							))}
						</ol>
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
