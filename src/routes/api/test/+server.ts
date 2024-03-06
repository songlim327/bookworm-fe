import { API_HOST } from '$env/static/private'

export async function POST() {
	return fetch(`${API_HOST}/test`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
	});
}
