#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Wed Jan 19 15:57:20 2022

@author: leonardomartinez
@author: jpechiar 20220303
"""

import json
import os
import sys

import cv2 as cv
import numpy as np

BASE_OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "outputs")

# los clicks del usuario
# marcas_imagen = []


# def onMouse(event, x, y, flags, param):
#     if event == cv.EVENT_LBUTTONDOWN:
#         marcas_imagen.append((x,y))

def selectFile(file_path):
    return file_path

def sortMarks(marcas_originales):
    """Given a list of coordinate tuples { (x,y)...}, sort them by
    row / column. Assumes a reasonable aligned cuadrilateral.
    Returns top-right, top-left, bottom-right, bottom-left."""
    return sorted(marcas_originales, key=lambda marca: (marca[0] + 3 * marca[1]))


def interpolatePoints( point1, point2, numSpaces ):
    """Given 2 coordinate tuples, return a list of numSpaces + 1 tuples,
    evenly spaced, including beginning and ending on the given points.
    Returned tuples are integers."""
    alfa = 1.0 / numSpaces
    ret = []
    x1 = float( point1[0] )
    x2 = float( point2[0] )
    y1 = float( point1[1] )
    y2 = float( point2[1] )
    deltaX = x2-x1
    deltaY = y2-y1
    for i in range( numSpaces + 1 ):
        x = x1 + alfa*i*deltaX
        y = y1 + alfa*i*deltaY
        ret.append( (int(x),int(y)) )
    return ret


def getMidpoints( coordinates ):
    """Given a list of coordinate tuples, return the list of coordinates
    in the midpoint of consecutive input coordinates. The return list contains
    1 point less than the input."""
    ret = []
    if( len(coordinates) < 2 ):
        return None
    for i in range( len(coordinates) - 1 ):
        ret.append(
            interpolatePoints( coordinates[i], coordinates[i+1], 2 )[1])
    return ret



# def inputCorners(image_rgb):
#     """Mostrar imagen, permitir que el usuario haga clic en 4 coordenadas y retornar la lista de coordenadas.
#     La imagen proporcionada se modificará con las marcas."""
#
#     marcas_imagen = []
#
#     def onMouse(event, x, y, flags, param):
#         if event == cv.EVENT_LBUTTONDOWN:
#             marcas_imagen.append((x, y))
#             cv.drawMarker(image_rgb, (x, y), color=(0, 0, 255), markerType=cv.MARKER_TILTED_CROSS,
#                           markerSize=20, thickness=2)
#             cv.imshow("Select", image_rgb)
#
#     cv.imshow("Select", image_rgb)
#     cv.namedWindow('Select')
#     cv.setMouseCallback('Select', onMouse)
#
#     while True:
#         if len(marcas_imagen) == 4:
#             confirm = messagebox.askyesno("Confirmación", "¿Deseas confirmar la selección de esquinas?")
#             if confirm:
#                 break
#             else:
#                 # Eliminar las marcas anteriores
#                 cv.destroyAllWindows()
#                 sys.exit(0)
#
#         key = cv.waitKey(10)
#         if key == 27:  # Esc key
#             cv.destroyAllWindows()
#             sys.exit(0)
#
#     cv.destroyAllWindows()
#     print(marcas_imagen)
#     return marcas_imagen



def get1345( inputList ):
    """Return list without 2nd element."""
    ret = inputList
    del ret[1]
    return ret


def getAllMidpoints( corners ):
    """Given 4 (unsorted) corners, get the list of center coordinates for
    the 18 color patches. Order is left to right, top to bottom."""
    ret = []
    scorners = sortMarks( corners )
    leftMidPoints = getMidpoints(get1345( interpolatePoints( scorners[0], scorners[2], 4 )))
    rightMidPoints = getMidpoints(get1345( interpolatePoints( scorners[1], scorners[3], 4 )))
    for i in range(len(leftMidPoints)): # type: ignore
        ret = ret + getMidpoints(
            interpolatePoints( leftMidPoints[i], rightMidPoints[i], 6 )) # type: ignore
    return ret


def addMarkers( image_rgb, points ):
    """Show image with markers; modifies image; exit with q keypress."""
    for coord in points:
        cv.drawMarker( image_rgb, coord, color=(0,255,0), markerType=cv.MARKER_TILTED_CROSS, markerSize=20, thickness=2 )


def showImage( image_rgb, delay=1000 ):
    cv.imshow("Select", image_rgb)
    cv.namedWindow('Select')
    cv.waitKey(10000000)

def blurImage( image_in ):
    """Blur the given image destructively."""
    image_blur = cv.blur( image_in, (5,5) )
    return image_blur


def pickColors( image_rgb, points ):
    """return list of colors for a given list of coordinates, in r,g,b format"""
    ret = []
    for a in points:
        color = image_rgb[ a[1], a[0] ]
        ret.append( (color[2], color[1], color[0]) )
    return ret


def pickGrays( image_rgb, points ):
    """return the list of gray values in the first row (1st 6 points)"""
    image_gray = cv.cvtColor( image_rgb, cv.COLOR_RGB2GRAY )
    ret = []
    for a in points:
        ret.append( image_gray[ a[1], a[0] ] )
    return ret


def pickHues( image_rgb, points ):
    """return the list of Hue values in the 2nd and 3rd rows"""
    image_hsv = cv.cvtColor( image_rgb, cv.COLOR_RGB2HSV )
    ret = []
    for a in points:
        ret.append( image_hsv[ a[1], a[0] ][0] )
    return ret


