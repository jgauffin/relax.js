import { ElementUtils } from "../../src/dom/ElementUtils";

describe("ElemUtils", () => {

    test("if id is used as identifier", () => {
        const elem = document.createElement("div");
        elem.id = "33";

        const sut = new ElementUtils();
        const actual = sut.getIdentifier(elem);
      
        expect(actual).toBe('33');
    });

    test("that data is used as default prefix", () => {
        const elem = document.createElement("div");
        elem.setAttribute('data-name', "33");

        const sut = new ElementUtils();
        const actual = sut.getIdentifier(elem);
      
        expect(actual).toBe('33');
    });

    test("that prefix can be changed", () => {
        const elem = document.createElement("div");
        elem.setAttribute('yo-name', "33");

        const sut = new ElementUtils("yo");
        const actual = sut.getIdentifier(elem);
      
        expect(actual).toBe('33');
    });

    
    test("that name is used as identifier", () => {
        const elem = document.createElement("div");
        elem.setAttribute('name', "33");

        const sut = new ElementUtils("yo");
        const actual = sut.getIdentifier(elem);
      
        expect(actual).toBe('33');
    });

    test("that all children are moved to the new node", () => {
        const elem = document.createElement("div");
        const child1 = document.createElement('div');
        const child2 = document.createElement('div');
        elem.appendChild(child1);
        elem.appendChild(child2);
        child1.setAttribute('id', "1");
        child2.setAttribute('id', "2");
        const target = document.createElement("div");

        const sut = new ElementUtils("yo");
        sut.moveChildren(elem, target);
      
        expect(elem.childElementCount).toBe(0);
        expect(target.childElementCount).toBe(2);
        expect(target.childNodes[0]).toBe(child1);
    });

    test("that all children are removed", () => {
        const elem = document.createElement("div");
        const child1 = document.createElement('div');
        const child2 = document.createElement('div');
        elem.appendChild(child1);
        elem.appendChild(child2);
        child1.setAttribute('id', "1");
        child2.setAttribute('id', "2");

        const sut = new ElementUtils("yo");
        sut.removeChildren(elem);
      
        expect(elem.childElementCount).toBe(0);
    });
});

