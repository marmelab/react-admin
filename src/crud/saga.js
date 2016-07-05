import listSaga from '../list/saga';

export default function* crudSaga() {
    yield [
        listSaga(),
    ];
}
