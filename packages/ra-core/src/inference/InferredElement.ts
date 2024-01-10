import { createElement } from 'react';
import { InferredType } from './types';

class InferredElement {
    constructor(
        private type?: InferredType,
        private props?: any,
        private children?: any
    ) {
        this.type = type;
        this.props = props;
        this.children = children;
    }

    getElement(props = {}) {
        if (!this.type || !this.type.component) {
            return;
        }
        return this.children
            ? createElement(
                  this.type.component,
                  { ...this.props, ...props },
                  this.children.length > 0
                      ? this.children.map((child, index) =>
                            child.getElement({ key: index })
                        )
                      : this.children.getElement()
              )
            : createElement(this.type.component, { ...this.props, ...props });
    }

    getProps() {
        return this.props;
    }

    isDefined() {
        return !!this.type;
    }

    getRepresentation() {
        if (!this.type) {
            return;
        }
        if (this.type.representation) {
            return this.type.representation(this.props, this.children);
        }
        if (this.type.component) {
            return `<${
                this.type.component.displayName || this.type.component.name
            } source="${this.props.source}" />`;
        }
    }
}

export default InferredElement;
