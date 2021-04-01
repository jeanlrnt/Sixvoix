# S I X V O I X

Application SixVoix de l'IUT en **Node.js** pour la partie serveur et **jQuery** pour la partie client.  

Pour cloner le dépôt, vous pouvez taper :  
`git clone https://github.com/jeanlrnt/Sixvoix votreRepertoire`  

Le fichier `vip.sql` permet de créer la base vip accompagnée d'un jeu d'essai (réaliste mais pas exact) avec des données cohérentes. 
Le fichier `config.db` contient les paramètres pour la base **MySQL**.

Il existe une version admin et une version public disponibles respectivement dans les dossiers 
[Sixvoix/admin/](https://github.com/jeanlrnt/Sixvoix/blob/master/admin/) et 
[Sixvoix/public/](https://github.com/jeanlrnt/Sixvoix/blob/master/public/).
Pour démarer chaque serveur, il faut se rendre dans le repertoire voulu (admin ou public) puis effectuer l'une des commandes suivantes : `npm run start` ou `npm run dev`.  

La première commande lancera le programme automatiquement avec node alors que l'autre utilisera le package nodemon. Dans les deux cas, la commande effectuera une mise à jour des packages npm.  

Le serveur admin est à l'écoute du port `6900` et le serveur public est lui à l'écoute du port `6800`.

**⊂(◉‿◉)つ**
