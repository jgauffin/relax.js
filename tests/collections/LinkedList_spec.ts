import { LinkedList } from '../../src/collections/LinkedList';

describe('LinkedList', () => {

    test('lenght is zero from the start', () => {
        const sut = new LinkedList<string>();

        expect(sut).toHaveProperty('length', 0);
    });

    test('length should be updated when a node is added', () => {
        const sut = new LinkedList<string>();

        sut.addLast("hej");

        expect(sut).toHaveProperty("length", 1);
    });

    test('references should be updated when adding a new last node', () => {
        const sut = new LinkedList<string>();
        sut.addLast("1")

        sut.addLast("2");

        expect(sut.first!.next).toHaveProperty("value", "2");
        expect(sut.last!.prev).toHaveProperty("value", "1");
    });

    test('references should be updated when adding a new first node', () => {
        const sut = new LinkedList<string>();
        sut.addFirst("2")

        sut.addFirst("1");

        expect(sut.first!.next).toHaveProperty("value", "2");
        expect(sut.last!.prev).toHaveProperty("value", "1");
    });


    test('single node can to be added and removed', () => {
        const sut = new LinkedList<string>();

        sut.addLast("hej");
        const actual = sut.removeFirst();

        expect(actual).toBe("hej");
    });

    test('single node can to be added and removed', () => {
        const sut = new LinkedList<string>();

        sut.addLast("hej");
        const actual = sut.removeFirst();

        expect(actual).toBe("hej");
    });

});
