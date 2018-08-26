# Redux Saga Modal (currently under development)

`redux-saga-modal` (currently under development)
will connect list of your modals to the redux store and invoke sagas when action showModal is dispatched.
## Install (currently only local)
```bash
git clone git@github.com:KarimAziev/redux-saga-modal.git && 
cd redux-saga-modal &&
yarn && yarn build && yarn link

//finally in your app-folder: 
yarn link redux-saga-modal && yarn
```


## Setup

```javascript
//in your root container 
import { SagaModal } from 'redux-saga-modal';
import { exampleModalSaga } from '../sagas/modals';
import ExampleModal from './ExampleModal'

const Modal = SagaModal({ 
  name: 'bootstrap', 
  saga: exampleModalSaga,
  initProps: { title: 'Hello', },
 })(BootstrapModal);

class App extends Component {

  render() {
    const { children, showModal, show } = this.props;

    return (
      <div>
        <Button  bsStyle='primary' onClick={() => show('bootstrap')}>Show modal</Button>
         <SagaModal />
        {children}
      </div>
    )
  }
}
const mapStateToProps = state => ({
  modals: state.modals,
});

const mapDispatchToProps = dispatch => bindActionCreators(
  { dispatch }, dispatch
);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App)

//in the root-reducer
import { reducer as modalReducer } from 'redux-saga-modal';

const appReducer = combineReducers({
  modals: modalReducer,
  //...another app reducers
});

//in the root-saga
import { fork, all } from 'redux-saga/effects';
import { sagas as modalSagas } from 'redux-saga-modal';

export default function* rootSaga() {
  yield all([
    fork(modalSagas),
    //...another app sagas
  ]);
}

//modal component
class ExampleModal extends Component {
  render() {
    const { 
      isOpen, 
      text, 
      title,
      clickModal,
    } = this.props

    return (
      <Modal show={isOpen}>
        <Modal.Header>
          <Modal.Title>{ title }</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          { text }
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={() => clickModal('CANCEL')}>Close</Button>
          <Button bsStyle='primary' onClick={() => clickModal('OK')}>Save changes</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

//After that you can manage modals with you sagas. They will be automatically invoken after dispatching action showModal
import { takeModalClick } from 'redux-saga-modal';
import { race, call } from 'redux-saga/effects';
import api from '../api';

export function* exampleModalSaga(modal) {
  modal.show({ 
    text: 'You are leaving without saving', 
    title: 'Save changes?',
  })
  
  while (true) {
    const click = yield race({
      ok: takeModalClick('ok'),
      cancel: takeModalClick('cancel'),
    })

    if (click.ok) {
      modal.update({ title: 'Saving', isLoading: true });
      yield call(api.save);
      modal.update({ title: 'Changes saved', isLoading: true });
    }
    
    modal.hide();
  }
}

```

## License

MIT
