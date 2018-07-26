import React from "react"
import {Home} from "../src/components/Home"
import { shallow } from "enzyme"
import renderer from 'react-test-renderer'

describe("Home component", () => {
    it("should match the snapshot", () => {
        let tree = renderer.create(<Home />).toJSON();
        expect(tree).toMatchSnapshot();
    })

    it("says name of app", () => {
        const wrapper = shallow(<Home />);
        let text = wrapper.find("h2").text();
        expect(text).toEqual("MtG Inventory")
    })
})