export default async function (req, res) {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Credentials', true);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.status(200).end();
        return;
    }

    if (req.method === 'POST') {
        let body;
        try {
            // Body should be parsed here
            body = JSON.parse(req.body);
        } catch (error) {
            console.error('Error parsing JSON body:', error);
            return res.status(400).json({ error: 'Invalid JSON payload' });
        }

        const { age, profession, futureGoal, category } = body;
        if (!age || !profession || !futureGoal || !category) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // ... your OpenAI API request code here ...

    } else {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
