#!/bin/bash
RA_DOCS_DIR=../react-admin-doc

echo "Updating the documentation to version $VERSION"
echo "Copying to the root folder..."
cp ./docs/*.html ${RA_DOCS_DIR}
cp ./docs/_layouts/*.html ${RA_DOCS_DIR}/_layouts
cp ./docs/*.md ${RA_DOCS_DIR}
cp ./docs/img/* -r ${RA_DOCS_DIR}/img
cp ./docs/css/docsearch.css ${RA_DOCS_DIR}/css
cp ./docs/css/prism.css ${RA_DOCS_DIR}/css
cp ./docs/css/style-*.css ${RA_DOCS_DIR}/css
cp ./docs/js/materialize.min.js ./docs/js/prism.js ./docs/js/ra-doc-exec.js ${RA_DOCS_DIR}/js

echo "Copying to the doc/${VERSION} folder..."
mkdir -p ${RA_DOCS_DIR}/doc/${VERSION}
mkdir -p ${RA_DOCS_DIR}/doc/${VERSION}/img
mkdir -p ${RA_DOCS_DIR}/doc/${VERSION}/css
mkdir -p ${RA_DOCS_DIR}/doc/${VERSION}/js
cp ./docs/*.html ${RA_DOCS_DIR}/doc/${VERSION}
cp ./docs/*.md ${RA_DOCS_DIR}/doc/${VERSION}
rm ${RA_DOCS_DIR}/doc/${VERSION}/404.html
cp -r ./docs/img/* ${RA_DOCS_DIR}/doc/${VERSION}/img
cp ./docs/css/docsearch.css ${RA_DOCS_DIR}/doc/${VERSION}/css
cp ./docs/css/prism.css ${RA_DOCS_DIR}/doc/${VERSION}/css
cp ./docs/css/style-*.css ${RA_DOCS_DIR}/doc/${VERSION}/css
cp ./docs/js/materialize.min.js ./docs/js/prism.js ./docs/js/ra-doc-exec.js ${RA_DOCS_DIR}/doc/${VERSION}/js

echo "Done"

