import { getStore } from '@netlify/blobs';
import { env } from '$env/dynamic/private';

const STORE_NAME = 'evidence-photos';
export const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp']);

const EXT_BY_MIME: Record<string, string> = {
	'image/jpeg': 'jpg',
	'image/png': 'png',
	'image/webp': 'webp'
};

function evidencePhotoStore() {
	const siteID = env.NETLIFY_SITE_ID ?? env.SITE_ID;
	const token = env.NETLIFY_AUTH_TOKEN ?? env.NETLIFY_API_TOKEN;

	if (siteID && token) {
		return getStore({ name: STORE_NAME, siteID, token });
	}

	return getStore(STORE_NAME);
}

export function buildPhotoUrl(origin: string, photoKey: string): string {
	const encoded = photoKey
		.split('/')
		.map((segment) => encodeURIComponent(segment))
		.join('/');
	return `${origin}/evidence-photos/${encoded}`;
}

export function validateEvidencePhoto(file: File): string | null {
	if (!file || file.size === 0) {
		return 'Photo is required';
	}
	if (file.size > MAX_PHOTO_BYTES) {
		return 'Photo must be 5 MB or smaller';
	}
	if (!ALLOWED_MIME.has(file.type)) {
		return 'Photo must be JPEG, PNG, or WebP';
	}
	return null;
}

export async function uploadEvidencePhoto(
	userId: string,
	file: File
): Promise<{ photoKey: string; contentType: string }> {
	const validationError = validateEvidencePhoto(file);
	if (validationError) {
		throw new Error(validationError);
	}

	const ext = EXT_BY_MIME[file.type] ?? 'bin';
	const photoKey = `${userId}/${crypto.randomUUID()}.${ext}`;

	const store = evidencePhotoStore();
	await store.set(photoKey, await file.arrayBuffer(), {
		metadata: { contentType: file.type }
	});

	return { photoKey, contentType: file.type };
}

export async function deleteEvidencePhoto(photoKey: string): Promise<void> {
	if (!photoKey) return;
	try {
		const store = evidencePhotoStore();
		await store.delete(photoKey);
	} catch {
		// Best-effort cleanup for MVP
	}
}

export async function getEvidencePhoto(photoKey: string): Promise<{
	data: Blob;
	contentType: string;
} | null> {
	const store = evidencePhotoStore();
	const entry = await store.getWithMetadata(photoKey, { type: 'blob' });

	if (!entry?.data) {
		return null;
	}

	const contentType =
		typeof entry.metadata?.contentType === 'string'
			? entry.metadata.contentType
			: 'application/octet-stream';

	return { data: entry.data, contentType };
}
