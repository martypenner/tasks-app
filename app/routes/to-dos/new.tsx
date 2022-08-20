import type { ActionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';
import * as React from 'react';

import { createTodo } from '~/models/todo.server';
import { requireUserId } from '~/session.server';

export async function action({ request }: ActionArgs) {
	const userId = await requireUserId(request);

	const formData = await request.formData();
	const title = formData.get('title');
	const notes = formData.get('notes');

	if (typeof title !== 'string' || title.length === 0) {
		return json({ errors: { title: 'Title is required', notes: null } }, { status: 400 });
	}

	if (typeof notes !== 'string') {
		return json({ errors: { title: null, notes: 'Notes must be text' } }, { status: 400 });
	}

	const todo = await createTodo({ title, notes, userId });

	return redirect(`/to-dos/${todo.id}`);
}

export default function NewTodoPage() {
	const actionData = useActionData<typeof action>();
	const titleRef = React.useRef<HTMLInputElement>(null);
	const notesRef = React.useRef<HTMLTextAreaElement>(null);

	React.useEffect(() => {
		if (actionData?.errors?.title) {
			titleRef.current?.focus();
		} else if (actionData?.errors?.notes) {
			notesRef.current?.focus();
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

			<div className="text-right">
				<button type="submit" className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400">
					Save
				</button>
			</div>
		</Form>
	);
}
