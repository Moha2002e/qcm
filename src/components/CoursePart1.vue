<script setup>
defineEmits(['close'])
</script>

<template>
  <div class="course-container glass-panel">
    <div class="header">
      <button class="btn-icon" @click="$emit('close')">
        ← Retour
      </button>
      <h2>Synthèse : Partie 1</h2>
    </div>

    <div class="content-scroll">
      
      <!-- ENTITY FRAMEWORK CORE -->
      <section class="module-section">
        <h3 class="section-title">1. Entity Framework Core (EF Core)</h3>
        
        <div class="topic-card">
          <h4>Concepts Fondamentaux</h4>
          <ul>
            <li><strong>ORM</strong> : Transforme les données relationnelles (SQL) en objets C#.</li>
            <li><strong>DbContext</strong> : Représente une session avec la BDD. C'est l'unité de travail (Unit of Work).</li>
            <li><strong>DbSet&lt;T&gt;</strong> : Représente une table de la base de données.</li>
            <li><strong>Code-First</strong> : On définit les classes C# en premier, la BDD est générée ensuite.</li>
          </ul>
        </div>

        <div class="topic-card">
          <h4>Cycle de Vie & Persistance</h4>
          <ul>
            <li><strong>Change Tracker</strong> : Surveille l'état des entités (<em>Added, Modified, Deleted, Unchanged</em>).</li>
            <li><strong>SaveChanges()</strong> : Applique tous les changements détectés à la base de données (Transaction).</li>
            <li><strong>Attach(e)</strong> : Attache une entité existante au contexte (état <em>Unchanged</em>).</li>
            <li><strong>ExecuteUpdateAsync</strong> : Mise à jour directe en SQL sans charger les entités (Performance ++).</li>
          </ul>
        </div>

        <div class="topic-card">
          <h4>Configuration (Fluent API)</h4>
          <p>La <em>Fluent API</em> (dans <code>OnModelCreating</code>) est prioritaire sur les Data Annotations.</p>
          <div class="code-block">
            <code>modelBuilder.Entity&lt;Student&gt;()<br>.HasKey(s => s.Id);</code>
          </div>
          <ul>
            <li><strong>[Key]</strong> : Clé primaire.</li>
            <li><strong>[NotMapped]</strong> : Exclure une propriété.</li>
            <li><strong>Relations</strong> :
              <ul>
                <li>Utiliser <code>virtual</code> pour le <em>Lazy Loading</em>.</li>
                <li>Utiliser <code>.Include()</code> pour le <em>Eager Loading</em> (chargement immédiat).</li>
              </ul>
            </li>
            <li><strong>Cascade Delete</strong> : Suppression des enfants si le parent est supprimé.</li>
          </ul>
        </div>

        <div class="topic-card">
          <h4>Migrations</h4>
          <ul>
            <li><code>dotnet ef migrations add Nom</code> : Créer une migration.</li>
            <li><code>dotnet ef database update</code> : Appliquer à la BDD.</li>
            <li><code>EnsureCreated()</code> : Crée la BDD sans migrations (interdit en prod).</li>
          </ul>
        </div>
      </section>

      <!-- ASP.NET CORE -->
      <section class="module-section">
        <h3 class="section-title">2. ASP.NET Core Web API</h3>

        <div class="topic-card">
          <h4>Structure & Injection</h4>
          <ul>
            <li><strong>Program.cs</strong> : Point d'entrée et configuration du pipeline.</li>
            <li><strong>Services (DI)</strong> :
              <ul>
                <li><code>AddDbContext&lt;T&gt;()</code> : Enregistre EF Core.</li>
                <li><code>AddControllers()</code> : Active les contrôleurs API.</li>
              </ul>
            </li>
            <li><strong>Middleware</strong> : Composants du pipeline (Auth, Routing, etc.).</li>
          </ul>
        </div>

        <div class="topic-card">
          <h4>Contrôleurs</h4>
          <ul>
            <li>Hériter de <strong>ControllerBase</strong> (et non <em>Controller</em>).</li>
            <li><strong>[ApiController]</strong> : Validation auto, Binding, Réponses 400.</li>
            <li><strong>Verbes</strong> : <code>[HttpGet]</code>, <code>[HttpPost]</code>, <code>[HttpPut]</code>, <code>[HttpDelete]</code>.</li>
            <li><strong>Routes</strong> : <code>[HttpGet("{id:int}")]</code> contraint l'ID à être un entier.</li>
          </ul>
        </div>

        <div class="topic-card">
          <h4>Réponses HTTP</h4>
          <ul>
            <li><span class="badge success">200 OK</span> : <code>Ok(data)</code></li>
            <li><span class="badge success">201 Created</span> : <code>CreatedAtAction(...)</code></li>
            <li><span class="badge success">204 No Content</span> : <code>NoContent()</code> (Update/Delete)</li>
            <li><span class="badge error">404 Not Found</span> : <code>NotFound()</code></li>
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
  color: #e2e8f0;
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

.code-block {
  background: #1e293b;
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
  font-family: 'Consolas', monospace;
  font-size: 0.9rem;
  color: #a5b4fc;
  border-left: 3px solid var(--accent-color);
}

.badge {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: bold;
  color: #1e293b;
}

.badge.success { background: #4ade80; }
.badge.error { background: #f87171; }

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
