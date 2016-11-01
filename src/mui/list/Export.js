import React, { PropTypes, Component } from 'react';
import LinearProgress from 'material-ui/LinearProgress';
import ReactDOMServer from 'react-dom/server';
import debounce from 'lodash.debounce';
import santizeHtml from 'sanitize-html';
import entities from 'entities';
import csvStringify from 'csv-stringify';

import title from '../../util/title';
import FieldContext from './FieldContext';

const forceDownload = (filename, csv) => {
    const fakeLink = document.createElement('a');
    document.body.appendChild(fakeLink);

    fakeLink.setAttribute('href', `data:application/octet-stream;charset=utf-8,${encodeURIComponent(csv)}`);
    fakeLink.setAttribute('download', `${filename}.csv`);
    fakeLink.click();
};

class Export extends Component {

    static contextTypes = {
        store: React.PropTypes.object,
        muiTheme: React.PropTypes.object,
    };

    componentDidMount() {
        this.generateCsvDebounced();
    }

    generateCsv() {
        const { resource, data, ids, children, exportOptions, onDownload, basePath } = this.props;
        const { store, muiTheme } = this.context;
        const csvData = [];
        const fields = React.Children.toArray(children);

        csvData.push(fields.map(field => title(field.props.label, field.props.source)));

        ids.forEach(id => csvData.push(
            fields.map((field) => {
                const cellContent = ReactDOMServer.renderToStaticMarkup(
                    <FieldContext store={store} muiTheme={muiTheme}>
                        <field.type
                            {...field.props}
                            record={data[id]}
                            resource={resource}
                            basePath={basePath}
                        />
                    </FieldContext>
                );

                return entities.decodeHTML(santizeHtml(cellContent, {
                    allowedTags: [],
                    allowedAttributes: [],
                }));
            })
        ));

        csvStringify(csvData, exportOptions, (err, csvText) => {
            if (!err) {
                forceDownload(resource, csvText);
                onDownload();
            } else {
                console.warn(`Error generating csv : ${err}`);
            }
        });
    }

    // Csv generation is debounced to allow referenced fields to be fetched
    generateCsvDebounced = debounce(() => {
        if (this.props.isLoading) {
            this.generateCsvDebounced();
        } else {
            this.generateCsv();
        }

        return null;
    }, 50)

    render() {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 50, paddingBottom: 50 }}>
                Generating export...
                <LinearProgress style={{ maxWidth: 200, marginTop: 20 }} />
            </div>
        );
    }
}

Export.propTypes = {
    children: PropTypes.node,
    ids: PropTypes.arrayOf(PropTypes.any).isRequired,
    onDownload: PropTypes.func.isRequired,
    basePath: PropTypes.string.isRequired,
    resource: PropTypes.string,
    data: PropTypes.object.isRequired,
    isLoading: PropTypes.bool.isRequired,
    exportOptions: PropTypes.object, // http://csv.adaltas.com/stringify/#options
};

Export.defaultProps = {
    data: {},
    ids: [],
    exportOption: {},
};

export default Export;
