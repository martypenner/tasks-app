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

	let globalOrder = 0;

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
			globalOrder: globalOrder++,
		},
	});
	const project = await prisma.project.create({
		data: {
			userId: user.id,
			title: 'My cool project',
			areaId: area.id,
			globalOrder: globalOrder++,
		},
	});
	const independentProject = await prisma.project.create({
		data: {
			userId: user.id,
			title: 'My independent project',
			globalOrder: globalOrder++,
		},
	});
	const completedProject = await prisma.project.create({
		data: {
			userId: user.id,
			title: 'My completed project',
			completedDate: new Date(),
			globalOrder: globalOrder++,
		},
	});
	const deletedProject = await prisma.project.create({
		data: {
			userId: user.id,
			title: 'My deleted project',
			deleted: new Date(),
			globalOrder: globalOrder++,
		},
	});
	const heading = await prisma.heading.create({
		data: {
			userId: user.id,
			title: 'My useful heading',
			projectId: project.id,
			globalOrder: globalOrder++,
		},
	});
	const heading2 = await prisma.heading.create({
		data: {
			userId: user.id,
			title: 'My other useful heading',
			projectId: project.id,
			globalOrder: globalOrder++,
		},
	});
	const heading3 = await prisma.heading.create({
		data: {
			userId: user.id,
			title: 'My archived heading',
			projectId: project.id,
			archived: new Date(),
			globalOrder: globalOrder++,
		},
	});
	await prisma.heading.create({
		data: {
			userId: user.id,
			title: 'My empty archived heading',
			projectId: project.id,
			archived: new Date(),
			globalOrder: globalOrder++,
		},
	});

	await prisma.task.create({
		data: {
			title: 'My first task',
			notes: 'Hello, world!',
			status: 'completed',
			completedDate: new Date(),
			userId: user.id,
			globalOrder: globalOrder++,
		},
	});
	await prisma.task.create({
		data: {
			title: 'My second task',
			userId: user.id,
			globalOrder: globalOrder++,
		},
	});
	await prisma.task.create({
		data: {
			title: 'My third task',
			userId: user.id,
			when: 'today',
			globalOrder: globalOrder++,
		},
	});
	await prisma.task.create({
		data: {
			title: 'My fourth task',
			userId: user.id,
			when: 'specificDate',
			whenDate: new Date(`${new Date().getFullYear() + 1}-01-01`),
			globalOrder: globalOrder++,
		},
	});
	await prisma.task.create({
		data: {
			title: 'My fifth task',
			userId: user.id,
			when: 'anytime',
			globalOrder: globalOrder++,
		},
	});
	await prisma.task.create({
		data: {
			title: 'My sixth task',
			userId: user.id,
			when: 'someday',
			globalOrder: globalOrder++,
		},
	});
	await prisma.task.create({
		data: {
			title: 'My seventh task',
			userId: user.id,
			status: 'completed',
			completedDate: new Date(),
			createdAt: new Date('2020-01-01'),
			globalOrder: globalOrder++,
		},
	});
	await prisma.task.create({
		data: {
			title: 'My eighth task',
			userId: user.id,
			deleted: new Date('2020-01-01'),
			globalOrder: globalOrder++,
		},
	});
	await prisma.task.create({
		data: {
			title: 'My project task',
			userId: user.id,
			projectId: project.id,
			globalOrder: globalOrder++,
		},
	});
	await prisma.task.create({
		data: {
			title: 'My second project task',
			userId: user.id,
			projectId: project.id,
			headingId: heading.id,
			globalOrder: globalOrder++,
		},
	});
	await prisma.task.create({
		data: {
			title: 'My third project task',
			userId: user.id,
			projectId: project.id,
			headingId: heading2.id,
			globalOrder: globalOrder++,
		},
	});
	await prisma.task.create({
		data: {
			title: 'My fourth and completed project task',
			userId: user.id,
			projectId: project.id,
			headingId: heading2.id,
			status: 'completed',
			completedDate: new Date(),
			globalOrder: globalOrder++,
		},
	});
	await prisma.task.create({
		data: {
			title: 'My fifth and completed project task',
			userId: user.id,
			projectId: project.id,
			status: 'completed',
			completedDate: new Date(),
			globalOrder: globalOrder++,
		},
	});
	await prisma.task.create({
		data: {
			title: 'My sixth and completed project task',
			userId: user.id,
			projectId: project.id,
			headingId: heading3.id,
			status: 'completed',
			completedDate: new Date(),
			globalOrder: globalOrder++,
		},
	});
	await prisma.task.create({
		data: {
			title: 'My task in a deleted project',
			userId: user.id,
			projectId: deletedProject.id,
			status: 'completed',
			completedDate: new Date(),
			deleted: new Date(),
			globalOrder: globalOrder++,
		},
	});
	await prisma.task.create({
		data: {
			title: 'My task in a completed project',
			userId: user.id,
			projectId: completedProject.id,
			status: 'completed',
			completedDate: new Date(),
			globalOrder: globalOrder++,
		},
	});
	await prisma.task.create({
		data: {
			title: 'My area task',
			userId: user.id,
			areaId: area.id,
			createdAt: new Date('2020-01-01'),
			globalOrder: globalOrder++,
		},
	});
	await prisma.task.create({
		data: {
			title: 'My completed area task',
			userId: user.id,
			areaId: area.id,
			status: 'completed',
			completedDate: new Date(),
			globalOrder: globalOrder++,
		},
	});
	await prisma.task.create({
		data: {
			title: 'My first independent project task',
			userId: user.id,
			projectId: independentProject.id,
			status: 'completed',
			completedDate: new Date(),
			globalOrder: globalOrder++,
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
