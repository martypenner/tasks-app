import { ActionArgs, json, redirect } from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';
import * as React from 'react';
import { createProject } from '~/models/project.server';

import { requireUserId } from '~/session.server';

export async function action({ request }: ActionArgs) {
	const userId = await requireUserId(request);

	const formData = await request.formData();
	const title = formData.get('title');
	const notes = formData.get('notes');
	const when = formData.get('when');
	const whenDate = formData.get('whenDate');

	if (typeof title !== 'string' || title.length === 0) {
		return json(
			{
				errors: {
					title: 'Title is required',
					notes: null,
					when: null,
					whenDate: null,
				},
			},
			{ status: 400 }
		);
	}

	if (typeof notes !== 'string') {
		return json(
			{
				errors: {
					notes: 'Notes must be text.',
					title: null,
					when: null,
					whenDate: null,
				},
			},
			{ status: 400 }
		);
	}

	if (typeof when !== 'string' || title.length === 0) {
		return json(
			{
				errors: {
					title: null,
					notes: null,
					when: 'When is required',
					whenDate: null,
				},
			},
			{ status: 400 }
		);
	}
	const validWhen = ['inbox', 'today', 'thisEvening', 'anytime', 'someday', 'specificDate'];
	if (!validWhen.includes(when)) {
		return json(
			{
				errors: {
					title: null,
					notes: null,
					when: `When must be one of the following: ${validWhen.join(', ')}`,
					whenDate: null,
				},
			},
			{ status: 400 }
		);
	}

	if (when === 'specific' && (typeof whenDate !== 'string' || whenDate.length === 0)) {
		return json(
			{
				errors: {
					title: null,
					notes: null,
					when: null,
					whenDate: '`When date` is required when `when` is specific',
				},
			},
			{ status: 400 }
		);
	}

	const project = await createProject({
		title,
		notes,
		when,
		whenDate: when === 'specific' ? new Date(whenDate as string) : null,
		userId,
	});

	return redirect(`/projects/${project.id}`);
}

export default function NewProjectPage() {
	const actionData = useActionData<typeof action>();
	const titleRef = React.useRef<HTMLInputElement>(null);
	const notesRef = React.useRef<HTMLTextAreaElement>(null);
	const whenRef = React.useRef<HTMLSelectElement>(null);

	React.useEffect(() => {
		if (actionData?.errors?.title) {
			titleRef.current?.focus();
		} else if (actionData?.errors?.notes) {
			notesRef.current?.focus();
		} else if (actionData?.errors?.when) {
			whenRef.current?.focus();
		}
	}, [actionData]);

	return (
		<Form
			method="post"
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: 8,
				width: '100%',
			}}>
			<div>
				<label className="flex w-full flex-col gap-1">
					<span>Title</span>
					<input
						ref={titleRef}
						name="title"
						className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
						aria-invalid={actionData?.errors?.title ? true : undefined}
						aria-errormessage={actionData?.errors?.title ? 'title-error' : undefined}
					/>
				</label>
				{actionData?.errors?.title && (
					<div className="pt-1 text-red-700" id="title-error">
						{actionData.errors.title}
					</div>
				)}
			</div>

			<div>
				<label className="flex w-full flex-col gap-1">
					<span>Notes</span>
					<textarea
						ref={notesRef}
						name="notes"
						rows={8}
						className="w-full flex-1 rounded-md border-2 border-blue-500 py-2 px-3 text-lg leading-6"
						aria-invalid={actionData?.errors?.notes ? true : undefined}
						aria-errormessage={actionData?.errors?.notes ? 'notes-error' : undefined}
					/>
				</label>
				{actionData?.errors?.notes && (
					<div className="pt-1 text-red-700" id="notes-error">
						{actionData.errors.notes}
					</div>
				)}
			</div>

			<div>
				<label className="flex w-full flex-col gap-1">
					<span>When</span>

					<select name="when" ref={whenRef} defaultValue="inbox">
						<option value="inbox">Inbox</option>
						<option value="thisEvening">This evening</option>
						<option value="specificDate">Specific date</option>
						<option value="someday">Someday</option>
						{/* For later */}
						{/* <option value="reminder">+ Reminder</option> */}
					</select>
				</label>
				{actionData?.errors?.when && (
					<div className="pt-1 text-red-700" id="when-error">
						{actionData.errors.when}
					</div>
				)}
			</div>

			<div className="text-right">
				<button type="submit" className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400">
					Save
				</button>
			</div>
		</Form>
	);
}
