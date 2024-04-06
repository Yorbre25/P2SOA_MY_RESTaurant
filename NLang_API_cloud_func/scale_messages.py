
def get_scales_message(scale):
    msg=""
    match scale:
        case 0:
            msg="We're sorry to hear that you had a poor experience with our service. We'll strive to improve."
        case 1: 
            msg="We apologize that your experience with our service was less than satisfactory. Your feedback is valuable to us."
        case 2:
            msg="Thank you for your feedback! We'll take it into consideration to enhance our service."
        case 3:
            msg="We're glad you enjoyed our service! Your positive feedback motivates us to keep up the good work."
        case 4:
            msg="Wow! We're thrilled to hear that you had an outstanding experience with our service. Thank you for your support!"
        case _: 
            msg=""
    return msg
