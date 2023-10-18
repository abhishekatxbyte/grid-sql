
self.addEventListener('message', (event) => {
    const { data } = event;
    const { type, payload } = data;

    if (type === 'FILTER_DATA') {
        const { data, baseHeader, secondHeader, selectedOperator, headerCondition, customInput } = payload;
        const filterData = (data, baseHeader, secondHeader, selectedOperator, headerCondition, customInput) => {
            if (headerCondition === 'HEADER_TO_HEADER') {
                return data.filter(item => {
                    const xValue = item[baseHeader];
                    const yValue = item[secondHeader];

                    switch (selectedOperator) {
                        case 'isEqual':
                            return xValue === yValue;
                        case 'isNotEqual':
                            return xValue !== yValue;
                        case 'isLessThan':
                            return xValue < yValue;
                        case 'isGreaterThan':
                            return xValue > yValue;
                        case 'isGreaterThanOrEqual':
                            return xValue >= yValue;
                        case 'isLessThanOrEqual':
                            return xValue <= yValue;
                        default:
                            return true; // If condition is not specified, return all data
                    }
                });
            } else if (headerCondition === 'HEADER_TO_INPUT') {
                const isNumber = customInput * 1;
                return data.filter(item => {
                    const xValue = item[baseHeader];

                    switch (selectedOperator) {
                        case 'isEqual':
                            return xValue === (isNumber ? parseFloat(customInput) : customInput);
                        case 'isNotEqual':
                            return xValue !== (isNumber ? parseFloat(customInput) : customInput);
                        case 'isLessThan':
                            return xValue < (isNumber ? parseFloat(customInput) : customInput);
                        case 'isGreaterThan':
                            return xValue > (isNumber ? parseFloat(customInput) : customInput);
                        case 'isGreaterThanOrEqual':
                            return xValue >= (isNumber ? parseFloat(customInput) : customInput);
                        case 'isLessThanOrEqual':
                            return xValue <= (isNumber ? parseFloat(customInput) : customInput);
                        default:
                            return true; // If condition is not specified, return all data
                    }
                });
            } else {
                // Invalid headerCondition, return the original data
                return data;
            }
        };

        // Call the filterData function with the provided parameters
        const filteredData = filterData(data, baseHeader, secondHeader, selectedOperator, headerCondition, customInput);
        // Post the filtered data back to the main thread
        self.postMessage({ type: 'FILTERED_DATA', payload: filteredData });
    }
});
