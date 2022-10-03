import type { Heading, Task } from '@prisma/client';
import type { ActionArgs, LoaderArgs, MetaFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Form, useCatch, useFetcher, useLoaderData } from '@remix-run/react';
import { Fragment, useState } from 'react';
import invariant from 'tiny-invariant';
import { AlertDialog } from '~/components/AlertDialog';
import Button from '~/components/Button';
import NewTask from '~/components/NewTask';
import TaskView from '~/components/TaskView';
import {
	archiveHeading,
	convertHeadingToProject,
	deleteProject,
	getProject,
	toggleProjectComplete,
} from '~/models/project.server';
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
		throw redirect(paths.inbox({}));
	}

	// Initialize the map with the default "heading" so it's first in the order
	const groupedTasksByHeading = new Map<Heading | null, Task[]>([[null, []]]);
	for (const task of project.tasks.filter((task) => (project.deleted == null ? task.deleted == null : true))) {
		// Find the heading instead of setting it based on task.Heading so we have referential stability
		const heading = project.Headings.find((heading) => heading.id === task.Heading?.id) ?? null;
		groupedTasksByHeading.set(
			task.Heading?.archived ? null : heading,
			(groupedTasksByHeading.get(heading) ?? []).concat(task)
		);
	}

	return json({
		project,
		groupedTasks: Array.from(groupedTasksByHeading),
		doneTasks:
			project.deleted != null || project.completedDate != null
				? []
				: project.tasks.filter((task) => task.status !== 'in-progress').filter((task) => task.deleted == null),
		outstandingTasks: project.tasks
			.filter((task) => task.status === 'in-progress')
			.filter((task) => task.deleted == null),
	});
}

export async function action({ request, params }: ActionArgs) {
	const userId = await requireUserId(request);
	const { projectId } = params;
	invariant(projectId, 'projectId not found');

	const data = await request.formData();
	const intent = data.get('intent');
	invariant(typeof intent === 'string', 'must provide an intent');

	if (intent === 'deleteProject') {
		await deleteProject({ userId, id: projectId });
	} else if (['markProjectAsComplete', 'markProjectAsIncomplete'].includes(intent)) {
		const completedDate = data.get('completedDate') ?? '';
		const tasksIntent = data.get('tasksIntent') ?? '';
		invariant(typeof completedDate === 'string', 'must provide completedDate');

		await toggleProjectComplete({
			userId,
			id: projectId,
			completedDate: completedDate.length === 0 ? new Date() : null,
			taskStatus: tasksIntent === 'markAsComplete' ? 'completed' : 'cancelled',
		});
		return json({});
	} else if (intent === 'convertToProject') {
		const headingId = data.get('headingId');
		invariant(typeof headingId === 'string', 'headingId not found');

		const project = await convertHeadingToProject({ userId, id: headingId });
		return redirect(paths.project({ projectId: project.id }));
	} else if (intent === 'archive') {
		const headingId = data.get('headingId');
		invariant(typeof headingId === 'string', 'headingId not found');

		await archiveHeading({ userId, id: headingId });
		return redirect(paths.project({ projectId }));
	}

	return redirect(paths.inbox({}));
}

