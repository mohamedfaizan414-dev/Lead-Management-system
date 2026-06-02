const Groq = require('groq-sdk');

// Initialize the Groq client using your environment variable
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function summarizeNotes(req, res) {
    try {
        const { notes } = req.body;
        if (!notes || notes.length === 0) {
            return res.status(400).json({ message: "No notes to summarize" });
        }

        // Format the chronological notes array into a clean string block
        const notesText = notes.map((n, i) => `${i + 1}. ${n.content}`).join('\n');

        // Create the chat completion payload via Groq
        const chatCompletion = await groq.chat.completions.create({
            // Using a flagship, active model optimized for fast summarization
            model: 'llama-3.3-70b-specdec',
            max_tokens: 512,
            temperature: 0.3, // Lower temperature keeps summaries professional and factual
            messages: [{
                role: 'user',
                content: `Summarize the following sales lead notes in 3-4 sentences. Focus on key interactions, current status, and next steps:\n\n${notesText}`
            }]
        });

        // Extract the generated text cleanly from the Groq response array
        const summary = chatCompletion.choices[0].message.content;
        
        res.status(200).json({ summary });
    } catch (err) {
        res.status(500).json({ message: "AI service failed", error: err.message });
    }
}

module.exports = { summarizeNotes };