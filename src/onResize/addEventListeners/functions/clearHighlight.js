import '../../../util/d3-selection-moveToFront';

export default function clearHighlight() {
    this.svg
        .selectAll('.line:not(.selected)')
        .select('path')
        .attr(this.config.line_attributes);
    this.svg.selectAll('.line.selected').moveToFront();
    this.svg
        .selectAll('.point:not(.selected)')
        .select('circle')
        .attr(this.config.point_attributes)
        .attr('r', this.config.marks.find(mark => mark.type === 'circle').radius);
    this.svg.selectAll('.point.selected').moveToFront();
}
