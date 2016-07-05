import { watchFetchList } from './data/sagas';

export default function* listSaga() {
    yield [
        watchFetchList(),
    ];
}
