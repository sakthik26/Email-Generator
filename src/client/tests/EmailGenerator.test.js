import React from 'react';
import renderer from 'react-test-renderer';
import EmailGenerator from '../pages/EmailGenerator.js'

test('Match the snapshot of the Email Generator', () => {
    const component = renderer.create(
        <EmailGenerator />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();

});