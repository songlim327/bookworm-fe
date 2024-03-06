export async function POST({ fetch, request }) {
	const message = await request.json();

	return fetch('http://192.168.0.152:8000/query', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(message)
	});
}
