/* eslint-disable @typescript-eslint/no-explicit-any */
import { assignValue } from "../../src/objects/assignValue";

describe("Container", () => {

    test("to assign a simple value directly", () => {
        const obj = {};

        assignValue(obj, 'name', 'Arne')

        expect(obj).toHaveProperty('name', "Arne");
    });

    test("to assign using dot notation", () => {
        const obj: any = {};

        assignValue(obj, 'user.firstName', 'Arne')

        expect(obj.user.firstName).toBe('Arne');
    });

    test("to assign using nested dot notation", () => {
        const obj: any = {};

        assignValue(obj, 'user.address.city', 'Falun')

        expect(obj.user.address.city).toBe('Falun');
    });

    test("to assign using dot array dot notation", () => {
        const obj: any = {};

        assignValue(obj, 'user.address[0].city', 'Falun')
        assignValue(obj, 'user.address[1].postalCode', '12345')

        expect(obj).toEqual(
            expect.objectContaining({
                user: {
                    address: [{ city: "Falun" }, {postalCode: 12345}]
                }
            })
        );
    });

    test("to assign using array without indexing", () => {
        const obj: any = {};

        assignValue(obj, 'names[]', 'Jonas')

        expect(obj).toEqual(
            expect.objectContaining({
                names: ['Jonas']
            })
        );
    });    

    test("to assign multiple values using array without indexing", () => {
        const obj: any = {};

        assignValue(obj, 'names[]', 'Jonas')
        assignValue(obj, 'names[]', 'Arne')
        assignValue(obj, 'names[]', 'Gusten')

        expect(obj).toEqual(
            expect.objectContaining({
                names: ['Jonas', "Arne", "Gusten"]
            })
        );
    });    

    test("to assign complete set", () => {
        const obj: any = {};

        assignValue(obj, 'user.firstName', 'Jonas')
        assignValue(obj, 'user.address[0].postal', '11122')
        assignValue(obj, 'user.address[0].city', 'Sometown')
        assignValue(obj, 'user.address[1].postal', '22211')
        assignValue(obj, 'user.address[1].city', 'Somecity')

        expect(obj).toEqual(
            expect.objectContaining({
                user: {
                    firstName: 'Jonas',
                    address: [{
                        postal: 11122,
                        city: "Sometown"
                    }, {
                        postal: 22211,
                        city: "Somecity"
                    }]
                }
            })
        );
    });

});