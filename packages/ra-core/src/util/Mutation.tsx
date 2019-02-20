import { Component, ReactNode } from 'react';
import withDataProvider from './withDataProvider';

type DataProviderCallback = (
    type: string,
    resource: string,
    payload?: any,
    options?: any
) => Promise<any>;

interface ChildrenFuncParams {
    data?: any;
    loading: boolean;
    error?: any;
}

interface Props {
    dataProvider: DataProviderCallback;
    children: (mutate: () => void, params: ChildrenFuncParams) => ReactNode;
    type: string;
    resource: string;
    payload?: any;
    options?: any;
}

interface State {
    data?: any;
    loading: boolean;
    error?: any;
}

/**
 * Craft a callback to fetch the data provider and pass it to a child function
 *
 * @example
 *
 * const ApproveButton = ({ record }) => (
 *     <Mutation
 *         type="UPDATE"
 *         resource="comments"
 *         payload={{ id: record.id, data: { isApproved: true } }}
 *     >
 *         {(approve) => (
 *             <FlatButton label="Approve" onClick={approve} />
 *         )}
 *     </Mutation>
 * );
 */
class Mutation extends Component<Props, State> {
    state = {
        data: null,
        loading: false,
        error: null,
    };

    mutate = () => {
        this.setState({ loading: true });
        const { dataProvider, type, resource, payload, options } = this.props;
        dataProvider(type, resource, payload, options)
            .then(({ data }) => {
                this.setState({
                    data,
                    loading: false,
                });
            })
            .catch(error => {
                this.setState({
                    error,
                    loading: false,
                });
            });
    };

    render() {
        const { children } = this.props;
        return children(this.mutate, this.state);
    }
}

export default withDataProvider(Mutation);
