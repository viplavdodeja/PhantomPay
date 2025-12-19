# LiveKit AI Agent Setup for PhantomPay

## Overview

PhantomPay uses a **Twilio → LiveKit bridge** for voice calls:

1. **Twilio** dials the customer's actual phone number
2. When they answer, **Twilio streams audio** to a WebSocket endpoint
3. The WebSocket **bridges the call** to a **LiveKit room**
4. A **LiveKit AI agent** joins the room and has a real conversation with the customer

## Current Status

✅ **Implemented:**
- Twilio call initiation
- LiveKit room creation
- WebSocket endpoint for Twilio media stream bridging
- Audio stream reception from Twilio

⚠️ **Requires Deployment:**
- LiveKit AI agent to join rooms and conduct conversations

## How It Works

### 1. Call Flow

```
Customer's Phone <---> Twilio <---> WebSocket Bridge <---> LiveKit Room <---> AI Agent
```

### 2. When You Click "Ring from the Beyond"

1. Backend creates a unique LiveKit room (e.g., `debt-collection-abc123`)
2. Backend initiates Twilio call to customer's phone
3. Twilio plays: "Connecting you to our payment specialist. Please hold."
4. Twilio streams customer audio to `/twilio-stream` WebSocket
5. WebSocket receives audio and metadata (room name, invoice details)

### 3. What Happens Now

Currently, the customer is connected to a LiveKit room, but no AI agent is there yet. The WebSocket logs incoming audio but doesn't forward it to LiveKit.

## Setting Up a LiveKit AI Agent

To enable full AI conversations, you need to deploy a LiveKit agent service that:

1. Listens for new rooms being created
2. Joins the room automatically
3. Receives audio from the customer (via Twilio bridge)
4. Uses an LLM (like OpenAI's GPT-4 with voice) to understand and respond
5. Sends audio responses back through LiveKit

### Recommended Approach: LiveKit Agents SDK

Use the official [LiveKit Agents SDK](https://docs.livekit.io/agents/overview/) which provides:

- Built-in voice activity detection
- Integration with OpenAI Realtime API
- Automatic audio handling
- Room connection management

### Example Agent Setup (Python)

```python
from livekit.agents import AutoSubscribe, JobContext, WorkerOptions, cli, llm
from livekit.agents.voice_assistant import VoiceAssistant
from livekit.plugins import openai, silero

async def entrypoint(ctx: JobContext):
    # Get invoice details from room metadata
    metadata = ctx.room.metadata
    
    # Create the AI assistant with debt collection context
    assistant = VoiceAssistant(
        vad=silero.VAD.load(),
        stt=openai.STT(),
        llm=openai.LLM(
            model="gpt-4",
            instructions=f"""
            You are a polite debt collection agent calling about invoice {metadata.get('invoiceNumber')}.
            The customer owes {metadata.get('total')} which was due on {metadata.get('dueDate')}.
            Be professional, empathetic, and work to arrange payment or a payment plan.
            """
        ),
        tts=openai.TTS(),
    )
    
    # Connect to the room and start the conversation
    await ctx.connect(auto_subscribe=AutoSubscribe.AUDIO_ONLY)
    assistant.start(ctx.room)
    
    # Greet the customer
    await assistant.say(f"Hello {metadata.get('customerName')}, this is PhantomPay calling about invoice {metadata.get('invoiceNumber')}.")

if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint))
```

### Environment Variables Needed

The agent service needs:
- `LIVEKIT_URL` - Your LiveKit server URL
- `LIVEKIT_API_KEY` - Your LiveKit API key
- `LIVEKIT_API_SECRET` - Your LiveKit API secret
- `OPENAI_API_KEY` - For the AI voice model

These are already configured in your Replit environment!

## Alternative: Simple Audio Forwarding

For a simpler (but less intelligent) implementation, you could:

1. Decode Twilio's mulaw audio in the WebSocket handler
2. Forward it directly to LiveKit using the SDK
3. Play pre-recorded messages or use basic TTS

This doesn't require running a separate agent service but won't have real conversations.

## Testing

With TEST_PHONE_NUMBER set:
1. Click "Ring from the Beyond" on any invoice
2. Your test phone will ring
3. Answer the call
4. Currently: You'll hear "Connecting you to our payment specialist"
5. With agent: You'll have a real conversation with the AI

## Next Steps

1. Deploy a LiveKit agent worker (using the SDK example above)
2. The agent will automatically join rooms when calls come in
3. Customers will have real AI-powered debt collection conversations
4. Monitor conversations via LiveKit dashboard

## Resources

- [LiveKit Agents Documentation](https://docs.livekit.io/agents/)
- [LiveKit Python SDK](https://github.com/livekit/python-sdks)
- [Twilio Media Streams](https://www.twilio.com/docs/voice/twiml/stream)
- [OpenAI Realtime API](https://platform.openai.com/docs/guides/realtime)
