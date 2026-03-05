export const TabAR = ({ showPreview }) => (
  <div className="tab-content" id="tab-ar">
    <div className="ar-container">
      <div className="ar-preview" id="ar-preview">
        <div className="mockup-empty">
          <p style={{ fontSize: "3rem" }}>📱</p>
          <p>Cámara AR</p>
        </div>
      </div>
      <div className="ar-instructions">
        <h4>📱 Cómo usar la Realidad Aumentada</h4>
        <ol>
          <li>Genera un diseño primero</li>
          <li>Pulsa "Iniciar cámara AR"</li>
          <li>Apunta tu cámara hacia la fachada</li>
          <li>¡Verás tu rótulo superpuesto!</li>
        </ol>
      </div>
      <button className="btn-ar-start" disabled={!showPreview}>
        <span>📷</span> Iniciar cámara AR
      </button>
    </div>
  </div>
);
