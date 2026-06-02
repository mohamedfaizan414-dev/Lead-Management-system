const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function summarizeNotes(req, res) {
    try {
        const { notes } = req.body;
        if (!notes || notes.length === 0) {
            return res.status(400).json({ message: "No notes to summarize" });
        }

      
        

        
        const chatCompletion = await groq.chat.completions.create({
           
            model: 'llama-3.3-70b-specdec',
            max_tokens: 512,
            temperature: 0.3,
            messages: [{
                role: 'user',
                content: `Summarize the following sales lead notes in 3-4 sentences. Focus on key interactions, current status, and next steps:\n\n${notes}`
            }]
        });

        
        const summary = chatCompletion.choices[0].message.content;
        
        res.status(200).json({ summary });
    } catch (err) {
        res.status(500).json({ message: "AI service failed", error: err.message });
    }
}

module.exports = { summarizeNotes };