import { ActionArgs, json, redirect } from '@remix-run/server-runtime';
import { createTask } from './models/task.server';
import { allTasks } from './paths';
import { requireUserId } from './session.server';

export async function newTaskAction({ request }: ActionArgs) {
	const userId = await requireUserId(request);

	const formData = await request.formData();
	const title = formData.get('title');
	const notes = formData.get('notes');
	const when = formData.get('when');
	const whenDate = formData.get('whenDate');
	const redirectTo = (formData.get('redirectTo') as string) ?? allTasks({});

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

	await createTask({
		title,
		notes,
		when,
		whenDate: when === 'specific' ? new Date(whenDate as string) : null,
		userId,
	});

	return redirect(redirectTo);
}