def pickSaturations( image_rgb, points ):
    """return the list of Saturation values in the 2nd and 3rd rows"""
    image_hsv = cv.cvtColor( image_rgb, cv.COLOR_RGB2HSV )
    ret = []
    for a in points:
        ret.append( image_hsv[ a[1], a[0] ][1] )
    return ret


def pickHSV( image_rgb, points ):
    """return list of CIE XY value pairs for a given list of coordinates"""
    image_hsv = cv.cvtColor( image_rgb, cv.COLOR_RGB2HSV )
    ret = []
    for a in points:
        color = image_hsv[ a[1], a[0] ]
        ret.append( (color[0], color[1], color[2]) )
    return ret


def pickLAB( image_rgb, points ):
    """return list of CIE LAB value pairs for a given list of coordinates"""
    image_LAB = cv.cvtColor( image_rgb, cv.COLOR_RGB2Lab )
    ret = []
    for a in points:
        color = image_LAB[ a[1], a[0] ]
        ret.append( (color[0], color[1], color[2]) )
    return ret


def pickXY( image_rgb, points ):
    """return list of CIE XY value pairs for a given list of coordinates"""
    image_XYZ = cv.cvtColor( image_rgb, cv.COLOR_RGB2XYZ )
    ret = []
    for a in points:
        color = image_XYZ[ a[1], a[0] ]
        ret.append( (color[0], color[1]) )
    return ret


def formatRgbHsvXy( image_rgb, points ):
    """Return string represntation in R,G,B,G,H,S,V,X,Y of a set of colors."""
    ret        = ""
    pointsRGB  = pickColors( image_rgb, points )
    pointsGrey = pickGrays( image_rgb, points )
    pointsHSV  = pickHSV( image_rgb, points )
    pointsXY   = pickXY( image_rgb, points )
    for a in range(len(points)):
        ret = ret + "{}{}{}{}{}{}".format(pointsRGB[a][0],'\t',
                                          pointsRGB[a][1],'\t',
                                          pointsRGB[a][2],'\t')
        ret = ret + "{}{}".format(pointsGrey[a],'\t')
        ret = ret + "{}{}{}{}{}{}".format(pointsHSV[a][0],'\t',
                                          pointsHSV[a][1],'\t',
                                          pointsHSV[a][2],'\t')
        ret = ret + "{}{}{}{}".format(pointsXY[a][0],'\t',
                                      pointsXY[a][1],'\n')
    return ret


def formatLab( image_rgb, points):
    """Return string represntation in L,a,b of a set of colors"""
    ret        = ""
    pointsLAB  = pickLAB( image_rgb, points )
    for a in range(len(points)):
        ret = ret + "{}{}{}{}{}{}".format(pointsLAB[a][0],'\t',
                                          pointsLAB[a][1],'\t',
                                          pointsLAB[a][2],'\n')

    return ret


def flipList( list18 ):
    """Reorder the 18 points to account for horizontally flipped images."""
    myorder = [5, 4, 3, 2, 1, 0, 11, 10, 9, 8, 7, 6, 17, 16, 15, 14, 13, 12];
    return [list18[i] for i in myorder]


def isImageFlipped( imageRGB, darkpoint, lightpoint ):
    """return true if image at darkpoint is lighter than image at lightpoint."""
    targets = pickGrays( imageRGB, [darkpoint, lightpoint] )
    if ( targets[0] > targets[1] ):
        return True
    else:
        return False


def main(image_path, corners):
    if not os.path.exists(image_path):
        print("El archivo de imagen no existe.")
        return

    basename = os.path.basename(image_path)
    imagen_dut = cv.imread(image_path)
    imagen_dut_rgb = cv.cvtColor(imagen_dut, cv.COLOR_BGR2RGB)
    imagen_dut_rgb_copy = np.copy(imagen_dut_rgb)

    midpoints = getAllMidpoints(corners)
    addMarkers(imagen_dut_rgb_copy, midpoints)
    iblur = blurImage(imagen_dut_rgb)

    if isImageFlipped(iblur, midpoints[5], midpoints[0]):
        print("FLIPPED")
        midpoints = flipList(midpoints)

    colorSamples = pickColors(iblur, midpoints)
    lab_format = formatLab(iblur, midpoints)

    if not os.path.exists(BASE_OUTPUT_DIR):
        os.makedirs(BASE_OUTPUT_DIR)

    filename = basename.split('.')[0] + "_Lab.txt"
    filepath = os.path.join(BASE_OUTPUT_DIR, filename)

    with open(filepath, "w") as file:
        file.write(lab_format)

    image_filename = basename.split('.')[0] + "_marked.jpg"
    image_filepath = os.path.join(BASE_OUTPUT_DIR, image_filename)
    cv.imwrite(image_filepath, cv.cvtColor(imagen_dut_rgb_copy, cv.COLOR_RGB2BGR))

    output = {'lab_format': lab_format, 'filename': filename, 'image_filename': image_filename}
    print(json.dumps(output))

if __name__ == "__main__":
    image_path = sys.argv[1]
    coordinates_str = sys.argv[2]

    coordinates = [int(num) for num in coordinates_str.split(',')]
    coordinates = [(coordinates[i], coordinates[i + 1]) for i in range(0, len(coordinates), 2)]

    main(image_path, coordinates)