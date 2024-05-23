import React from 'react';

const CustomLauncher = ({ toggle }) => (
    <button onClick={toggle} className="chatbot-launcher">
      <div className="speech-bubble">Precisa de Ajuda?</div>
    </button>
  );

export default CustomLauncher;