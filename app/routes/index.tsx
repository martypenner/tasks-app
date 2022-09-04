import { redirect } from '@remix-run/server-runtime';
import * as paths from '~/paths';

export async function loader() {
	return redirect(paths.inbox({}));
}
