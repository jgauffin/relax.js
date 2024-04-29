import { EventMapper } from "../../src/dom/EventMapper";

describe("EventMapper", () => {

    test("that click event is hoocked up", () => {
        let invoked = false;
        const elem = document.createElement("div");
        const child = document.createElement("div");
        const sut = new EventMapper(elem);
        const e = new MouseEvent('click');
        child.setAttribute('yo-name', 'somename');
        elem.appendChild(child);

        sut.click('$somename', () => invoked = true)
        child.dispatchEvent(e);
      
        expect(invoked).toBe(true);
    });

    test("that keyDown event is hoocked up", () => {
        let invoked = false;
        const elem = document.createElement("div");
        const child = document.createElement("div");
        const sut = new EventMapper(elem);
        const e = new KeyboardEvent('keydown');
        child.setAttribute('yo-name', 'somename');
        elem.appendChild(child);

        sut.keyDown('$somename', () => invoked = true)
        child.dispatchEvent(e);
      
        expect(invoked).toBe(true);
    });

    test("that keyUp event is hoocked up", () => {
        let invoked = false;
        const elem = document.createElement("div");
        const child = document.createElement("div");
        const sut = new EventMapper(elem);
        const e = new KeyboardEvent('keyup');
        child.setAttribute('yo-name', 'somename');
        elem.appendChild(child);

        sut.keyUp('$somename', () => invoked = true)
        child.dispatchEvent(e);
      
        expect(invoked).toBe(true);
    });

});