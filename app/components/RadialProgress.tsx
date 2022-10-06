export type Props = JSX.IntrinsicElements['svg'] & {
	progress: number;
};

function RadialProgress({ progress, className = '', ...rest }: Props) {
	const strokeWidth = 24;
	const half = Math.floor(strokeWidth / 2);
	const max = Math.floor(2 * 3.14 * half);
	const convertedProgress = (progress / 100) * max;
	const clampedProgress = Math.floor(Math.min(convertedProgress, Math.max(convertedProgress, 0, 100)));

	return (
		// Thanks,
		// https://www.smashingmagazine.com/2015/07/designing-simple-pie-charts-with-css/
		// and
		// https://blog.logrocket.com/build-svg-circular-progress-component-react-hooks/
		<svg
			viewBox={`0 0 ${strokeWidth} ${strokeWidth}`}
			className={`mr-3 h-6 w-6 flex-shrink-0 -rotate-90 rounded-full border-2 border-blue-500 bg-gray-800 p-0.5 ${className}`}
			{...rest}>
			<circle
				r={half}
				cx={half}
				cy={half}
				className="fill-gray-800 stroke-blue-500 stroke-[24px]"
				style={{
					strokeDasharray: `${clampedProgress} ${max}`,
				}}
			/>
		</svg>
	);
}

export default RadialProgress;
