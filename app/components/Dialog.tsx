import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Fragment } from 'react';

const Title = (props: DialogPrimitive.DialogTitleProps) => {
	return <DialogPrimitive.Title asChild {...props} />;
};
const Description = (props: DialogPrimitive.DialogDescriptionProps) => {
	return <DialogPrimitive.Description asChild {...props} />;
};

function Content({ ...props }: DialogPrimitive.DialogContentProps) {
	return (
		<Fragment>
			<DialogPrimitive.Overlay className="fixed inset-0" />
			<DialogPrimitive.Content {...props} />
		</Fragment>
	);
}

// Exports
export const Dialog = Object.assign(DialogPrimitive.Root, {
	Trigger: DialogPrimitive.Trigger,
	Title,
	Description,
	Content,
	Close: DialogPrimitive.Close,
});
