import listSaga from '../list/saga';
import { watchFetchRecord } from '../detail/saga';

export default function* crudSaga() {
    yield [
        listSaga(),
        watchFetchRecord(),
    ];
}
