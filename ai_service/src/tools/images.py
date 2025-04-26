import base64
from langchain_community.callbacks import get_openai_callback
from langchain_community.chat_models import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage
from config import settings


def __encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')


def transcribe_images(image_path1, image_path2=None, is_encoded=False, description=None):
    total_cost = 0

    if not is_encoded:
        base64_image1 = __encode_image(image_path1)
        base64_image2 = __encode_image(image_path2)
    else:
        base64_image1 = image_path1
        base64_image2 = image_path2
    llm = ChatOpenAI(model_name=settings.gpt_model,
                     openai_api_key=settings.open_ai_api_key,
                     max_tokens=5000)
    messages = [
        SystemMessage(
            content=[
                {
                    "type": "text",
                    "text": "Your task is to evaluate the building in as much detail as possible. Year, approximate price, etc. And also describe the damage to the object in great detail in the photo (area, nature and location of damage, type of damage, etc.)"
                }
            ]
        ),
        SystemMessage(
            content=[
                {
                    "type": "text",
                    "text": "Answer in detail but without emoticons or any highlighting. Just plain text."
                }
            ]
        )
        ,
        HumanMessage(
            content=[
                {
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:image/jpeg;base64,{base64_image1}"
                    },
                },
            ]
        ),
        HumanMessage(
            content=[
                {
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:image/jpeg;base64,{base64_image2}"
                    },
                },
            ]
        )
    ]
    if description:
        messages.append(
                HumanMessage(
                    content=[
                        {
                            "type": "text",
                            "text": description
                        }
                    ]
                )
            )
    with get_openai_callback() as cb:
        response = llm.invoke(messages)
        total_cost += cb.total_cost
        return response.content


if __name__ == "__main__":
    # Example usage
    print(transcribe_images(r"C:\Users\uarmo\Downloads\1.jpg",
                           r"C:\Users\uarmo\Downloads\2.jpg"),
          )