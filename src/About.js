import React from 'react';

function About({ t }) {
  return (
    <div className="container">
      <h1>{t.aboutTitle}</h1>
      <p>{t.aboutText}</p>
    </div>
  );
}

export default About;
