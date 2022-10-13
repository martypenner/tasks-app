import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { useFetcher } from '@remix-run/react';
import { useRef, useState } from 'react';
import { useKey } from 'react-use';
import { Dialog } from '~/components/Dialog';
import * as paths from '~/paths';
import { isEditingContent } from '~/utils';

type Props = {};

export default function Search(props: Props) {
	const [isDialogVisible, setIsDialogVisible] = useState(false);
	const formRef = useRef<HTMLFormElement | null>(null);
	const fetcher = useFetcher();

	useKey(
		// todo: figure out how to filter out non-essential keypresses. There is a long list: https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values#special_values
		(event) =>
			!isEditingContent(event) &&
			!isDialogVisible &&
			event.keyCode > 48 &&
			!(event.altKey || event.shiftKey || event.ctrlKey || event.metaKey),
		() => {
			setIsDialogVisible(true);
		},
		undefined,
		[isDialogVisible]
	);

	// Allow tabbing and esc to close the dialog.
	useKey(
		(event) => isDialogVisible && (event.key === 'Tab' || event.key === 'Escape'),
		() => {
			formRef.current?.reset();
			setIsDialogVisible(false);
		},
		undefined,
		[isDialogVisible]
	);

	return (
		<Dialog open={isDialogVisible} onOpenChange={setIsDialogVisible}>
			<Dialog.Content>
				<Dialog.Title className="sr-only">
					<h3>Search for anything</h3>
				</Dialog.Title>

				<fetcher.Form ref={formRef} method="post" action={paths.search({})} className="flex w-full flex-col gap-2">
					<div>
						<div className="relative w-full text-gray-400 focus-within:text-gray-600 dark:focus-within:text-gray-300">
							<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center">
								<MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />
							</div>
							<label htmlFor="search-field" className="sr-only">
								Search
							</label>
							<input
								autoFocus
								id="search-field"
								className="block h-full w-full border-transparent bg-transparent py-2 pl-8 pr-3 placeholder-gray-500 focus:border-transparent focus:placeholder-gray-400 focus:outline-none focus:ring-0 dark:placeholder-gray-400 dark:focus:placeholder-gray-500 sm:text-sm"
								placeholder="Search"
								type="search"
								name="search"
								onChange={(event) => {
									fetcher.submit(event.target.form);
								}}
							/>
						</div>
					</div>
				</fetcher.Form>

				{/* todo: show results */}
			</Dialog.Content>
		</Dialog>
	);
}
