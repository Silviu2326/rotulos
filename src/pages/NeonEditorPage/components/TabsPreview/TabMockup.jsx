export const TabMockup = () => (
  <div className="tab-content" id="tab-mockup">
    <div className="mockup-controls-bar">
      <button className="upload-facade-btn">
        <span>📸</span> Subir mi fachada
      </button>
    </div>
    <div className="mockup-preview" id="mockup-preview">
      <div className="mockup-canvas" id="mockup-canvas">
        <div className="mockup-empty">
          <p>📷</p>
          <p>Sube una fachada para ver el mockup</p>
        </div>
      </div>
    </div>
  </div>
);
