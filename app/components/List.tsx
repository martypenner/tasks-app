import type { Node } from '@react-types/shared';
import { useRef } from 'react';
import { mergeProps, useFocusRing, useGridList, useGridListItem } from 'react-aria';
import { Item, useListState } from 'react-stately';

function ListImpl<T extends object>(props: Parameters<typeof useListState<T>>[0]) {
	let state = useListState<T>(props);
	let ref = useRef(null);
	let { gridProps } = useGridList(props, state, ref);

	return (
		<ul {...gridProps} ref={ref} className="list">
			{[...state.collection].map((item) => (
				<ItemImpl key={item.key} item={item} state={state} />
			))}
		</ul>
	);
}

type ItemProps<T> = {
	item: Node<T>;
	state: ReturnType<typeof useListState>;
};

function ItemImpl<T extends object>({ item, state }: ItemProps<T>) {
	let ref = useRef(null);
	let { rowProps, gridCellProps } = useGridListItem({ node: item }, state, ref);
	// Using a more robust focus ring implementation than tailwind's.
	let { isFocusVisible, focusProps } = useFocusRing();

	return (
		<li
			{...mergeProps(rowProps, focusProps)}
			ref={ref}
			className={`${isFocusVisible ? 'bg-blue-900' : ''} rounded-md outline-none`}>
			<div {...gridCellProps}>{item.rendered}</div>
		</li>
	);
}

export const List = Object.assign(ListImpl, {
	Item,
});
