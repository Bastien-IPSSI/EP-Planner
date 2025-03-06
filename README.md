# Procédure d'installation

## Dossier Backend

1. Ajoutez un fichier `.env` dans le dossier backend pour la configuration, notamment pour la connexion à la base de données. Exemple de ligne pour la base de données :
DATABASE_URL="mysql://user:password@127.0.0.1:3306/database_name"

2. Installez les dépendances : composer install

3. Créez la base de données : php bin/console doctrine:database:create

4. Exécutez les migrations : php bin/console doctrine:migrations:migrate

5. Chargez les fixtures (création des spécialités et de quelques utilisateurs depuis un seeder) : php bin/console doctrine:fixtures:load

6. Lancez le serveur Symfony : symfony serve


## Dossier Frontend

1. Installez les dépendances : npm install

2. Démarrez l'application : npm start
