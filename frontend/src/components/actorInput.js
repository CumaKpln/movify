import React from "react";

function ActorInput({ actors, onChange, onAdd, onRemove }) {
  return (
    <div>
      <label className="form-label">Oyuncular</label>
      {actors.map((actor, index) => (
        <div key={index} className="d-flex gap-2 mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Oyuncu Adı"
            value={actor.name}
            onChange={(e) => onChange(index, "name", e.target.value)}
            required
          />
          <input
            type="number"
            className="form-control"
            placeholder="Yaş"
            value={actor.age}
            onChange={(e) => onChange(index, "age", e.target.value)}
            required
          />
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => onRemove(index)}
          >
            Sil
          </button>
        </div>
      ))}
      <button
        type="button"
        className="btn btn-success mt-2"
        onClick={onAdd}
      >
        Oyuncu Ekle
      </button>
    </div>
  );
}

export default ActorInput;
