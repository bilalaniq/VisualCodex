import React from "react";
import "./AboutPage.css";
import { FaLightbulb, FaCode, FaTree, FaProjectDiagram } from 'react-icons/fa';

const AboutPage = () => {
  return (
    <div className="about-container">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Making Algorithms <span className="highlight">Visual</span>
          </h1>
          <p className="hero-description">
            Transform complex algorithms into intuitive visualizations.
            Experience the power of visual learning in computer science.
          </p>
          <div className="hero-buttons">
            <a href="/algorithms" className="primary-button">Start Learning</a>
            <a href="https://github.com/bilalaniq/VisualCodex" className="secondary-button">View Source</a>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="section-content">
          <h2>Our Mission</h2>
          <p>
            We believe learning algorithms should be engaging and intuitive. 
            Through interactive visualizations, we break down complex concepts 
            into digestible, step-by-step animations that make learning a joy.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>What You'll Learn</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <FaProjectDiagram />
            </div>
            <h3>Pathfinding Algorithms</h3>
            <p>Explore BFS, DFS, Dijkstra, and A* algorithms through interactive node networks.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <FaCode />
            </div>
            <h3>Sorting Visualized</h3>
            <p>Watch how Bubble, Merge, and Quick Sort transform unordered data into perfect sequences.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <FaTree />
            </div>
            <h3>Tree Structures</h3>
            <p>Master Binary Search Trees and various traversal techniques with clear animations.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <FaLightbulb />
            </div>
            <h3>Graph Theory</h3>
            <p>Understand the fundamentals of graph algorithms through interactive demonstrations.</p>
          </div>
        </div>
      </section>

      {/* Creator Section */}
      <section className="creator-section">
        <div className="creator-content">
          <h2>Meet the Creator</h2>
          <div className="creator-info">
            <p>
              Hi! I'm <strong>Muhammad Bilal</strong>, a cybersecurity engineer and software developer
              passionate about making computer science education more accessible and engaging.
              VisualCodex is my contribution to helping students and developers understand
              algorithms through the power of visualization.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="about-footer">
        <div className="footer-content">
          <p>© {new Date().getFullYear()} VisualCodex</p>
          <p>Crafted with ❤️ by Muhammad Bilal</p>
        </div>
      </footer>
    </div>
  );
};

export default AboutPage;
