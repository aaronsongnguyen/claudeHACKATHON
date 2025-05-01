import os

# Get API key from environment variable or use default
ANTHROPIC_API_KEY = os.getenv('ANTHROPIC_API_KEY', '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')

if not ANTHROPIC_API_KEY:
    raise ValueError("ANTHROPIC_API_KEY environment variable is not set")