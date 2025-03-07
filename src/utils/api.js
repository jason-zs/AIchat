import { useSettingsStore } from '../stores/settings'

const API_BASE_URL = 'http://192.168.10.200:5000'

const createHeaders = () => {
    const settingsStore = useSettingsStore()
    return {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${settingsStore.apiKey}`
    }
}

export const chatApi = {
    async sendMessage(messages, stream = false) {
        const settingsStore = useSettingsStore()
        
        const payload = {
            // inputs: { },
            query: messages[messages.length - 1].content,
            // response_mode: "streaming",
            // user: 'user'
            
            // parameters: {
            //     has_thoughts: true
            // },
            // debug: {}
            // model: settingsStore.model,
            // messages,
            // temperature: settingsStore.temperature,
            // max_tokens: settingsStore.maxTokens,
            // stream,
            // top_p: 0.7,
            // top_k: 50,
            // frequency_penalty: 0.5,
            // n: 1,
            // response_format: {
            //     type: "text"
            // },
            // tools: [{
            //     type: "function",
            //     function: {
            //         description: "<string>",
            //         name: "<string>",
            //         parameters: {},
            //         strict: true
            //     }
            // }]
        }

        const response = await fetch(`${API_BASE_URL}/chatbot/chat-messages`, {
            method: 'POST',
            headers: {
                ...createHeaders(),
                ...(stream && { 'Accept': 'text/event-stream' })
            },
            body: JSON.stringify(payload)
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        if (stream) {
            return response
        }

        return await response.json()
    },

    async sendAsyncMessage(messages) {
        const settingsStore = useSettingsStore()
        
        const payload = {
            model: settingsStore.model,
            messages,
            temperature: settingsStore.temperature,
            max_tokens: settingsStore.maxTokens
        }

        const response = await fetch(`${API_BASE_URL}/async/chat/completions`, {
            method: 'POST',
            headers: createHeaders(),
            body: JSON.stringify(payload)
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        return await response.json()
    },

    async getAsyncResult(taskId) {
        const response = await fetch(`${API_BASE_URL}/async-result/${taskId}`, {
            method: 'GET',
            headers: createHeaders()
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        return await response.json()
    }
} 