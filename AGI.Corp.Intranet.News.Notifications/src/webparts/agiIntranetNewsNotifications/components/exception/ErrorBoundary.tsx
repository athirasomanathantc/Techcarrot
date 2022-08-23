import * as React from 'react';
import styles from './ErrorBoundary.module.scss';

export interface IErrorBoundaryState {
    error: any;
    errorInfo: {
        componentStack: any
    };
}

class ErrorBoundary extends React.Component<{}, IErrorBoundaryState> {
    constructor(props: any) {
        super(props);
        this.state = { error: null, errorInfo: null };
    }

    componentDidCatch(error: any, errorInfo: any) {
        // Catch errors in any components below and re-render with error message
        this.setState({
            error: error,
            errorInfo: errorInfo
        })
        // You can also log error messages to an error reporting service here
    }

    render() {
        if (this.state.errorInfo) {
            // Error path
            return (
                <div className={styles.errorBoundary}>
                    <h3>Something went wrong. Please contact your administrator</h3>
                </div>
            );
        }
        // Normally, just render children
        return this.props.children;
    }
}

export default ErrorBoundary;