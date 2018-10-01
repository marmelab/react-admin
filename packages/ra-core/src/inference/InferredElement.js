import { createElement } from 'react';

class InferredElement {
    constructor(type, props, children) {
        this.type = type;
        this.props = props;
        this.children = children;
    }

    getElement(props = {}) {
        if (!this.isDefined()) {
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
        if (!this.isDefined()) {
            return;
        }
        if (this.type.representation) {
            return this.type.representation(this.props, this.children);
        }
        return `<${this.type.component.displayName ||
            this.type.component.name} source="${this.props.source}" />`;
    }
}

export default InferredElement;
