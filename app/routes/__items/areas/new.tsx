import { ActionArgs, json, MetaFunction, redirect } from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';
import * as React from 'react';
import { createArea } from '~/models/area.server';
import * as paths from '~/paths';
import { requireUserId } from '~/session.server';

export const meta: MetaFunction = () => ({
	title: 'Create new area',
});

export async function action({ request }: ActionArgs) {
	const userId = await requireUserId(request);

	const formData = await request.formData();
	const title = formData.get('title');

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

	const area = await createArea({
		title,
		userId,
	});

	return redirect(paths.area({ areaId: area.id }));
}

export default function NewAreaPage() {
	const actionData = useActionData<typeof action>();
	const titleRef = React.useRef<HTMLInputElement>(null);

	React.useEffect(() => {
		if (actionData?.errors?.title) {
			titleRef.current?.focus();
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

			<div className="text-right">
				<button type="submit" className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400">
					Save
				</button>
			</div>
		</Form>
	);
}
