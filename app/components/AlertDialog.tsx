import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';

function Trigger({ ...props }: AlertDialogPrimitive.DialogTriggerProps) {
	return <AlertDialogPrimitive.Trigger asChild {...props} />;
}

function Content({ children, ...props }: AlertDialogPrimitive.AlertDialogContentProps) {
	return (
		<AlertDialogPrimitive.Portal>
			<AlertDialogPrimitive.Overlay className="fixed inset-0 z-30 bg-black/40" />

			<AlertDialogPrimitive.Content
				{...props}
				className={`fixed top-1/2 left-1/2 z-30 max-h-[85vh] w-[90vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-6 shadow-xl focus:outline-none ${props.className}`}>
				{children}
			</AlertDialogPrimitive.Content>
		</AlertDialogPrimitive.Portal>
	);
}

function Title({ ...props }: AlertDialogPrimitive.AlertDialogTitleProps) {
	return (
		<AlertDialogPrimitive.Title
			{...props}
			className={`m-0 text-base font-medium text-[color:#1a1523] ${props.className}`}
		/>
	);
}

function Description({ ...props }: AlertDialogPrimitive.AlertDialogDescriptionProps) {
	return (
		<AlertDialogPrimitive.Description {...props} className={`mb-5 text-sm text-[color:#6f6e77] ${props.className}`} />
	);
}

function Cancel({ ...props }: AlertDialogPrimitive.AlertDialogCancelProps) {
	return <AlertDialogPrimitive.Cancel asChild {...props} />;
}

function Action({ ...props }: AlertDialogPrimitive.AlertDialogActionProps) {
	return <AlertDialogPrimitive.Action asChild {...props} />;
}

// Exports
export const AlertDialog = Object.assign(AlertDialogPrimitive.Root, {
	Trigger,
	Content,
	Title,
	Description,
	Cancel,
	Action,
});
