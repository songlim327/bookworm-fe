import { API_HOST } from '$env/static/private'

export async function POST({ fetch, request }) {
	const message = await request.json();

	return fetch(`${API_HOST}/query`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(message)
	});
}
