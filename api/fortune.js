const axios = require('axios');

export default async function (req, res) {
    const { age, profession, futureGoal, category } = req.body;
    const apiKey = process.env.OPENAI_API_KEY; // Secured API key stored in Vercel Environment Variables

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
                },
            }
        );

        const fortune = response.data.choices[0].text.trim();
        res.status(200).json({ fortune });
    } catch (error) {
        console.error('Error calling OpenAI API:', error);
        res.status(500).json({ error: 'Failed to generate fortune' });
    }
}
