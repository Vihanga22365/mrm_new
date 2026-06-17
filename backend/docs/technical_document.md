# Kore.ai Documentation

# Virtual Assistants Overview

## Introduction

Communication has been the essence of life from the beginning of time. Traditionally, conversations were restricted to verbal and textual interaction between humans. These interactions were usually guided by emotions, context, and awareness of previous conversations.

With the advent of computers, interactions have expanded to include machines i.e. human-machine interactions. The transitions from a command-based interface to a Graphical User Interface (GUI) to a Conversational User Interface (CUI) became natural and need-based, making communication easier.

Further enhancements facilitated the emergence of Artificial Intelligence (AI) that can process natural language (NLP). In turn, AI has contributed to Conversational Virtual Assistants that understand human communication, derive a task from this understanding and extract the information they require in order to execute this task.

AI-driven, NLP-based chat, and voice Conversational Virtual Assistants are the latest in technology and a must for contemporary enterprises.

## What are Conversational Assistants?

A Conversational Virtual Assistant (VA) acts as an intelligent intermediary between people, digital systems, and internet-enabled things. It replaces the traditional Graphical User Interfaces (GUIs) of an application or website with a Conversational User Interface (CUI). It is a paradigm shift from the earlier communications achieved either by entering syntax-specific commands or clicking icons.

These Virtual Assistants are designed to converse with users through a combination of natural language-based conversations. Responses can come in the form of text, links, buttons, calendars, or other widgets that accelerate the speed with which a user can respond.

AI-powered messaging solutions or Conversational Virtual Assistants serve as the stepping stone to the future. They communicate with intelligent virtual agents, organization apps, websites, social media platforms, and messenger platforms. Users can interact with such assistants using voice or text to access information, complete tasks, and execute transactions.

## Why Add a Conversational Virtual Assistant to Your Business?

In a nutshell, such an assistant can significantly reduce the amount of time and labor required to maintain specific business processes. Here is what a Conversational VA can achieve:

- Talk to people, systems and internet-enabled things,
- Perform omnichannel communication through voice and text, using natural language,
- Understand natural language, including domain-specific,
- Learn from its interactions and apply this learning in future conversations,
- Handle multi-turn conversations,
- Apply context to improve communication,
- Handle task interruptions and accomplish what users want.

## How Do Conversational Virtual Assistants Work?

A Conversational Virtual Assistant works by analyzing what users say, to detect their goals and extract the information required in order to achieve that goal.

Let's take a look at the key components and the core process that enable a Virtual Assistant to fulfill its functions.

### **The Key Components**

Whatever the user says is considered an Utterance. The main task of the Conversational VA is to analyze the utterance and extract the intent, and entities essential to carry a conversation.

An Intent is the user's intention and usually comes in the form of a verb or noun within the user utterance.  

Entities are a collection of data or information that the VA requires to complete the task which is identified in the user intent. They can be fields, data or words that the developer designates as necessary for the VA to complete a task. Entities can either be part of a user utterance, but the VA might also need to prompt the user to provide them. An Entity can be of any type; for instance: name, location, date, time, etc.

For example, let us consider the following message that a user sends to the Virtual Assistant:

_I want to fly to London this weekend._

- The entire sentence represents the Utterance;
- "I want to fly" is the Intent;
- "London" and "this weekend" form the values for the Entities representing "Destination" and "Travel Date" respectively. As you can notice, the "Source" entity value is missing and in such a case, the VA needs to ask the user where they want to fly from.

### **The Core Process**

In order for a Conversational Virtual Assistant to work as intended, it has to simultaneously perform the following three processes:

- Detect the user's Intent: Understand what the user wants
- Extract Entities: Obtain specific information from the user, in order to accomplish what the user wants;
- Execute the Dialog Task: Participate in the conversation process in order to accomplish what the user wants.

## Building Intelligent Conversational Virtual Assistants

Virtual Assistants are not smart by default. They are designed to show some level of artificial intelligence by leveraging technologies such as machine learning, big data, natural language processing, etc. However, a Virtual Assistant is only intelligent when it can understand user needs, perspectives or context, and responds according to the user's mood or emotion. This is only achievable through training and interaction with users, over a period of time. Below are a few suggestions that may help you increase your VA's level of intelligence.

### **Build a Rich Collection of Intents and Entities**

