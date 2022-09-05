import type { ActionArgs, LoaderArgs, MetaFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Form, NavLink, useCatch, useLoaderData } from '@remix-run/react';
import invariant from 'tiny-invariant';
import NewTask from '~/components/NewTask';
import { deleteArea, getArea } from '~/models/area.server';
import * as paths from '~/paths';
import { requireUserId } from '~/session.server';

// todo: figure out how to type this
export const meta: MetaFunction = ({ data }) => ({
	title: `${data.area.title}`,
});

export async function loader({ request, params }: LoaderArgs) {
	const userId = await requireUserId(request);
	invariant(params.areaId, 'areaId not found');

	const area = await getArea({ userId, id: params.areaId });
	if (!area) {
		throw redirect(paths.inbox({}));
	}
	return json({ area });
}

export async function action({ request, params }: ActionArgs) {
	const userId = await requireUserId(request);
	invariant(params.areaId, 'areaId not found');

	await deleteArea({ userId, id: params.areaId });

	return redirect(paths.inbox({}));
}

export default function AreaDetailsPage() {
	const data = useLoaderData<typeof loader>();

	return (
		<div>
			<div className="flex items-center">
				<h3 className="text-2xl font-bold">{data.area.title}</h3>

				<Form method="post" className="ml-8">
					<button
						type="submit"
						className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400">
						Delete
					</button>
				</Form>
			</div>

			<hr className="my-4" />

			<NewTask key={data.area.tasks.length} defaultWhen="anytime" areaId={data.area.id} />

			<ol>
				{data.area.Project.map((project) => (
					<li key={project.id}>
						<NavLink
							className={({ isActive }) => `block border-b p-4 text-xl ${isActive ? 'bg-white' : ''}`}
							to={paths.project({ projectId: project.id })}>
							📝 {project.title}
						</NavLink>
					</li>
				))}
			</ol>

			<ol>
				{data.area.tasks.map((task) => (
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
