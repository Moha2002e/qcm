<script setup>
defineEmits(['close'])
</script>

<template>
  <div class="course-container glass-panel">
    <div class="header">
      <button class="btn-icon" @click="$emit('close')">
        ← Retour
      </button>
      <h2>Synthèse : Partie 2 (Définitions Mots-Clés)</h2>
    </div>

    <div class="content-scroll">
      
      <!-- DATA ACCESS -->
      <section class="module-section">
        <h3 class="section-title">1. Accès aux Données (EF Core)</h3>
        
        <div class="topic-grid">
          <div class="def-card">
            <h4>Entity Framework Core</h4>
            <p><strong>ORM</strong> permettant de gérer la base de données via du code C#.</p>
          </div>
          <div class="def-card">
            <h4>DbContext</h4>
            <p>Classe représentant la <strong>session</strong> avec la base et gérant les entités.</p>
          </div>
          <div class="def-card">
            <h4>DbSet&lt;T&gt;</h4>
            <p>Collection d'entités d'un type donné (table).</p>
          </div>
          <div class="def-card">
            <h4>Migration</h4>
            <p>Fichier C# décrivant les changements de schéma à appliquer à la BDD.</p>
          </div>
          <div class="def-card">
            <h4>Fluent API</h4>
            <p>Configuration des entités via <strong>code C#</strong> (prioritaire sur les attributs).</p>
          </div>
          <div class="def-card">
            <h4>Data Annotation</h4>
            <p>Configuration via <strong>attributs</strong> (<code>[Key]</code>, <code>[Required]</code>...).</p>
          </div>
          <div class="def-card">
            <h4>LINQ</h4>
            <p>Syntaxe C# pour interroger des collections et bases de données.</p>
          </div>
          <div class="def-card">
            <h4>Cascade Delete</h4>
            <p>Suppression automatique des enfants quand le parent est supprimé.</p>
          </div>
          <div class="def-card">
            <h4>Scaffold</h4>
            <p>Génération du modèle (Classes + DbContext) depuis une BDD existante.</p>
          </div>
        </div>
      </section>

      <!-- WEB API -->
      <section class="module-section">
        <h3 class="section-title">2. ASP.NET Core Web API</h3>

        <div class="topic-grid">
          <div class="def-card">
            <h4>Middleware</h4>
            <p>Composant interceptant/traitant les requêtes HTTP dans le pipeline.</p>
          </div>
          <div class="def-card">
            <h4>Dependency Injection (DI)</h4>
            <p>Injection automatique des services dans les classes (constructeur).</p>
          </div>
          <div class="def-card">
            <h4>ActionResult</h4>
            <p>Type de retour combinant données et code statut HTTP.</p>
          </div>
          <div class="def-card">
            <h4>Swagger / OpenAPI</h4>
            <p>Outils de documentation et test d'API.</p>
          </div>
          <div class="def-card">
            <h4>Serilog</h4>
            <p>Framework de <strong>logging structuré</strong>.</p>
          </div>
        </div>
      </section>

      <!-- ARCHITECTURE -->
      <section class="module-section">
        <h3 class="section-title">3. Architecture Logicielle</h3>

        <div class="topic-grid">
          <div class="def-card">
            <h4>Clean Architecture</h4>
            <p>Organisation en couches concentriques (Domain au centre) pour isoler le métier.</p>
          </div>
          <div class="def-card">
            <h4>Domain Layer</h4>
            <p>Cœur métier : Entités, Règles pures (sans dépendances).</p>
          </div>
          <div class="def-card">
            <h4>Application Layer</h4>
            <p>Cas d'usage, orchestration, interfaces.</p>
          </div>
          <div class="def-card">
            <h4>Infrastructure Layer</h4>
            <p>Implémentation technique (BDD, API externes, Fichiers).</p>
          </div>
          <div class="def-card">
            <h4>Repository</h4>
            <p>Encapsule l'accès aux données (Collection en mémoire).</p>
          </div>
          <div class="def-card">
            <h4>DTO (Data Transfer Object)</h4>
            <p>Objet simple pour transférer des données entre couches (sans logique).</p>
          </div>
          <div class="def-card">
            <h4>CQRS</h4>
            <p><strong>C</strong>ommand <strong>Q</strong>uery <strong>R</strong>esponsibility <strong>S</strong>egregation : Séparation Lecture / Écriture.</p>
          </div>
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

.topic-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.def-card {
  background: rgba(255,255,255,0.03);
  border-radius: 12px;
  padding: 1.2rem;
  border: 1px solid rgba(255,255,255,0.05);
  transition: transform 0.2s;
}

.def-card:hover {
  transform: translateY(-2px);
  background: rgba(255,255,255,0.06);
  border-color: var(--accent-color);
}

.def-card h4 {
  margin: 0 0 0.5rem 0;
  color: #e2e8f0;
  font-size: 1.1rem;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  padding-bottom: 0.5rem;
}

.def-card p {
  margin: 0;
  color: #94a3b8;
  font-size: 0.95rem;
  line-height: 1.5;
}

strong {
  color: #818cf8;
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
