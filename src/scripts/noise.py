import cv2
import numpy as np
import sys
import json
import os

TIME_START_SECONDS = 1
TIME_END_SECONDS = 6
BASE_OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "outputs")

num_bins = 100
channels = [0, 1, 2]

filename = sys.argv[1]

cap = cv2.VideoCapture(filename)

fps = cap.get(cv2.CAP_PROP_FPS)

frame_count = 0

frame_start = int(TIME_START_SECONDS * fps)
frame_end = int(TIME_END_SECONDS * fps)

frame_max = None
valid_output = False

results = {
    'nivel_de_ruido': None,
    'luminancia': None,
    'output_filename': None
}

while (cap.isOpened()):
    ret, frame = cap.read()

    if ret:
        if frame_count >= frame_end:
            break
        elif frame_count >= frame_start:
            if frame_max is None:
                frame_max = frame.copy()
                frame_min = frame.copy()
                imH, imW, imC = frame.shape
                imPixels = imH * imW
                valid_output = True

            frame_max = cv2.max(frame, frame_max)
            frame_min = cv2.min(frame, frame_min)

        frame_count += 1
    else:
        break

if valid_output:
    frame_avg = cv2.addWeighted(frame_max, 0.5, frame_min, 0.5, 0.0)
    frame_avg_rgb = cv2.cvtColor(frame_avg, cv2.COLOR_BGR2RGB)
    frame_avg_lav = cv2.cvtColor(frame_avg, cv2.COLOR_RGB2Lab)

    average_values = cv2.mean(frame_avg_lav)
    luminance = average_values[0]

    frame = cv2.subtract(frame_max, frame_min)
    frame8 = cv2.convertScaleAbs(frame,alpha=8.0)
    bigaverage = 0.0
    for ch in channels:
        histogram = cv2.calcHist([frame8], [ch], None, [num_bins], [0, 256])
        sum_hist = sum(bin * histogram[bin, 0] for bin in range(num_bins))
        average = sum_hist / imPixels
        bigaverage += average

    image_filename = os.path.basename(filename).split('.')[0] + "_noise.jpg"
    image_filepath = os.path.join(BASE_OUTPUT_DIR, image_filename)
    cv2.imwrite(image_filepath, frame8)

    results['nivel_de_ruido'] = bigaverage / len(channels)
    results['luminancia'] = luminance
    results['output_filename'] = image_filename

json_results = json.dumps(results)
print(json_results)

cap.release()
cv2.destroyAllWindows()

