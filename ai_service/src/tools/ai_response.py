from openai import AsyncOpenAI

from config import settings
from schemas.rating import RatingPromptSchema


async def get_ai_response(prompt_schema: RatingPromptSchema):
    try:
        messages = [
            {"role": "system", "content": "You are a construction expert with 20 years of experience in restoring damaged infrastructures in Ukraine. "
                                          "Task: Based on the user-entered building characteristics, assess: Whether the building can be repaired or is it more appropriate to rebuild it from scratch. Estimate the cost of the work in monetary terms (approximate amount in US dollars). "},
            {"role": "user", "content": f"""
            Region: {prompt_schema.region}
            Type of infrastructure: {prompt_schema.type_of_infrastructure}
            Damage level: {prompt_schema.extent_of_damage}
            Date of damage: {prompt_schema.date_of_event}
            Description: {prompt_schema.description}
            """
             },
            # Additional information: {prompt_schema.additional_info}
            # """},
            {"role": "system", "content": """
            return response in JSON format with the following fields:
            ```
            {{
                'money_evaluation': int,
                "can_be_repaired": bool // true if the building can be repaired, false if it is more appropriate to rebuild it from scratch
            }}
            ```
            without any special characters or additional text, only raw JSON
            """},
        ]
        client = AsyncOpenAI(api_key=settings.open_ai_api_key,
                             max_retries=3)
        response = await client.chat.completions.create(
                model=settings.gpt_model,
                messages=messages,
                temperature=0.0
            )
        result = response.choices[0].message.content
        result = result.replace('json', '')
        result = result.replace('`', '')
        result = result.replace('\n', '')
        return result
    except Exception as e:

if __name__ == "__main__":
    import asyncio
    from config import settings
    from schemas.rating import RatingPromptSchema

    prompt = RatingPromptSchema(
        region="Kyiv",
        type_of_infrastructure="Residential building",
        extent_of_damage="Severe damage",
        date_of_event="2022-03-01",
        source_link="No additional information"
    )
    response = asyncio.run(get_ai_response(prompt))
    print(response)