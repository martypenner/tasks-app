import type { EntryContext, Headers } from '@remix-run/node';
import { Response } from '@remix-run/node';
import { RemixServer } from '@remix-run/react';
import isbot from 'isbot';
import { renderToPipeableStream } from 'react-dom/server';
import { PassThrough } from 'stream';

const ABORT_DELAY = 5000;

// https://github.com/prisma/studio/issues/614#issuecomment-795213237
// @ts-expect-error
BigInt.prototype.toJSON = function () {
	return this.toString();
};

export default function handleRequest(
	request: Request,
	responseStatusCode: number,
	responseHeaders: Headers,
	remixContext: EntryContext
) {
	const callbackName = isbot(request.headers.get('user-agent')) ? 'onAllReady' : 'onShellReady';

	return new Promise((resolve, reject) => {
		let didError = false;

		// deepcode ignore OR: remix's problem, not ours
		const { pipe, abort } = renderToPipeableStream(<RemixServer context={remixContext} url={request.url} />, {
			[callbackName]() {
				let body = new PassThrough();

				responseHeaders.set('Content-Type', 'text/html;charset=UTF-8');

				resolve(
					new Response(body, {
						status: didError ? 500 : responseStatusCode,
						headers: responseHeaders,
					})
				);
				pipe(body);
			},
			onShellError(err: unknown) {
				reject(err);
			},
			onError(error: unknown) {
				didError = true;
				console.error(error);
			},
		});
		// deepcode ignore CodeInjection: coming from remix server
		setTimeout(abort, ABORT_DELAY);
	});
}
