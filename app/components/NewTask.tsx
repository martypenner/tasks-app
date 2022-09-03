import type { Task } from '@prisma/client';
import { Form, useActionData, useLocation } from '@remix-run/react';
import * as React from 'react';
import { useKey, useKeyPressEvent } from 'react-use';
import type { newTaskAction } from '~/actions';
import * as paths from '~/paths';

type Props = {
	defaultWhen?: Task['when'];
	projectId?: Task['projectId'];
	areaId?: Task['areaId'];
};

export default function NewTask({ defaultWhen = 'inbox', projectId, areaId }: Props) {
	const actionData = useActionData<typeof newTaskAction>();
	const titleRef = React.useRef<HTMLInputElement>(null);
	const notesRef = React.useRef<HTMLTextAreaElement>(null);
	const whenRef = React.useRef<HTMLSelectElement>(null);

	const [isNewTaskVisible, setIsNewTaskVisible] = React.useState(false);
	const [notes, setNotes] = React.useState('');

	const location = useLocation();

	// Prevent holding space scrolling the page. We can't do this in
	// `useKeyPressEvent`.
	useKey(
		' ',
		(event) => {
			if (isNewTaskVisible) {
				return;
			}

			event.preventDefault();
			event.stopPropagation();
		},
		{ event: 'keydown' },
		[isNewTaskVisible]
	);
	// We want to respond only once to the event.
	useKeyPressEvent(' ', () => {
		setIsNewTaskVisible(true);
	});

	// We want to respond only once to the event.
	useKeyPressEvent('Escape', () => {
		setIsNewTaskVisible(false);
	});

	React.useEffect(() => {
		if (!isNewTaskVisible) {
			return;
		}

		if (actionData?.errors?.title) {
			titleRef.current?.focus();
		} else if (actionData?.errors?.notes) {
			notesRef.current?.focus();
		} else if (actionData?.errors?.when) {
			whenRef.current?.focus();
		}
	}, [actionData, isNewTaskVisible]);

	if (!isNewTaskVisible) {
		return null;
	}

	return (
		<Form method="post" action={paths.newTask({})} className="flex w-full flex-col gap-2">
			{/* Provide a return URL */}
			<input type="hidden" name="redirectTo" value={location.pathname} />

			{projectId != null && <input type="hidden" name="projectId" value={projectId} />}
			{areaId != null && <input type="hidden" name="areaId" value={areaId} />}

			<div>
				<input
					ref={titleRef}
					name="title"
					autoFocus
					placeholder="New To-Do"
					className="flex w-full rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
					aria-invalid={actionData?.errors?.title ? true : undefined}
					aria-errormessage={actionData?.errors?.title ? 'title-error' : undefined}
				/>
				{actionData?.errors?.title && (
					<div className="pt-1 text-red-700" id="title-error">
						{actionData.errors.title}
					</div>
				)}
			</div>

			<div>
				<textarea
					ref={notesRef}
					name="notes"
					// todo: cross-platform line breaks
					placeholder="Notes"
					rows={Math.max(2, notes.split('\n').length ?? 2)}
					value={notes}
					onChange={(event) => setNotes(event.target.value)}
					className="flex w-full flex-1 rounded-md border-2 border-blue-500 py-2 px-3 text-lg leading-6"
					aria-invalid={actionData?.errors?.notes ? true : undefined}
					aria-errormessage={actionData?.errors?.notes ? 'notes-error' : undefined}
				/>
				{actionData?.errors?.notes && (
					<div className="pt-1 text-red-700" id="notes-error">
						{actionData.errors.notes}
					</div>
				)}
			</div>

			<div>
				<label className="flex w-full flex-col gap-1">
					<span>When</span>

					{/* <Select.Root name="when" defaultValue="inbox">
						<Select.Trigger>
							<Select.Value />
							<Select.Icon />
						</Select.Trigger>

						<Select.Portal>
							<Select.Content ref={whenRef}>
								<Select.ScrollUpButton />

								<Select.Viewport>
									<Select.Item value="inbox">
										<Select.ItemText>Inbox</Select.ItemText>
										<Select.ItemIndicator>
											<InboxIcon />
										</Select.ItemIndicator>
									</Select.Item>
									<Select.Item value="Trash">
										<Select.ItemText>Trash</Select.ItemText>
										<Select.ItemIndicator>
											<TrashIcon />
										</Select.ItemIndicator>
									</Select.Item>
								</Select.Viewport>

								<Select.ScrollDownButton />
							</Select.Content>
						</Select.Portal>
					</Select.Root> */}
					<select name="when" ref={whenRef} defaultValue={defaultWhen}>
						<option value="inbox">Inbox</option>
						<option value="today">Today</option>
						<option value="thisEvening">This evening</option>
						<option value="specificDate">Specific date</option>
						<option value="someday">Someday</option>
						<option value="anytime">Anytime</option>
						{/* For later */}
						{/* <option value="reminder">+ Reminder</option> */}
					</select>
				</label>
				{actionData?.errors?.when && (
					<div className="pt-1 text-red-700" id="when-error">
						{actionData.errors.when}
					</div>
				)}
			</div>

			<div className="text-right">
				<button type="submit" className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400">
					Save
				</button>
			</div>

			<hr />
		</Form>
	);
}
