import cv2
import numpy as np
import sys
import json

TIME_START_SECONDS = 1
TIME_END_SECONDS = 6

num_bins = 100
channels = [0, 1, 2]

# Ahora solo necesitas un argumento para el nombre del archivo de video.
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
    'luminancia': None
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
    frame_avg_lav = cv2.cvtColor(frame_max, cv2.COLOR_RGB2Lab)

    average_values = cv2.mean(frame_avg_lav)
    luminance = average_values[0]

    frame_diff = cv2.subtract(frame_max, frame_min)
    frame_diff_scaled = cv2.convertScaleAbs(frame_diff, alpha=8.0)
    bigaverage = 0.0
    for ch in channels:
        histogram = cv2.calcHist([frame_diff_scaled], [ch], None, [num_bins], [0, 256])
        sum_hist = sum(bin * histogram[bin, 0] for bin in range(num_bins))
        average = sum_hist / imPixels
        bigaverage += average

    results['nivel_de_ruido'] = bigaverage / len(channels)
    results['luminancia'] = luminance

json_results = json.dumps(results)
print(json_results)

cap.release()
cv2.destroyAllWindows()
