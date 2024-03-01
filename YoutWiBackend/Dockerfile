# Usar una imagen base de Node.js
FROM node:21

# Crear un directorio en el contenedor para la aplicación
WORKDIR /usr/src/app

# Copiar los archivos de definición de paquetes al directorio de trabajo
COPY package*.json ./

# Instalar las dependencias del proyecto
RUN npm install

# Copiar todos los archivos del proyecto al contenedor
COPY . .

# Exponer el puerto en el que tu aplicación se ejecutará dentro del contenedor
EXPOSE 8080

# Comando para iniciar la aplicación
CMD [ "npm", "run", "dev" ]
