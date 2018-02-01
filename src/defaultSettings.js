const defaultSettings = {
    //Custom settings for this template
    id_col: 'USUBJID',
    time_cols: [
        {
            type: 'ordinal',
            value_col: 'VISIT',
            label: 'Visit',
            order_col: 'VISITNUM',
            order: null,
            rotate_tick_labels: true,
            vertical_space: 100
        },
        {
            type: 'linear',
            value_col: 'DY',
            label: 'Study Day',
            rotate_tick_labels: false,
            vertical_space: 0
        }
    ],
    measure_col: 'TEST',
    value_col: 'STRESN',
    unit_col: 'STRESU',
    normal_col_low: 'STNRLO',
    normal_col_high: 'STNRHI',
    start_value: null,
    filters: null,
    custom_marks: null,
    details: [
        { value_col: 'AGE', label: 'Age' },
        { value_col: 'SEX', label: 'Sex' },
        { value_col: 'RACE', label: 'Race' }
    ],
    multiples_sizing: {
        width: 300,
        height: 100
    },

    //Standard webCharts settings
    x: {
        column: null, //set in syncSettings()
        type: null, //set in syncSettings()
        behavior: 'flex'
    },
    y: {
        column: null, //set in syncSettings()
        stat: 'mean',
        type: 'linear',
        label: 'Value',
        behavior: 'flex',
        format: '0.2f'
    },
    marks: [
        {
            per: null, //set in syncSettings()
            type: 'line',
            attributes: {
                'stroke-width': 0.5,
                'stroke-opacity': 0.5,
                stroke: '#999',
                'clip-path': 'url(#1)'
            },
            tooltip: null //set in syncSettings()
        },
        {
            per: null, //set in syncSettings()
            type: 'circle',
            radius: 2,
            attributes: {
                'stroke-width': 0.5,
                'stroke-opacity': 0.5,
                'fill-opacity': 1,
                'clip-path': 'url(#1)'
            },
            tooltip: null //set in syncSettings()
        }
    ],
    resizable: true,
    margin: { right: 20 }, //create space for box plot
    aspect: 3
};

// Replicate settings in multiple places in the settings object
export function syncSettings(settings) {
    const time_col = settings.time_cols[0];

    settings.x.column = time_col.value_col;
    settings.x.type = time_col.type;
    settings.x.label = time_col.label;
    settings.x.order = time_col.order;

    settings.y.column = settings.value_col;

    settings.marks[0].per = [settings.id_col, settings.measure_col];
    settings.marks[0].tooltip = `[${settings.id_col}]`;

    settings.marks[1].per = [
        settings.id_col,
        settings.measure_col,
        time_col.value_col,
        settings.value_col
    ];
    settings.marks[1].tooltip = `[${settings.id_col}]:  [${settings.value_col}] [${
        settings.unit_col
    }] at ${settings.x.column} = [${settings.x.column}]`;

    //Add custom marks to settings.marks.
    if (settings.custom_marks) settings.custom_marks.forEach(mark => settings.marks.push(mark));

    //Define margins for box plot and rotated x-axis tick labels.
    if (settings.margin) settings.margin.bottom = time_col.vertical_space;
    else
        settings.margin = {
            right: 20,
            bottom: time_col.vertical_space
        };

    settings.rotate_x_tick_labels = time_col.rotate_tick_labels;

    return settings;
}

// Default Control objects
export const controlInputs = [
    { label: 'Measure', type: 'subsetter', start: null },
    { type: 'dropdown', label: 'X-axis', option: 'x.column', require: true },
    { type: 'number', label: 'Lower Limit', option: 'y.domain[0]', require: true },
    { type: 'number', label: 'Upper Limit', option: 'y.domain[1]', require: true }
];

// Map values from settings to control inputs
export function syncControlInputs(controlInputs, settings) {
    let labTestControl = controlInputs.filter(d => d.label === 'Measure')[0];
    labTestControl.value_col = settings.measure_col;

    let xAxisControl = controlInputs.filter(d => d.label === 'X-axis')[0];
    xAxisControl.values = settings.time_cols.map(d => d.value_col);

    if (settings.filters) {
        settings.filters.forEach(function(d, i) {
            const thisFilter = {
                type: 'subsetter',
                value_col: d.value_col ? d.value_col : d,
                label: d.label ? d.label : d.value_col ? d.value_col : d
            };
            //add the filter to the control inputs (as long as it isn't already there)
            var current_value_cols = controlInputs
                .filter(f => f.type == 'subsetter')
                .map(m => m.value_col);
            if (current_value_cols.indexOf(thisFilter.value_col) == -1)
                controlInputs.push(thisFilter);
        });
    }

    return controlInputs;
}

export default defaultSettings;