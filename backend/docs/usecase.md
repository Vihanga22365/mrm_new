# Use Case Description

The chatbot is an intelligent, AI-powered virtual assistant designed to provide 24/7 self-service for retail banking customers. It goes beyond simple FAQs to perform complex transactional tasks—such as fund transfers, card management, and personalized financial insights—using natural language conversation. It seamlessly integrates with the bank’s core systems to provide real-time, context-aware support across mobile, web, and voice channels

# Business Objective

1. Operational Efficiency: Reduce call center volume by automating 70-80% of routine inquiries (L1 support)
2. Customer Experience: Provide instant resolutions and 24/7 availability, leading to a 15-20% increase in Net Promoter Score (NPS).
3.Cost Optimization: Lower the cost per interaction from ~$5.00 (human agent) to <$0.50 (AI agent).
4.Revenue Growth: Use personalized insights to proactively recommend relevant products (e.g., credit card upgrades or high-yield savings accounts)

# Target Users

Primary: Existing retail banking customers (Checking, Savings, Credit Card holders).
Secondary: Prospective customers inquiring about loan rates or account opening requirements.
Internal: Customer Support Agents (using the "Agent Assist" feature to handle complex handovers with full context).

# Domain
Industry: Financial Services / Banking.
Domain: Retail Banking & Digital CX.

# AIMLTechnique Used
The Kore.ai XO Platform employs a Multi-Engine NLP Approach:
Fundamental Meaning (FM): Deterministic model for high-precision intent matching based on keywords and patterns.
Machine Learning (ML): Probabilistic model (SVM/CRF) trained on banking utterances to handle variations in language.
Knowledge Graph (KG): Structured ontology to answer complex FAQs.
Generative AI (LLM): * RAG (Retrieval-Augmented Generation): To answer questions from unstructured policy PDFs (e.g., "What is the fee for international wire transfers?").
GenAI Node: For "free-flowing" entity collection (e.g., gathering travel dates and destinations for a travel notification without rigid forms).
Zero-Shot Intent Detection: To understand user requests for which no training data yet exists.

# Data Sources
Core Banking System (e.g., Fiserv, FIS, Jack Henry): For balances, transaction history, and account status.
CRM (e.g., Salesforce): For customer profiles and relationship history.
Internal CMS/Knowledge Base: For bank policies and product information.
External Market APIs: For real-time mortgage rates and currency exchange.

# Data Coverage Period
Real-time Data: Account balances and pending transactions.
Historical Data: Past 12–24 months of transaction history for spending analysis and disputes.\
Document Data: Current versions of "Terms and Conditions" and "Product Disclosure Statements.

# Input Variables
User Utterance: Natural language text or voice input (e.g., "Why was my card declined at Starbucks yesterday?").
Contextual Variables: User ID, Authentication Token, Device Type, Geographic Location.
Entity Data: Dates, Currency Amounts, Account Types, Payee Names.

# Output Description
Conversational Response: Natural language answers (e.g., "Your card was declined due to an incorrect CVV entry.").
Actionable UI Elements: Digital forms, buttons, or "Quick Replies" for selecting account numbers.
Transaction Execution: Real-time updates to the core banking system (e.g., "Transfer successful. Your new balance is $1,200.00.").
Agent Handoff: A summarized transcript passed to a human agent when the bot cannot resolve the issue

# Feedback Monitoring

Sentiment Analysis: Real-time tracking of user frustration; triggers automatic escalation if sentiment turns negative.
Implicit Feedback: Monitoring "Containment Rate" (did the user leave without asking for an agent?).
Explicit Feedback: CSAT/Thumbs up-down surveys post-interaction.
Kore.ai Analytics: Usage of the Analysis tab to identify "Unknown Intents" for continuous retraining.

# Deployment Environment

Cloud Infrastructure: Hybrid Cloud (AWS/Azure) with SOC2 and PC-DSS compliance.
Channels: Bank’s Mobile App (iOS/Android), Web Portal, and SMS/WhatsApp for proactive alerts.
Security: Integrated with PingID/Okta for Multi-Factor Authentication (MFA).

# Update Frequency

NLP Training: Weekly review of "failed" utterances to improve the ML model.
System Knowledge: Monthly updates for marketing offers and interest rates.
Platform Updates: Quarterly adoption of new Kore.ai XO features (e.g., new LLM model versions).

# Assumptions and Constraints

Assumptions: Customers have a valid online banking ID; the bank’s internal APIs provide <2s response times.
Constraints: Must comply with US regulations (e.g., CCPA, GLBA); GenAI outputs must be strictly "grounded" in bank data to prevent hallucinations (secured via Kore.ai guardrails); no PII (Personally Identifiable Information) is stored in the NLP logs.

