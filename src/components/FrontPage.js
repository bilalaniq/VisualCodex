import React from 'react';
import { useNavigate } from 'react-router-dom';
import './FrontPage.css';

const FrontPage = () => {
  const navigate = useNavigate();

  const handleExploreClick = () => {
    navigate('/algorithms');
  };
  return (
    <div id="front-page" className="front-page-container">
      <section className="intro-section">
        <div className="intro-content">
          <div className="text-content">
            <h1>Visualize Algorithms, Master Computer Science</h1>
            <p>
              Visual Codex is an interactive platform designed to help you understand
              algorithms through step-by-step visualizations. Explore sorting, pathfinding,
              graph traversals, and tree structures, and see how they work in real-time.
              Learn efficiently, grasp concepts faster, and gain a deeper understanding of
              computer science fundamentals.
            </p>
            <button
              className="cta-button"
              onClick={handleExploreClick}
            >
              Explore Algorithms →
            </button>
          </div>
          <div className="animation-content">
            <div className="scene">
              <div className="cube cube1">
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="ball"></div>
              </div>
              <div className="cube cube2">
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="ball"></div>
              </div>
              <div className="cube cube3">
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="ball"></div>
              </div>
              <div className="cube cube4">
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="ball"></div>
              </div>
              <div className="cube cube5">
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="ball"></div>
              </div>
              <div className="cube cube6">
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="ball"></div>
              </div>
              <div className="cube cube7">
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="ball"></div>
              </div>
              <div className="cube cube8">
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="ball"></div>
              </div>
              <div className="cube cube9">
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="ball"></div>
              </div>
              <div className="cube cube10">
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="ball"></div>
              </div>
              <div className="cube cube11">
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="ball"></div>
              </div>
              <div className="cube cube12">
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="ball"></div>
              </div>
              <div className="cube cube13">
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="ball"></div>
              </div>
              {/* Additional five cubes (14..18) added */}
              <div className="cube cube14">
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="ball"></div>
              </div>
              <div className="cube cube15">
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="ball"></div>
              </div>
              <div className="cube cube16">
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="ball"></div>
              </div>
              <div className="cube cube17">
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="ball"></div>
              </div>
              <div className="cube cube18">
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="cube__side"></div>
                <div className="ball"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FrontPage;