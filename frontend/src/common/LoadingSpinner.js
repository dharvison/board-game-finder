import React from "react";
import { Spinner } from "reactstrap";

/**
 * Standardize L&F for spinner
 */
function LoadingSpinner() {
    // return (<Spinner type="border" color="primary"><span className="sr-only">Loading...</span></Spinner>)
    return (<Spinner type="border" color="primary" className="mt-1"/>)
}

export default LoadingSpinner;