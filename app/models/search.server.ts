import type { Heading } from '@prisma/client';
import { prisma } from '~/db.server';
import type { Area } from './area.server';
import type { Project } from './project.server';
import type { Task } from './task.server';

export async function search({ query }: { query: string }) {
	let results: {
		tasks: Task[];
		projects: Project[];
		areas: Area[];
		headings: Heading[];
	} = {
		tasks: await prisma.task.findMany({
			where: {
				OR: [{ title: { contains: query } }, { notes: { contains: query } }],
			},
			orderBy: { globalOrder: 'desc' },
		}),
		projects: await prisma.project.findMany({
			where: {
				OR: [{ title: { contains: query } }, { notes: { contains: query } }],
			},
			orderBy: { globalOrder: 'desc' },
		}),
		areas: await prisma.area.findMany({
			where: {
				title: { contains: query },
			},
			orderBy: { globalOrder: 'desc' },
		}),
		headings: await prisma.heading.findMany({
			where: {
				title: { contains: query },
			},
			orderBy: { globalOrder: 'desc' },
		}),
	};

	return results;
}
