import { redirect } from '@remix-run/server-runtime';
import * as paths from '~/paths';

export const loader = () => {
	return redirect(paths.inbox({}));
};
