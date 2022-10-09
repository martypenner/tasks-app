import type { ActionArgs } from '@remix-run/server-runtime';
import { redirect } from '@remix-run/server-runtime';
import invariant from 'tiny-invariant';
import * as paths from '~/paths';

import { deleteTask } from '~/models/task.server';
import { requireUserId } from '~/session.server';

export async function action({ request, params }: ActionArgs) {
	const userId = await requireUserId(request);
	const data = await request.formData();
	const taskId = data.get('taskId');
	invariant(typeof taskId === 'string' && taskId.length > 0, 'taskId not found');

	await deleteTask({ userId, id: taskId });
	return redirect(paths.inbox({}));
}
