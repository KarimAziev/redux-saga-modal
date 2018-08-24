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
import { Modals } from 'redux-saga-modal';
import { exampleModalSaga } from '../sagas/modals';
import { anotherModalSaga } from '../sagas/modals';

class App extends Component {
  render() {
    const { modals, children } = this.props;
    
    return (
      <div>

        {children}

        <Modals
          dispatch={this.props.dispatch.bind(this)}
          reducer={modals}>
          <ExampleModal name='bootstrap' saga={exampleModalSaga} />
          <ExampleModal name='anotherExample' saga={anotherModalSaga} />
        </Modals>

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
import { showModal, hideModal, takeModalClick } from 'redux-saga-modal';
import { race, put, call } from 'redux-saga/effects';
import api from '../api';

export function* exampleModalSaga() {
  while (true) {
     yield put(showModal('bootstrap', { 
      text: 'You are leaving without saving', 
      title: 'Save changes?',
    }));
    
    const click = yield race({
      ok: takeModalClick('OK'),
      cancel: takeModalClick('CANCEL'),
    })

    if (click.ok) {
      yield call(api.save);
    }

    return yield put(hideModal('bootstrap'));
  }
}
```

## License

MIT
