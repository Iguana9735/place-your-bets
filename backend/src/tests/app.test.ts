import {sayHello} from '../app/app'
import {describe, expect, it} from "@jest/globals";

describe("app", () => {
    it("says hello", () => {
        expect(sayHello("Bob")).toBe("Hello, Bob!")
    })
})
