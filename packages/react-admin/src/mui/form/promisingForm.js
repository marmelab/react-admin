import mapProps from 'recompose/mapProps';
import { submitForm } from '../../actions/formActions';

const promisingForm = mapProps(({ handleSubmit, ...props }) => ({
    ...props,
    handleSubmit: callback =>
        handleSubmit(
            (values, dispatch, props) =>
                new Promise((resolve, reject) => {
                    dispatch(submitForm(resolve, reject));
                    callback(values, dispatch, props);
                })
        ),
}));

export default promisingForm;
