import langchain
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
import os
from langchain.llms import OpenAI
from dotenv import load_dotenv
from langchain.chains import ConversationChain
from langchain.memory import ConversationBufferWindowMemory, CombinedMemory, ConversationSummaryMemory
import time

load_dotenv('.env')
k= os.getenv('key')
os.environ["OPENAI_API_KEY"] = k

# initialize the models
llm = OpenAI(
    model_name="text-davinci-003",
    openai_api_key= k
)


def chatbot(complaint):
    # defining a template
    template = """Question: {question}
    please provide step by step Answer:
    """
    # prompt = PromptTemplate(template=template, input_variables=["question"])
    # formated_prompt =prompt.format(question=str(user_input))
    # return llm(formated_prompt)

    prompt = PromptTemplate(input_variables=["complaint"], template="I am a customer service representative. I received the following complaint: {complaint}. My response is:")
    # Create a language model chain with the defined prompt template
    chain = LLMChain(llm=llm, prompt=prompt)
    return chain.run(complaint)

def coverletter(position, company, skills):
    prompt = PromptTemplate(
    input_variables=["position", "company", "skills"],
    template="Use this draft to write a more detailed cover letter:\n'Dear Hiring Manager,\n\nI am writing to apply for the {position} position at {company}. I have experience in {skills}.\n\nThank you for considering my application.\n\nSincerely,\n[Your Name]'",
)

    formatted_prompt = prompt.format(position=position, company=company, skills=skills)
    response = llm(formatted_prompt)
    return response




# Set up conversation memory
# This memory will store the last k turns of conversation
conv_memory = ConversationBufferWindowMemory(
    memory_key="chat_history_lines",
    input_key="input",
    k=1
)

# This memory will store a summary of the conversation
summary_memory = ConversationSummaryMemory(llm=OpenAI(), input_key="input")

# Combine the two memories
memory = CombinedMemory(memories=[conv_memory, summary_memory])

# Define the template for the conversation prompt
_DEFAULT_TEMPLATE = """The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know.

Summary of conversation:
{history}
Current conversation:
{chat_history_lines}
Human: {input}
AI:"""

# Create the prompt from the template
PROMPT = PromptTemplate(
    input_variables=["history", "input", "chat_history_lines"], template=_DEFAULT_TEMPLATE
)

# Set up the conversation chain
# This object will handle the conversation flow
conversation = ConversationChain(
    llm=llm,
    verbose=True,
    memory=memory,
    prompt=PROMPT
)
chat_history=[]
def respond(message):
    bot_message = conversation.run(message)  # Run the user's message through the conversation chain
    chat_history.append((message, bot_message))  # Append the user's message and the bot's response to the chat history
    time.sleep(1)  # Pause for a moment
    return bot_message, chat_history  # Return the updated chat history

from langchain.agents import load_tools
from langchain.agents import initialize_agent
def google(txt):
# Equipting the agent with some tools
    tools = load_tools([ "google-search", "wikipedia","requests_all","human"], llm=llm)

# Defining the agent
    agent = initialize_agent(tools, llm=llm, agent="zero-shot-react-description", verbose=True)
    agent.run(txt)