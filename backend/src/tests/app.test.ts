import {describe, expect, it} from "@jest/globals";
import {App} from "../app/app";

describe("app", () => {
    it("provides the current bitcoin price", () => {
        const app = new App();
        expect(typeof app.getCurrentPrice()).toBe("number")
    })
})
