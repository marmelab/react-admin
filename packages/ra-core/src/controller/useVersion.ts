// @ts-ignore
import { useSelector } from 'react-redux';
import { ReduxState } from '../types';

const useVersion = () =>
    useSelector((reduxState: ReduxState) => reduxState.admin.ui.viewVersion);

export default useVersion;
