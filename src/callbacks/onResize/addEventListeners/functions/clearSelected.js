export default function clearSelected() {
    this.marks.forEach(mark => {
        const element = mark.type === 'line' ? 'path' : mark.type;
        mark.groups
            .classed('selected', false)
            .select(element)
            .attr(mark.attributes);
    });
    if (this.multiples.chart) this.multiples.chart.destroy();
    delete this.selected_id;
}
