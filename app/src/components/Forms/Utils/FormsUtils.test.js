import { checkNoEmptyString } from './FormsUtils';

describe("checkNoEmptyString()", () => {
    it("should return true", () => {
        expect(checkNoEmptyString("a", "b", "c")).toBeTruthy()
    })

    it("should return false", () => {
        expect(checkNoEmptyString("a", "", "c")).toBeFalsy()
    })
})