# Image Node compatible avec Meteor 1.7 (éviter Node 22)
FROM node:14-buster

# Installer Meteor
RUN curl https://install.meteor.com/ | sh

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers du projet
COPY . /app

# Installer les dépendances
RUN meteor npm install

# Exposer le port utilisé par Render
EXPOSE 3000

# Lancer l'application
CMD ["meteor", "run", "--port", "3000", "--production"]
