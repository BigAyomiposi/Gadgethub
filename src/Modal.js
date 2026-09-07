import React from "react";
import "./Modal.css";

export default function Modal({
    show,
    title,
    message,
    closeModal,
    confirmModal,
    isConfirm
}) {

    if (!show) {
        return null;
    }

    return (
        <div className="modal-overlay">

            <div className="modal-box">

                <button
                    className="modal-close"
                    onClick={closeModal}
                >
                    ×
                </button>

                <h2>{title}</h2>

                <p>{message}</p>

                {isConfirm ? (

                    <div className="modal-buttons">

                        <button
                            className="modal-cancel-btn"
                            onClick={closeModal}
                        >
                            Cancel
                        </button>

                        <button
                            className="modal-btn"
                            onClick={confirmModal}
                        >
                            Yes
                        </button>

                    </div>

                ) : (

                    <button
                        className="modal-btn"
                        onClick={confirmModal}
                    >
                        OK
                    </button>

                )}

            </div>

        </div>
    );
}