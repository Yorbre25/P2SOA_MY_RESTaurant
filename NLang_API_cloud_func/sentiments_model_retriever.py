
import json
from google.cloud import aiplatform
from google.cloud.aiplatform.gapic.schema import predict
from google.protobuf import json_format
from google.protobuf.struct_pb2 import Value


def predict_text_sentiment_analysis_sample(
    content: str = "",
):
    endpoint=get_endpoint()
    # The AI Platform services require regional API endpoints.
    client_options = {"api_endpoint": endpoint['api_endpoint']}
    # Initialize client that will be used to create and send requests.
    # This client only needs to be created once, and can be reused for multiple requests.
    client = aiplatform.gapic.PredictionServiceClient(client_options=client_options)
    instance = predict.instance.TextSentimentPredictionInstance(
        content=content,
    ).to_value()
    instances = [instance]
    parameters_dict = {}
    parameters = json_format.ParseDict(parameters_dict, Value())
    endpoint = client.endpoint_path(
        project=endpoint['project'], location=endpoint['location'], endpoint=endpoint['endpoint_id']
    )
    response = client.predict(
        endpoint=endpoint, instances=instances, parameters=parameters
    )
  
    predictions = response.predictions
    return dict(predictions[0])


        

def get_endpoint():
    with open('sentiment_analysis_endpoint.json', 'r') as file:
        endpoint_json = json.load(file) 
    return endpoint_json

