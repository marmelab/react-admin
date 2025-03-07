#!/bin/bash
echo "Updating the documentation to version $VERSION"
echo "Copying to the root folder..."
cp ./docs/*.html ${RA_DOC_PATH}
cp ./docs/_layouts/*.html ${RA_DOC_PATH}/_layouts
cp ./docs/*.md ${RA_DOC_PATH}
cp ./docs/img/* -r ${RA_DOC_PATH}/img
cp ./docs/css/docsearch.css ${RA_DOC_PATH}/css
cp ./docs/css/prism.css ${RA_DOC_PATH}/css
cp ./docs/css/style-*.css ${RA_DOC_PATH}/css
cp ./docs/js/materialize.min.js ./docs/js/prism.js ./docs/js/ra-doc-exec.js ${RA_DOC_PATH}/js

echo "Copying to the doc/${VERSION} folder..."
mkdir -p ${RA_DOC_PATH}/doc/${VERSION}
mkdir -p ${RA_DOC_PATH}/doc/${VERSION}/img
mkdir -p ${RA_DOC_PATH}/doc/${VERSION}/css
mkdir -p ${RA_DOC_PATH}/doc/${VERSION}/js
cp ./docs/*.html ${RA_DOC_PATH}/doc/${VERSION}
cp ./docs/*.md ${RA_DOC_PATH}/doc/${VERSION}
rm ${RA_DOC_PATH}/doc/${VERSION}/404.html
cp -r ./docs/img/* ${RA_DOC_PATH}/doc/${VERSION}/img
cp ./docs/css/docsearch.css ${RA_DOC_PATH}/doc/${VERSION}/css
cp ./docs/css/prism.css ${RA_DOC_PATH}/doc/${VERSION}/css
cp ./docs/css/style-*.css ${RA_DOC_PATH}/doc/${VERSION}/css
cp ./docs/js/materialize.min.js ./docs/js/prism.js ./docs/js/ra-doc-exec.js ${RA_DOC_PATH}/doc/${VERSION}/js

echo "Done"

