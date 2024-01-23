export async function POST({ request, cookies }) {
	return fetch('http://192.168.0.152:8000/test', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
	});
}
