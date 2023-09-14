import React from "react";

function TruncateSpan({text, length}) {

    function truncate(str, numChars) {
        if (str.length > numChars) {
            return str.substring(0, numChars - 3) + '...';
        }
        return str;
    }
    const trunctatedComp = truncate(text, length);

    return (<span className="truncated-span" title={text}>{trunctatedComp}</span>);
}

export default TruncateSpan;