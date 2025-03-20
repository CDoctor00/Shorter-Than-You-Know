import { useContext, useEffect, useRef } from "react";
import { ModalContext } from "../../../contexts/modal/Context";
import Portal from "../portal/Portal";
import "./Modal.css";

function Modal() {
  const { isOpen, toggleModal, children } = useContext(ModalContext);
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    //? close modal listener

    //? When user press the escape key
    const closeOnEscapeKey = (e: KeyboardEvent) => {
      if (elementRef.current && e.key === "Escape") {
        e.preventDefault();
        toggleModal();
      }
    };

    //? When user click out of the modal component
    const closeOnOutClick = (e: MouseEvent) => {
      if (
        elementRef.current &&
        !elementRef.current.contains(e.target as Node)
      ) {
        e.preventDefault();
        toggleModal();
      }
    };

    //? adding listener for escape key on mounting element
    document.body.addEventListener("keydown", closeOnEscapeKey);
    //? adding listener for out click on mounting element
    document.body.addEventListener("mousedown", closeOnOutClick);

    return () => {
      //? removing listener for escape key on umounting element
      document.body.removeEventListener("keydown", closeOnEscapeKey);
      //? removing listener for out click on umounting element
      document.body.removeEventListener("mousedown", closeOnOutClick);
    };
  }, [toggleModal]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }

    if (!isOpen) {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  return !isOpen ? null : (
    <Portal
      children={
        <div className="modal-page">
          <div className="modal-container" ref={elementRef}>
            <div className="content">{children}</div>
          </div>
        </div>
      }
    ></Portal>
  );
}
export default Modal;
