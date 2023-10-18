function resize() {
    this.style.height = "auto";
    this.style.height = `${this.scrollHeight}px`;
}
export const setResizeListeners = ($el, query) => {
    const targets = $el.querySelectorAll(query);
    targets.forEach(target => {
        if (target.value) target.style.height = `${target.scrollHeight}px`;
        else target.style.height = `auto`;
        target.addEventListener("input", resize);
        target.addEventListener("change", resize);
    });
};