export default function ProjectDetailsPage() {
	const data = useLoaderData<typeof loader>();
	const [showLoggedItems, setShowLoggedItems] = useState(false);

	const [showCompletionConfirmation, setShowCompletionConfirmation] = useState(false);
	const toggleComplete = useFetcher();

	return (
		<div>
			<div className="flex items-center">
				<h3 className="text-2xl font-bold">{data.project.title}</h3>

				<toggleComplete.Form
					method="post"
					className="ml-8"
					onSubmit={(event) => {
						if (data.outstandingTasks.length > 0 && data.project.completedDate == null) {
							event.preventDefault();
							setShowCompletionConfirmation(true);
						} else {
							setShowCompletionConfirmation(false);
						}
					}}>
					<input type="hidden" name="completedDate" value={data.project.completedDate ?? ''} />

					<Button
						type="submit"
						name="intent"
						value={data.project.completedDate == null ? 'markProjectAsComplete' : 'markProjectAsIncomplete'}>
						{data.project.completedDate == null ? 'Complete' : 'Mark as not done'}
					</Button>
				</toggleComplete.Form>

				<AlertDialog open={showCompletionConfirmation}>
					<AlertDialog.Content>
						<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
						<AlertDialog.Description>
							There {data.outstandingTasks.length === 1 ? 'is' : 'are'} still {data.outstandingTasks.length} to-do
							{data.outstandingTasks.length === 1 ? '' : 's'} in this project that you haven’t completed. What would you
							like to do with {data.outstandingTasks.length === 1 ? 'it' : 'them'}?
						</AlertDialog.Description>

						<div className="flex justify-between">
							<AlertDialog.Cancel>
								<Button className="mr-6" onClick={() => setShowCompletionConfirmation(false)}>
									Cancel
								</Button>
							</AlertDialog.Cancel>

							<div className="flex">
								<toggleComplete.Form method="post" onSubmit={() => setShowCompletionConfirmation(false)}>
									<input type="hidden" name="completedDate" value={data.project.completedDate ?? ''} />
									<input type="hidden" name="tasksIntent" value="markAsComplete" />

									<AlertDialog.Action>
										<Button type="submit" className="mr-1" name="intent" value="markProjectAsComplete">
											Mark as Completed
										</Button>
									</AlertDialog.Action>
								</toggleComplete.Form>
								<toggleComplete.Form method="post" onSubmit={() => setShowCompletionConfirmation(false)}>
									<input type="hidden" name="completedDate" value={data.project.completedDate ?? ''} />
									<input type="hidden" name="tasksIntent" value="markAsCancelled" />

									<AlertDialog.Action>
										<Button type="submit" name="intent" value="markProjectAsComplete">
											Mark as Canceled
										</Button>
									</AlertDialog.Action>
								</toggleComplete.Form>
							</div>
						</div>
					</AlertDialog.Content>
				</AlertDialog>

				{data.project.deleted == null && (
					<Form method="post" className="ml-2">
						<input type="hidden" name="projectId" value={data.project.id} />

						<Button type="submit" name="intent" value="deleteProject">
							Delete
						</Button>
					</Form>
				)}
			</div>

			<p className="py-6">{data.project.notes}</p>
			<p>Done: {data.project.completedDate != null ? 'Done' : 'Not done'}</p>
			<p>When: {data.project.when}</p>
			<p>When date: {data.project.whenDate}</p>
			<p>Completed on: {data.project.completedDate}</p>

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

									<Button type="submit" name="intent" value="convertToProject">
										Convert to project
									</Button>

									{/* Allow archiving headings with no active tasks */}
									{tasks.filter((task) => task.completedDate == null).length === 0 && (
										<Button type="submit" className="ml-2" name="intent" value="archive">
											Archive
										</Button>
									)}
								</Form>
							</div>
						)}

						<ol>
							{tasks
								.filter((task) =>
									data.project.deleted != null || data.project.completedDate != null
										? true
										: task.status === 'in-progress'
								)
								.map((task) => (
									<li key={task.id}>
										<TaskView task={task} className={task.status === 'cancelled' ? 'line-through' : ''} />
									</li>
								))}
						</ol>
					</li>
				))}
			</ol>

			{data.doneTasks.length > 0 && (
				<Fragment>
					<button type="button" className="mt-4" onClick={() => setShowLoggedItems(!showLoggedItems)}>
						{showLoggedItems
							? `Hide logged item${data.doneTasks.length === 1 ? '' : 's'}`
							: `Show ${data.doneTasks.length} logged item${data.doneTasks.length === 1 ? '' : 's'}`}
					</button>
					{showLoggedItems && (
						<ol>
							{data.doneTasks.map((task) => (
								<li key={task.id}>
									<TaskView task={task} />
								</li>
							))}
						</ol>
					)}
				</Fragment>
			)}
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
