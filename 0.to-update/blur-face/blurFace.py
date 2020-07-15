from PIL import Image
import face_recognition
import sys
import cv2

image_file=sys.argv[1]
image_width=sys.argv[2]
image_height=sys.argv[3]
frame_rate=sys.argv[4]

input_movie = cv2.VideoCapture(image_file)
length = int(input_movie.get(cv2.CAP_PROP_FRAME_COUNT))

fourcc = cv2.VideoWriter_fourcc(*'XVID')
output_movie = cv2.VideoWriter('iexec/output.avi', fourcc, float(frame_rate), (int(image_width), int(image_height)))

# Load the jpg file into a numpy array
#image = face_recognition. o(image_file)

# This method is fairly accurate, but not as accurate as the CNN model and not GPU accelerated.
# See also: find_faces_in_picture_cnn.py
#face_locations = face_recognition.face_locations(image)
frame_number = 0

while True:
    # Grab a single frame of video
    ret, frame = input_movie.read()
    frame_number += 1

      # Quit when the input video file ends
    if not ret:
        break

    # Convert the image from BGR color (which OpenCV uses) to RGB color (which face_recognition uses)
    rgb_frame = frame[:, :, ::-1]

    face_locations = face_recognition.face_locations(rgb_frame)

    print("I found {} face(s) to blur in this photograph.".format(len(face_locations)))
    count = 0;
    for top, right, bottom, left in face_locations:

       # Extract the region of the image that contains the face
       face_image = frame[top:bottom, left:right]
       face_image = cv2.GaussianBlur(face_image, (99, 99), 30)
       frame[top:bottom, left:right] = face_image

       count = count + 1;
       # Print the location of each face in this image
       #top, right, bottom, left = face_location
       print("A face to blur is located at pixel location Top: {}, Left: {}, Bottom: {}, Right: {}".format(top, left, bottom, right))

    # You can access the actual face itself like this:
    print("Writing frame {} / {}".format(frame_number, length))
    output_movie.write(frame)
    #face_image = image[top:bottom, left:right]
    #pil_image = Image.fromarray(face_image)

# All done!
input_movie.release()
cv2.destroyAllWindows()
