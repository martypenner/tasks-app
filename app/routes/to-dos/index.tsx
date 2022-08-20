import { Link } from '@remix-run/react';

export default function TodoIndexPage() {
	return (
		<p>
			No to-do selected. Select a to-do on the left, or{' '}
			<Link to="new" className="text-blue-500 underline">
				create a new to-do.
			</Link>
		</p>
	);
}
