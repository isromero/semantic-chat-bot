# Semantic Chat Bot para Educaia (Prueba técnica)

## Descripción

Este proyecto implementa un servicio de caché semántico mediante embeddings de OpenAI para un chatbot, diseñado para optimizar y reducir los costos de las consultas utilizando similaridad semántica. Esto permite agrupar preguntas similares y reutilizar respuestas ya existentes, ahorrando en costes. Además, se incluye una interfaz de usuario que permite visualizar y editar las respuestas.

## Tecnologías Utilizadas

- **Next.js**: Para el servidor API y la interfaz de usuario.
- **PostgreSQL**: Para el almacenamiento persistente de datos.
- **pgvector**: Para la gestión de vectores (embeddings) en la base de datos PostgreSQL.
- **Tailwind CSS y shadcn**: Para el diseño y estilización de la interfaz de usuario.

### Requisitos Previos

- Node.js
- PostgreSQL con pgvector instalado

### Base de Datos

Para preparar tu base de datos PostgreSQL:

1. Instala la extensión `pgvector` en tu instancia de PostgreSQL si aún no está instalada.

2. Crea la base de datos y la tabla necesarias ejecutando el siguiente comando SQL:
```sql
CREATE TABLE data (
  id SERIAL PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  embedding vector
);
```
### Instalación

1. **Clonar el repositorio**: Primero, clona este repositorio a tu máquina local utilizando Git. Abre una terminal y ejecuta el siguiente comando:

   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd <NOMBRE_DEL_DIRECTORIO>
   ```
2. Instala las dependencias necesarias
3. Configura las variables de entorno necesarias en un archivo `.env.local`, basándote en el archivo `.env.example` proporcionado.
4. Configura la base de datos.
5. Ejecuta la aplicación
   ```bash
   npm run dev
   ```

