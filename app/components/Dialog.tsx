import { blackA, mauve } from '@radix-ui/colors';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { keyframes, styled } from '@stitches/react';
import { Fragment } from 'react';

const overlayShow = keyframes({
	'0%': { opacity: 0 },
	'100%': { opacity: 1 },
});

const contentShow = keyframes({
	'0%': { opacity: 0, transform: 'translate(-50%, -48%) scale(.96)' },
	'100%': { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
});

const StyledOverlay = styled(DialogPrimitive.Overlay, {
	backgroundColor: blackA.blackA9,
	position: 'fixed',
	inset: 0,
	'@media (prefers-reduced-motion: no-preference)': {
		animation: `${overlayShow} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
	},
});

const StyledContent = styled(DialogPrimitive.Content, {
	backgroundColor: 'white',
	borderRadius: 6,
	boxShadow: 'hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px',
	position: 'fixed',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: '90vw',
	maxWidth: '450px',
	maxHeight: '85vh',
	padding: 25,
	'@media (prefers-reduced-motion: no-preference)': {
		animation: `${contentShow} 150ms cubic-bezier(0.16, 1, 0.3, 1)`,
	},
	'&:focus': { outline: 'none' },
});

function Content({ ...props }: DialogPrimitive.DialogContentProps) {
	return (
		<Fragment>
			<StyledOverlay />
			<StyledContent {...props} />
		</Fragment>
	);
}

const StyledTitle = styled(DialogPrimitive.Title, {
	margin: 0,
	fontWeight: 500,
	color: mauve.mauve12,
	fontSize: 17,
});
const Title = (props: DialogPrimitive.DialogTitleProps) => {
	return <StyledTitle asChild {...props} />;
};

const StyledDescription = styled(DialogPrimitive.Description, {
	margin: '10px 0 20px',
	color: mauve.mauve11,
	fontSize: 15,
	lineHeight: 1.5,
});

// Exports
export const Dialog = Object.assign(DialogPrimitive.Root, {
	Trigger: DialogPrimitive.Trigger,
	Content,
	Title,
	Description: StyledDescription,
	Close: DialogPrimitive.Close,
});