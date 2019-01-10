import React, { Component, Children, cloneElement } from "react";
import PropTypes from "prop-types";
import Tabs from "@material-ui/core/Tabs";
import Divider from "@material-ui/core/Divider";
import { withRouter, Route } from "react-router-dom";
import compose from "recompose/compose";
import { translate } from "ra-core";

import CardContentInner from "../layout/CardContentInner";

const TabbedShowLayoutTabs = ({ value, children, ...rest }) => (
    <Tabs
        value={value}
        indicatorColor="primary"
    >
        {children}
    </Tabs>
);

TabbedShowLayoutTabs.propTypes = {
    children: PropTypes.node,
    value: PropTypes.number
};

export default TabbedShowLayoutTabs;
