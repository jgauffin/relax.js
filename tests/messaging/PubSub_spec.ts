import  * as pb from "../../src/messaging/PubSub";

class MyEvent{

}
class OtherEvent{

}
describe("FormReader", () => {

    test("can receive messages", async () => {
        let received: MyEvent|null = null;
        const actual=new MyEvent();
        const sub = pb.subscribe(MyEvent, async evt => {
            received = evt
        });

        await pb.publish(actual);

        sub.unsubscribe();
        expect(received).toBe(actual);
    });

    test("can unsubscribe", async () => {
        let received: MyEvent|null = null;
        const actual=new MyEvent();
        const sub = pb.subscribe(MyEvent, async evt => {
            received = evt
        });

        sub.unsubscribe();
        await pb.publish(actual);

        expect(received).toBe(null);
    });

    test("will not receive other events", () => {
        let received: MyEvent|null = null;
        const actual=new OtherEvent();
        const sub = pb.subscribe(MyEvent, async evt => {
            received = evt
        });
        
        pb.publish(actual);

        sub.unsubscribe();
        expect(received).toBe(null);
    });

});