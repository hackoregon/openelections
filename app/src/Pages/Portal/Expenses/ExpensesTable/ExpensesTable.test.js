import React from "react"
import { shallow } from "enzyme"
import ExpensesTable from "./ExpensesTable"

describe("<ExpensesTable/>", () => {
    it("should be defined", () => {
        const wrapper = shallow(<ExpensesTable/>);
        expect(wrapper).toBeDefined();
        expect(wrapper).toMatchSnapshot();
    })
})