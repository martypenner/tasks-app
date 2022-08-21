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

	await prisma.task.create({
		data: {
			title: 'My first task',
			notes: 'Hello, world!',
			done: true,
			userId: user.id,
		},
	});
	await prisma.task.create({
		data: {
			title: 'My second task',
			userId: user.id,
		},
	});
	await prisma.task.create({
		data: {
			title: 'My third task',
			userId: user.id,
			when: 'today',
		},
	});
	await prisma.task.create({
		data: {
			title: 'My fourth task',
			userId: user.id,
			when: 'specificDate',
			whenDate: new Date(`${new Date().getFullYear() + 1}-01-01`),
		},
	});
	await prisma.task.create({
		data: {
			title: 'My fifth task',
			userId: user.id,
			when: 'anytime',
		},
	});
	await prisma.task.create({
		data: {
			title: 'My sixth task',
			userId: user.id,
			when: 'someday',
		},
	});
	await prisma.task.create({
		data: {
			title: 'My seventh task',
			userId: user.id,
			done: true,
		},
	});
	await prisma.task.create({
		data: {
			title: 'My eighth task',
			userId: user.id,
			deleted: new Date(),
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
