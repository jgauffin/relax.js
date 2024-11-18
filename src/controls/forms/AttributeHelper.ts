export function copyInputAttributes(
    source: HTMLElement,
    target: HTMLInputElement | HTMLTextAreaElement
): boolean {
    let copied = false;

    for (const key in target) {
        if (source.hasAttribute(key) && key in target) {
            target.setAttribute(key, source.getAttribute(key));
            //(target as unknown)[key] = (source as unknown)[key];
            copied = true;
        }
    }

    return copied;
}
