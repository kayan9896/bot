import gradio as gr
from langchain.prompts import PromptTemplate
import os
from langchain.llms import OpenAI
from dotenv import load_dotenv

load_dotenv('.env')
k= os.getenv('key')
os.environ["OPENAI_API_KEY"] = k

# initialize the models
llm = OpenAI(
    model_name="text-davinci-003",
    openai_api_key= k
)


def chatbot(user_input):
    # defining a template
    template = """Question: {question}
    please provide step by step Answer:
    """
    prompt = PromptTemplate(template=template, input_variables=["question"])
    formated_prompt =prompt.format(question=str(user_input))
    return llm(formated_prompt)
demo = gr.Interface(fn=chatbot, inputs="text", outputs="text")
demo.launch()  