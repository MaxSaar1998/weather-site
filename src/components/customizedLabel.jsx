const customizedLabel = (props) =>{
    const { index, x, y, stroke, value, numLabels } = props;
    var xOffset = 0;
    if(index == 0) {
        xOffset = 10;
    }
    if(index == numLabels - 1) {
        xOffset = -10;
    }

    return (
        <text x={x} y={y} dy={-10} dx={xOffset} fill={stroke} fontSize={12} textAnchor="middle">
        {value.toFixed(1)}
        </text>
    );
}

export default customizedLabel