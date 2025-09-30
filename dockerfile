
# 1️⃣ Base Node compatible avec Meteor 1.7
FROM node:8.15.1

# 2️⃣ Installer dépendances système pour compiler Meteor & Fibers
RUN apt-get update && apt-get install -y \
    python \
    make \
    g++ \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# 3️⃣ Installer Meteor 1.7
RUN curl https://install.meteor.com/ | sed s/RELEASE=.*/RELEASE=1.7/ | sh

# 4️⃣ Définir répertoire de travail
WORKDIR /app

# 5️⃣ Copier ton projet (ou le bundle déjà généré dans deploy/bundle)
COPY . /app

# 6️⃣ Définir variable pour exécution en superuser
ENV METEOR_ALLOW_SUPERUSER=1

# 7️⃣ Builder l’application Meteor en bundle Node.js
RUN ~/.meteor/meteor build --directory /opt/bundle --allow-superuser

# 8️⃣ Installer dépendances du serveur (bundle)
WORKDIR /opt/bundle/bundle/programs/server
RUN npm install --unsafe-perm

# 9️⃣ Définir répertoire final
WORKDIR /opt/bundle/bundle

# 🔟 Exposer le port 3000
EXPOSE 3000

# 1️⃣1️⃣ Démarrer l’application
CMD ["node", "main.js"]
