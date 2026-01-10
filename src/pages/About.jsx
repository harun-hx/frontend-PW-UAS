import { useNavigate } from 'react-router-dom';

function About() {
  const navigate = useNavigate();

  return (
    <div className="app-container narrow">
      <div className="text-left">
        <button onClick={() => navigate(-1)} className="btn-back">← Back</button>
      </div>

      <div className="ui-card text-center">
        <h1>👨‍💻 The Team</h1>
        <p className="subtitle">Built for the Final Project</p>
        
        <div className="about-content">
          <p>
            <strong>Project Name:</strong> AI Horse Breed Identifier<br/>
            <strong>Tech Stack:</strong> React (Frontend) + Laravel (Backend) + Python (AI)<br/>
            <strong>Objective:</strong> To demonstrate a microservices architecture where an AI engine operates independently from the user database.
          </p>

          <h3 className="credits-header">Credits</h3>
          <ul className="credits-list">
            <li>
              <strong>Harun (You):</strong> Full Stack Developer
            </li>
            <li>
              <strong>Olga Belitskaya:</strong> Dataset Provider (Kaggle)
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default About;