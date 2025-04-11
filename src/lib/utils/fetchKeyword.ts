export async function fetchKeyword(): Promise<string> {
	let keyword: string;
	try {
		const response = await fetch(`http://localhost:8000/config/keyword`, {
			method: 'GET'
		});
		if (!response.ok) {
			throw new Error(`HTTP error ${response.status}`);
		}
		keyword = await response.text();
		return keyword;
	} catch (error) {
		console.error('Error fetching keyword:', error);
		return 'Failed to fetch keyword. Is the go server running?';
	}
}