The key for a Conversational Virtual Assistant to understand humans is its ability to identify human intentions (Intents), extract relevant information Entities) from utterances and map the relevant action/task against those utterances (Dialog Task execution). This is achievable using [Natural Language Processing](https://developer.kore.ai/docs/bots/chatbot-overview/nlp-guide/) (NLP), which you can train according to your organization's needs.

### **Develop Conversations**

Managing dialogs to keep track of multiple conversation threads, remember the context, and respond to the user tone or sentiment provides the much-needed humane touch to the conversation. At the same time, this serves the user with accurate and appropriate responses, ensuring a positive experience.

### **Build a Knowledge Graph**

In addition, having a Knowledge Graph gives the VA the ability to respond to frequently asked questions that return static responses. Building such knowledge collections is an attempt to represent entities, ideas, and events with all their interdependent properties and relations according to a system of categories. This structured categorization of data helps the VA to answer user queries effectively and with ease.

# Natural Language Processing (NLP)

## Prerequisites

Key NLP concepts such as utterance, intent, or dialog task are discussed in the [Virtual Assistants Overview](https://developer.kore.ai/docs/bots/chatbot-overview/chatbot-overview/).

## Introduction

Conversational VAs are all about enabling a machine to have natural conversations with users. The key for a conversational VA to understand human interactions lies in its ability to identify the user's intention (Intent Detection), extract useful information (Entity Extraction), and map them to relevant actions or tasks (Dialog Task execution).

NLP is the science of deducing the intention and related information from natural conversations. The conversation flow in Kore.ai virtual assistants passes through various Natural Language Understanding (NLU) engines and conversation engines before the VA decides upon action and response.

This article provides an overview of the NLP flow within a Kore.ai virtual assistant and shows how you, as a developer, can leverage its features to build an efficient and accurate VA.

## Kore.ai's NLP Approach

The Kore.ai Experience Optimization (XO) Platform employs a multi-engine approach to natural language, which combines the following three models for optimal outcomes:

- **Fundamental Meaning (FM):** A computational linguistics approach that is built on ChatScript. The model analyzes the structure of a user's utterance to identify each word by meaning, position, conjugation, capitalization, plurality, and other factors;
- **Machine Learning (ML):** Kore.ai uses state-of-the-art NLP algorithms and models for machine learning to enable VAs to be trained and to gradually improve their intelligence;
- **Knowledge Graph Engine (KG):** The Knowledge Graph helps you turn your static FAQ text into an intelligent and personalized conversational experience.

With its three-fold approach, the Kore.ai XO Platform enables you to accelerate the Natural Language Understanding (NLU) performance of the virtual assistant and achieve optimal accuracy with relatively less training data. Kore.ai automatically enables the trained NLP capabilities to all built-in and custom VAs, and powers the way they communicate, understand, and respond to a user request.

## NLP Building Blocks

When a virtual assistant built on the Kore.ai XO Platform receives a user utterance, it is processed to identify the user intent, extract any additional information (entities), and then answer the user via a task execution. NLP is mostly concerned with the first two - intent detection and entity extraction.

### Steps in a Conversation Flow

The Conversation Flow involves going through the following steps:

- **NLP Analysis**: The user utterance goes through a series of NLP engines for entity extraction and intent detection. (You can extend the out-of-the-box NLP functionality to use your own engine. You can install the [Bot Kit SDK](https://developer.kore.ai/docs/bots/sdks/using-the-botkit-sdk/) and easily integrate the virtual assistant with any 3rd party NLP engine. The output from the 3rd party NLP engine complements the outputs from Kore.ai thus adding to the efficiency and accuracy of the engine.) The engines provided by the Kore.ai XO Platform are as follows:
  - **Fundamental Meaning Engine** which breaks up the utterances based on the grammar constructs;
  - **Machine Learning Engine** which classifies individual words in the utterance, using an example-based, auto-learning training process;
  - **Knowledge Collection Engine** which mostly deals with FAQ type user queries. It can also be configured to trigger tasks in response to the user query;
  - **Traits Engine** which is a multiclass classifier and can identify multiple categories in user utterances thus aiding in refining user intent detection;
  - **Small Talk Engine** which adds human flavor to the conversations;
  - **Ranking and Resolver** to score the results from the above engines and rank them according to the set business rules, with the purpose of deciding on the winning intent.
- **Task Execution**: The winning intent along with the entities extracted then passes through the conversation engine for the actual task execution. This engine maintains the state or context of the conversation with information like user details, the previous intents requested by the user, and any other information as tagged by the business rules. This helps provide a near-human conversation experience. The conversation engine uses this state information along with the following conditions to accept or reject the intent identified by the NLU engines
  - **Pre-conditions** - if an intent has a set of predefined conditions configured and if any of these conditions are not satisfied the winning intent is then rejected. For example, a _booking payment_ intent should have the _payee_ details available.
  - **Negative patterns** capture the presence of a pattern that should not identify a particular intent. For example "_I lost my bag, how do I retrieve it_" should, not assume that the user wants to be provided with information about baggage, and instead attempt to track their bag, based on the presence of the phrase "lost my bag"
  - **Event handling** - events defined for a welcome message, sentiment analysis, etc
- **Interruptions handling**: Other conditions such as Interruption settings (to handle situations where another intent is identified during the course of an ongoing task) or Sentiment Analysis settings (user sounds angry and hence should be transferred to an agent) are crucial for the action to be taken.
- **Response Generation**: A response is generated and presented to the user based on the channel of interaction. The response could be a success message, information as requested by the user, prompt for missing information or message concerning their transfer to a human agent.

### NLP Training

In the previous section, we have seen the NLP process of the Kore.ai virtual assistant, but it needs some training on your part to ensure that the process proceeds as per your requirements. So, how do you train a fully functional VA to achieve the best results? How do you make maximum use of the features above?

We will see some basic guidelines for NLP training in this section, before going into the details of each of the NLU engines.

#### The NLP Training Process

Morphology is the underlying principle behind NLP. Morphology is the study of words, how they are formed, and their relationship to other words in the same language. It analyzes the structure of words and parts of words, such as stems, root words, prefixes, and suffixes. Morphology also looks at parts of speech, intonation, and stress, and the ways the context can change a word's pronunciation and meaning.

Based on this, a user utterance undergoes the following preprocessing before an attempt at entity extraction and intent detection:

- **Tokenization** - Splitting of utterances into sentences (Sentence tokenization) and Splitting of Sentence(s) into words. Kore.ai NLP uses TreeBank Tokenizer for English. Each language might have its own tokenizer
- **toLower()** - Convert all the text into lower (Not done for German, since the word meaning changes based on the case). This process is done only by ML and KG engines.
- **StopWord removal** - Each language has its own set of stop words that can be edited by the developer. Removes words that may not contribute to improving the learning. This process is done only in ML and KG engines. This setting is optional, but is disabled by default.
- **Lemmatization or Stemming** depending on the language
  - **Stemming** - Retains the stem of the word like "Working"->" work", "Running"->" Run", "housing"->"hous". It basically cuts the words. The output word may not be a valid language word
  - **Lemmatization** - Converts the word to its base form using the dictionary. Like in earlier examples "Working"->" work", "Running"->" Run" however,  "housing"->" house".
- **N-grams** - Helps in combining co-occurring words. For example, "New York City" and "Internet Explorer". Each word has its own meaning. But when we take tri-gram in the first case and bi-gram in the second case, it actually results in a more meaningful word. N-grams also help in getting some context before or after a word.

#### Scoping

The first step in NLP training is to define the scope of the VA, narrowing down the problem the Virtual Assistant will need to solve. This helps in configuring the various training nuances you will require. This involves brainstorming sessions with various stakeholders like SMEs/BAs, Conversation Experience Designers, VA Developers, NLP Analysts/Data Engineers, NLP Trainers, and Testers.

The basic guidelines we suggest to keep in mind while scoping the VA are the following:

- **Start with a problem to solve** - get a clear idea of what the VA is supposed to accomplish. Talk to business analysts and VA developers to understand the requirements and the actual functionality of the Virtual Assistant.
- **Create a list of Intents -** this will streamline the entire process
  - - For each intent, identify the key results that the VA is aiming to accomplish;
      - The focus should be on the needs of the user, not the platform requirements.
- **Detail out example conversations -** both user utterances and responses
  - - Create user personas and think about the conversations they might engage in with your VA.
      - Think through edge cases, follow-ups, and clarifying questions;
      - You can leverage the Storyboard feature of the platform if it has not been already used for the VA development phase.
- **Brainstorm what an end user might ask as part of achieving their intent -** these would be the alternate utterances for every intent. Try to also include idioms and slang.

### Kore.ai's NLU Engines and When to Use Them

We have seen above that the Kore.ai XO Platform offers three main engines for NLU:

- Machine Learning (ML)
- Fundamental Meaning (FM)
- Knowledge Collection  / Knowledge Graph (KG)

When do you use each engine? Each of these engines has settings and configurations. Our article on [Optimizing NLP to Improve VA Performance](https://developer.kore.ai/docs/bots/nlp/optimizing-bots/) discusses this in more detail. Here we will list out some broad guidelines as to which engine to use when.

## Improving VA Performance - NLP Optimization

A chatbot's ability to consistently understand and interact with a user is dictated by the robustness of the Natural Language Processing (NLP) that powers the conversation.

Kore.ai's platform uses a unique Natural Language Processing strategy, combining Fundamental Meaning and Machine Learning engines for maximum conversation accuracy with little upfront training. Bots built on Kore.ai's platform can understand and process multi-sentence messages, multiple intents, contextual references made by the user, patterns and idiomatic sentences, and more. [See here for an overview](https://developer.kore.ai/docs/bots/chatbot-overview/nlp-guide/).

The NL engine includes recognition support for a wide range of entities and provides the tools needed to further customize your bot's language understanding using additional patterns.

### Optimizing your Virtual Assistant

To make sure your VA is NLP-optimized, you can define, and refine names and terms used for your assistant to enhance the NLP interpreter accuracy and performance to recognize the right bot task for the user.  
You begin by defining synonyms at the task level, and then manage and refine synonyms, and test at the bot level.

To get started optimizing your Virtual Assistant and tasks, you need to access the **Natural Language** options. These options are categorized under various headings for your convenience:

- **Training** - In the Training section, you can define how the NLP interpreter recognizes and responds to the user input for a VA, and then train the interpreter to recognize the correct user intent.
  - **Machine Learning Utterances** - With Machine Learning, you can enhance recognition of user utterances for better recognition and system performance for the user intent which is the intended task that the user wants to access.
  - **Synonyms & Concepts** - You can use the Synonyms section to optimize the NLP interpreter accuracy in recognizing the correct intent and entity provided by the user.
  - **Patterns & Rules** - In the Patterns section, you can define slang, metaphors, or other idiomatic expressions for intent and entities.
- **Thresholds & Configurations** - In this section, you can define the recognition confidence levels required for minimum recognition actions, the confidence range for asking a user to choose from a list of possible matches, and a recognition confidence level for a positive match for the knowledge graph.
- Modify **Advanced Settings** like auto training setting for user utterances and negative intent patterns.

## Machine Learning Engine

Machine Learning (ML) is the recommended engine for training a VA. The reason for this is its flexibility and auto-learn feature. Given a few examples, the engine learns and is capable of understanding similar new utterances. The training utterances need not be full sentences, as the ML can learn from phrases too.

If you have a large corpus for each intent that you are planning to implement, then use Machine Learning. If you don't have a corpus it would be a good idea to develop one. In the long run, it is better to spend time building a large corpus and use ML rather than going for the other less time-consuming, easier options.

The way you define a large corpus could differ depending on the intents. For example, if the intentions are very different from each other and can be understood using their sample data like "Find Flight" or "Change Sear", then a corpus of 200-300 for each intent is sufficient. However, if intents are closer to each other (and usually start with a similar utterance, such as "Change Seat" and "Change Flight", then the corpus should be in 1000s.

Similarly, if you are planning to use Deep Neural Networks, you need a higher number of samples for better predictions of both True Positives and True Negatives, as these networks are data-hungry. Learn more below

# The Machine Learning Engine

Developers need to provide sample utterances for each intent (task) the assistant needs to identify, to train the machine learning model. The Kore.ai XO Platform Machine Learning (ML) engine will build a model that will try to map a user utterance to one of the VA's intents.

Kore.ai's XO Platform allows fully unsupervised machine learning to constantly expand the language capabilities of your assistant - without human intervention. Unlike unsupervised models in which AI assistants learn from any input - good or bad - the Kore.ai XO Platform enables assistants to automatically increase their vocabulary only when the VA successfully recognizes the intent and extracts the entities of a human's request to complete a task.

However, we recommend keeping Supervised learning enabled to monitor the VA performance and manually tune it if required. Using the XO Platform, developers can evaluate all interaction logs, easily change NL settings for failed scenarios, and use the learnings to retrain the VA for better conversations.

This article discusses the processes behind the Machine Learning Engine, and how to perform training for optimum performance.

# The Machine Learning Process

## Intent Detection

The below diagram summarizes the intent detection pipeline for both training and prediction stages. For the training pipeline, the language detection and auto-correction are not run with the assumption that the trainer would be aware of the language in which training needs to be done and of the spellings to be used which might include domain-specific non-dictionary words like Kore, etc.

### Entity Extraction

Entity extraction involves identifying any information provided by the user apart from the intent that can be used in the intent fulfillment. The entities are of three types

- **System entities** like date, time, color, etc are provided out-of-the-box by the Platform. It includes nearly 22-24 entities and these are recognized by the ML engine automatically with no training except for string & description entity types.
- **Custom entities** are defined by the bot developer and these include the list of values - enumerated, lookup, and remote, regex expressions, and composite entities. These are also mostly auto-detected by the ML engine.
- **NER or named entity recognition** needs the training to identify the same entity type for different entities e.g. source & destination cities for flight booking intent, both of which are city type entities and the engine needs the training to distinguish between the two. NER can be conditional random field-based or neural network-based. CRF is preferred since it works on lesser data and has a faster training time compared to the NN-based method.

The following diagram summarizes the NER entity extraction pipeline.

### ML Output

The ML Engine runs the classification against the user utterance and generates the following scores output which Ranking and Resolver uses for identifying the correct intent:

- **The probability Score** for each class/intent, can be interpreted as follows
  - Definitive Match/Perfect Match: If the probability score >0.95 (default and adjustable)
  - Possible match: If the score is <0.95%, it becomes eligible for ranking against other intents which may have been found by other engines.
- **The fuzzy score** for each of the traits/intents which are greater than the Threshold score(default is 0.3) - Fuzzy logic goes through each utterance of a given intent and compares it against the user input to see how close the user input and the utterance are. The scores are usually from 0-100 and can be interpreted as follows:
  - Definite Match/Perfect Match: If the score is above 95%(default  & adjustable)
  - Possible match: If the score is <95%, becomes eligible for Ranking against other intents which may have been found by other engines.
- **CR Sentences** - The ML engine also sends the top 5 ML utterances for each of those Intents which have qualified using the Threshold score. These 5 ML utterances are derived using the Fuzzy score. Ranking & Resolver uses these CR sentences to Rescore and choose the best of these utterances (compares each utterance against user input and chooses an utterance with topmost score)

### Limitations

Though the ML model is very thorough, it has its own limitations, as follows:

- In cases where sufficient training data is not available, the ML model tends to overfit small datasets and subsequently lead to poor generalization capability, which in turn leads to poor performance in production.
- Domain adaptation might be difficult if trained on datasets originating from some common domains like the internet or news articles.
- Controllability and interpretability are hard because, most of the time, they work like a black box, making it difficult to explain the results.
- Cost is high both in terms of resources and time.
- The above two points also result in maintenance or problem resolution being expensive (again both in terms of time & effort) and can result in regression issues.

Hence, ML engines augmented by FM engines would yield better results. One can train the assistant with a basic ML model, and any minor issues can be addressed using FM patterns and negative patterns for idiomatic sentences, command-like utterances, and quick fixes.

### Training the ML Engine

#### Training Overview

The Machine Learning Engine builds a model, based on training through intent detection and entity extraction, as follows:

- The **intent prediction** model is trained using statistical modeling and neural networks.  Intent classification tags the user utterance to a specific intent. The classification algorithm learns from the set of sample utterances that are labeled on how they should be interpreted. Training utterance preparation and curation is one of the most significant aspects of building a robust Machine learning model.
- **Entity Detection** involves recognizing System Entities (Out Of the Box, Rule-based model), predicting Custom Entities (Custom-trainable Rules-based Model), and Named Entity Recognition (NER). System Entities are defined using built-in rules. However, using the NER approach, any named entity can be trained using Machine Learning by simply choosing the value from the ML training utterances and tagging them against the named entity.

**Training the ML Engine involves the following steps:**

- Choosing and gathering data that can be used as the training set,
- Dividing the training set for evaluation and tuning (test and cross-validation sets),
- Training a few ML models according to algorithms (feed-forward neural networks, support vector machines, and so on) and hyperparameters (for example, the number of layers and the number of neurons in each layer for neural networks),
- Evaluating and tuning the model over test and cross-validation sets,
- Choosing the best performing model and using it to solve the desired task.

The NLP module improves the performance by constantly validating the ML Engine and presents  actionable insights to resolve the conflicts in intent and entity training.

## Optimizing Intent Recognition

### **Adding Machine Learning Utterances**

To add utterances to the Machine Learning Engine, please follow the steps below:

- Open the VA for which you want to add sample user utterances.
- Select the **Build** tab from the top menu.
- From the left menu, select the **Natural Language ->** **Training** option.
- By default, the tab with a list of all **Intents** would be displayed.
- You can use the filter option to restrict the display items to **Dialog Intents, Sub Intent Dialogs** or **Sub-Intents**. You can also choose to **Include Hidden Tasks**.
- Click **Utterances > + Utterance** against the Intent for which you want to add the utterances.
- The user utterance page opens.
- Here is where you can enter the utterances

The negation of trained intents will be ignored by the Platform.

For example, consider a Travel Assistant trained on the Book a Flight utterance. A user might say: Your app takes me to the booking screen, but I don't want to book a flight. In this case, the Book a Flight intent will not trigger.

### **Adding Entities for Named Entity Recognition**

Apart from the intent, you can train your VA to recognize the entities, if present, in the user utterance. For example, if the user says: Book Flight from Hyderabad to Mumbai apart from recognizing the intent as "Book Flight" the source and destination of the flight should also be recognized. This can be achieved by marking the entities in the user utterance during training.

**You can mark entities in your utterances**, by selecting the entity value and clicking the corresponding entity name.

The Platform will also try to identify and mark the entities. You have the option to accept or discard these suggestions. The Platform will identify the entities based upon:

- System entities;
- Static List of items - either enumerated or lookup;
- NER trained entities (from above).

For each of the entities thus marked, the confidence scores identified by the ML engine are displayed. This score is available only when the Conditional Random Field is selected as the NER model.

Further, if you have enabled Entity Placeholders, the Platform will replace the entity values in the training utterance with entity name placeholders for training the ML model. Using actual entity values as well as multiple additions of an utterance with just a change in the entity value will have an adverse impact on the ML training model. The name of entities also starts contributing highly to the intent detection model.

### **Using Negative Patterns**

Negative patterns can be used to eliminate intents detected by the Fundamental Meaning or Machine Learning models.

# Training your Assistant

After you added user utterances, you should train the Kore.ai interpreter to recognize the utterances and the associated user intent. When you have untrained utterances in your VA, the following message is displayed:

"You have untrained utterances in your ML model. Train your VA to update with all your utterances."

Click **Train**. A status bar is displayed to show progress for utterance training. When complete, the Utterances trained successfully message is displayed. The user utterances are added to the Machine Learning Database. You can further configure the ML engine, identify the dummy intents when a user utterance contains the words that are not used in the VA's training i.e. vocabulary, [refer here for more details](https://developer.kore.ai/docs/bots/nlp/advanced-nlp-configurations/).

Once you have trained your VA, you can test it on the newly trained data. [Learn how to test your](https://developer.kore.ai/docs/bots/test-your-bot/testing-your-bot-with-nlp/) assistant.

You can view NER information after utterance training. The path to view the information is **context.NL_Analysis.intents.nerInfo\[x\].Value** where 'x' is the index of whichever value you wish to access. This path should be mentioned in the **If** section within **Properties >** **Connections** for the marked entity. Note that this feature is available only for **Standard bots**.

### Auto-Training

By default, machine learning is automatically trained for any defined user utterances whenever a task is:

- Updated with a new
  - Task name or intent name,
  - Entity name or parameter name,
  - Entity type,
  - VA name
- Published
- Suspended by the Admin.
- Deleted by the Admin.

On the XO Platform, when auto-train is in progress, a warning message that "_untrained user utterances cannot be identified_" is displayed if you try to test the VA before auto-train is complete.

To set up the **Auto Train** option, follow the steps below:

- 1. Open the VA for which you want to modify the settings.
  - Select the **Build** top menu option.
  - On the left navigation menu, click **Natural Language** -> **Thresholds & Configurations** -> **Machine Learning**.
  - Select "_Yes, add the successfully identified user utterances to the ML training model (Unsupervised Training)"_ for the **Auto Training For Machine Learning** option.

# Thresholds & Configurations

To train and improve the performance of your Assistant, Threshold and Configurations can be specified for all three NLP engines - FM, KG, and ML. You can access these settings by navigating to **Build** > **Natural Language** > **Thresholds & Configurations**.

The Threshold & Configurations for the ML engine are discussed in detail in the following sections.

### Machine Learning Model Configuration Overview

The XO  Platform ver 6.3 upgraded its Machine Learning (ML) model to v3. This includes a host of improvements and also allows developers to fine-tune the model using parameters to suit business requirements. The developers can change parameters like stopword usage, synonym usage, thresholds, and n-grams, as well as opt between [Deep Neural Network](https://en.wikipedia.org/wiki/Deep_learning#Deep_neural_networks) or [Conditional Random Field-based](https://en.wikipedia.org/wiki/Conditional_random_field) algorithms for the [Named-Entity Recognition (NER)](https://en.wikipedia.org/wiki/Named-entity_recognition) model.

In v8.0 of the Platform, provision has been enabled to use the v5 of the ML intent model and externalize several hyperparameters. This can be achieved through the Advanced NLP Configuration, [refer here for details](https://developer.kore.ai/docs/bots/nlp/advanced-nlp-configurations/).

When the Multiple Intents Model =is enabled, the ML Engine maintains multiple intent models for the VA as follows:

- **Bot level Intent Model** containing all the Primary Intents of the assistant which includes Primary Dialog Intents, and Alert Task Intents.
- **Dialog Intent Models** - one for every primary dialog intent and sub-dialog intent which includes the Sub-intent nodes added to the dialog definition, Sub-intents scoped as part of the Group nodes and Interruption exceptions added to the dialog definition.

You can configure the Thresholds and Configurations separately for each of the intent models. This includes:

- All the configurations under Thresholds and Configurations - ML Engine as discussed in the below section;
- All the ML Engine configurations under the Advanced NLP Configurations [discussed in detail here](https://developer.kore.ai/docs/bots/nlp/advanced-nlp-configurations/).

### **The Multiple Intent Model**

Training of "similar intents" with different purposes is usually difficult as the training given for an intent can add noise or conflict with the training given to the other intent. This is more evident in cases where the intents have a contextually different meaning or purpose.

Consider the following case: A user is in the **Make a Booking** task, so any query related to the Booking refund policy should be answered within this context. However, the query can also trigger FAQs from **Cancel a Booking**.

Enabling the Multiple Intent Models from the Advanced NLP Configurations ([see here for how](https://developer.kore.ai/docs/bots/nlp/advanced-nlp-configurations/)) allows you to have a dedicated ML model only for the primary intents and separate ML Models for each of the dialogs with their associated sub-intents so that the intent detection of sub-intents gets preferential treatment.

Continuing with the above example, with a Multiple Intent Model, you can define a separate _context-based_ FAQ and ensure a proper response to the user.

All the primary intents of the VA will be part of the **Bot Level Intent Model**. Each of the Dialog tasks will have its own ML Model consisting of all the sub-intents added to it. The Thresholds and Configurations can be individually configured for each of the models. For example, the Bot Level Intent Model can use 'Standard' Network Type and a specific Dialog's intent model can use 'LSTM' Network Type.

## Configuring Machine Learning Parameters

The XO Platform provides language-wise defaults for the following parameters related to the ML performance of your VA. You can customize them to suit your particular needs.

### **Network Type**

You can choose the Neural Network that you would like to use to train the intent models. This setting has been moved to Machine Learning from Advanced NLP Configurations in v8.1.

You can choose between the following types. Based on the selection additional configurations can be done from the Advanced NLP Configurations section, [refer here for details](https://developer.kore.ai/docs/bots/nlp/advanced-nlp-configurations/#Externalization_of_ML_Engine).

- **Standard.**
- **MLP-BOW** - The bag-of-words model is a simplifying representation used in natural language processing and information retrieval. In this model, a text is represented as the bag of its words, disregarding grammar and even word order but keeping multiplicity.
- **MLP-WordEmbeddings** - Word embedding is the collective name for a set of language modeling and feature learning techniques in natural language processing where words or phrases from the vocabulary are mapped to vectors of real numbers.
- **LSTM** (Long Short-Term Memory) is an artificial recurrent neural network (RNN) architecture used in the field of deep learning. LSTM has feedback connections and hence has the ability to capture long-term dependencies for texts of any length and is well suited for longer texts.
- **CNN** (convolutional neural networks) is a class of deep neural networks in deep learning most commonly applied to analyzing visual imagery. It makes use of the word order for a specific region size and has achieved remarkable results on various text classification tasks.
- **Transformers** use a Universal Sentence encoder in the vectorization stage of the Training pipeline. The output of the sentence encoder is fed to a Multi-Layer perceptron network for training. SentenceEncoder has an inbuilt capability of understanding the semantic similarity between sentences taking into account the synonyms and various usage patterns of the same sentence.  
    The Universal Sentence Encoder encodes text into high-dimensional vectors that can be used for text classification, semantic similarity, clustering, and other natural language tasks. The model is trained and optimized for greater-than-word length text, such as sentences, phrases, or short paragraphs. It is trained on a variety of data sources and a variety of tasks with the aim of dynamically accommodating a wide variety of natural language understanding tasks. The input is the variable-length English text and the output is a 512-dimensional vector.
- **KAEN** (Kore Advanced Embeddings Network) - Models trained with Sentence Embeddings alone can not understand the domain-specific terminology especially if the words from training are non-dictionary words. Kore.ai provides a model which can understand the meaning of the sentence and at the same time give importance to the domain-specific terminology. There are two parallel layers in work in this model - one to optimize the weights against the sentence embeddings and the other to optimize the word importance for a given sentence.  The activation function used for these two layers is RReLU (Randomized Leaky Rectified Linear Unit, [refer here for details](https://arxiv.org/pdf/1505.00853.pdf))
- **Zero-shot Model (ZSM)**: Helps define descriptive intents that the VA identifies in the user utterance based on semantic similarity without requiring training data.
- **Few-shot Model (Kore.ai Hosted Embeddings)**: Helps define more number of granular intents that describe the user's intention in the utterance more accurately with limited training requirement.

### **Zero-shot Model**

**Note**: The Zero-shot model is production-ready in English but experimental in other languages. We advise caution before using it in production for non-English languages.

The Kore.ai XO platform allows developers to create a Natural Language Understanding (NLU) model to use in a virtual assistant.

The **Zero-shot Model (ZSM)** allows developers to quickly create the model without needing training data. Instead, it relies on a pre-trained language model and a logic learning machine (LLM) to identify the intention of a user through the utterance based on semantic similarity. This feature uses the intent name to map or identify the intent name's similarity with the user input to predict the utterances accurately. Thus, the intents have to be defined very well. This approach is well-suited for virtual assistants with relatively fewer intents and distinct use cases.

**Benefits**

- The **Zero-shot Model** network type helps create an NLU model quickly as it does not require training data.
- Uses **LLM & Generative AI models** to identify the intent names by comparing the user utterance.
- The user must only provide a descriptive intent name to leverage this functionality.

**Important Considerations**

- This model identifies and defines granular intents describing the purpose of the user interaction and not what the virtual assistant can do.
- **ZSM** works well when the virtual assistant has good intent coverage.
- Utterances are required to train entities.
- Intent names and user utterances will be shared with the LLM providers.
- When using **ZSM**, dialog intents and FAQs need to be treated the same.
- The **Zero-shot Model network type** applies only to the ML engine and not the FM, KG, and Traits engines. The Platform continues to use Patterns for Intent matching by the FM engine.
- There is no option to tweak the training if something does not work.
- **ZSM** is available in the bot-level model configuration and not in the dialog intent model.
- Multiple intent models are not supported when **ZSM** is enabled.
- Bot Synonyms and stop words are not used for intent detection.
- When **ZSM** is enabled, all the matches from the ML engine are definite.
- Only the **Incorrect Patterns** and **Wrong Entity Annotation** goal-driven validations are enabled when **Zero-shot Model** is enabled.

**How it works**

- The user defines the intent to be identified by the system. For example, in the banking use case, instead of saying "_I see invalid transactions_", the intent you provide has to be more descriptive within a subject, object, and nouns. It should be something more descriptive like "_I received an alert on my phone about transactions that I have not done._". This helps the virtual assistant correctly identify the intent "_Dispute credit card Transaction._" If required, the user can add dialogs for the intents.

2.The user should enable the **Zero-shot Model Network Type** under **Training**.

- The system identifies the most logical intent by matching the user utterance with the defined intent names (without training utterances). It then responds with the relevant intent. Intents identified by the **Zero-shot** **Model** are considered definitive matches.

**Rescoring of Intents for Definitive Matches**

When **Prefer Definite Matches** is disabled, and **Rescoring of Intents** is enabled, the platform continues rescoring for definite matches based on the similarity between the training data and user utterance to discover the winning intent(s). However, enabling Prefer Definite Matches is recommended to rescore for definitive matches based on the similarity between the intent names and user utterances.

**Demonstrating with an Example**

For an online shopping virtual assistant, the following needs to be ensured to implement the **Zero-shot** model:

- The intent names should be very descriptive.
- Provide descriptive names, as the model relies heavily on intent names.

When an intent is named "**_Show the status of my order_**," for example, under **Build** > **Conversational Skills** > **Dialog Tasks**.

For a new bot, under **Build** > **Natural Language** > **Training** > **Intents**, ensure that no training utterances are added for the intent.

When you enable **Zero-shot network type** for an existing bot, the system does not identify the intent for its training data/utterances.

**Note**: For more descriptive intent names like "_I want to place an order_" and "_Will I be able to place an order?_", the system considers the punctuation and the case (upper or lower) to identify the intent.

**Note**: The Zero-shot Threshold and Zero-shot Definitive Score apply only to zero-shot v2 prompts.

**Zero-shot Threshold**

Zero-shot Threshold defines the criteria for qualifying a probability score of an intent to be a possible match. The default value is set to 0.7. This means that any intent that scores >0.7 is considered as a qualified Intent. Intents scoring < 0.7 are rejected.

**Note**: Apps created after the 10.14 release use a default threshold value of 0.7, while apps created before this release use a default threshold value of 0.6.

**Zero-shot Definitive Score**

Set the threshold score for definite matches between 80-100%. The default value is 95%. If the probability score exceeds 95%, the intent is classified as a Definite Match or Perfect Match.

**Note**: The zero-shot score is considered if the LLM score is less than it.

**Enable the Zero-shot Network Type**

To enable the **Zero-shot** model, follow the steps below:

- Navigate to **Build** > **Natural Language** > **Thresholds and Configurations** > **Machine Learning**.
- Select **Zero-Shot Model** in the dropdown list for **Network Type**, and click **Save**.

**Testing the Utterance**

To test the utterance for the **Zero-shot Model** Network Type, follow the steps below:

- 1. Navigate to **Build** > **Testing** > **Utterance Testing**.
  - Type the utterance.

- Click **Save & Run**.
- The Machine Learning Model identifies and displays the following intents in the **NLP Analysis** window for each example.

### **Few-shot Model (Kore.ai Hosted Embeddings)**

**Note:** The Few-shot model is production-ready in English but experimental in other languages. We advise caution before using it in production for non-English languages.

The Few-shot model allows you to train your virtual assistants using the intent names and a few training utterances if required. Kore.ai uses **custom NLU models pre-trained with large datasets** to identify the intents based on their semantic similarity in the user utterance. This model works in the same manner as the **Zero-shot** Model except that more intents are considered while identifying the user's intention in the utterances through LLMs hosted by the Platform. This model does not share any data externally and needs no additional enablement or costs.

The few-shot model supports two embedding models for intent detection:

- **MPNet**: An ML model that improves NLP model precision with less training data. It identifies intents based on semantic similarity in user utterances.
- **Pre-trained MPNet**: This is the latest version of MPNet, pre-trained and fine-tuned for superior accuracy and precision in intent identification compared to earlier versions. The latest encoder model is pre-trained to understand the different components of the user utterance and generate embeddings by prioritizing the intent (action). This targeted approach improves the overall accuracy and precision of the intent detection with lesser training data.

Advantages of using the Pre-trained MPNet Model:

- **Understanding Negations**: Pre-trained models get negations like "not" or "don't" easily, unlike MPNet which might mix things up. So, when you say, "I want to transfer funds," and "I do not want to transfer funds," pre-trained models know the difference, making them better at understanding what you really mean.
- **Clear Intent Differentiation**: Pre-trained models are great at telling apart similar things, which can be tricky for MPNet. For example, if you say, "I want to unblock a card," or "I want to block a card," pre-trained models can confidently tell the difference between wanting to block or unblock a card, unlike MPNet, which might get confused.
- **Staying on Topic**: Pre-trained models are good at sticking to the topic at hand. So, if you talk about increasing your credit card limit, they won't start suggesting things unrelated to credit cards, unlike MPNet, which might go off track.
- **Easier Training**: Pre-trained models need less training data compared to MPNet. This means the model can learn the same things with fewer examples, making the training process faster and simpler.

#### Model Comparison (MPNet vs. Pre-trained MPNet)

The following metrics display the accuracy of the MPNet and Pre-trained MPNet models on different datasets in terms of the Top 1% intent match percentage.

**Public Dataset**

**Configuration Default Setting:**

| **Component** | **Settings** |
| --- | --- |
| **ML Engine** | - 'Multiple Intent Models' is disabled.<br>- The minimum value for ML Threshold is set to 0.6.<br>- The ML Definitive Score is set to 90% (0.9). |
| **Ranking & Resolver** | 'Rescoring of Intents' (by the R&R engine to find the top-qualifying/winning intents) is disabled. |
| **Fundamental Meaning** | 'Intent Detection using Task Name Words' (to determine if the FM Engine should identify the intents using the words in the Task Name) is disabled. |
| **Advanced NLP Settings** | - 'ML Suggestion Proximity' (for ML Engine) is added to the list by default with value set to 5.<br>- 'Exact Task Name Match' (for FM Engine) is added to the list by default and set to the Disabled state.<br>- 'Multi-intent Model' is set to the Disabled state. |

**Important Considerations**

- It is important to give descriptive names for your tasks so that the model finds the semantic similarity between the task names and the user utterances.
- This model identifies and defines granular intents describing the purpose of the user interaction, and not what the virtual assistant can do.
- Works well when the virtual assistant has good intent coverage.
- You may need to add training utterances to identify entities by the NER model for specific scenarios.
- When using **Few-shot**, dialog intents and FAQs need to be treated the same.
- Stop Words are not used by the Few-shot Model (Kore.ai Hosted Embeddings).
- The new Few-shot Model (Kore.ai Hosted Embeddings) for Traits in NLP V3 allows the NLP Engine to train and identify Traits when set as the default model. This feature is available for only the new bots that have English as the NLU language. [Learn more](https://developer.kore.ai/docs/bots/nlp/user-utterances/#Support_for_Standard_Bot_Traits).
- Intents are rescored by the R&R Engine by comparing the closest training sentences (including the task name) with the user utterance.

**How it works**

The model uses embeddings generated using large pre-trained language models to compare the similarity between the training data and the user utterances.

- You can start by just creating intents with descriptive names. Post-testing the performance of the intent, you can consider adding a few utterances only for the failed variations. For example, in the banking use case, when the utterance "_I forgot my pin_" (which is very straightforward) is given, the virtual assistant correctly identifies the intent "_reset credit card pin_."

However, for a more complex utterance like "_I received an alert on my phone about transactions that I have not done._", the virtual assistant identifies the intent "_Dispute credit card Transaction_" correctly only when a training utterance like "_Unidentified Transactions_" is added to nudge the model in the right direction.

- This behavior varies from scenario to scenario where the correct intent can be identified accurately based on the training utterance you provide.
- The system identifies the most logical intent by matching the user utterance(s) with the defined intent names. It then responds with the relevant intent. Intents identified by Few-shot are considered definitive matches.

**Enable the Few-shot Network Type**

To enable the **Few-shot** model, follow the steps below:

- Navigate to **Build** > **Natural Language** > **Thresholds and Configurations** > **Machine Learning**.
- In the **Network Type** dropdown, select **Few-Shot Model (Kore.ai Hosted Embeddings)**. The confirmation pop-up is displayed.
- Click **Confirm**.
- Select the required embedding model from the dropdown list.  
    **Note**: The pre-trained MPNet is the default model for new bots.
- The success message is displayed.

### **Support for Standard Bot Traits**

The Few-shot Model is now the default model for managing Traits. This feature is only available for the new bots created in NLP V3.

Bot synonym is used while identifying the traits in the Few-shot Traits model. Also, the Few-shot model for traits is available only in English.

To manage the Few-shot Model as the default Network Type for traits, follow the steps below:

- Click **Build** on the top menu.
- Navigate to **Natural Language** > **Training**, and click the **Traits** tab.
- Click the trait you want to configure from the list. Otherwise, add a new trait by clicking **Add Traits**.
- In the resulting window, click **Manage** to view the **Manage Traits** panel.
- The system selects **Few-shot Model (Kore.ai Hosted Embeddings)** by default as the Network Type, and the following settings appear:  
    i. **ML Threshold** is set to the default value 0.5.  
    ii. The **Feature Extraction** and **Sequence Length** options available for Standard Models don't appear as they're not applicable.

### **Support for Bot Synonyms**

Bot synonym is used while identifying intents in the Few-shot ML model.

The Few-Shot model supports Bot synonyms where a specific word in the user utterance including an abbreviation, acronym, or enterprise-specific word like "_A/C_" is replaced by the relevant term or word (_Account_) which will enable better intent recognition.

For example:

When the **User utterance** is "_Check my a/c balance_," the **Training data** matched is "_Check my account balance_."

In this case, MPNet provides a high score (ML Threshold and ML Definitive scores) where the intent/entity/question is understood by the Virtual Assistant and matched to the training data. This support is helpful for migrating the solution-specific bots to the LLM approach.

**Enabling Bot Synonyms**

On the Platform, you can use Bot Synonyms as part of the Few-shot model by enabling the **Bot Synonyms** option in the **Bot Level Intent Model Configurations** window (after selecting the **Few-Shot Model (Kore.ai Hosted Embeddings)** Network Type under **BUILD** > **NATURAL LANGUAGE** > **THRESHOLDS AND CONFIGURATIONS**.

When the **Bot Synonyms** option is enabled, the following happens:

- The Platform looks for any synonyms present in the training utterances and replaces them with the Synonym Key.
- The training sentences with the replaced words are used for training the model.
- The modified sentence is used for intent identification (generation of embedding as well as similarity checks).

### **ML Threshold**

ML Threshold defines the criteria for qualifying a probability score of an intent to be a possible or definite match. The default value is set to 0.3. This means that any intent which scores > 0.3 is considered as a qualified Intent. Intents scoring < 0.3 are rejected.

### **ML Definitive Score**

Configure the threshold score for definite matches, which can be set to a value between 80-100%, with the following classification:

- **Probability Score** - If the probability score by the classification Engine is > 0.95 (default which is adjustable using "ML Definitive Score" divided by 100) Intent is considered as a Definite Match/Perfect Match.
- **Fuzzy logic** goes through each utterance of a given Intent and compares it against the user input to see how close the user input and the utterance are (scores are usually from 0-100). If the score is above 95% (default which is adjustable using "ML Definitive Score") Intent is considered as a Definite Match/Perfect Match.

### **Bot Synonyms**

This setting is **Disabled** by default. Enable this option if you would like to consider intent synonyms in building the ML model.

Enabling Synonyms allows the ML model to take the synonyms defined under "Synonyms and Concepts" to be considered while training the ML model. It helps in avoiding preparing duplicate utterances.

For example: "I want to book a flight".

If we had defined "buy", "reserve", "purchase" as synonyms of "book" and "ticket" or  "seat" as synonyms of "flight", then you need not add training utterances like "I want to buy a ticket" or "I want to reserve a seat" etc.

### **Stop Words**

This setting is **Disabled** by default. Enable this option if you would like to remove the stop words in the training utterances in building the ML model. Once enabled, stop words are used to filter out the words/phrases from the Training utterances before training the ML model and are removed from the user utterance before prediction.

This setting is not valid when Network Type is set to Transformer. Also, the Few-shot model doesn't use Stop Words.

### **Support for Non-CS Languages**

The Kore.ai XO Platform now supports the following **150 Polish stop words** for ML Engine Training, in addition to the current stop words.

**Note:** Refer to the original documentation for the complete list of Polish stop words organized by alphabet.

### **Feature Extraction**

Using this option (introduced in ver8.0) you can associate the ML intent model with the preferred algorithm. This option is not valid when Network Type is set to MLP WordEmbeddings, LSTM, CNN, and Transformer.

The options are:

- **n-gram** - this is the default setting and can be used to define the contiguous sequence of words to be used from training sentences to train the model.  
    For example, if Generate weather forecast report is the user utterance and if the n-gram is set to 2, then Generate weather, Weather forecast, and Forecast report are used in training the model. If n-gram is set to 3, then Generate weather forecast, and Weather forecast report will be used in training the model.  
    You can set the n-gram using the **n-gram Sequence Length -** The minimum n-gram limit is 1 by default. You can set the maximum limit up to 4.
- **skip-gram** - when the corpus is very limited or when the training sentences, in general, contain fewer words then skip-gram would be a better option. For this you need to define:
  - **Sequence Length** - the length for skip-gram sequences, with a minimum of 2 and a maximum of 4
  - **Maximum Skip Distance** - the maximum words to skip to form the grams, with a minimum of 1 and a maximum of 3.

### **The NER Model**

Choose the NER model to be used for entity detection. The XO Platform provides two entity recognition models for training using NER that follow the same approach with

- **Conditional Random Fields**: lightweight and is easy to use for all sizes of datasets
- **Neural network**: works well with medium to large datasets but training time is very high

### **NER Threshold**

**NER Threshold** is a user-configurable parameter to set the minimum confidence score required for the system to identify and return only entity values above the set threshold. An entity with a confidence score below the set threshold is considered a Probable Match and one with a score that is equal to or above the threshold is considered an Exact Match.

This setting helps filter out low-confidence recognitions and remove false positive results. This is beneficial for improving the accuracy of Named Entity Recognition (NER) results by excluding less reliable or uncertain identifications.

**Important Considerations**

While using the **NER Threshold** setting, the following considerations should be made:

- This feature is useful for identifying NER entities for CRF and DNN methods.
- The user can set the threshold value between 0 and 1 in **multiples of 0.01**.
- For all the existing bots and languages, the default threshold value is **0**, for all new bots, the default value is configurable. To **0.3** currently.
- During runtime, the system returns only the matched entity values with a confidence score above the threshold.
- The confidence score based on this setting is reflected in the following locations:
  - **Utterance Testing**: On the left panel.
  - **Batch Testing**: In the CSV file and **More Details** section of the **Test Case Details** screen.
  - **Health and Monitoring Dashboard**: In the **More Details** section of the **Test Case Details** screen.
- In scenarios where multiple entity values are identified for an entity, the system compares the confidence scores and returns the entity value with the maximum confidence score.
- When multiple entities are identified for a value, the system compares the confidence scores and qualifies the entity with the maximum confidence.

**Example of NER Identification**

For a flight booking service, when you set the **NER Threshold** value for the following entities:

- Source City
- Destination City
- Date of Travel

The training utterance is as follows:

"_I want to book a flight from New York to Boston._"

When the user provides the following inputs to the virtual assistant:

- **Utterance 1**: "_I want to fly from New York to Boston._"
- **Utterance 2**: "_Book a ticket to New Jersey from Boston._"
- **Utterance 3**: "_Help me book a flight ticket on 25th of July, 2023._"

The system identifies all the entity names and checks their NER confidence score. Only the matched entities with a confidence score above the set limit are returned instead of all the recognized entities. Thus, the following results are returned:

- **Source City**: New York
- **Destination City**: Boston
- **Date of Travel**: 25 July 2023

### **Entity Placeholders**

Enable to replace entity values present in the training utterances with the corresponding entity placeholders in the training model. Entity placeholders remove the contribution of real entity values in Intent detection. This works only when the entity training(NER) is done via ML.

**Note**: Enabling this flag reduces scores contributed by entity values.

**Example**: I want to fly to London tomorrow.

In the above example, we don't want the engine to learn that "London" and "tomorrow" are important features. Hence they are replaced with their Placeholders once NER is done and the Entity Placeholders flag is enabled. Training utterance becomes "I want to fly &lt;to&gt; on &lt;date&gt;.

This option is not valid when Network Type is set to Transformer.

### **Upgrading the ML Model (for old VAs)**

All new VAs that are created use the new ML model by default. Developers can upgrade the ML model for old VAs or downgrade the model for the VAs using the new model.

If you are using a previous model of ML in the XO Platform, you can upgrade it as follows:

- Open the assistant for which you want to upgrade the ML model and go to **Natural Language > Thresholds & Configurations**.
- Expand **Machine Learning**. Under the ML Upgrade section, click the **Upgrade Now** button. It opens a confirmation window.
- Click **Upgrade and Train**. You can see new customizable options under the Machine Learning section.

# Training Validations

The ML engine enables you to identify issues proactively in the training phase itself with the following set of recommendations:

- **Untrained Intents** - notifies about intents that are not trained with any utterances so that you can add the required training.
- **Inadequate training utterances** - notifies the intents that have insufficient training utterances so that you can add more utterances to them.
- **Utterance does not qualify any intent (false negative)** - notifies about a utterance for which the NLP model cannot predict any intent. For example, an utterance added to Intent A is expected to predict Intent A. Whereas in some cases the model won't be able to predict neither the trained Intent A nor any other Intents within the model. Identifying such cases proactively helps you to rectify the utterance and enhance the model for prediction.
- **Utterance predicts wrong intent (false positive)** - Identifies utterances that predict intents other than the trained intent. For example, when you add an utterance that is similar to utterances from another intent, the model could predict a different intent rather than the intent to which it is trained to. Knowing this would help you to rectify the utterance and improve the model prediction
- **Utterance predicts intent with low confidence** - notifies about the utterances that have low confidence scores. With this recommendation, you can identify and fix such utterances to improve the confidence score during the virtual assistant creation phase itself.

## Viewing NLU Training Validations

- On the virtual assistant's **Build** menu, click **Natural Language ->** **Training.**
- In the **Intents** tab, you can see the set of recommendations for the Intents and ML utterances.  
    **Note**: The errors and warnings in this screen are examples. The ML validations vary based on the error or waning recommendation as explained in the Goal-Based NLU Training Validations section above.
- Hover over the validation options and view the following recommendations:
  - Hover on the **Error** icon to view the recommendations to resolve the error.  

**Note**: An Error is displayed when the intent has a definite problem that impacts the virtual assistant's accuracy or intent score. Errors are high severity problems.

- Hover on the **Warning** icon and follow the instructions in the warning to enhance the training for ML utterances.  

**Note**: A warning is displayed when the issue impacts the VA's accuracy and it can be resolved. Warnings are less severe problems when compared to errors.

# Exporting and Importing Machine Learning Utterances

You can import and export ML utterances of a VA into another in CSV and JSON formats. You can choose between 'In-Development' or 'Published' tasks to export, whereas importing utterances always replace the latest copy of the task.

## How to Export or Import ML Utterances

- On the VA's **Build** menu, click **Natural Language ->** **Training.**
- The 'In-Development' version of the VA's ML utterances open by default. If you want to see the utterances in the 'Published' version, toggle on the top right side of the window to **Published**.

**Note**: The export of ML utterances varies based on this selection as explained in the Versioning and Behavior of the Exported Utterances section below.

- Click the options icon and select an option:
  - Click **Import** to upload a CSV or JSON file with the utterances to import OR import utterances between different languages in the same app, or,
  - Click **Export Utterances** and select CSV or JSON formats to export the utterances.

You can import/export ML utterances using either of the below methods:

- Upload Utterances File
- Copy from another Language

### **Upload Utterances File (Default)**

- Ensure that the **Upload Utterances File (CSV / JSON)** option is selected. This is the default import option.
- Select the language(s) for which you want to import. All the language added to the VA will be available for selection.
- Upload or drag and drop the CSV or JSON file containing the utterances. Click **Import** to initiate the import.

### **Copy from another Language**

Using this option, you can copy the utterances from one language to another in the same bot so that you can easily import and synchronize the utterances data between two languages.This option is available for bots that have more than one language enabled.

- **Import From:** Select the language from which you want to copy the utterances. The base language of the bot is pre-selected by default.
- **Version**: Choose Configured or Published, whichever meets your requirements.
- **Import To**: Select the language to which you wish to import. The current bot language is pre-selected by default. If the current language is the primary language of the bot, the field is pre-populated with any other language. You can change it by clicking the **Change** link, selecting a language and clicking Save.
- **Choose Intents to Import**: You can choose either of the two options:
  - **Import Utterances from all the Intents**: This is the default option. All the intents with all the utterances are imported. You can preview the summary of intents and utterances by clicking View Intents.
  - **Select Intents to import Utterances**: Having selected this option, you can choose which utterances to import. Only the utterances from the selected intents will be imported.

Once you have finalized the selections, click **Import**. After the import completes, a confirmation is displayed.

## Versioning and Behavior of Imported Utterances

- The imported utterances in CSV/JSON (if imported from Utterance File) or the source language (if imported from another language of the same VA) entirely replace the utterances present in the latest copy of the tasks.
- If the task is in Upgrade in Progress status, the utterances related to the task get entirely replaced with the task utterances present in the imported file or source language. The utterances in the Published copy of the task aren't affected.
- If the task is in the Published status, an Upgrade in Progress copy of the task gets created by default and the new utterances present in the imported file or source language will be added to the upgraded copy. The utterances in the Published copy of the task aren't affected.

## Versioning and Behavior of Exported Utterances

- When you export a VA's utterances, all the utterances related to every task type - alert, dialog - get exported.
- When you export an In Development copy of the VA, the utterances of all tasks in the latest available copy get exported.
- When you export a Published copy of the assistant, all the utterances in the published state get exported.
- In the case of multi-language VAs, the export of utterances includes utterances added in all of the languages.
- Export of utterances to JSON includes NER tagging present in the tasks, whereas CSV export doesn't include them.

# Recommendations

## General ML Training Recommendations

- Give a balanced training for all the intents that the VA needs to detect, add approximately the same number of sample utterances. A skewed model may result in skewed results.
- Provide at least 8-10 sample utterances against each intent. The model with just 1-2 utterances will not yield any machine learning benefits. Ensure that the utterances are varied and you do not provide variations that use the same words in a different order.
- Avoid training common phrases that could be applied to every intent, for example, "I want to". Ensure that the utterances are varied for larger variety and learning.
- After every change, train the model and check the model. Ensure that all the dots in the ML model are diagonal (in the True-positive and True-negative) quadrant and you do not have scattered utterances in other quadrants. Train the model until you achieve this.
- Regularly train the assistant with new utterances.
- Regularly review the failed or abandoned utterances and add them to the utterance list against a valid task or intent.

## NLP Intent Detection Training Recommendations

- If there are a good number of sample utterances, try training the VA using Machine Learning approach first, before trying to train the fundamental meaning model.
- Define bot synonyms to build a domain dictionary such as pwd for a password; SB for a savings bank account.
- After every change to the model training, run the batch testing modules. Test suites are a means to perform regression testing of your VA's ML model.

## NLP Entity Detection Training Recommendations

The best approach to train entities is based on the type of entity as explained below:

- Entity types like **List of Items** (enumerated, lookup), **City**, **Date**, **Country** do not need any training unless the same entity type is used by multiple types in the same task. If the same entity type is used in a task, use either of the training models to find the entity within the user utterances.
- When the entity type is **String** or **Description,** the recommended approach is to use Entity patterns and synonyms.
- For all other entity types, both NER and Patterns can be used in combination.

## Entity Training Recommendations

- Use NER training where possible - NER coverage is higher than patterns.
- NER approach best suits detecting an entity where information is provided as unformatted data. For entities like Date and Time, the Platform has been trained with a large set of data.
- NER is a neural network-based model and will need to be trained with at least 8-10 samples to work effectively.

# Model Validation

Once you have built your virtual assistant and trained it, the Kore.ai platform builds an ML model mapping user utterance with intents ([click here for more info](https://developer.kore.ai/docs/bots/nlp/user-utterances/)). Once created, it is recommended to validate the model to understand and estimate an unbiased generalization performance of the ML model.

The XO Platform offers two validation methods:

- **K-fold Cross-Validation** to estimate the skill of the machine learning model.
- **Confusion Matrix** or **Error Matrix** to visualize the performance of the machine learning model.

To choose the validation model, follow the below steps:

- Open the assistant that you want to validate the ML model and select **Build** from the top menu.
- From the left menu, click **Natural Language -> Training.**
- Click the **Validate Model** drop-down list on the top-right and select the model.
- The results page of the corresponding validation method is displayed.

In the following sections, we will look into each of these methods in detail.

## K-fold Cross-Validation

**Cross-Validation** is a resampling procedure used to evaluate machine learning models on a limited data sample. The technique involves partitioning the data into subsets, training the data on a subset, and using the other subsets to evaluate the model's performance. Performing Cross-Validation gives a more generalized metric on model performance which is a better indicator of the ML model's performance.

**Note**: K-fold Cross-Validation is not available for Few-shot and Zero-shot models.

### **Configuration**

The XO Platform supports **K-fold Cross-Validation**. For this, you must configure the **K-fold parameter** for cross-validation from the advanced NLP configurations. [Click here for more info.](https://developer.kore.ai/docs/bots/nlp/advanced-nlp-configurations/#K_Fold_Cross-Validation)

To initiate the training and generate the K-fold validation report, follow the below steps:

- From the left menu under the **Build** top menu option, click **Natural Language -> Training**.
- On the Machine Learning Utterances page, click **Validate Model** drop-down list on the top-right and select **K-fold Cross-Validation**.
- On the K-fold Cross-Validation page, click **Generate** to initiate the training and generate the K-fold validation report. Generate button appears only when you perform the cross-validation for the first time.
- After the report is generated, you can click the **Re-generate** button on the top right to regenerate the report when needed.

### **Implementation**

Following are the steps followed by the platform while performing the K-fold cross-validation:

- The entire set of utterances is randomly divided into training and test data sets.
- The entire training data is partitioned into k folds with each subset containing an equal number of training utterances. The value for k folds must be configured as mentioned above.
- The system then runs k iterations and in each iteration, a subset (fold) of utterances is tested against the model trained using the rest of the subsets ('k - 1' folds).
- The resulting model is validated on the test data set to compute the performance measures.
- This process is repeated until every utterance is used at least once for testing the model.
- The metrics are provided post K fold cross-validation to help you assess the ML model's performance.

### **Understand the Results**

The following metrics are provided post the K fold cross-validation:

- The **Precision** score of each testing fold - to define how precise/accurate your model is and is calculated as the ratio of true positives over total predicted positives (sum of true and false positives)
- The **Recall** score of each testing fold - defines the fraction of the relevant utterances that are successfully identified and is calculated as the ratio of true positives over actual positives (sum of true positives and false negatives).
- The **F1 Score** of each testing fold - to even out class distribution and seek a balance between precision and recall and is calculated as the weighted average of Precision and Recall.
- A **mean** of the precision, recall, and F1 scores for all the folds.

The following information is also provided to help understand the associated metrics better:

- **Total Utterances** - number of utterances in the training corpus
- **Number of Intents** - total number of intents in the assistant
- **Number of Folds** - number of subsets the training corpus was divided into the K-fold parameter
- **Test Data per Fold** - number of utterances in each subset used for testing
- **Training Data per Fold** - number of utterances in each subset used for training

### **Export the K-fold Cross-Validation Reports**

After you have generated the K-fold Cross-Validation report, you can export the report in CSV format. To export the validation report, follow the below steps:

- On the K-fold Cross-Validation page, click the export icon on the top-right.
- On the Export Report dialog box, click **Proceed**.

The exported file appears in this format: Kfold_BotName_YYYYMMDDHHmmSS.csv.

## Confusion Matrix

Confusion Matrix is useful in describing the performance of a classification model (or classifier) on a set of test data for which the true values are known. The graph generated by the confusion matrix presents an at-a-glance view of the performance of your trained utterances against the tasks. The name stems from the fact that it makes it easy to see if the model is confusing utterances.

The ML Model graph evaluates all the training utterances against each task and plots them into one of these quadrants of the task: True Positive (True +ve), True Negative (True -ve), False Positive (False +ve), False Negative (False -ve). A quick look at the graph and you know which utterance-intent matches are accurate and which can be further trained to produce better results.

The higher the utterance in the _True_ quadrants the better it exhibits expected behavior. True +ve represents a strong match with the task for which they are trained and the True -ve represents a mismatch with the irrelevant intents as expected. Utterances at a moderate level in the _True_ quadrants can be further trained for better scores.

The utterances falling into the _False_ quadrants need immediate attention. These are the utterances that are either not matching with the intended tasks or are matching with the wrong ones. To read the utterance text in any quadrant, hover over the dot in the graph.

#### **True Positive Quadrant**

When utterances trained for an intent receive a positive confidence score for that intent, they fall into its True Positive quadrant. This quadrant represents a favorable outcome. However, the higher the utterance on the quadrant's scale the more chances of it finding the right intent.

#### **True Negative Quadrant**

When utterances not trained for an intent to receive a negative confidence score for the intent, they fall into its True Negative quadrant. This quadrant represents a favorable outcome as the utterance is not supposed to match with the intent. The lower the utterance on the quadrant's scale, the higher the chances of it staying afar from the intent. All the utterances trained for a particular task should ideally fall into the True Negative quadrants of the other tasks.

#### **False Positive Quadrant**

When utterances that are not trained for an intent receive a positive confidence score for the intent, they fall into its False Positive quadrant. This quadrant represents an unfavorable outcome. For such outcomes, the utterance, the intended task, and the incorrectly matching task may have to be trained for optimum results.

#### **False Negative Quadrant**

When utterances trained for an intent receive a negative confidence score for the intent, they fall into its False Negative quadrant. The quadrant represents an unfavorable outcome as the utterance is supposed to match with the intent. For such outcomes, the utterance, the intended task, and the task need to be trained for optimum outcome. Read Machine Learning to learn more.

**Note**: Make sure to click the train button after making any changes to your assistant to reflect them in the ML Model Graph.

Consider the following key points when referring to the graph:

- The higher up the utterance in the True quadrants the better it exhibits the expected behavior.
- Utterances at a moderate level in the True quadrants can be further trained for better scores.
- The utterances falling into the False quadrants need immediate attention.
- Utterances that fall into the True quadrants of multiple tasks denote overlapping tasks that must be fixed.

## Knowledge Graph Engine

If your intents are more query-like in nature than transactional tasks or if the content is in documents and you want the VA to answer user queries from documents, then use Knowledge Collection. This engine can also be used to trigger dialog tasks in response to user queries thus incorporating other features available within the Kore.ai XO Platform.

If you have a lot of Intents and do not have time to prepare alternate utterances, but you are able to manually annotate some important terms, use Knowledge Collection. It is advisable to spend some time building a corpus and going for Machine Learning since annotation in the Knowledge Graph works in a similar way to ML's auto-learning process.

### Knowledge Graph Training

Training your Assistant is not restricted to the Machine Learning and Fundamental Meaning engines. You must also train the Knowledge Graph (KG) engine, too.

The Ontology-based Knowledge Graph turns static FAQ text into an intelligent, personalized conversational experience. It uses domain terms and relationships thus reducing the training needs. It also has the capability to enable the ontology weighted features whenever ML gets confused and to automate conversational dialog for resolving appropriate answers.

The Few-Shot Knowledge Graph leverages Kore.ai's LLM and lets you add FAQs without building an ontology. Less training and maintenance are required since you do not need to configure the graph term-by-term.

The Knowledge Graph engine thus responds to users' intents by identifying the appropriate questions within the Knowledge Graph, and then presenting the user with the appropriate response.

You can find the Knowledge Graph by selecting your desired VA, then going to **Build > Conversation Skills > Knowledge Graph**.

### Training a Few-Shot Knowledge Graph

Few-Shot Knowledge Graphs do not require an ontology and do not perform path qualification. Instead, they identify intents using semantic similarity and pattern recognition. However, if you want to train the VA on a specific use case for which the appropriate FAQ is not identified, you can map FAQs to an ontology, similar to what you would do with an Ontology-based Graph.

The main difference concerning training is that in the Few-Shot KG, Terms don't require some of the training configurations needed in an Ontology Graph:

- **Default Terms** are not available. The only exception is when you switch from an Ontology Graph, in which case existing Default terms are stored as such until updated. Afterward, Default terms become Organizer terms and can be set as Mandatory.
- **Organizer Terms** do not support Path-Level and Knowledge Graph Synonyms. They support Intent Preconditions and Context Output.
- **Mandatory Terms** support Traits, Path-Level and Knowledge Graph Synonyms, Intent Preconditions, and Context Output, just like in an Ontology-based Graph.
- You can set all **Thresholds and Configurations** except Path Coverage and Lemmatization using Parts of Speech, Search in Answer, and Qualify Contextual Paths, which are not supported by Few-Shot Graphs.

### Knowledge Graph Engine Capabilities

The following are the overall capabilities of the Knowledge Graph Engine:

- **Ease of Training using Synonyms:** Kore.ai's Knowledge Graph has a provision to associate synonyms against a graph node. This helps capture the variation in a question.
- **Better Coverage with Alternate Questions:** The Knowledge Graph has a provision to add alternate questions. This helps us to capture the various ways a user might ask the same question.
- **Improved Accuracy:** Ontology-driven question-answers reduce the possibility of false positives.
- **Weighing Phrases using Traits:** Kore.ai's Knowledge Graph engine includes a concept of traits for filtering out irrelevant suggestions.
- **Ability to Mark Term Importance:** The Knowledge Graph has a provision to mark that an ontology term is important.
- **Ability to Group Relevant Nodes:** Using the organizer node construct of the ontology engine, developers can group relevant child nodes under a parent node.

### FAQ Detection Steps

Here are the steps that the Knowledge Graph Engine takes when detecting FAQs:

- **Step 1: Extract Nodes:** The KG engine processes the user utterance to extract the term (ontology nodes) present in the graph. It also takes into consideration the synonyms, traits, and tags associated with the terms.
- **Step 2: Query Graph:** The KG engine fetches all the paths that consist of the extracted nodes.
- **Step 3: Shortlist Paths:** All the paths consisting of 50% or more matching terms with the user utterance are shortlisted for further processing. (Note: Path coverage computation doesn't consider the root node.)
- **Step 4: Filter with Traits:** If traits are defined in the Knowledge Graph, paths shortlisted in the above step are further filtered based on the confidence score of a classification algorithm in user utterance.
- **Step 5: Send to Ranker:** The KG engine then sends the shortlisted paths to the Ontology Ranker Program.

### Training Process

After you complete creating/editing the Knowledge Graph, click the **Train** button on the top-right of the Knowledge Graph window. When you perform this action, all the paths, synonyms, and question-answer sets are sent to the Graph DB engine.

**Note:** After every change that you make to the Knowledge Graph such as adding synonyms to a term or editing the name of a term, you must click the Train button for the changes to reflect in the bot responses.

The training fails if any single node has more than 100 questions. This limit was introduced in v7.3 to make the Knowledge Graph more efficient by improving the response times. In such failure cases, you can Download Errors CSV file which lists the path with more than 100 questions.

### Thresholds & Configurations

To train and improve the performance, Thresholds and Configurations can be specified. Access these settings from **Natural Language > Training > Thresholds & Configurations**.

- **Auto-Correction:** Will spell correct the words in the user input to the closest matching word from the VA's Knowledge Graph domain dictionary (extracted from questions, nodes, and synonyms).
- **Bot Synonyms:** Enables the XO Platform to use the Bot Synonyms in Knowledge Graph as well. Inclusion of Bot Synonyms for intent detection by the KG engine requires training.
- **Lemmatization using Parts of Speech:** Enables the use of parts of speech associated with the words in the utterance to lemmatize.
- **Path Coverage:** Defines the minimum percentage of terms in the user's utterance to be present in a path to qualify it for further scoring. Default is 50%.
- **Minimum and Definitive Level for Knowledge Graph Intent:**
  - **Definitive Range:** Matches in this range (93-100% default) are picked and others discarded.
  - **Probable Range:** Matches in this range (80-93% default) are considered for rescoring and ranking.
  - **Low Confidence Range:** (60-80% default) presented to end-user for intent confirmation.
  - **Not Matching an Intent:** Confidence levels too low to match (below 60% default).
- **KG Suggestions Count:** Define the maximum number of KG/FAQ suggestions (up to 5) to be presented when a definite match is not available. Default is 3.
- **Proximity of Suggested Matches:** Define the maximum difference (up to 50%) allowed between top-scoring and immediate next suggested questions to consider them equally important. Default is 5%.

## Fundamental Meaning Engine

If you have cases where users employ idiomatic sentences or command-like sentences or if you are not too strict about some false positives then use the Fundamental Meaning (FM) engine.

The **Fundamental Meaning (FM) Engine** is a core NLP component of the Kore.ai XO Platform. It uses a computational linguistics approach (built on ChatScript) to analyze the structure of user utterances. Unlike probabilistic models (like ML), the FM engine is **deterministic**, meaning it uses specific semantic rules and language context to identify intent matches.

Below is a detailed breakdown of the original content and data extracted from the Kore.ai documentation:

### 1\. Engine Overview & Scoring

The FM engine identifies words based on meaning, position, conjugation, capitalization, and plurality. It scores utterances using these semantic rules:

- **Grammar & Sentence Structure:** Analyzes how words relate to each other.
- **Parts of Speech (POS):** Identifies nouns, verbs, etc.
- **Word Match & Coverage:** How much of the sentence matches the trained task name or pattern.
- **Word Position:** Where the keywords appear in the utterance.

### 2\. The FM Processing Pipeline

When a user speaks to the bot, the FM engine processes the text through several stages:

- **Tokenization:** Breaks text into units (tokens). Hyphenated words are kept together; digits are split (e.g., "2-3" becomes "2 - 3").
- **Substitution:** Expands abbreviations and texting shorthand. Developers can add **Bot Substitutions** (e.g., "Chevy" → "Chevrolet") to handle domain-specific jargon or ASR (speech-to-text) errors.
- **Merging:** Combines related tokens like "credit card" or "twenty five" into single units.
- **Spell Check:** Uses WordNet and VA-defined terms to correct typos (e.g., "wantt" → "want").
- **Lemmatization:** Reduces words to their base form (lemma) using the WordNet database.
- **Gleaning & POS Tagging:** Identifies parts of speech and marks sections of the utterance for further analysis.

### 3\. Key Training Components

You can train the FM engine using three main methods:

- **Synonyms:** Used when words for an intent or entity are interchangeable. The platform includes a built-in library, but you can add domain-specific synonyms.
- **Concepts:** Predefined sets of choices (e.g., ~world_country, ~colors).
  - **Custom Concepts:** You can create hierarchical concepts (concepts within concepts).
  - **Syntax:** original word | replacement word (e.g., NYC | New York City).
- **Patterns:** Used for complex intent detection, idiomatic expressions, or metaphors. Patterns provide high-precision matching that overrides other scores.

### 4\. FM Output Analysis

The engine evaluates the following to determine the "strength" of a match:

- **Role:** Identifies the Main Subject, Main Verb, and Main Object.
- **Tense:** Preference is often given to tasks in the **Present** or **Future** tense.
- **Match Type:** Distinction between an exact word match and a synonym match.

### 5\. Thresholds & Configurations

- **Intent Detection using Task Name:** By default, the engine matches intents if the user utterance contains words from the Task Name. This can be **disabled** to prevent false positives (e.g., if multiple tasks contain the word "order").
- **FM Threshold:** Limits the results sent to the "Ranking & Resolver."
  - **Range:** 0% to 20% (Default is 2%).
  - Only intents within this percentage of the top-scoring intent are considered, eliminating low-confidence matches.

### 6\. Additional Support Features

- **Bot Aliases:** Allows the bot to recognize itself by different names.
- **Bot Homophones:** Handles words that sound the same but have different meanings (critical for voice channels).
- **Emoji Support:** The engine can be configured to understand the intent behind specific emojis.

# Ranking and Resolver

Based on the Kore.ai documentation provided, here is a comprehensive breakdown of the **Ranking and Resolver (R&R)** engine and how it processes natural language detection.

### 1\. Overview of Ranking and Resolver

The Kore.ai NLP engine uses a hybrid approach involving three primary models to identify and score user intents:

- **Machine Learning (ML)**
- **Fundamental Meaning (FM)**
- **Knowledge Graph (KG)**

The Ranking and Resolver engine acts as the final decision-maker, re-ranking the results from these three engines to determine the "winning intent."

### 2\. Output of the Individual Engines

Each engine provides specific types of matches to the R&R component:

- **ML Engine Output:**
  - **Deterministic Match:** A fuzzy score match of \$\\ge\$ 95%.
  - **Probable Matches:** Confidence scores for intents.
  - **Top 5 Utterances:** The five closest utterances from the training set with a confidence score above the threshold (default 0.3).
- **KG Engine Output:**
  - **Deterministic Match:** Fuzzy match score of \$\\ge\$ 95%.
  - **Probable Matches:** Scores based on path terms (\$\\ge\$ 50%), word matches (\$\\ge\$ 60%), synonyms, and nodes matched.
- **FM Engine Output:**
  - **Deterministic Match:** Pattern matches or exact matches with the task name.
  - **Probable Matches:** Partial label matches and synonyms.

### 3\. The Working Process

Intents are classified into two categories:

- **Definitive Matches:** High confidence matches. In published assistants, a single definitive match executes immediately. Multiple definitive matches trigger an ambiguity dialog (presenting choices to the user).
- **Probable Matches:** Intents that score reasonably well but aren't exact. They are further classified into "Good" and "Unsure." In published assistants, these typically trigger "Did you mean?" suggestions.

### 4\. Deciding the Winning Intent

The R&R engine follows specific logic to choose the winner:

**If Definitive Matches are found:**

- A single definitive match wins.
- Multiple different definitive matches are treated as ambiguous and presented as choices.
- **Note:** If a deterministic intent is found, probable matches are generally ignored (unless "Prefer Definitive Matches" is disabled).

**If only Probable Matches are found:**

- **ML:** Scores the top 5 utterances for each intent.
- **KG:** Scores alternate and modified questions.
- **Ranking:** The scores are ranked. If the top score and the next closest score are within 2% of each other, they are treated as ambiguous.
- **KG Specifics:**
  - If only KG finds a probable intent with a score \$> 80\\%\$, it wins.
  - If the score is between \$60\\% - 80\\%\$, it is presented as a "Did you mean?" suggestion.

### 5\. Ranking & Resolver Versions

Kore.ai offers two versions of the R&R engine:

- **Version 1:** The standard version that rescored matches across all engines.
- **Version 2:** Specifically optimized for the **Few-shot ML Model**.
  - It ranks scores of definitive matches from ML and KG engines only (not FM).
  - It does **not** perform intent rescoring, aiming for higher accuracy by eliminating intents with lower proximity rather than those with semantic similarity.
  - FM configurations are disabled by default in V2.

### 6\. NLP Detection Scenarios

The documentation outlines four key scenarios for how the resolver behaves:

- **Scenario 1 (FM Definitive):** FM identifies a definitive match while ML finds nothing and KG finds a probable match. FM wins.
- **Scenario 2 (ML Definitive):** ML identifies a definitive match and FM identifies a probable one. ML wins.
- **Scenario 3 (KG Definitive):** KG finds a 100% path match (Definitive), while ML and FM find probable matches. KG wins.
- **Scenario 4 (Multiple Probable):** All three engines return probable matches. R&R re-ranks them, and the one with the highest score (often from the FM engine in keyword-heavy cases) is selected.

### 7\. Thresholds and Advanced Configurations

Users can fine-tune the R&R engine via **Build > Natural Language > Thresholds & Configurations**:

- **Prefer Definitive Matches:** Enabled by default. If disabled, all matches (definitive and probable) are rescored together.
- **Dependency Parsing Model:** Used to define the "Minimum Match Score" (default 0.5) to qualify an intent as a probable match.
- **Advanced Configurations:** A JSON editor is available for developers to manually adjust weights and scores associated with various parameters.

### 8\. Important Considerations

- Changing to **Version 2** is only recommended if using the Few-shot ML model.
- V2 works by eliminating matches with "lower proximity" rather than semantic similarity.
- Dependency Parsing is only supported in specific languages.

# Advanced NLP Configurations

**Advanced NLP Configurations** allow you to fine-tune intent detection for each enabled language. These settings are found under **Build > Natural Language > Training > Thresholds & Configurations > Advanced NLP Configurations**.

Below is a comprehensive breakdown of all the data available from the provided documentation.

### 1\. Machine Learning (ML) Engine Configurations

These settings primarily affect how the ML model is trained and how it processes user utterances.

| **Configuration** | **Description** | **Valid Inputs** | **Notes** |
| --- | --- | --- | --- |
| **Split Compound Words** | Splits compound words into stems for processing. | Enable, Disable (default) | Supported only for **German**. |
| **Split Combined Words** | Splits incorrectly combined words into valid words. | Enable, Disable (default) | Supported only for **Spanish**. |
| **None Intent** | Creates a placeholder intent to reduce false positives. | **Enable (default)**, Disable |     |
| **Epochs** | Iterations for training the neural network. | 20 to 300 (default 20) | Only for MLP-BOW, MLP-WordEmbeddings, LSTM, CNN. |
| **Batch Size** | Training samples used per batch. | 10 to 30 (default 10) | Only for MLP-BOW, MLP-WordEmbeddings, LSTM, CNN. |
| **Learning Rate** | Controls weight adjustments during training. | 1e-4 to 1e-3 (default 1e-03) | Only for MLP-BOW, MLP-WordEmbeddings, LSTM, CNN. |
| **Dropout** | Regularization to avoid overfitting. | 0 to 0.8 (default 0) | Only for MLP-BOW, MLP-WordEmbeddings, LSTM, CNN. |
| **Vectorizer** | Feature extraction technique. | **count (default)**, tfidf | Only for MLP-BOW. |
| **Max Sequence Length** | Max length of training sample/user input. | 10 to 30 (default 20) | Only for MLP-WordEmbeddings, LSTM, CNN. |
| **Embeddings Type** | Technique for featurization. | generated, **random (default)** | Only for MLP-WordEmbeddings, LSTM, CNN. |
| **Embeddings Dimensions** | Size of the embedding vector. | 100 to 400 (default 300) | Only for MLP-WordEmbeddings, LSTM, CNN. |
| **K Fold** | Groups for cross-validation. | 2 to 10 (default 2) |     |
| **Fuzzy Match** | Enables fuzzy matching for intent identification. | **Enable (default)**, Disable | Scores \$\\ge\$ 95 are definitive matches. |
| **Handle Negation** | Penalizes scores if negated words are found. | **Enable (default)**, Disable |     |
| **Ignore Multiple Occurrences** | Discards repeated words in an utterance. | **Enable (default)**, Disable | Only for MLP-BOW. |
| **Entity Placeholders** | Replaces entity values with placeholders in training. | **Enable (default)**, Disable | Only for MLP-BOW. |
| **Sentence Split** | Splits user input to perform intent detection. | **Enable (default)**, Disable |     |
| **Multiple Intent Models** | Separate ML models for primary intents/sub-intents. | Enable, **Disable (default)** |     |
| **NER Training Tagged** | Uses only tagged utterances for NER training. | **Enable (default)**, Disable |     |
| **Neurons in Hidden Layer** | Number of neurons in the hidden layer. | 0 to 1000 | Only for Standard Network Type. |
| **Softmax Temperature** | Confidence level for the winning intent. | 0 to 100 | Not for Standard Network. |
| **Spell Correction for ML** | Support spell correction on the ML bot dictionary. | Enable, **Disable (default)** | For English, French, Dutch. |
| **SpaCy Tokenizer** | Uses a specific tokenizer for NER/Intent accuracy. | Enable, **Disable (default)** | Only for French VAs in the DE region. |

### 2\. Knowledge Graph (KG) Engine Configurations

These settings optimize how FAQs and Knowledge Graph paths are matched.

| **Configuration** | **Description** | **Valid Inputs** |
| --- | --- | --- |
| **Lemmatize KG Synonyms** | Uses lemmatized versions of synonyms to detect intents. | **Enable (default)**, Disable |
| **Cosine Similarity Dampening** | Avoids penalty on short questions in KG matching. | **Enable (default)**, Disable |
| **FAQ Name as Intent Name** | Uses the Primary Question as the intent name. | Enable, **Disable (default)** |
| **FAQs Order for Disambiguation** | Order in which FAQs appear in ambiguity dialogs. | Order by Hierarchy, **Default Order (default)** |
| **Auto qualify FAQs** | Qualifies all FAQs from a fully matched path. | Enable, **Disable (default)** |
| **Taxonomy based KG** | Requires full match of all path terms for qualification. | Enable, **Disable (default)** |

### 3\. Fundamental Meaning (FM) Engine Configurations

These govern the "Deterministic" or pattern-based matching.

| **Configuration** | **Description** | **Valid Inputs** |
| --- | --- | --- |
| **Default Max Wildcards (Intent)** | Max wildcards allowed between words in patterns. | 0-9 (default 3) |
| **Default Max Wildcards (Entity)** | Max wildcards allowed for entity patterns. | 0-5 (default 2) |
| **Matching Order of Patterns** | Picks the first match or goes through all for the "best". | **First (default)**, Best |
| **Grading of Pattern Matches** | Marks pattern matches as Probable if wildcards \$> X\$. | 0-9 (default 3) |
| **Precedence (Ambiguous Entities)** | Chooses whether to favor Intent or Entity in conflict. | Use Precedence, Intent over Entity, **Entity over Intent (default)** |
| **Prefer Only First Pattern** | Pick only the first match or all in a single sentence. | **Enable (default)**, Disable |
| **Suppress Fallback** | Prevents "Intent Not Found" if a dialog is fulfilled. | **Enable (default)**, Disable |
| **Exact Task Name Match** | Auto-generates strict pattern if task name matching is off. | **Enable (default)**, Disable |
| **Resolve Sensitive Entity** | Validates/converts raw input for sensitive entities. | Enable, **Disable (default)** |

### 4\. Ranking & Resolver (RR) and General Configurations

- **Intent Elimination Rules (RR Engine):** \* **Description:** Applies prebuilt rules to eliminate intent matches.
  - **Valid Inputs:** **Enable (default)**, Disable.
  - **Notes:** Applicable for English, Spanish, French, and German.
- **Spell Correction Version:** \* **Description:** Selects the engine version for spell correction.
  - **Valid Inputs:** Version 1, Version 2.
  - **Notes:** For English, French, and Dutch.
- **Spell Correction Status:** \* **Description:** Overall toggle for the spell correction feature.
  - **Valid Inputs:** Enable, Disable.
- **Custom Configurations:** \* The platform allows adding custom JSON-based configurations. Developers should contact Kore.ai support for specific advanced use cases.

## NLP Organization within the XO Platform

To get started optimizing your VA's NLP, you need to select the VA you're working with, then access  **Build >** **Natural Language**. The NLP options are categorized under various headings for your convenience:

- **Training** - In the Training section, you can define how the NLP interpreter recognizes and responds to the user input for a VA, and then train the interpreter to recognize the correct user intent.
- **Thresholds & Configurations** - In this section, you can define the recognition confidence levels required for minimum recognition actions, the confidence range for asking a user to choose from a list of possible matches, and a recognition confidence level for a positive match for the knowledge graph.
- Modify **Advanced Settings** like auto training settings for user utterances and negative intent patterns.