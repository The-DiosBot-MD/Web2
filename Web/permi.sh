#!/bin/bash

# Ruta del directorio
DIR="/var/www/Web"

# Verifica si el directorio existe
if [ ! -d "$DIR" ]; then
    echo "El directorio $DIR no existe."
    exit 1
fi

echo "Asignando permisos completos a $DIR y subdirectorios..."

# Cambiar dueño a www-data (opcional)
chown -R www-data:www-data "$DIR"

# Dar permisos de lectura, escritura y ejecución a todo
chmod -R 777 "$DIR"

echo "Permisos aplicados correctamente."
