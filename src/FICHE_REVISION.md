# 🎓 Fiche de Révision : 25 Concepts Clés (EF Core, API, Architecture)

1. **Entity Framework Core**  
   C’est un ORM (Object-Relational Mapper) entre le code C# et la base de données. Il transforme les objets C# en requêtes SQL automatiquement, ce qui évite d’avoir à écrire le code SQL soi-même.

2. **DbContext**  
   C’est le chef d’orchestre de la connexion à la base de données. Il ouvre la session, surveille toutes les modifications faites sur les objets en mémoire et s’occupe de tout sauvegarder quand on lui demande.

3. **DbSet**  
   C’est la représentation d’une table spécifique de la base de données dans le code. C’est une liste sur laquelle on peut directement ajouter, lire ou supprimer des éléments pour impacter la table correspondante.

4. **Migration**  
   C’est un script de mise à jour généré pour synchroniser la base de données avec le code. Quand on modifie les classes (ex : ajout d’une propriété), la migration applique ce changement à la structure réelle de la base de données.

5. **Fluent API**  
   C’est une méthode de configuration avancée écrite directement en C#. Elle permet de définir précisément les règles et les relations des tables, en offrant plus de puissance que les simples attributs.

6. **Data Annotation**  
   Ce sont des étiquettes (attributs) comme `[Required]` ou `[Key]` qu’on place au-dessus des propriétés dans le code. Elles servent à définir rapidement des règles simples (clés primaires…) pour la base de données sans écrire de code complexe.

7. **LINQ**  
   C'est le langage de requête intégré à C#. Il te permet de poser des questions à ta base de données (filtrer, trier, sélectionner) en utilisant des méthodes C# lisibles (comme `.Where()` ou `.OrderBy()`) au lieu d'écrire du SQL brut.

8. **EntityState**  
   C'est le statut invisible (Ajouté, Modifié, Supprimé...) que Entity Framework colle sur chaque objet. Cela lui permet de savoir exactement quelle commande SQL (INSERT, UPDATE ou DELETE) il doit envoyer à la base quand tu sauvegardes.

9. **Cascade Delete**  
   C'est un nettoyage automatique des données liées. Si tu supprimes un élément "parent" (ex: un Client), la base de données supprimera automatiquement tous ses "enfants" (ex: ses Commandes) pour éviter de laisser des données orphelines.

10. **Scaffold-DbContext**  
    C'est une commande de génération automatique utilisée si tu as déjà une base de données (Database-First). Elle analyse ta base existante et écrit tout le code C# (le DbContext et les classes) à ta place.

11. **Connection String**  
    C'est l'adresse complète de ta base de données. Elle contient toutes les informations nécessaires (serveur, nom de la base, identifiant, mot de passe) pour que ton application puisse trouver la base et s'y connecter.

12. **Middleware**  
    C'est un maillon de la chaîne de traitement des requêtes HTTP. Imagine une chaîne de montage : chaque middleware est une station qui intercepte la requête, effectue une action précise (comme vérifier l'authentification ou logger l'accès), puis passe la main au suivant.

13. **Dependency Injection (DI)**  
    C'est une technique pour fournir les outils dont une classe a besoin, plutôt que de la laisser les fabriquer elle-même. Au lieu de faire `new MonService()` dans ton code, tu demandes simplement `MonService` dans le constructeur, et le système te le donne tout prêt (configuré et géré).

14. **ActionResult**  
    C'est le type de réponse flexible renvoyé par une API. Il permet à une même méthode de retourner soit des données (comme un objet JSON avec un code 200 OK), soit une erreur HTTP (comme 404 Not Found) selon le résultat de l'opération.

15. **Swagger / OpenAPI**  
    C'est la documentation interactive de ton API. C'est un outil qui scanne ton code pour générer une page web où tu peux voir toutes tes routes disponibles, comprendre comment les utiliser et même les tester directement en cliquant sur un bouton.

16. **Serilog**  
    C'est une librairie de journalisation (logging) avancée. Contrairement au journal basique qui écrit juste du texte, Serilog enregistre des données structurées (JSON), ce qui te permet de faire des recherches précises dans tes logs (ex: "Trouve toutes les erreurs de l'utilisateur X") et de les envoyer vers des outils d'analyse.

17. **Clean Architecture**  
    C'est une manière d'organiser ton code en cercles concentriques. Le but est de protéger ton code métier (au centre) des dépendances externes comme la base de données ou l'interface web (à l'extérieur), rendant ton application plus facile à tester et à faire évoluer.

18. **Domain Layer**  
    C'est le cœur pur de ton application. Elle contient uniquement tes entités (les objets métier comme Client ou Commande) et les règles de gestion essentielles, sans aucune dépendance technique (ni base de données, ni frameworks).

19. **Application Layer**  
    C'est le chef d'orchestre des cas d'utilisation. Elle contient la logique qui répond aux demandes de l'utilisateur (ex: "Créer une commande"). Elle coordonne les interactions en demandant des données au Repository et en appliquant les règles du Domaine.

20. **Infrastructure Layer**  
    C'est la boîte à outils technique. C'est ici que se trouvent les implémentations concrètes pour communiquer avec l'extérieur : Entity Framework pour la base de données, l'envoi d'emails, ou les appels à d'autres API. Elle "sert" les couches supérieures.

21. **Repository Pattern**  
    C'est un intermédiaire de sécurité entre ton application et ta base de données. Il regroupe toutes les méthodes d'accès aux données (comme GetById, Save, Delete) dans une classe dédiée, cachant ainsi les détails techniques complexes (SQL ou Entity Framework) au reste de ton code.

22. **Service Layer**  
    C'est le cerveau des opérations. Située entre le Contrôleur (qui reçoit la demande) et le Repository (qui a les données), cette couche applique toutes les règles métier et les calculs nécessaires avant de valider une action.

23. **DTO (Data Transfer Object)**  
    C'est une enveloppe de transport. C'est un objet très simple qui ne contient que des données (pas de logique) et qui sert uniquement à transférer des informations d'un point A à un point B (par exemple, envoyer juste le nom et l'email d'un utilisateur à l'écran, sans envoyer son mot de passe stocké en base).

24. **Mapperly**  
    C'est une photocopieuse intelligente. C'est une librairie qui écrit automatiquement le code pour copier les données d'un objet (comme une Entité) vers un autre (comme un DTO), t'évitant d'écrire des centaines de lignes répétitives à la main.

25. **CQRS (Command Query Responsibility Segregation)**  
    C'est la séparation des tâches. C'est un principe qui divise ton application en deux parties distinctes : une partie qui ne fait que lire les données (Queries) pour l'affichage, et une autre qui ne fait que modifier les données (Commands), permettant d'optimiser chaque partie séparément.

---
*Ce document résume les définitions clés pour la révision de l'examen EF Core & ASP.NET Core.*
