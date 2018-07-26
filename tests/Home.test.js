import React from "react"
import {Home} from "../src/components/Home"
import { shallow } from "enzyme"

describe("Home component", () => {
    it("says name of app", () => {
        const wrapper = shallow(<Home />);
        let text = wrapper.find("h2").text();
        expect(text).toEqual("MtG Inventory")
    })
})