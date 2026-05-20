import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getEvidencePhoto } from '$lib/server/blobs';

export const GET: RequestHandler = async (event) => {
	if (!event.locals.user) {
		error(401, 'Unauthorized');
	}

	const photoKey = event.params.key;
	if (!photoKey) {
		error(404, 'Not found');
	}

	const photo = await getEvidencePhoto(photoKey);
	if (!photo) {
		error(404, 'Not found');
	}

	return new Response(photo.data, {
		headers: {
			'Content-Type': photo.contentType,
			'Cache-Control': 'private, max-age=3600'
		}
	});
};
