// components/AboutPage.js
import React from "react";
import "./AboutPage.css";

const AboutPage = () => {
  return (
    <div className="about-container">
      {/* Hero Section */}
      <section className="about-hero">
        
        <h1>
          <span className="highlight">Visualizing Algorithms</span>
        </h1>
        <p>
          Learn, interact, and master algorithms through visualization.  
          We transform abstract computer science concepts into beautiful, 
          dynamic, and intuitive visuals.
        </p>
      </section>

      {/* About Project */}
      <section className="about-section">
        <h2>Visualizing AlgorithmsOur Mission</h2>
        <p>
          Understanding algorithms can be challenging — walls of code, loops, 
          and recursion can easily become overwhelming.  
          <strong>Visualizing Algorithms</strong> aims to make this learning 
          process clear and engaging by showing every step in real-time.
        </p>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>What You Can Explore</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Pathfinding</h3>
            <p>BFS, DFS, Dijkstra, and A* — watch nodes connect as they find the shortest path.</p>
          </div>
          <div className="feature-card">
            <h3>Sorting</h3>
            <p>Visualize sorting algorithms like Bubble, Merge, and Quick Sort step by step.</p>
          </div>
          <div className="feature-card">
            <h3>🌳 Trees</h3>
            <p>Understand Binary Search Trees and traversals through dynamic animations.</p>
          </div>
          <div className="feature-card">
            <h3>🕸️ Graphs</h3>
            <p>Learn how networks connect and evolve using graph traversal techniques.</p>
          </div>
        </div>
      </section>

      {/* Developer Section */}
      <section className="creator-section">
        <h2>About the Creator</h2>
        <p>
          Developed by <strong>Muhammad Bilal</strong> — a cybersecurity and software enthusiast 
          passionate about making complex concepts simple and visual.  
          This project is part of his mission to help students and developers 
          truly understand how algorithms think.
        </p>
      </section>

      {/* Footer Line */}
      <footer className="about-footer">
        <p>© {new Date().getFullYear()} Visualizing Algorithms — Crafted with ❤️ by Bilal</p>
      </footer>
    </div>
  );
};

export default AboutPage;
