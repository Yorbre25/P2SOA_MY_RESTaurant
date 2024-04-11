import functions_framework
from sentiments_model_retriever import predict_text_sentiment_analysis_sample
from scale_messages import get_scales_message

@functions_framework.errorhandler(KeyError)
def handle_key_error(e):
    response={
        'msg':str(e)
    }
    return response, 400

@functions_framework.errorhandler(AssertionError)
def handle_assertion_error(e):
    response={
        'msg': "Method not allowed"
    }
    return response, 405



@functions_framework.http
def sentiment_api(request):

    assert request.method == "POST" #checking that the only method used is POST

    request_json = request.get_json(silent=True)
    request_args = request.args
    param='review'

    if request_json and param in request_json: # get review parameter from body
        review = request_json[param]
    else: 
        raise KeyError("Bad Request: the requested parameters were no send") #if the needed keys are not in the request
    
    if(type(review)!=str):
        raise KeyError("The review value must be a string") #wrong key type

    try:
        sentiment_json= predict_text_sentiment_analysis_sample(content=review) # make the request to the sentiment analysis model

        sentiment_scale=sentiment_json['sentiment']
        sentiment_msg=get_scales_message(sentiment_scale) #getting the message related to the value on the scale

        response = { #building the reponse 
            "scale": sentiment_scale,
            "msg"  : sentiment_msg
        }
    except:
        response = { #building the reponse 
            "scale": 0,
            "msg"  : "no valid review message, please review your message"
        }
    return response,200
