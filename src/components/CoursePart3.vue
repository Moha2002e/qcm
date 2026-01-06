<script setup>
defineEmits(['close'])
</script>

<template>
  <div class="course-container glass-panel">
    <div class="header">
      <button class="btn-icon" @click="$emit('close')">
        ← Retour
      </button>
      <h2>Synthèse : Partie 3 (.NET Avancé)</h2>
    </div>

    <div class="content-scroll">
      
      <!-- EF CORE INTERNALS -->
      <section class="module-section">
        <h3 class="section-title">1. EF Core : Fonctionnement Interne</h3>
        
        <div class="topic-card">
          <h4>Change Tracker & États</h4>
          <ul>
            <li><strong>ChangeTracker</strong> : Mécanisme central qui surveille les entités.</li>
            <li>Si une entité est chargée (Tracking), modifier ses propriétés suffit. Pas besoin d'<code>Update()</code>.</li>
            <li><code>AsNoTracking()</code> : Lecture seule, plus rapide (pas de snapshot mémoire).</li>
            <li><strong>AutoDetectChanges</strong> : Activé par défaut. Peut être désactivé pour les gros batchs.</li>
          </ul>
        </div>

        <div class="topic-card">
          <h4>Persistance & Concurrence</h4>
          <ul>
            <li><code>SaveChanges()</code> : Crée une <strong>transaction implicite</strong> pour toutes les modifications.</li>
            <li><strong>Concurrence</strong> : Si la même donnée est modifiée par 2 contextes, le dernier gagne (Last Win) sauf si <code>RowVersion</code> est configuré (→ <code>DbUpdateConcurrencyException</code>).</li>
            <li><strong>Add() vs Attach()</strong> :
               <ul>
                   <li><code>Add()</code> : Marque tout le graphe comme <em>Added</em> (Insertion).</li>
                   <li><code>Attach()</code> : Marque comme <em>Unchanged</em> (puis détecte les modifs).</li>
               </ul>
            </li>
          </ul>
        </div>
      </section>

      <!-- EF CORE ADVANCED -->
      <section class="module-section">
        <h3 class="section-title">2. EF Core : Concepts Avancés</h3>
        
        <div class="topic-card">
          <h4>Performance</h4>
          <ul>
            <li>Attention au <strong>N+1</strong> : Utiliser <code>Include()</code>.</li>
            <li><strong>Filtering</strong> : Faire le <code>Where()</code> AVANT le <code>ToList()</code> (sinon filtrage en mémoire RAM).</li>
            <li><strong>Compiled Queries</strong> : Mettre en cache la traduction LINQ → SQL.</li>
            <li><strong>Global Query Filters</strong> : Filtres automatiques (ex: Soft Delete <code>IsDeleted==false</code>).</li>
          </ul>
        </div>

        <div class="topic-card">
          <h4>Modélisation</h4>
          <ul>
            <li><strong>Shadow Properties</strong> : Propriétés suivies par EF mais absentes de la classe C# (ex: FK, Timestamp).</li>
            <li><strong>Owned Types</strong> : Objets de valeur (Value Objects) stockés dans la même table.</li>
            <li><strong>Composite Keys</strong> : Clés composées via <code>HasKey(e => new { e.A, e.B })</code>.</li>
          </ul>
        </div>
      </section>

      <!-- API & ARCHITECTURE -->
      <section class="module-section">
        <h3 class="section-title">3. ASP.NET Core & Architecture</h3>

        <div class="topic-card">
          <h4>Web API Avancé</h4>
          <ul>
            <li><strong>Minimal APIs</strong> : <code>Results.Ok()</code>, pas de contrôleurs complexes, très léger.</li>
            <li><strong>Content Negotiation</strong> : Adapter la réponse (JSON/XML) selon le header <code>Accept</code>.</li>
            <li><strong>Middleware vs Filter</strong> :
              <ul>
                <li><em>Middleware</em> : Pipeline global (Technique).</li>
                <li><em>Filter</em> : Lié à une action/contrôleur (Métier/Validation).</li>
              </ul>
            </li>
            <li><strong>ILogger</strong> : Utiliser le logging structuré <code>LogInfo("User {Id}", id)</code>.</li>
          </ul>
        </div>

        <div class="topic-card">
          <h4>CQRS & Clean Architecture</h4>
          <ul>
            <li><strong>CQRS</strong> : Séparation stricte.
              <ul>
                <li><em>Command</em> : Modifie l'état, transactionnel.</li>
                <li><em>Query</em> : Lecture seule, optimisé (peut éviter le Domain).</li>
              </ul>
            </li>
            <li><strong>MediatR</strong> : Pattern Médiateur pour le couplage faible (Envoi de Messages).</li>
            <li><strong>UnitOfWork</strong> : Garantir que plusieurs Repositories partagent la même transaction.</li>
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
}

.topic-card {
  background: rgba(255,255,255,0.03);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(255,255,255,0.05);
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
