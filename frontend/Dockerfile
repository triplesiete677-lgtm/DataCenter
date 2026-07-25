FROM nginx:alpine

# Copiar el frontend al directorio donde Nginx sirve contenido
COPY . /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]