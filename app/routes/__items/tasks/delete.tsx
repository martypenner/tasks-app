import type { ActionArgs } from '@remix-run/server-runtime';
import { redirect } from '@remix-run/server-runtime';
import invariant from 'tiny-invariant';

import { deleteTask } from '~/models/task.server';

export async function action({ request }: ActionArgs) {
	const data = await request.formData();
	const taskId = data.get('taskId');
	invariant(typeof taskId === 'string' && taskId.length > 0, 'taskId not found');

	const redirectTo = (data.get('redirectTo') as string) ?? request.url;

	await deleteTask({ id: taskId });
	return redirect(redirectTo);
}
