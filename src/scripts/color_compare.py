#Función que compara colores capturados por la camara del DUT en espacio Lab. Espera archivos txt generados por "get_colors.py"
#Devuelve el error de Luminancia promedio en escala de grises y de color para los cuadros de color en comparación 
# con archivo de referencia.

import sys
import numpy as np
import os
import json


current_dir = os.path.dirname(os.path.abspath(__file__))
REFERENCE_IMG_DIR = os.path.join(current_dir, "reference")
BASE_OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "outputs")

GRAY_COUNT = 6
COLOR_COUNT = 18

#Function that gets the text file and outputs a list of 12 colors in the format (L,a,b)
def decodeFile(file_name):
    colors_list = []

    with open(file_name, encoding = 'utf-8') as file:
        line = file.readline()

        while(line != ""):

            line_sp = line.split('\t')
            L = int(line_sp[0])
            a = int(line_sp[1])
            b = int(line_sp[2][:-1])

            colors_list.append([L,a,b])
            line = file.readline()

    return colors_list

#Function that calculates indicator for color performance
def calculateIndicators(Lab_img, Lab_reference):

    #grayscale_error (error absoluto de L promedio en los 6 primeros colores)
    #color_error (distancia euclideana entre img y referencia promedio en los 12 últimos colores)
    gs_error = 0
    color_error = 0

    for i in range(len(Lab_img)):
        if i >= GRAY_COUNT:
            L_diff_sq = ((Lab_img[i][0] - Lab_reference[i][0]))**2
            a_diff_sq = ((Lab_img[i][1] - Lab_reference[i][1]))**2
            b_diff_sq = ((Lab_img[i][2] - Lab_reference[i][2]))**2

            color_error += (L_diff_sq + a_diff_sq + b_diff_sq)**0.5
        else:
            gs_error += np.abs(Lab_img[i][0] - Lab_reference[i][0])

    color_error /= COLOR_COUNT - GRAY_COUNT
    gs_error /= GRAY_COUNT

    output = {'desvio_grises': "{:.2f}".format(gs_error), 'desvio_color': "{:.2f}".format(color_error)}
    print(json.dumps(output))
#     print("El error promedio de luminancia es de " + "{:.2f}".format(gs_error))
#     print("El promedio de color " + "{:.2f}".format(color_error))

def main(filename):
    filepath = os.path.join(BASE_OUTPUT_DIR, filename)
    reference = os.path.join(REFERENCE_IMG_DIR, "ref_NEF.lab")

    if filepath.endswith(".txt"):

        color_list_file = []
        color_list_reference = []

        #open files and populate lists
        color_list_file = decodeFile(filepath)
        color_list_reference = decodeFile(reference)

        color_dut = np.array(color_list_file)
        color_reference = np.array(color_list_reference)

        calculateIndicators(color_dut, color_reference)

    else:
        print("Se debe ingresar un archivo con extensión .txt generado mediante get_colors.py")

if __name__ == '__main__':
    if len(sys.argv) != 2:
        print("Se debe ingresar un archivo con extensión .txt generado mediante get_colors.py")
    else:
        filename = sys.argv[1]
        main(filename)





