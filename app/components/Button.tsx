import { useRef } from 'react';
import type { AriaButtonProps } from 'react-aria';
import { useButton } from 'react-aria';

export default function Button(props: AriaButtonProps<'button'>) {
	let ref = useRef(null);
	let { buttonProps } = useButton(props, ref);

	return (
		<button
			{...buttonProps}
			ref={ref}
			className={`rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400 ${
				// @ts-expect-error
				props.className ?? ''
			}`}
			{...props}
		/>
	);
}
