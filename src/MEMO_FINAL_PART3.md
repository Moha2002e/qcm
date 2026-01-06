# 🎓 Tableau Récapitulatif Final : Questions 1 → 90 (Part 3 : EF Core & ASP.NET Core)

Ce document regroupe l'intégralité des 90 questions de la partie "EF Core Avancé & ASP.NET Core", corrigées et commentées pour une révision ultra-rapide avant l'examen.

---

| ID (Part 3) | Concept | Réponse(s) Correcte(s) | Explication Rapide / Piège à éviter |
| :--- | :--- | :--- | :--- |
| **1-37** | **EF Core Avancé (Change Tracking, Performance, Transactions)** | | |
| **1** | **Suivi (ChangeTracker)** | **C** | Détecte auto les modifs si l'entité est suivie. Pas besoin de `Update` explicite si suivi. |
| **2** | **États d'une entité** | **E** | `Added`, `Unchanged`, `Modified`, `Deleted`, `Detached`. |
| **3** | **DetectChanges()** | **B** | Appel auto par `SaveChanges()`. Compare snapshot initial vs actuel. |
| **4** | **AsNoTracking()** | **C** | Lecture seule, pas de suivi = + performant. Idéal pour GET. |
| **5** | **Update() sur détaché** | **C** | Marque **toutes** les propriétés comme modifiées (génère UPDATE set col1=..., col2=...). |
| **6** | **Optimistic Concurrency** | **A, B, C, D** | `RowVersion` (timestamp), `ConcurrencyCheck`, `DbUpdateConcurrencyException`. |
| **7** | **Gérer Concurrency Exception** | **C** | Catch l'exception, recharger (Reload) ou gagner (ClientWins/StoreWins). |
| **8** | **Transactions (Défaut)** | **C** | `SaveChanges` crée implicitement une transaction si aucune n'existe. |
| **9** | **Transaction Explicite** | **C** | `BeginTransaction()` permet de grouper plusieurs `SaveChanges` ou SQL bruts. |
| **10** | **Lazy Loading** | **A, B** | Charge à la demande. Nécessite `virtual` + proxy. Attention au N+1 ! |
| **11** | **Eager Loading** | **B** | `.Include(x => x.Rel)` charge tout en une requête (JOIN). |
| **12** | **Explicit Loading** | **A** | `Entry(e).Collection(c => c.Posts).Load()`. Utile si besoin précis post-lecture. |
| **13** | **N+1 Problem** | **B** | 1 requête pour la liste + N requêtes pour les enfants (boucle). Tueur de perf. |
| **14** | **Split Queries** | **B** | `.AsSplitQuery()` évite l'explosion cartésienne des JOIN multiples. |
| **15** | **Global Query Filters** | **C** | `HasQueryFilter(x => !x.Deleted)`. S'applique partout sauf si `IgnoreQueryFilters()`. |
| **16** | **Raw SQL** | **B** | `FromSqlRaw`. Doit retourner toutes les colonnes de l'entité. Paramètres sécurisés requis. |
| **17** | **ExecuteSqlRaw** | **B** | Pour UPDATE/DELETE direct (pas de retour d'entités). Retourne int (lignes affectées). |
| **18** | **DbFunction** | **C** | Mappe une fonction C# vers une UDF SQL. Utilisable dans LINQ. |
| **19** | **Interceptor** | **B, D** | Intercepte commandes SQL (avant/après). Utile pour log, soft delete, audit. |
| **20** | **Convention Custom** | **A, D** | `ConfigureConventions`. Applique règles globales (ex: tout string = varchar(50)). |
| **21** | **Value Conversions** | **A, B, C, D** | Convertit type C# <-> SQL (ex: Enum vers String, Bool vers Y/N). |
| **22** | **Table Splitting** | **B** | 2 entités mappées sur **1 seule table** (partage de PK). |
| **23** | **Entity Splitting** | **A, B, C** | 1 entité éclatée sur **plusieurs tables**. |
| **24** | **NoTracking Global** | **B, C** | Configurable au niveau contexte `ChangeTracker.QueryTrackingBehavior`. |
| **25** | **ToList() vs IQueryable** | **B** | `ToList()` exécute SQL immédiatement (matérialise). |
| **26** | **Shadow Properties** | **E (Toutes)** | Propriété définie dans le modèle EF sans champ dans la classe C#. |
| **27** | **Delete Cascade** | **B** | Par défaut activé si FK requise. Supprime enfants si parent supprimé. |
| **28** | **Owned Types** | **E (Toutes)** | `OwnsOne`. Pas d'ID propre, stocké dans table du parent (ou table séparée). |
| **29** | **DateCreated Auto** | **C** | Surcharger `SaveChanges`, détecter `Added`, set Date = Now. |
| **30** | **Requêtes Composées** | **B** | IQueryable permet d'empiler Where/OrderBy avant exécution finale. |
| **31** | **Update Partiel** | **A, E** | Attacher l'entité + modifier juste une prop (`Entry(e).Property(p).IsModified = true`). |
| **32** | **Perf Déconseillée** | **E** | `LazyLoading` partout sans réfléchir (risque N+1 caché). |
| **33** | **Clé Composite** | **C** | `HasKey(x => new { x.Id1, x.Id2 })` dans Fluent API. |
| **34** | **SingleOrDefault** | **A, B, C** | Lève exception si > 1 résultat. Charge en mémoire. Moins performant que `First`. |
| **35** | **Compiled Query** | **B** | Cache le plan d'exécution SQL pour requêtes fréquentes. |
| **36** | **TransactionScope** | **B** | Transaction ambiante supportée par EF Core (si provider compatible). |
| **37** | **LazyLoadingProxies** | **B, C, D** | Nécessite package NuGet + `UseLazyLoadingProxies` + virtual. |
| **38-80** | **ASP.NET Core & Architecture API** | | |
| **38** | **Find vs FirstOrDefault** | **E (Toutes)** | `Find` utilise le cache local (rapide). `First` tape toujours la DB. |
| **39** | **Migration Renommage** | **B** | Risque de perte de données (DROP/CREATE) si pas précis. |
| **40** | **Seed Data** | **B, C** | `HasData` (auto migration) ou `Seeder` manuel au startup. |
| **42** | **Middleware vs Filter** | **B, C, E** | Middleware = Pipeline HTTP global. Filter = Contexte MVC (Action/Controller). |
| **43** | **Minimal API Return** | **C** | `IResult` (ex: `Results.Ok()`) est l'interface standard. |
| **44** | **Validation Auto** | **B, D** | Désactivable via `SuppressModelStateInvalidFilter`. |
| **45** | **ActionResult<T>** | **B, D** | Combine type fort (DOC) + flexibilité HTTP (NotFound). |
| **46** | **Bindings** | **B, C, E** | Body = objet complexe (JSON). Query/Route = types simples. |
| **51** | **ILogger** | **B, E** | Utiliser templates `{Param}` pour logs structurés. |
| **52** | **Serilog** | **B, D** | `UseSerilogRequestLogging` remplace le log HTTP verbeux par défaut. |
| **53** | **OpenAPI .NET 9** | **A, B, C, E** | `AddOpenApi` natif. Supporte Scaler/Swagger UI. |
| **56** | **CancellationToken** | **A, D** | Propagé depuis le client. A passer aux méthodes async EF (`ToListAsync(ct)`). |
| **57** | **DI Scope** | **C, D, E** | DbContext = Scoped (1 par requête). Singleton = Dangereux pour DbContext. |
| **59** | **Validation DTO** | **B, C, D** | FluentValidation très populaire. Ne pas polluer le Domain avec DataAnnotations UI. |
| **63** | **Pagination** | **B, C, D** | Ne jamais retourner `IQueryable` ou table entière. Utiliser `Skip/Take`. |
| **64** | **Minimal vs Controller** | **B, C, E** | Minimal = Microservices, perf, syntaxe légère. Controller = App structurée, filtres. |
| **66** | **Global Exception** | **B, E** | Middleware custom ou `UseExceptionHandler`. Ne pas fuiter `StackTrace` en prod. |
| **68** | **Routing** | **A, D, E** | Contraintes `{id:int}`. Catch-all `{*path}`. |
| **69** | **Content Negociation** | **A, C, E** | Accept Header détermine format (JSON/XML). 406 si non supporté. |
| **74** | **Swagger Prod** | **B, C, E** | Attention sécurité. Souvent désactivé ou protégé en prod. |
| **75** | **Anti-patterns Perf** | **A to E** | Sync over Async = Deadlock/Lenteur. Select N+1. |
| **77** | **HttpLogging** | **A, C, E** | Loggue tout (Header/Body). Attention RGPD/Sécurité (mots de passe loggués). |
| **79** | **Circular Dep** | **A, C, E** | A dépend de B qui dépend de A. Crash au démarrage. Revoir design. |
| **80** | **Partial Update** | **C, E** | PATCH (JSON Patch). Difficile à sécuriser et valider correctement. |
| **81-90** | **Clean Architecture & CQRS** | | |
| **81** | **Clean Arch But** | **B, C, E** | Indépendance Framework/UI/DB. Testabilité. |
| **82** | **Couches** | **B** | App -> Domain. Infra -> App/Domain (dépendance inversée). UI -> App/Infra (DI). |
| **83** | **Repository** | **C, D** | Abstraction collection-like. Découple du DbContext direct (discutable avec EF Core). |
| **84** | **Service App** | **A, C** | Orchestre USE CASE. Ne fait ni SQL, ni HTTP Response. Appelle Domain/Repo. |
| **85** | **Domain Layer** | **A, D** | Le cœur pur. Zéro dépendance technique (NuGet EF Core toléré parfois, mais idéalement non). |
| **86** | **CQRS But** | **A, C, E** | Séparer Read (rapide, DTO) et Write (riche, Domaine). Scalabilité. |
| **87** | **MediatR** | **A, C, E** | Découplage in-process. 1 requete = 1 handler. |
| **88** | **Entités en API** | **B, C, D** | Jamais ! Fuite abstraction, ref circulaire, breaking changes, over-fetching. |
| **89** | **Mapping** | **B, C, D** | AutoMapper/Mapperly. Obligatoire pour convertir Entité -> DTO. |
| **90** | **Transaction CQRS** | **A to D** | Command = Transaction (ACID). Query = NoTracking. UnitOfWork gère le commit final. |
