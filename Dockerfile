# ---- Build Stage ----
FROM node:16 AS build
WORKDIR /usr/src/app

# Instalar Python y pip, y actualizar pip
RUN apt-get update && \
    apt-get install -y python3 python3-pip && \
    pip3 install --upgrade pip && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN apt-get update && apt-get install -y libgl1-mesa-glx

# Copiar los archivos necesarios para instalar dependencias de Node.js y Python
COPY package*.json ./

# Instalar las dependencias del proyecto Node.js
RUN npm install

# Copiar el resto de los archivos del proyecto
COPY . .

# Crear la carpeta 'scripts/outputs' dentro de la carpeta 'scripts'
RUN mkdir -p /usr/src/app/src/scripts/outputs

# Generar prisma
RUN npx prisma generate

# Construir la aplicación Node.js
RUN npm run build

# ---- Run Stage ----
FROM node:16-slim
WORKDIR /usr/src/app

# Instalar libssl y Python en la etapa de ejecución
RUN apt-get update && \
    apt-get install -y libssl1.1 python3 python3-pip libgl1-mesa-glx && \
    pip3 install --upgrade pip && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN apt-get update && apt-get install -y libgl1-mesa-glx

# Copiar desde la etapa de construcción
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/package.json ./package.json
COPY --from=build /usr/src/app/src/scripts ./src/scripts

# Crear la carpeta 'scripts/outputs' dentro de la carpeta 'scripts'
RUN mkdir -p /usr/src/app/src/scripts/outputs

# Instalar las dependencias del proyecto Python en la etapa de ejecución
COPY requirements.txt ./
COPY .env ./

RUN pip3 install --no-cache-dir -r requirements.txt

# Exponer el puerto en el que se ejecutará la aplicación Node.js
EXPOSE $PORT

# Comando para ejecutar la aplicación
CMD ["node", "dist/main.js"]