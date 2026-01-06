# 🎓 Tableau Récapitulatif : Questions 38 → 80 (EF Core & ASP.NET Core)

| ID | Concept | Réponse(s) Correcte(s) | Explication Rapide |
| :--- | :--- | :--- | :--- |
| **38** | **Find() vs FirstOrDefault()** | **E** (Toutes) | Find utilise le cache + PK, FirstOrDefault fait toujours une requête SQL. |
| **39** | **Migration (Rename/Type)** | **B** | Peut provoquer un DROP/CREATE de colonne si le provider ne supporte pas le changement direct. |
| **40** | **Seed Data Conditionnel** | **B, C** | `HasData` (OnModelCreating) pour seed statique, `DbSeeder` custom au démarrage pour logique complexe. |
| **42** | **Middleware vs Filter** | **B, C, E** | Middleware = pipeline global (statique inclus). Filter = MVC (accès ModelState/Action). |
| **43** | **Minimal API Result** | **C** | `Results.NotFound()` retourne une implémentation de `IResult`. |
| **44** | **Validation [ApiController]** | **B, D** | Désactiver `SuppressModelStateInvalidFilter` ou utiliser un ActionFilter manuel. |
| **45** | **ActionResult<T>** | **B, D** | Retourne T (sérialisé) ou IActionResult (NotFound, etc.). Utile pour doc OpenAPI. |
| **46** | **Binding [FromBody]/[Query]** | **B, C, E** | Body = objets complexes (1 seul max). Query/Route = types simples. |
| **51** | **ILogger<T>** | **B, E** | Templating `{Id}` crée du log structuré. Catégorie = nom de T. |
| **52** | **Serilog ASP.NET Core** | **B, D** | `UseSerilogRequestLogging` (clean request log). Enrichissement via config. |
| **53** | **Swagger/Scalar .NET 9** | **A, B, C, E** | `AddOpenApi`, `UseSwagger`, `MapOpenApi`. Supporte versions multiples. |
| **56** | **CancellationToken** | **A, D** | Annule les requêtes async si le client coupe la connexion HTTP. |
| **57** | **Durée de vie DI** | **C, D, E** | DbContext = Scoped. Service stateless = Transient. Cache/Config = Singleton. |
| **59** | **Validation DTO** | **B, C, D** | FluentValidation, DataAnnotations, ou validation manuelle dans le contrôleur/filter. |
| **63** | **Pagination** | **B, C, D** | Métadonnées (header/envelope), limite max, AsNoTracking pour lecture. |
| **64** | **Minimal vs Controllers** | **B, C, E** | Minimal = léger, fonctionnel, IResult. Controllers = MVC, filtres, ActionResult<T>. |
| **66** | **Exception Handling** | **B, E** | Middleware global -> ProblemDetails standard. Logguer sans exposer détails en prod. |
| **68** | **Routing** | **A, D, E** | Contraintes `{id:int}`, optionnel `{cat?}`, catch-all `*`/`**`. |
| **69** | **Content Negotiation** | **A, C, E** | JSON par défaut. XML possible. 406 si format non supporté demandé. |
| **74** | **OpenAPI (Prod)** | **B, C, E** | Protéger/Désactiver l'UI en prod. Décrire auth/schémas. Multi-versions. |
| **75** | **Perf Anti-patterns** | **A, B, C, E** | Pas de sync IO, ToList prématuré, log Debug en prod, ou N+1 (loop save). |
| **77** | **HttpLogging** | **A, C, E** | Utile mais attention aux données sensibles et à la perf (gros body). |
| **79** | **Ref. Circulaire DI** | **A, C, E** | Signe de mauvais design. Erreur au runtime. Refactorer (interfaces/events). |
| **80** | **Partial Update (Patch)** | **C, E** | Valider les champs modifiables. Attention à la sécurité et concurrence. |

---
**Note :** Ce tableau correspond aux corrections appliquées dans le fichier `questions.json`.
