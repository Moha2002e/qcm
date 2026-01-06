<script setup>
defineEmits(['close'])
</script>

<template>
  <div class="course-container glass-panel">
    <div class="header">
      <button class="btn-icon" @click="$emit('close')">
        ← Retour
      </button>
      <h2>Synthèse : Partie 3 (EF Core Avancé & Architecture)</h2>
    </div>

    <div class="content-scroll">
      
      <!-- SECTION 1: EF CORE AVANCÉ -->
      <section class="module-section">
        <h3 class="section-title">1. EF Core Avancé : Interne & Performance</h3>
        
        <div class="topic-card">
          <h4>Change Tracking & États</h4>
          <ul>
            <li><strong>États d'une entité</strong> : <code>Added</code>, <code>Unchanged</code>, <code>Modified</code>, <code>Deleted</code>, <code>Detached</code>.</li>
            <li><strong>ChangeTracker</strong> : Surveille les entités attachées. Une modification de propriété est détectée automatiquement par <code>DetectChanges()</code> (appelé par SaveChanges).</li>
            <li><strong>Optimisation Lecture</strong> : Utiliser <code>AsNoTracking()</code> pour les scénarios de lecture seule (évite le snapshot mémoire).</li>
            <li><strong>Update sur Détaché</strong> : <code>Update()</code> marque <em>toutes</em> les propriétés comme modifiées. Préférer l'attachement (<code>Attach</code>) + modification ciblée pour des UPDATE partiels.</li>
          </ul>
        </div>

        <div class="topic-card">
          <h4>Transactions & Concurrence</h4>
          <ul>
            <li><strong>Transactions</strong> : <code>SaveChanges()</code> crée une transaction implicite si aucune n'existe.</li>
            <li><strong>Explicite</strong> : <code>BeginTransaction()</code> permet de grouper plusieurs opérations ou requêtes SQL brutes.</li>
            <li><strong>Concurrence Optimiste</strong> : EF Core utilise "Last Write Wins" par défaut. Utiliser un <code>RowVersion</code> (Timestamp) pour détecter les conflits (lève une <code>DbUpdateConcurrencyException</code>).</li>
          </ul>
        </div>

        <div class="topic-card">
          <h4>Stratégies de Chargement (Loading)</h4>
          <ul>
            <li><strong>Eager Loading</strong> : <code>.Include(x => x.Rel)</code> (JOIN immédiat). Attention aux "Cartesian explosions" → utiliser <code>AsSplitQuery()</code>.</li>
            <li><strong>Lazy Loading</strong> : Chargement à la demande (nécessite <code>virtual</code> + Proxies). Risque majeur de <strong>N+1 Selects</strong> (1 requête liste + N requêtes enfants).</li>
            <li><strong>Explicit Loading</strong> : Chargement manuel post-lecture via <code>Entry(e).Collection(c).Load()</code>.</li>
          </ul>
        </div>

        <div class="topic-card">
          <h4>Fonctionnalités Puissantes</h4>
          <ul>
            <li><strong>Global Query Filters</strong> : Filtres appliqués partout par défaut (ex: Soft Delete <code>IsDeleted == false</code>). Ignorer avec <code>IgnoreQueryFilters()</code>.</li>
            <li><strong>Shadow Properties</strong> : Propriétés mappées en base mais invisibles dans la classe C# (ex: FK audit, DateCreated).</li>
            <li><strong>SQL Brut</strong> : <code>FromSqlRaw</code> (doit retourner toutes les colonnes de l'entité) ou <code>ExecuteSqlRaw</code> (UPDATE/DELETE direct pour perf).</li>
            <li><strong>Interceptors</strong> : Permet d'intercepter/modifier les commandes SQL avant exécution (Logs, Audit, Soft Delete).</li>
          </ul>
        </div>
      </section>

      <!-- SECTION 2: ASP.NET CORE -->
      <section class="module-section">
        <h3 class="section-title">2. ASP.NET Core & API Design</h3>
        
        <div class="topic-card">
          <h4>Pipeline & Architecture</h4>
          <ul>
            <li><strong>Middleware vs Filter</strong> :
               <ul>
                   <li><em>Middleware</em> : Pipeline global (Technique, Auth, Log).</li>
                   <li><em>Filter</em> : Contexte MVC local à l'action (Validation, Formatage).</li>
               </ul>
            </li>
            <li><strong>DI Scopes</strong> : <code>DbContext</code> doit être <strong>Scoped</strong> (1 par requête HTTP). Jamais Singleton (concurrence fatale) !</li>
            <li><strong>Logging</strong> : Utiliser le <strong>Logging Structuré</strong> (<code>Logger.LogInfo("Item {Id}", id)</code>) avec Serilog (Requests logs plus propres).</li>
          </ul>
        </div>

        <div class="topic-card">
          <h4>Bonnes Pratiques API</h4>
          <ul>
            <li><strong>Retour Controller</strong> : Utiliser <code>ActionResult&lt;T&gt;</code> pour combiner type de retour et codes HTTP (NotFound, BadRequest).</li>
            <li><strong>Minimal API</strong> : Alternative légère sans contrôleur. Retour via <code>Results.Ok()</code>, <code>Results.NotFound()</code>.</li>
            <li><strong>Content Negotiation</strong> : L'API adapte le format (JSON/XML) selon le header <code>Accept</code> du client.</li>
            <li><strong>Async/Await</strong> : Toujours propager le <code>CancellationToken</code> jusqu'à EF Core (<code>ToListAsync(ct)</code>) pour annuler la requête SQL si le client coupe.</li>
          </ul>
        </div>

        <div class="topic-card">
          <h4>Pièges à Éviter</h4>
          <ul>
            <li><strong>Find vs First</strong> : <code>Find(id)</code> utilise le cache local du contexte (rapide). <code>First/Single</code> tape toujours la BDD.</li>
            <li><strong>Exposition</strong> : Ne JAMAIS retourner des **Entités EF Core** directement (Circular Ref, Over-fetching). Utiliser des **DTO**.</li>
            <li><strong>Pagination</strong> : Obligatoire. Ne pas faire <code>ToList()</code> sur une grosse table. Utiliser <code>Skip(x).Take(y)</code>.</li>
            <li><strong>Sync over Async</strong> : Ne jamais bloquer le thread (<code>.Result</code>, <code>.Wait()</code>). Risque de Deadlock et effondrement de perf.</li>
          </ul>
        </div>
      </section>

      <!-- SECTION 3: ARCHITECTURE -->
      <section class="module-section">
        <h3 class="section-title">3. Clean Architecture & CQRS</h3>

        <div class="topic-card">
          <h4>Clean Architecture (Onion)</h4>
          <ul>
            <li><strong>Domain</strong> : Le cœur. Règles métier pures. Zéro dépendance (pas de HTTP, pas de EF Core idéalement).</li>
            <li><strong>Application</strong> : Orchestration (Use Cases). Manipule interfaces et DTOs.</li>
            <li><strong>Infrastructure</strong> : Implémentation technique (EF Core, Email, File System). Dépendance inversée vers Domain/App.</li>
            <li><strong>Presentation (UI)</strong> : Contrôleurs, Blazor. Dépend de App.</li>
          </ul>
        </div>

        <div class="topic-card">
          <h4>Pattern CQRS (Command Query Responsibility Segregation)</h4>
          <ul>
            <li><strong>Principe</strong> : Séparer les opérations d'écriture (Command) et de lecture (Query).</li>
            <li><strong>Write (Command)</strong> : Transactionnel, riche, validation métier forte (Domain).</li>
            <li><strong>Read (Query)</strong> : Optimisé, souvent <code>AsNoTracking</code>, projection DTO directe (peut court-circuiter le Domain).</li>
            <li><strong>MediatR</strong> : Librairie standard pour implémenter CQRS in-process (Bus de messages interne).</li>
          </ul>
        </div>
      </section>

    </div>
  </div>
</template>

<style scoped>
.course-container {
  height: 80vh;
  display: flex;
  flex-direction: column;
  padding: 0;
  overflow: hidden;
  max-width: 900px;
  width: 100%;
}

.header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--glass-border);
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(15, 23, 42, 0.4);
}

.header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: var(--text-color);
}

.btn-icon {
  background: none;
  border: 1px solid var(--glass-border);
  color: var(--text-secondary);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-icon:hover {
  background: rgba(255,255,255,0.1);
  color: white;
}

.content-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
}

.module-section {
  margin-bottom: 3rem;
}

.section-title {
  color: var(--accent-color);
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid var(--accent-color);
  padding-bottom: 0.5rem;
  display: inline-block;
  text-align: left;
}

.topic-card {
  background: rgba(255,255,255,0.03);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(255,255,255,0.05);
  text-align: left;
}

.topic-card h4 {
  margin-top: 0;
  color: #fbbf24; /* Amber-400 for Part 3 distinction */
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

ul {
  padding-left: 1.2rem;
  color: #94a3b8;
  line-height: 1.6;
}

li {
  margin-bottom: 0.5rem;
}

strong {
  color: #f1f5f9;
}

/* Scrollbar */
.content-scroll::-webkit-scrollbar {
  width: 8px;
}

.content-scroll::-webkit-scrollbar-track {
  background: rgba(0,0,0,0.1);
}

.content-scroll::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.2);
  border-radius: 4px;
}
</style>
