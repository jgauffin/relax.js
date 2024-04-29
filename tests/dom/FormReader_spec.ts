import { FormReader } from "../../src/dom/FormReader";

describe("FormReader", () => {

    test("read an input value", () => {
        const html = `
        <body>
            <form>
                <input name="name" value="Arne">
            </form>
        </body>`;
        const elem = document.createElement("div");
        elem.innerHTML = html;

        const sut = new FormReader();
        const doc = sut.read(elem);

        expect(doc).toHaveProperty('name', "Arne");
    });

    test("convert input type number to numeric value", () => {
        const html = `
        <body>
            <form>
                <input name="userId" type="number" value="3">
            </form>
        </body>`;
        const elem = document.createElement("div");
        elem.innerHTML = html;

        const sut = new FormReader();
        const doc = sut.read(elem);

        expect(doc).toHaveProperty('userId', 3);
    });



    test("read a select value", () => {
        const html = `
        <body>
            <form>
                <select name="state">
                    <option value="2">2</option>
                    <option value="3" selected>3</option>
                </select>
            </form>
        </body>`;
        const elem = document.createElement("div");
        elem.innerHTML = html;

        const sut = new FormReader();
        const doc = sut.read(elem);

        expect(doc).toHaveProperty('state', 3);
    });

    test("read a select multiple value", () => {
        const html = `
        <body>
            <form>
                <select name="states" multiple>
                    <option value="1">1</option>
                    <option value="2" selected>2</option>
                    <option value="3" selected>3</option>
                </select>
            </form>
        </body>`;
        const elem = document.createElement("div");
        elem.innerHTML = html;

        const sut = new FormReader();
        const doc = sut.read(elem);

        expect(doc).toHaveProperty('states', [2, 3]);
    });


    test("read selected checkboxes value", () => {
        const html = `
        <body>
            <form>
                <input type="checkbox" name="state[]" value="1">
                <input type="checkbox" name="state[]" value="2" checked>
                <input type="checkbox" name="state[]" value="3" checked>
            </form>
        </body>`;
        const elem = document.createElement("div");
        elem.innerHTML = html;

        const sut = new FormReader();
        const doc = sut.read(elem);

        expect(doc).toHaveProperty('state', [2, 3]);
    });

    test("read selected radio", () => {
        const html = `
        <body>
            <form>
                <input type="radio" name="state" value="1">
                <input type="radio" name="state" value="2" selected>
            </form>
        </body>`;
        const elem = document.createElement("div");
        elem.innerHTML = html;

        const sut = new FormReader();
        const doc = sut.read(elem);

        expect(doc).toHaveProperty('state', 2);
    });


    test("read sub object using name attribute", () => {
        const html = `
        <body>
            <form>
                <div data-name="person">
                    <input name="firstName" value="Gunnar">
                    <input name="lastName" value="Ek">
                </div>
            </form>
        </body>`;
        const elem = document.createElement("div");
        elem.innerHTML = html;

        const sut = new FormReader();
        const doc = sut.read(elem);

        expect(doc).toHaveProperty('person');
        expect(doc.person).toHaveProperty('firstName', "Gunnar");
        expect(doc.person).toHaveProperty('lastName', "Ek");
    });

    test("read sub object using dot notation", () => {
        const html = `
        <body>
            <form>
                <input name="person.firstName" value="Gunnar">
                <input name="person.lastName" value="Ek">
            </form>
        </body>`;
        const elem = document.createElement("div");
        elem.innerHTML = html;


        const sut = new FormReader();
        const doc = sut.read(elem);

        expect(doc).toHaveProperty('person');
        expect(doc.person).toHaveProperty('firstName', "Gunnar");
        expect(doc.person).toHaveProperty('lastName', "Ek");
    });    

    test("read array", () => {
        const html = `
        <body>
            <form>
                <input name="names[0]" value="jonas">
                <input name="names[1]" value="adam">
                <input name="names[2]" value="jens">
            </form>
        </body>`;
        const elem = document.createElement("div");
        elem.innerHTML = html;

        const sut = new FormReader();
        const doc = sut.read(elem);

        expect(doc).toHaveProperty('names', ["jonas", "adam", "jens"]);
    });

    test("read object array objects with dot notation", () => {
        const html = `
        <body>
            <form>
                <input name="persons[0].firstName" value="jonas">
                <input name="persons[0].lastName" value="gud">
                <input name="persons[1].firstName" value="per">
                <input name="persons[1].lastName" value="skog">
            </form>
        </body>`;
        const elem = document.createElement("div");
        elem.innerHTML = html;

        const sut = new FormReader();
        const doc = sut.read(elem);

        expect(doc).toHaveProperty('persons', [{firstName: "jonas", lastName: "gud"}, {firstName: "per", lastName: "skog"}]);
    });

    test("read object array with name attribute", () => {
        const html = `
        <body>
            <form>
                <div data-name="persons[]">
                    <input name="firstName" value="jonas">
                    <input name="lastName" value="gud">
                </div>
                <div data-name="persons[]">
                    <input name="firstName" value="per">
                    <input name="lastName" value="skog">
                </div>
            </form>
        </body>`;
        const elem = document.createElement("div");
        elem.innerHTML = html;

        const sut = new FormReader();
        const doc = sut.read(elem);

        expect(doc).toHaveProperty('persons', [{firstName: "jonas", lastName: "gud"}, {firstName: "per", lastName: "skog"}]);
    });        

    test("read object array with name attribute", () => {
        const html = `
        <body>
            <form>
                <div data-name="persons[0]">
                    <input name="firstName" value="jonas">
                    <input name="lastName" value="gud">
                </div>
                <div data-name="persons[2]">
                    <input name="firstName" value="per">
                    <input name="lastName" value="skog">
                </div>
            </form>
        </body>`;
        const elem = document.createElement("div");
        elem.innerHTML = html;

        const sut = new FormReader();
        const doc = sut.read(elem);

        expect(doc).toHaveProperty('persons', [{firstName: "jonas", lastName: "gud"}, undefined, {firstName: "per", lastName: "skog"}]);
    });        
});