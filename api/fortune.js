const axios = require('axios');

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
        // No need to parse JSON, Vercel functions automatically parse it
        const { age, profession, futureGoal, category } = req.body;
        const apiKey = process.env.OPENAI_API_KEY;

        if (!age || !profession || !futureGoal || !category) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const prompt = `Give a personalized fortune for a ${age}-year-old ${profession} focused on ${category}. They want to see themselves in 5 years as ${futureGoal}.`;

        try {
            const response = await axios.post(
                'https://api.openai.com/v1/completions',
                {
                    model: 'text-davinci-003',
                    prompt: prompt,
                    max_tokens: 150,
                },
                {
                    headers: {
                        Authorization: `Bearer ${apiKey}`,
                        'Content-Type': 'application/json',
                    }
                }
            );

            const fortune = response.data.choices[0].text.trim();
            res.setHeader('Access-Control-Allow-Origin', '*'); // Allow cross-origin requests
            res.status(200).json({ fortune });
        } catch (error) {
            console.error('Error during API call:', error.response ? error.response.data : error.message);
            res.status(500).json({ error: 'Failed to generate fortune. Please check logs for more details.' });
        }
    } else {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
