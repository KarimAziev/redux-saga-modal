import React from 'react';
import Modal from 'react-modal';
import { Button } from 'components';
import styles from './styles.module.css';

import { sagaModal } from 'redux-saga-modal';

Modal.setAppElement('#root');

const style = {
  overlay: {
    padding: '30px',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  content: {
    border: 'none',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '400px',
    padding: '20px',
  },
};

const Confirm = (props) => {
  const { isOpen, text, title, click, hide, confirmBtn, cancelBtn } = props;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={hide}
      style={style}
      contentLabel="Example Modal"
    >
      <section className={styles.modal}>
        <h2 className={'title'}>{title}</h2>
        <p className={'text'}>{text}</p>
        <span className={styles.footer}>
          <Button {...cancelBtn} onClick={hide}>
            {cancelBtn.title}
          </Button>
          <Button type={'submit'} {...confirmBtn} onClick={(e) => click('OK')}>
            {confirmBtn.title}
          </Button>
        </span>
      </section>
    </Modal>
  );
};
Confirm.defaultProps = {
  confirmBtn: {},
  cancelBtn: {},
};

export default sagaModal({ name: 'confirmModal' })(Confirm);
