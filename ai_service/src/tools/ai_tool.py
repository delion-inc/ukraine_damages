import base64
import json

from langchain.agents import initialize_agent, Tool, AgentType
from langchain.chat_models import ChatOpenAI
from langchain.tools import DuckDuckGoSearchRun
from config import settings
from schemas.rating import RatingPromptSchema
from tools.images import transcribe_images

search = DuckDuckGoSearchRun()
class DamageEvaluation:
    def __init__(self):
        self.llm = ChatOpenAI(model_name=settings.gpt_model, temperature=0.2, api_key=settings.open_ai_api_key, max_tokens=16384)
        self.search_tool = Tool(
            name="Search",
            func=search.run,
            description="Search for current prices for building materials, windows, renovations, apartments, houses, etc."
        )
        self.agent = initialize_agent(
            tools=[self.search_tool],
            llm=self.llm,
            agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
            verbose=True,
            handle_parsing_errors=False
        )

    def run(self, prompt_schema: RatingPromptSchema):
        described_image = transcribe_images(prompt_schema.photo_before, prompt_schema.photo_after, is_encoded=True, description=prompt_schema.description)
        prompt = self.prompt_preparation(
            area_size_sqm = prompt_schema.area_size_sqm,
            floors = prompt_schema.floors,
            object_type = prompt_schema.object_type,
            address = prompt_schema.address,
            description = prompt_schema.description,
            construction_year = prompt_schema.construction_year,
            photo_description = described_image,
        )
        response = self.agent.run(prompt)
        return self.__update_response(response)

    def __update_response(self, response):
        response = response.replace('json', '')
        response = response.replace('`', '')
        response = response.replace('\n', '')
        response = response.replace('```', '')
        response = response.replace('```json', '')
        response = response.replace('Final answer:', '')
        response = response.replace('Final answer', '')
        response = json.loads(response)

        return response["final_response"] if "final_response" in response else response

    def prompt_preparation(self, **kwargs):

        basic_prompt = """
Estimate the cost of repairing an apartment with an area {area_size_sqm} of  square meters after war damage an {floors} floors {object_type} on address: {address} .
If it is completely destroyed, look for not just repairs but reconstruction and the cost of building the object
Describe the cost of work and materials separately, find approximate prices in Ukraine for .

NOTE: - Be responsible and do not provide false information.
- If you find some info in the search, please provide it in the response.
- If you find something, don`t search it again.
 

Here is a description of the damage from user:
{description}

construction_year - {construction_year} 

Here is a photo description of the building the damage:
{photo_description}

Make final response in Ukrainian language!

Return final response in next format:

```
Final Answer:
{{
"money_evaluation": int, // total cost of repairs in dollars
"description": str, // description of the reasons for the cost. List the main expenses (only in str format) in Ukrainian language
}}
```

without any special characters or additional text, only raw JSON
        """
        prompt = basic_prompt.format(**kwargs)
        return prompt



if __name__ == "__main__":
    def __encode_image(image_path):
        with open(image_path, "rb") as image_file:
            return base64.b64encode(image_file.read()).decode('utf-8')

    damage_evaluation = DamageEvaluation()
    result = damage_evaluation.run(RatingPromptSchema(
        area_size_sqm=100,
        floors=5,
        object_type="Residential building",
        address="Kyiv, Ukraine",
        description="Severe damage to the facade and windows.",
        construction_year=2000,
        photo_before=__encode_image(r"C:\Users\uarmo\Downloads\1.jpg"),
        photo_after=__encode_image(r"C:\Users\uarmo\Downloads\2.jpg")
    ))
    print(result)