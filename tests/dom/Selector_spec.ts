import { Selector } from "../../src/dom/Selector";

describe("FormReader", () => {

    test("get element by name attribute", () => {
        const html = `
        <body>
            <form>
                <input name="name" value="Arne">
            </form>
        </body>`;
        const elem = document.createElement("html");
        elem.innerHTML = html;

        const sut = new Selector(elem);
        const actual = sut.one('$name')

        expect(actual.getAttribute('value')).toBe('Arne');
    });

    test("get elemement by default prefix", () => {
        const html = `
        <body>
            <div data-name="name">hello</div>
        </body>`;
        const elem = document.createElement("html");
        elem.innerHTML = html;

        const sut = new Selector(elem);
        const actual = sut.one('$name')

        expect(actual.innerHTML).toBe('hello');
    });

    test("get elemement by custom prefix", () => {
        const html = `
        <body>
            <div yo-name="name">hello</div>
        </body>`;
        const elem = document.createElement("html");
        elem.innerHTML = html;

        const sut = new Selector(elem, 'yo');
        const actual = sut.one('$name')

        expect(actual.innerHTML).toBe('hello');
    });       
    
    test("get elemement by collection tag", () => {
        const html = `
        <body>
            <div yo-collection="name">hello</div>
        </body>`;
        const elem = document.createElement("html");
        elem.innerHTML = html;

        const sut = new Selector(elem, 'yo');
        const actual = sut.one('$name')

        expect(actual.innerHTML).toBe('hello');
    });

    test("get elemement by id", () => {
        const html = `
        <body>
            <div id="name">hello</div>
        </body>`;
        const elem = document.createElement("html");
        elem.innerHTML = html;

        const sut = new Selector(elem, 'yo');
        const actual = sut.one('$name')

        expect(actual.innerHTML).toBe('hello');
    });     

    test("get elemements", () => {
        const html = `
        <body>
            <div yo-name="some">
                hello
                <span name="some">kddk</span>
            </div>
            <div yo-collection="some">ldld</div>
            <h1 id="some">kdkd</h1>
        </body>`;
        const elem = document.createElement("html");
        elem.innerHTML = html;

        const sut = new Selector(elem, 'yo');
        const actuals = sut.all('$some')

        expect(actuals[0].textContent).toContain("hello");
        expect(actuals[1].innerHTML).toBe('kddk');
        expect(actuals[2].innerHTML).toBe('ldld');
        expect(actuals[3].innerHTML).toBe('kdkd');
    });     

});        
