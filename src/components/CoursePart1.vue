<script setup>
defineEmits(['close'])
</script>

<template>
  <div class="course-container glass-panel">
    <div class="header">
      <button class="btn-icon" @click="$emit('close')">
        ← Retour
      </button>
      <h2>Synthèse : Partie 1 (Bases EF Core & ASP.NET)</h2>
    </div>

    <div class="content-scroll">
      
      <!-- SECTION 1: EF CORE BASICS -->
      <section class="module-section">
        <h3 class="section-title">1. EF Core : Les Fondamentaux</h3>
        
        <div class="topic-card">
          <h4>Architecture</h4>
          <ul>
            <li><strong>Code-First</strong> : On écrit les classes C# (Entités) d'abord, on génère la DB ensuite.</li>
            <li><strong>DbContext</strong> : La classe centrale (héritant de <code>DbContext</code>). Elle contient les <code>DbSet</code> et gère la connexion.</li>
            <li><strong>OnConfiguring</strong> : Méthode pour configurer le provider (SQL Server, etc.) et la chaîne de connexion.</li>
          </ul>
        </div>

        <div class="topic-card">
          <h4>Migrations</h4>
          <ul>
            <li><strong>Rôle</strong> : Synchroniser le modèle C# avec le schéma SQL sans perte de données.</li>
            <li><code>add-migration Nom</code> : Crée un fichier C# décrivant les changements (Up/Down).</li>
            <li><code>update-database</code> : Applique les changements SQL sur la base réelle.</li>
            <li><code>Script-Migration</code> : Génère le script SQL équivalent (pour la prod).</li>
          </ul>
        </div>

        <div class="topic-card">
          <h4>Modélisation (Fluent API vs Annotations)</h4>
          <ul>
            <li><strong>Data Annotations</strong> : Attributs rapides (ex: <code>[Key]</code>, <code>[Required]</code>, <code>[MaxLength(50)]</code>).</li>
            <li><strong>Fluent API</strong> : Configuration puissante dans <code>OnModelCreating</code>.
                <br>Ex: <code>modelBuilder.Entity&lt;User&gt;().HasKey(u => u.Id);</code>
            </li>
            <li><strong>Relations</strong> : 
                <ul>
                    <li>1-N : <code>HasOne(...).WithMany(...)</code></li>
                    <li>N-N : Géré automatiquement ou avec table de jointure explicite.</li>
                </ul>
            </li>
          </ul>
        </div>
      </section>

      <!-- SECTION 2: ASP.NET CORE -->
      <section class="module-section">
        <h3 class="section-title">2. ASP.NET Core : Web API</h3>
        
        <div class="topic-card">
          <h4>Démarrage (Program.cs)</h4>
          <ul>
            <li><strong>Builder</strong> : <code>WebApplication.CreateBuilder(args)</code>. Configure services et config.</li>
            <li><strong>Dependency Injection (DI)</strong> :
               <ul>
                   <li><code>AddTransient</code> : Nouveau à chaque demande.</li>
                   <li><code>AddScoped</code> : Nouveau par requête HTTP (Idéal pour <strong>DbContext</strong>).</li>
                   <li><code>AddSingleton</code> : Unique pour toute la vie de l'app.</li>
               </ul>
            </li>
            <li><strong>App</strong> : <code>builder.Build()</code>. Configure le <strong>Pipeline Middleware</strong> (Auth -> StaticFiles -> Controllers).</li>
          </ul>
        </div>

        <div class="topic-card">
          <h4>Contrôleurs & Routing</h4>
          <ul>
            <li><strong>ControllerBase</strong> : Classe de base pour les API (sans Vue).</li>
            <li><strong>[ApiController]</strong> : Active la validation automatique des modèles et le binding intelligent.</li>
            <li><strong>Attributs HTTP</strong> : <code>[HttpGet]</code>, <code>[HttpPost]</code>, <code>[HttpPut]</code>, <code>[HttpDelete]</code>.</li>
            <li><strong>Routing</strong> : <code>[Route("api/[controller]")]</code> ou <code>[HttpGet("{id}")]</code> pour capturer des paramètres d'URL.</li>
          </ul>
        </div>

        <div class="topic-card">
          <h4>Réponses HTTP (Status Codes)</h4>
          <ul>
            <li><code>200 OK</code> : Succès standard (Lecture, Modification).</li>
            <li><code>201 Created</code> : Succès création (POST). Retourner l'URL de la ressource créée (<code>CreatedAtAction</code>).</li>
            <li><code>204 No Content</code> : Succès sans contenu (souvent pour PUT ou DELETE).</li>
            <li><code>400 Bad Request</code> : Erreur de validation client.</li>
            <li><code>404 Not Found</code> : Ressource non trouvée.</li>
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
  color: #60a5fa; /* Blue for Part 1 Basics */
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

ul {
  padding-left: 1.2rem;
  color: #94a3b8;
  line-height: 1.6;
}

li {
  margin-bottom: 0.8rem;
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
