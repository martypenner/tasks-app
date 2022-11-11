import type { ActionArgs } from '@remix-run/server-runtime';
import { json } from '@remix-run/server-runtime';
import invariant from 'tiny-invariant';
import { search } from '~/models/search.server';

export async function action({ request }: ActionArgs) {
	const data = await request.formData();
	const query = data.get('search');
	invariant(typeof query === 'string', 'query must be a string');

	const results = query.length === 0 ? [] : await search({ query });

	return json({ results });
}
