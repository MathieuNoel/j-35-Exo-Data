# O'dle

Développer (encore) un jeu, ça te dit ? Promis, ce jeu n'implique aucune fourchette.

## Mise en situation

Tu vas déveloper l'API du jeu O'dle, un _idle game_ (parfois appelé jeu itératif en français, un jeu "passif" dans lequel on progresse même quand on ne joue pas) qui envoie du bois :clown_face:

<details>
<summary>Euh, c'est un peu juste comme définition :thinking:</summary>

Pas de panique, savoir précisément ce qu'est un idle game n'est pas un pré-requis caché de la formation O'clock. Mais c'est assez important pour que tu comprennes ce qu'il faut faire dans cet exercice.

Plutôt qu'un long discours, je te propose d'en tester un quelques minutes : [Cookie Clicker](https://orteil.dashnet.org/cookieclicker/) (tu reviens après, hein :wink:). Le principe est plus ou moins toujours le même : un jeu très simple mais assez addictif avec des mécaniques basiques et surtout une notion de temps.

Bref, revenons à O'dle...
</details>

Tu y incarnes un bûcheron qui veut construire un empire forestier en partant de rien, à la sueur de son front. Tu vas donc couper du bois, qui est ta ressource primaire, et utiliser ce bois pour construire des bâtiments et améliorations afin d'augmenter le rendement, la capacité de stockage etc.

Range ta hache, la production de bois est automatique :relieved: Elle démarre à 0,2 mètres cube par seconde et l'objectif est d'augmenter ce rendement, d'investir dans le stockage du bois et de développer ton empire.

### Le code fourni

Le front est déjà codé :tada: Il est toutefois vivement conseillé d'y jeter un oeil pour mieux comprendre ce qu'il va falloir développer. En bas du fichier JS navigateur, tu trouveras un curieux gribouillis, n'y fais pas attention : il marche, c'est le principal :relieved:

Le routeur et un début de serveur sont également fournis. Ta mission, si tu l'acceptes, sera de coder le reste pour fournir une API fonctionnelle au front. 

## C'est parti

### Configuration du serveur

Pour l'instant, c'est un peu fouilli et rien ne marche. Avant toute chose, il va falloir configurer correctement le serveur pour que la communication se fasse dans les meilleures conditions.

Ajoute une ligne dans le fichier `server.js` pour permettre à l'application Express de fournir l'interface du jeu en contactant l'adresse `http://localhost:8888/game.html`.

Le fait d'avoir le client et l'API a une même adresse a plusieurs avantages :
- Pas de CORS (puisque pas de _cross origin_)
- Une gestion simplifiée des cookies (les requêtes AJAX cross origin doivent être lourdement paramétrées pour permettre l'utilisation des cookies)
- Une seule instruction pour tout lancer (parce que les dévs sont fainéants)

### Initialisation du jeu

Dans le fichier `router.js`, on constate l'appel systématique à une méthode _initGame_ du _GameController_. Cette méthode vérifie qu'il existe une partie en cours et en crée une si ce n'est pas le cas.

La partie est représentée par un objet dont on découvrira les propriétés au fur et à mesure, stocké dans la propriété `game` de la session de chaque utilisateur.

Pour créer une nouvelle partie, appelle la méthode `Game.generate()` du model _Game_ (on la code juste après).

### Génération d'une partie

Voici un exemple de partie en cours :

```js
{
  stock: 423.275618,
  sawmill: {
    level: 12,
    yield: 4.659617024496201,
    cost: 226.77564950118384
  },
  silo: {
    level: 9,
    capacity: 318.1349811900001,
    cost: 159.06749059500004
  },
  lastUpdate: 1596724318
}
```

**NB :** les nombres ont une précision effrayante mais ils sont arrondis à l'affichage :wink:

C'est exactement ce que doit retourner la méthode `Game.generate()`. Sauf qu'en début de partie, il n'y a pas de stock, l'entrepôt et la scierie ne sont pas construits et _lastUpdate_ correspond à la date et l'heure de la création de la partie (sous la forme d'un timestamp Unix, soit le nombre de secondes écoulées depuis le 1er janvier 1970 à minuit).

La scierie niveau 0 (non construite, donc) fournit 0,2 unité de bois par seconde, et son passage au niveau 1 coûte 4 unités de bois.

L'entrepôt niveau 0 permet de stocker 30 unités et sa construction en coûte 15.

Crée un objet qui représente cet état et retourne-le dans cette méthode.

### Test autonome

L'application est encore loin d'être terminée, mais on peut déjà tester ce qu'on a développé. Lance la REPL de Node et importe le model Game. Appelle alors `Game.generate()` pour vérifier que ce qui est retourné correspond bel et bien à une partie fraîchement démarrée (bâtiments au niveau 0, stock à 0).

### Test du serveur

Si ça fonctionne, autant tester l'API au passage, non ? On n'a pas encore codé de route mais il y en a une très simple, que tu peux coder en 2 minutes chrono. Il s'agit de `GET /status`, qui retourne l'état actuel de la partie.

Cette méthode extrait l'objet `game` de la session, puis passe cet objet à la méthode `Game.update(game)`, qui :
- calcule la différence entre le timestamp actuel et la propriété lastUpdate (4 secondes par exemple)
- affecte le timestamp actuel à lastUpdate (pour le prochain calcul)
- ajoute au stock ce que la scierie a produit dans ce délai (par exemple, pour 4 secondes et une scierie niveau 0, ça donnerait 0,8)
- vérifie que le stock ne dépasse pas la capacité de stockage de l'entrepôt (pour un entrepôt niveau 0, 30 unités) et plafonne le stock à cette capacité

Pour une question de lisibilité et de souplesse, tu peux retourner l'objet _game_ mis à jour. Mais puisqu'il s'agit d'un objet, il est passé par référence et les actions effectuées sur le paramètre dans la fonction sont en fait directement effectuées sur l'objet passé lors de l'appel (le fameux passage par référence, ça te rappelle des souvenirs ?).

Lance à présent ton serveur : le premier appel à `GET /update` devrait retourner une nouvelle partie, sans aucun stock. Attends quelques secondes et réaccède à `GET /update` : tes premières unités de bois sont venues peupler ton stock :tada:

### Construire la scierie

La route `GET /sawmill/upgrade` contacte une méthode qui :
- met à jour la partie (pour connaître les ressources du joueur au moment de la demande)
- vérifie si le coût de construction de la scierie peut être payé avec le stock
- remplace la scierie niveau 0 par la scierie niveau 1
- retire le coût de construction du stock (sinon, c'est gratuit)
- et redirige (que la construction ait pu se faire ou pas) vers la route `GET /status` (qui devrait donc afficher une partie avec une scierie construite)

:gift: **la redirection est déjà en place dans le code**

Dit comme ça, ça a l'air simple, mais il va te manquer une étape importante : la génération d'une scierie niveau 1 (puis d'une scierie niveau 2, puis 3 etc.).

Pour ça, il y a la méthode `Sawmill.generate(level)` qui retourne une scierie du niveau précisé en argument. Le model est déjà bien commenté.

Bonne nouvelle : cette méthode sert à générer n'importe quel niveau de scierie. Qu'il s'agisse de la construire ou de passer du niveau 34 au niveau 35, c'est du pareil au même.

<details>
<summary>Comment cloner un objet facilement ?</summary>

Grâce au <em>spread operator</em>. Pas de panique, Google se tient prêt pour t'apprendre ce que c'est.

</details>

### Construire l'entrepôt

On n'en dit pas plus, c'est exactement le même principe que ci-dessus.

Sauf qu'il faut avoir une scierie de niveau 3 minimum avant de pouvoir construire un entrepôt.

### Optimiser pour mieux maintenir

Maintenant qu'on a 2 méthodes pour générer une scierie et un entrepôt de n'importe quel niveau, est-ce qu'on ne retoucherait pas un peu `Game.generate()` pour les utiliser ? Ça permettrait de changer les valeurs de départ de ces 2 bâtiments à un seul et unique endroit (dans le model) et que ce soit répercuté partout :heart_eyes:

### CADEAU : un aperçu de la suite

Si tu es arrivé.e jusqu'ici, bravo ! Si tu as envie de développer davantage ce jeu, j'ai vu traîner un post-it avec quelques idées intéressantes, mais je ne sais plus où...