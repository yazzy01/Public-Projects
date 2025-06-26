import React, { useState } from "react";
import "./Card.css";

function Card({ img, title, description, onClick }) {
    const [isExpanded, setIsExpanded] = useState(false);
    
    return (
        <div className={`card-component ${isExpanded ? 'expanded' : ''}`}>
            {img && <img src={img} alt={title || 'card image'} />}
            {title && <h2>{title}</h2>}
            {description && (
                <p className="description">
                    {isExpanded ? description : `${description.substring(0, 50)}${description.length > 50 ? '...' : ''}`}
                </p>
            )}
            {description && description.length > 50 && (
                <button 
                    className="read-more-btn" 
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    {isExpanded ? 'Show less' : 'Read more'}
                </button>
            )}
            {onClick && (
                <button className="action-btn" onClick={onClick}>
                    Learn more
                </button>
            )}
        </div>
    );
}

export default Card;
