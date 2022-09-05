import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seed() {
	const email = 'rachel@remix.run';

	// cleanup the existing database
	await prisma.user.delete({ where: { email } }).catch(() => {
		// no worries if it doesn't exist yet
	});

	const hashedPassword = await bcrypt.hash('racheliscool', 10);

	const user = await prisma.user.create({
		data: {
			email,
			password: {
				create: {
					hash: hashedPassword,
				},
			},
		},
	});
	const area = await prisma.area.create({
		data: {
			userId: user.id,
			title: 'My important area',
			createdAt: new Date('2020-01-01'),
			globalOrder: 0,
		},
	});
	const project = await prisma.project.create({
		data: {
			userId: user.id,
			title: 'My cool project',
			areaId: area.id,
			globalOrder: 0,
		},
	});
	const completedProject = await prisma.project.create({
		data: {
			userId: user.id,
			title: 'My completed project',
			completedDate: new Date(),
			globalOrder: 1,
		},
	});
	const deletedProject = await prisma.project.create({
		data: {
			userId: user.id,
			title: 'My deleted project',
			deleted: new Date(),
			globalOrder: 2,
		},
	});
	const heading = await prisma.heading.create({
		data: {
			userId: user.id,
			title: 'My useful heading',
			projectId: project.id,
			globalOrder: 0,
		},
	});
	const heading2 = await prisma.heading.create({
		data: {
			userId: user.id,
			title: 'My other useful heading',
			projectId: project.id,
			globalOrder: 1,
		},
	});

	await prisma.task.create({
		data: {
			title: 'My first task',
			notes: 'Hello, world!',
			status: 'completed',
			userId: user.id,
			globalOrder: 0,
		},
	});
	await prisma.task.create({
		data: {
			title: 'My second task',
			userId: user.id,
			globalOrder: 1,
		},
	});
	await prisma.task.create({
		data: {
			title: 'My third task',
			userId: user.id,
			when: 'today',
			globalOrder: 2,
		},
	});
	await prisma.task.create({
		data: {
			title: 'My fourth task',
			userId: user.id,
			when: 'specificDate',
			whenDate: new Date(`${new Date().getFullYear() + 1}-01-01`),
			globalOrder: 3,
		},
	});
	await prisma.task.create({
		data: {
			title: 'My fifth task',
			userId: user.id,
			when: 'anytime',
			globalOrder: 4,
		},
	});
	await prisma.task.create({
		data: {
			title: 'My sixth task',
			userId: user.id,
			when: 'someday',
			globalOrder: 5,
		},
	});
	await prisma.task.create({
		data: {
			title: 'My seventh task',
			userId: user.id,
			status: 'completed',
			createdAt: new Date('2020-01-01'),
			globalOrder: 6,
		},
	});
	await prisma.task.create({
		data: {
			title: 'My eighth task',
			userId: user.id,
			deleted: new Date('2020-01-01'),
			globalOrder: 7,
		},
	});
	await prisma.task.create({
		data: {
			title: 'My project task',
			userId: user.id,
			projectId: project.id,
			globalOrder: 8,
		},
	});
	await prisma.task.create({
		data: {
			title: 'My second project task',
			userId: user.id,
			projectId: project.id,
			headingId: heading.id,
			globalOrder: 9,
		},
	});
	await prisma.task.create({
		data: {
			title: 'My third project task',
			userId: user.id,
			projectId: project.id,
			headingId: heading2.id,
			globalOrder: 10,
		},
	});
	await prisma.task.create({
		data: {
			title: 'My fourth and completed project task',
			userId: user.id,
			projectId: project.id,
			headingId: heading2.id,
			status: 'completed',
			globalOrder: 11,
		},
	});
	await prisma.task.create({
		data: {
			title: 'My task in a deleted project',
			userId: user.id,
			projectId: deletedProject.id,
			status: 'completed',
			deleted: new Date(),
			globalOrder: 12,
		},
	});
	await prisma.task.create({
		data: {
			title: 'My task in a completed project',
			userId: user.id,
			projectId: completedProject.id,
			status: 'completed',
			globalOrder: 13,
		},
	});
	await prisma.task.create({
		data: {
			title: 'My area task',
			userId: user.id,
			areaId: area.id,
			createdAt: new Date('2020-01-01'),
			globalOrder: 14,
		},
	});

	console.log(`Database has been seeded. 🌱`);
}

seed()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
