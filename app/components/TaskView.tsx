import type { NavLinkProps } from '@remix-run/react';
import { NavLink } from '@remix-run/react';
import type { Task } from '~/models/task.server';
import * as paths from '~/paths';

type Props = {
	task: Pick<Task, 'id' | 'title'> & {
		completedDate: string | null;
	};
} & Omit<NavLinkProps, 'to'>;

export default function TaskView({ task, ...rest }: Props) {
	return (
		<NavLink
			{...rest}
			className={({ isActive }) => `block p-4 text-xl ${isActive ? 'bg-white' : ''} ${rest.className}`}
			to={paths.task({ taskId: task.id })}>
			{task.completedDate && <span>{task.completedDate}</span>} <span>{task.title}</span>
		</NavLink>
	);
}
