import '@testing-library/jest-dom';
import '@testing-library/react';

beforeAll(() => {
    global.IS_REACT_ACT_ENVIRONMENT = false;
});