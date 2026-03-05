export const TabReadability = ({ showPreview }) => (
  <div className="tab-content" id="tab-readability">
    <div className="readability-container">
      <div className="readability-preview">
        {[5, 10, 20].map((dist) => (
          <div className="distance-card" key={dist}>
            <div className="distance-preview">
              <p style={{ color: "var(--color-text-muted)" }}>
                {showPreview ? "TU RÓTULO" : "Genera un diseño"}
              </p>
            </div>
            <div className="distance-info">
              <div className="distance-label">A {dist} metros</div>
              <div className="distance-status">
                {showPreview ? (dist === 5 ? "Excelente" : dist === 10 ? "Bueno" : "Regular") : "-"}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {showPreview && (
        <>
          <div className="readability-score">
            <div className="score-title">Puntuación</div>
            <div className="score-value">85</div>
            <div className="score-label">Excelente</div>
          </div>
          <div className="readability-recommendations">
            <div className="recommendations-title">💡 Recomendaciones</div>
            <ul>
              <li>Aumentar tamaño para mejor visibilidad</li>
              <li>Usar mayor contraste</li>
              <li>Considerar iluminación nocturna</li>
            </ul>
          </div>
        </>
      )}
    </div>
  </div>
);
