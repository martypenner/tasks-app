export default function Button(props: React.ComponentPropsWithoutRef<'button'>) {
	return (
		<button
			{...props}
			className={`rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400 ${
				props.className ?? ''
			}`}
		/>
	);
}
