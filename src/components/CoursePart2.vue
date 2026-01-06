<script setup>
defineEmits(['close'])
</script>

<template>
  <div class="course-container glass-panel">
    <div class="header">
      <button class="btn-icon" @click="$emit('close')">
        ← Retour
      </button>
      <h2>Synthèse : Partie 2 (Définitions & Concepts)</h2>
    </div>

    <div class="content-scroll">
      
      <!-- EF CORE CONCEPTS -->
      <section class="module-section">
        <h3 class="section-title">1. Concepts de Données (EF Core)</h3>
        
        <div class="topic-card">
          <h4>Briques Fondamentales</h4>
          <ul>
            <li><strong>Entity Framework Core</strong> : ORM (Object-Relational Mapper) transformant les objets C# en requêtes SQL automatiquement.</li>
            <li><strong>DbContext</strong> : Chef d’orchestre. Ouvre la session, surveille les modifications (Tracking) et gère la sauvegarde.</li>
            <li><strong>DbSet</strong> : Représente une table spécifique (Liste d'entités C# mappée à la BDD).</li>
            <li><strong>Connection String</strong> : Chaîne de connexion contenant l'adresse, l'utilisateur et le mot de passe de la base.</li>
          </ul>
        </div>

        <div class="topic-card">
          <h4>Configuration & Mise à jour</h4>
          <ul>
              <li><strong>Migration</strong> : Script généré pour synchroniser le schéma de la base de données avec les classes C#.</li>
              <li><strong>Scaffold-DbContext</strong> : Génération automatique du code (Reverse Engineering) à partir d'une base de données existante (Database-First).</li>
              <li><strong>Fluent API</strong> : Configuration avancée des relations et tables en C# (dans <code>OnModelCreating</code>), plus puissant que les attributs.</li>
              <li><strong>Data Annotation</strong> : Attributs simples (<code>[Key]</code>, <code>[Required]</code>) placés directement sur les classes.</li>
          </ul>
        </div>

        <div class="topic-card">
          <h4>Fonctionnement</h4>
          <ul>
              <li><strong>LINQ</strong> : Syntaxe C# pour interroger les données (<code>.Where()</code>, <code>.Select()</code>) sans écrire de SQL.</li>
              <li><strong>EntityState</strong> : État interne d'une entité (Added, Modified, Deleted) déterminant la requête SQL générée par <code>SaveChanges</code>.</li>
              <li><strong>Cascade Delete</strong> : Suppression automatique des entités enfants lorsque le parent est supprimé.</li>
          </ul>
        </div>
      </section>

      <!-- ARCHITECTURE CONCEPTS -->
      <section class="module-section">
        <h3 class="section-title">2. Architecture & Design Patterns</h3>

        <div class="topic-card">
          <h4>Structure d'Application</h4>
          <ul>
              <li><strong>Middleware</strong> : Composant du pipeline HTTP. Intercepte la requête (Log, Auth) avant qu'elle n'atteigne le contrôleur.</li>
              <li><strong>Dependency Injection (DI)</strong> : Technique permettant de fournir les services (DbContext, Repository) aux classes plutôt que de les instancier manuellement (<code>new Service()</code>).</li>
              <li><strong>Clean Architecture</strong> : Organisation en couches concentriques (Domain au centre) pour isoler le métier de la technique.</li>
          </ul>
        </div>

        <div class="topic-card">
          <h4>Les Couches (Layers)</h4>
          <ul>
              <li><strong>Domain Layer</strong> : Cœur pur. Contient seulement les Entités et règles métier. Aucune dépendance technique.</li>
              <li><strong>Application Layer</strong> : Orchestration. Gère les cas d'utilisation (Use Cases) en coordonnant Domaine et Utils.</li>
              <li><strong>Infrastructure Layer</strong> : Implémentation technique (EF Core, Email, API externes).</li>
          </ul>
        </div>

        <div class="topic-card">
          <h4>Modèles & Objets</h4>
          <ul>
              <li><strong>Repository Pattern</strong> : Abstraction de l'accès aux données (Collection-like interface) pour cacher la logique SQL/EF.</li>
              <li><strong>Service Layer</strong> : Logique métier complexe située entre le Contrôleur et le Repository.</li>
              <li><strong>DTO (Data Transfer Object)</strong> : Objet simple transportant des données (sans logique) entre les couches.</li>
              <li><strong>Mapperly / AutoMapper</strong> : Outils pour copier automatiquement les propriétés d'une Entité vers un DTO.</li>
              <li><strong>CQRS</strong> : Séparation des responsabilités : une stack pour l'Écriture (Command, complexe) et une pour la Lecture (Query, rapide).</li>
          </ul>
        </div>

        <div class="topic-card">
            <h4>API & Outils</h4>
            <ul>
                <li><strong>ActionResult</strong> : Type de retour flexible combinant données et statuts HTTP (200 OK, 404 NotFound).</li>
                <li><strong>Swagger / OpenAPI</strong> : Documentation interactive générée automatiquement pour tester l'API.</li>
                <li><strong>Serilog</strong> : Logging structuré (JSON) plus puissant que le log texte standard.</li>
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
  color: #c084fc; /* Purple for Part 2 Definitions */
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
