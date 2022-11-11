import type { ActionArgs } from '@remix-run/server-runtime';
import { redirect } from '@remix-run/server-runtime';
import invariant from 'tiny-invariant';
import { updateTaskStatus } from '~/models/task.server';
import * as paths from '~/paths';

const ALLOWED_INTENTS = ['markTaskAsComplete', 'markTaskAsIncomplete', 'markTaskAsCancelled'];

export async function action({ request }: ActionArgs) {
	const data = await request.formData();
	const taskId = data.get('taskId');
	invariant(typeof taskId === 'string' && taskId.length > 0, 'taskId not found');

	const intent = data.get('intent');
	invariant(typeof intent === 'string', 'must provide an intent');
	invariant(ALLOWED_INTENTS.includes(intent), `intent must be one of the following: ${ALLOWED_INTENTS.join(',')}`);

	const status = data.get('status') ?? 'false';
	invariant(typeof status === 'string', 'must provide status');

	const redirectTo = data.get('redirectTo') ?? paths.inbox({});
	invariant(typeof redirectTo === 'string', 'redirectTo must a string');

	await updateTaskStatus({ id: taskId, status });
	return redirect(redirectTo);
}
