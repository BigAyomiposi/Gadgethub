import React, {
    createContext,
    useContext,
    useState
} from "react";

import Modal from "./Modal";

const ModalContext = createContext();

export function ModalProvider({ children }) {

    const [modal, setModal] = useState({
        show: false,
        title: "",
        message: "",
        isConfirm: false,
        confirmAction: null
    });


    // NORMAL MODAL
    const showModal = (
        title,
        message = "",
        action = null
    ) => {

        setModal({
            show: true,
            title: title,
            message: message,
            isConfirm: false,
            confirmAction: action
        });

    };


    // CONFIRMATION MODAL
    const showConfirm = (
        title,
        message,
        action
    ) => {

        setModal({
            show: true,
            title: title,
            message: message,
            isConfirm: true,
            confirmAction: action
        });

    };


    // CLOSE MODAL
    const closeModal = () => {

        setModal({
            show: false,
            title: "",
            message: "",
            isConfirm: false,
            confirmAction: null
        });

    };


    // OK / YES
    const confirmModal = () => {

        if (modal.confirmAction) {
            modal.confirmAction();
        }

        closeModal();

    };


    return (
        <ModalContext.Provider
            value={{
                showModal,
                showConfirm,
                closeModal
            }}
        >

            {children}

            <Modal
                show={modal.show}
                title={modal.title}
                message={modal.message}
                closeModal={closeModal}
                confirmModal={confirmModal}
                isConfirm={modal.isConfirm}
            />

        </ModalContext.Provider>
    );

}


export function useModal() {
    return useContext(ModalContext);
}